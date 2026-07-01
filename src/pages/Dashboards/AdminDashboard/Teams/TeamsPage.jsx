import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Download,
  Eye,
  Search,
  X,
} from "lucide-react";
import Sidebar from "../../../../components/Siedbar";
import CommonHeader from "../../../../components/CommonHeader";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { exportToExcel } from "../../../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const getFacultyList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.faculties)) return payload.faculties;
  if (Array.isArray(payload?.data?.faculties)) return payload.data.faculties;
  if (Array.isArray(payload?.facultyDetails)) return payload.facultyDetails;
  if (Array.isArray(payload?.data?.facultyDetails)) return payload.data.facultyDetails;
  if (Array.isArray(payload?.employees)) return payload.employees;
  if (Array.isArray(payload?.data?.employees)) return payload.data.employees;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.data?.docs)) return payload.data.docs;
  return [];
};

const getFacultyName = (faculty) =>
  [faculty.salutation, faculty.firstName, faculty.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || faculty.empId || "Unnamed Faculty";

const getReportingToName = (faculty) => {
  if (!faculty?.reportingTo) return null;
  const name = [faculty.reportingTo.name, faculty.reportingTo.firstName, faculty.reportingTo.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || faculty.reportingTo.empId || null;
};

const SelectFilter = ({ label, value, onChange, options }) => (
  <label className="relative min-w-[180px] flex-1 sm:min-w-[190px] sm:flex-none">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full appearance-none rounded-lg border border-[#244061] bg-[#0d2138] px-3 pr-9 text-[14px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "All" ? `All ${label}` : option}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3984ff]"
    />
  </label>
);

const TeamsPage = () => {
  const navigate = useNavigate();

  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(false);
  const [facultyError, setFacultyError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  const fetchFaculties = useCallback(async () => {
    const token = localStorage.getItem("hrms_token");
    if (!token) {
      setFacultyError("Login token is missing. Please sign in again.");
      setFacultyMembers([]);
      return;
    }

    setIsLoadingFaculty(true);
    setFacultyError("");

    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/faculties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to load faculty data.");
      }

      const facultyList = getFacultyList(data);
      setFacultyMembers(facultyList);
    } catch (error) {
      setFacultyError(error.message || "Unable to load faculty data.");
      setFacultyMembers([]);
    } finally {
      setIsLoadingFaculty(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(fetchFaculties, 0);
    return () => window.clearTimeout(timerId);
  }, [fetchFaculties]);

  const departmentOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(facultyMembers.map((faculty) => faculty.department).filter(Boolean)),
      ),
    ],
    [facultyMembers],
  );

  const filteredFaculty = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return facultyMembers.filter((faculty) => {
      const name = getFacultyName(faculty);
      const reportingName = getReportingToName(faculty) || "";

      const matchesSearch =
        !normalizedSearch ||
        [name, faculty.empId, faculty.designation, reportingName]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        departmentFilter === "All" || faculty.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [departmentFilter, facultyMembers, searchQuery]);

  // Sort: HOD first when a department is selected, then alphabetically by name
  const sortedFaculty = useMemo(() => {
    const sorted = [...filteredFaculty];

    sorted.sort((a, b) => {
      // Only sort HOD to top when a specific department is selected
      if (departmentFilter !== "All") {
        const aIsHod = a.designation === "HOD" ? 0 : 1;
        const bIsHod = b.designation === "HOD" ? 0 : 1;
        if (aIsHod !== bIsHod) return aIsHod - bIsHod;
      }

      // Sort alphabetically by name
      const nameA = getFacultyName(a).toLowerCase();
      const nameB = getFacultyName(b).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return sorted;
  }, [filteredFaculty, departmentFilter]);

  const exportCurrentFilteredRows = () => {
    const rows = sortedFaculty.map((faculty) => ({
      "Faculty Name": getFacultyName(faculty),
      "Emp ID": faculty.empId || "-",
      "Designation": faculty.designation || "-",
      "Department": faculty.department || "-",
    }));
    exportToExcel(rows, "Team-List.xlsx");
  };

  const handleViewProfile = (faculty) => {
    navigate(`/profile/${faculty._id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">
                  Team Management
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Explore every team within the organization.
                </p>
              </div>
            </div>

            <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
              <div className="relative z-20 flex flex-col gap-3 px-4 py-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
                <h2 className="shrink-0 text-[18px] font-semibold text-white">
                  Faculty List{" "}
                  <span>({sortedFaculty.length})</span>
                </h2>

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by name, ID, designation, or reporting manager..."
                      className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] px-3 pl-10 pr-9 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f839f] hover:text-white transition"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Department Filter */}
                  <SelectFilter
                    label="Departments"
                    value={departmentFilter}
                    onChange={setDepartmentFilter}
                    options={departmentOptions}
                  />
                </div>

                {/* Export Button */}
                <button
                  type="button"
                  onClick={handleExportClick}
                  disabled={sortedFaculty.length === 0}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[14px] font-medium text-white transition hover:border-[#3984ff] hover:bg-[#132b49] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>

              <ExportPasswordModal
                isOpen={isExportModalOpen}
                onClose={closeExportModal}
                onConfirm={(password) => handleConfirmExport(password, exportCurrentFilteredRows)}
                loading={exportLoading}
                error={exportError}
              />

              <div className="relative z-0 max-h-[calc(100vh-275px)] overflow-auto table-custom-scrollbar">
                {facultyError && (
                  <div className="border-t border-[#183052] px-4 py-3 text-[13px] text-[#f16868]">
                    {facultyError}
                  </div>
                )}

                <table className="w-full table-fixed border-collapse text-left">
                  {/* <colgroup>
                    <col className="w-[24%]" />
                    <col className="w-[12%]" />
                    <col className="w-[18%]" />
                    <col className="w-[22%]" />
                    <col className="w-[12%]" />
                  </colgroup> */}
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[14px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="py-3 pl-5 pr-4 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Emp ID</th>
                      <th className="px-4 py-3 font-semibold">Designation</th>
                      {/* <th className="px-4 py-3 font-semibold">Reporting To</th> */}
                      <th className="px-4 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-[#cad7eb]">
                    {isLoadingFaculty ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-8 text-center text-[#8ca1bd]"
                        >
                          Loading faculty records...
                        </td>
                      </tr>
                    ) : sortedFaculty.length > 0 ? (
                      sortedFaculty.map((faculty) => {
                        const name = getFacultyName(faculty);
                        const isHod = faculty.designation === "HOD";
                        const avatarLetter = name.charAt(0).toUpperCase();
                        const reportingName = getReportingToName(faculty);

                        return (
                          <tr
                            key={faculty._id || faculty.empId}
                            className={`border-b border-[#132944] transition last:border-0 ${
                              isHod
                                ? "bg-emerald-700/40 hover:bg-emerald-700/60"
                                : "hover:bg-[#0a2742]"
                            }`}
                          >
                            <td className="py-3 pl-5 pr-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[16px] font-semibold text-white">
                                  {avatarLetter}
                                </span>
                                <div className="min-w-0">
                                  <span className="block truncate font-medium text-white">
                                    {name}
                                    {isHod && (
                                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#3984ff1f] px-2 py-0.5 text-[10px] font-semibold text-[#3984ff]">
                                        HOD
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.empId || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.designation || "-"}
                              </span>
                            </td>
                            {/* <td className="px-4 py-3">
                              <span className="block truncate">
                                {reportingName || "-"}
                              </span>
                            </td> */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleViewProfile(faculty)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                                  aria-label={`View profile for ${name}`}
                                  title="View Profile"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-8 text-center text-[#8ca1bd]"
                        >
                          {searchQuery || departmentFilter !== "All"
                            ? "No faculty records found matching your filters."
                            : "No faculty records available."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamsPage;
