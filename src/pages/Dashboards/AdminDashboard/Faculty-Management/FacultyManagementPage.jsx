import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Download,
} from "lucide-react";
import Sidebar from "../../../../components/Siedbar";
import CommonHeader from "../../../../components/CommonHeader";
import AddFacultyForm from "./AddFacultyForm";
import EditFacultyCanvas from "./EditFacultyCanvas";
import userImg from "../../../../assets/userImg.svg";
import { jwtDecode } from "jwt-decode";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { exportToExcel } from "../../../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const typeStyles = {
  Teaching: {
    row: "hover:bg-[#123250]",
    stripe: "border-l-[#18d3bf]",
    badge: "bg-[#18d3bf1f] text-[#18d3bf]",
  },
  "Non-Teaching": {
    row: "bg-[#f0a15f08] hover:bg-[#3a2a1f]",
    stripe: "border-l-[#f0a15f]",
    badge: "bg-[#f0a15f1f] text-[#f0a15f]",
  },
  Driver: {
    row: "hover:bg-[#182f45]",
    stripe: "border-l-[#78a7ff]",
    badge: "bg-[#3984ff1f] text-[#78a7ff]",
  },
  Housekeeping: {
    row: "hover:bg-[#24303a]",
    stripe: "border-l-[#c4c6d0]",
    badge: "bg-[#c4c6d01f] text-[#c4c6d0]",
  },
};

const defaultTypeStyle = {
  row: "hover:bg-[#123250]",
  stripe: "border-l-[#8ca1bd]",
  badge: "bg-[#8ca1bd1f] text-[#8ca1bd]",
};

const getFacultyList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.faculties)) return payload.faculties;
  if (Array.isArray(payload?.data?.faculties)) return payload.data.faculties;
  if (Array.isArray(payload?.facultyDetails)) return payload.facultyDetails;
  if (Array.isArray(payload?.data?.facultyDetails))
    return payload.data.facultyDetails;
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
    .trim() ||
  faculty.empId ||
  "Unnamed Faculty";

const getFacultyId = (faculty) => faculty?._id;

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

const FacultyManagementPage = () => {
  // Auth
  const token = localStorage.getItem("hrms_token");
  let decoded = jwtDecode(token);

  const navigate = useNavigate();
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [deletingFaculty, setDeletingFaculty] = useState(null);
  const [isDeletingFaculty, setIsDeletingFaculty] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(false);
  const [facultyError, setFacultyError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [originalDepartmentFilter, setOriginalDepartmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  const exportCurrentFilteredRows = () => {
    const rows = filteredFaculty.map((faculty) => ({
      "Faculty Name": getFacultyName(faculty),
      "Emp ID": faculty.empId || "-",
      Designation: faculty.designation || "-",
      Department: faculty.department || "-",
      "Original Department": faculty.originalDepartment || "-",
      Type: faculty.employeeCategory || "-",
    }));
    exportToExcel(rows, "Faculty-List.xlsx");
  };

  const fetchFaculties = useCallback(async () => {
    await Promise.resolve();

    const token = localStorage.getItem("hrms_token");
    if (!token) {
      setFacultyError("Login token is missing. Please sign in again.");
      setFacultyMembers([]);
      return;
    }

    setIsLoadingFaculty(true);
    setFacultyError("");

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/faculties`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to load faculties.",
        );
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

  const roleOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          facultyMembers.map((faculty) => faculty.designation).filter(Boolean),
        ),
      ),
    ],
    [facultyMembers],
  );

  const departmentOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          facultyMembers.map((faculty) => faculty.department).filter(Boolean),
        ),
      ),
    ],
    [facultyMembers],
  );

  const originalDepartmentOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          facultyMembers
            .map((faculty) => faculty.originalDepartment)
            .filter(Boolean),
        ),
      ),
    ],
    [facultyMembers],
  );

  const typeOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          facultyMembers
            .map((faculty) => faculty.employeeCategory)
            .filter(Boolean),
        ),
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
        [
          name,
          faculty.empId,
          faculty.designation,
          faculty.department,
          faculty.originalDepartment,
          faculty.employeeCategory,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesRole =
        roleFilter === "All" || faculty.designation === roleFilter;
      const matchesDepartment =
        departmentFilter === "All" || faculty.department === departmentFilter;
      const matchesOriginalDepartment =
        originalDepartmentFilter === "All" ||
        faculty.originalDepartment === originalDepartmentFilter;
      const matchesType =
        typeFilter === "All" || faculty.employeeCategory === typeFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment &&
        matchesOriginalDepartment &&
        matchesType
      );
    });
  }, [
    departmentFilter,
    facultyMembers,
    originalDepartmentFilter,
    roleFilter,
    searchQuery,
    typeFilter,
  ]);

  const handleFacultyCreated = () => {
    fetchFaculties();
  };

  const handleFacultySaved = () => {
    setEditingFaculty(null);
    fetchFaculties();
  };

  const handleViewFaculty = (faculty) => {
    console.log("faculty id : ", faculty);
    const facultyId = getFacultyId(faculty);
    if (!facultyId) {
      setFacultyError("Faculty ID is missing. Unable to open profile.");
      return;
    }

    navigate(`/profile/${faculty._id}`);
  };

  const handleDeleteFaculty = async () => {
    const facultyId = getFacultyId(deletingFaculty);
    if (!facultyId) {
      setDeleteError("Faculty ID is missing. Unable to delete this record.");
      return;
    }

    const token = localStorage.getItem("hrms_token");
    if (!token) {
      setDeleteError("Login token is missing. Please sign in again.");
      return;
    }

    setIsDeletingFaculty(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${facultyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to delete faculty.",
        );
      }

      setDeletingFaculty(null);
      fetchFaculties();
    } catch (error) {
      setDeleteError(
        error.message || "Something went wrong while deleting faculty.",
      );
    } finally {
      setIsDeletingFaculty(false);
    }
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
                  Faculty Management
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Manage faculty records, departments, roles, and staff type.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddFacultyOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <Plus size={16} />
                Add Faculty
              </button>
            </div>

            <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
              <h2 className="shrink-0 mt-2 ml-4  text-[18px] font-semibold text-white">
                Faculty List <span>({filteredFaculty.length})</span>
              </h2>
              <div className="relative z-20 flex flex-col gap-3 px-4 py-3 2xl:flex-row 2xl:items-center ">
                <div className="grid grid-cols-5 gap-2 ">
                  <div className="relative">
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
                    label="Roles"
                    value={roleFilter}
                    onChange={setRoleFilter}
                    options={roleOptions}
                  />
                  <SelectFilter
                    label="Departments"
                    value={departmentFilter}
                    onChange={setDepartmentFilter}
                    options={departmentOptions}
                  />
                  <SelectFilter
                    label="Original Departments"
                    value={originalDepartmentFilter}
                    onChange={setOriginalDepartmentFilter}
                    options={originalDepartmentOptions}
                  />
                  <SelectFilter
                    label="Types"
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={typeOptions}
                  />
                </div>
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

              <ExportPasswordModal
                isOpen={isExportModalOpen}
                onClose={closeExportModal}
                onConfirm={(password) =>
                  handleConfirmExport(password, exportCurrentFilteredRows)
                }
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
                  <colgroup>
                    <col className="w-[22%]" />
                    <col className="w-[12%]" />
                    <col className="w-[13%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[12%]" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[14px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="py-3 pl-5 pr-4 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Emp ID</th>
                      <th className="px-4 py-3 font-semibold">Designation</th>
                      <th className="px-4 py-3 font-semibold">Dept</th>
                      <th className="px-4 py-3 font-semibold">Original Dept</th>
                      <th className="px-4 py-3 font-semibold">Reporting To</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-[#cad7eb]">
                    {isLoadingFaculty ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-8 text-center text-[#8ca1bd]"
                        >
                          Loading faculty records...
                        </td>
                      </tr>
                    ) : filteredFaculty.length > 0 ? (
                      filteredFaculty.map((faculty) => {
                        const name = getFacultyName(faculty);
                        const type = faculty.employeeCategory || "Teaching";
                        const styles = typeStyles[type] || defaultTypeStyle;

                        return (
                          <tr
                            key={faculty._id || faculty.empId}
                            className={`border-b border-[#132944] transition last:border-0 ${styles.row}`}
                          >
                            <td className={``}>
                              <div className="flex items-center gap-3 pl-4">
                                <img
                                  src={userImg}
                                  alt={name}
                                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                />
                                <span className="block truncate">{name}</span>
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
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.department || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.originalDepartment || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.reportingTo?.name || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${styles.badge}`}
                              >
                                <span className="h-[4px] w-[4px] rounded-full bg-current" />
                                {type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                                <button
                                  type="button"
                                  onClick={() => handleViewFaculty(faculty)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                                  aria-label={`View ${name}`}
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingFaculty(faculty)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#3984ff12] text-green-400/60 transition hover:bg-[#3984ff24] hover:text-white"
                                  aria-label={`Edit ${name}`}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeleteError("");
                                    setDeletingFaculty(faculty);
                                  }}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                                  aria-label={`Delete ${name}`}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-8 text-center text-[#8ca1bd]"
                        >
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

      {isAddFacultyOpen && (
        <AddFacultyForm
          onClose={() => setIsAddFacultyOpen(false)}
          onCreated={handleFacultyCreated}
        />
      )}

      {editingFaculty && (
        <EditFacultyCanvas
          faculty={editingFaculty}
          onClose={() => setEditingFaculty(null)}
          onSaved={handleFacultySaved}
        />
      )}

      {deletingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-[4px]">
          <div className="w-full max-w-[420px] rounded-xl border border-[#183052] bg-[#071425] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <header className="border-b border-[#183052] py-3 px-4">
              <p className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#f16868]">
                Delete Faculty
              </p>
            </header>

            <div classname="">
              <h3 className="mt-2 text-[18px] font-semibold text-white px-4">
                Remove {getFacultyName(deletingFaculty)}?
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-[#9eb0cc] px-4">
                This action will permanently delete the faculty record from the
                system.
              </p>
            </div>

            {deleteError && (
              <p className="mt-4 rounded-lg bg-[#f168681f] px-3 py-2 text-[12px] font-semibold text-[#f16868]">
                {deleteError}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2 px-4 mb-2">
              <button
                type="button"
                onClick={() => setDeletingFaculty(null)}
                disabled={isDeletingFaculty}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] px-6 text-lg font-medium text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteFaculty}
                disabled={isDeletingFaculty}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FF4B4B] px-6 text-lg font-medium text-white transition hover:bg-[#bd3434] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingFaculty ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagementPage;
