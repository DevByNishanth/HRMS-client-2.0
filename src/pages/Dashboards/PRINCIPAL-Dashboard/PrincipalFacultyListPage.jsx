import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Eye,
  Search,
  Users,
  GraduationCap,
  BookOpen,
  Briefcase,
  Download,
} from "lucide-react";
import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import ExportPasswordModal from "../../../components/ExportPasswordModal";
import { exportToExcel } from "../../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../../hooks/usePasswordProtectedExport";

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

const SelectFilter = ({
  label,
  value,
  onChange,
  options,
  className = "w-[200px]",
}) => (
  <label className={`relative inline-flex max-w-full `}>
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

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="rounded-xl border border-[#183052] bg-[#0a1a2d] px-4 py-3">
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <Icon size={18} />
      </div>
      <div>
        <span className="text-[14px] font-medium text-[#8ca1bd]">{label}</span>
        <p className="text-[16px] font-semibold leading-none text-white">{value}</p>
      </div>
    </div>
  </div>
);

const PrincipalFacultyListPage = () => {
  const navigate = useNavigate();
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(false);
  const [facultyError, setFacultyError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  const exportCurrentFilteredRows = () => {
    const rows = filteredFaculty.map((f) => ({
      "Faculty Name": getFacultyName(f),
      "Emp ID": f.empId || "-",
      "Department": f.department || "-",
      "Designation": f.designation || "-",
    }));
    exportToExcel(rows, "Faculty-List.xlsx");
  };

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
        throw new Error(data?.message || data?.error || "Unable to load faculties.");
      }

      const facultyList = getFacultyList(data);
      setFacultyMembers(facultyList);
    } catch (error) {
      setFacultyError(error.message || "Unable to load faculties.");
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

  const designationOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(facultyMembers.map((faculty) => faculty.designation).filter(Boolean)),
      ),
    ],
    [facultyMembers],
  );

  const filteredFaculty = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return facultyMembers.filter((faculty) => {
      const name = getFacultyName(faculty);
      const matchesSearch =
        !normalizedSearch ||
        [name, faculty.empId, faculty.designation, faculty.department]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesDepartment =
        departmentFilter === "All" || faculty.department === departmentFilter;
      const matchesDesignation =
        designationFilter === "All" || faculty.designation === designationFilter;

      return matchesSearch && matchesDepartment && matchesDesignation;
    });
  }, [departmentFilter, designationFilter, facultyMembers, searchQuery]);

  // Stat card counts based on filtered department
  const deptFaculties = useMemo(() => {
    if (departmentFilter === "All") return facultyMembers;
    return facultyMembers.filter((f) => f.department === departmentFilter);
  }, [facultyMembers, departmentFilter]);

  const statCards = useMemo(() => {
    const total = deptFaculties.length;
    const asstProf = deptFaculties.filter(
      (f) => f.designation?.toLowerCase().includes("assistant"),
    ).length;
    const assocProf = deptFaculties.filter(
      (f) => f.designation?.toLowerCase().includes("associate"),
    ).length;
    const professor = deptFaculties.filter(
      (f) =>
        f.designation?.toLowerCase().includes("professor") &&
        !f.designation?.toLowerCase().includes("assistant") &&
        !f.designation?.toLowerCase().includes("associate"),
    ).length;

    return [
      { label: "Total Faculty", value: total, icon: Users, color: "#3984ff" },
      { label: "Assistant Prof", value: asstProf, icon: GraduationCap, color: "#18d3bf" },
      { label: "Associate Prof", value: assocProf, icon: BookOpen, color: "#f0a15f" },
      { label: "Professor", value: professor, icon: Briefcase, color: "#8b7cff" },
    ];
  }, [deptFaculties]);

  const handleViewFaculty = (faculty) => {
    const facultyId = faculty?._id;
    if (!facultyId) return;
    navigate(`/profile/${facultyId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto ">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">
                  Faculty List
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  View and manage all faculty members across departments.
                </p>
              </div>
              <div className="flex justify-end">
                <SelectFilter
                  label="Department"
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  options={departmentOptions}
                />
              </div>
            </header>

            {/* Stat Cards */}
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>

            {/* Faculty Table */}
            <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d] ">
              <div className="relative z-20 flex  gap-3 px-4 py-3 items-center  justify-between ">
                <h2 className="shrink-0 text-[18px] font-semibold text-white">
                  Faculty List <span>({filteredFaculty.length})</span>
                </h2>

                <div className="flex items-center gap-3 ">
                  <div className="relative w-[380px]">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search faculty..."
                      className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] px-3 pl-10 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    />
                  </div>

                  <SelectFilter
                    label="Designation"
                    value={designationFilter}
                    onChange={setDesignationFilter}
                    options={designationOptions}
                    className="w-full"
                  />
                  <SelectFilter
                    label="Department"
                    value={departmentFilter}
                    onChange={setDepartmentFilter}
                    options={departmentOptions}
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={handleExportClick}
                    disabled={filteredFaculty.length === 0}
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[14px] font-medium text-white transition hover:border-[#3984ff] hover:bg-[#132b49] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              <ExportPasswordModal
                isOpen={isExportModalOpen}
                onClose={closeExportModal}
                onConfirm={(password) => handleConfirmExport(password, exportCurrentFilteredRows)}
                loading={exportLoading}
                error={exportError}
              />

              <div className="relative z-0 max-h-[calc(100vh-320px)] overflow-auto table-custom-scrollbar">
                {facultyError && (
                  <div className="border-t border-[#183052] px-4 py-3 text-[13px] text-[#f16868]">
                    {facultyError}
                  </div>
                )}
                <table className="w-full min-w-[800px] border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Faculty Name</th>
                      <th className="px-4 py-3 font-semibold">Emp ID</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Designation</th>
                      <th className="px-4 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-[#cad7eb]">
                    {isLoadingFaculty ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-[#8ca1bd]">
                          Loading faculty records...
                        </td>
                      </tr>
                    ) : filteredFaculty.length > 0 ? (
                      filteredFaculty.map((faculty) => {
                        const name = getFacultyName(faculty);

                        return (
                          <tr
                            key={faculty._id || faculty.empId}
                            className="border-b border-[#132944] transition last:border-0 hover:bg-[#123250]"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[16px] font-semibold text-white">
                                  {name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                                <span className="block truncate font-semibold text-white">
                                  {name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">{faculty.empId || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">{faculty.department || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">{faculty.designation || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                                <button
                                  type="button"
                                  onClick={() => handleViewFaculty(faculty)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                                  aria-label={`View ${name}`}
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
                        <td colSpan="5" className="px-4 py-8 text-center text-[#8ca1bd]">
                          No faculty records found matching your filters.
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

export default PrincipalFacultyListPage;
