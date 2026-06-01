import { useMemo, useState } from "react";
import {
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Sidebar from "../../../../components/Siedbar";
import CommonHeader from "../../../../components/CommonHeader";
import AddFacultyForm from "./AddFacultyForm";

const facultyMembers = [
  {
    name: "Dr. Nishanth A",
    empId: "EMP001",
    designation: "HOD",
    dept: "Computer Science",
    type: "Teaching",
  },
  {
    name: "Dr. Meera Krishnan",
    empId: "EMP014",
    designation: "Professor",
    dept: "Information Technology",
    type: "Teaching",
  },
  {
    name: "Prof. Aravind Kumar",
    empId: "EMP026",
    designation: "Associate Professor",
    dept: "Electronics",
    type: "Teaching",
  },
  {
    name: "Ms. Priya Raman",
    empId: "EMP039",
    designation: "Assistant Professor",
    dept: "Computer Science",
    type: "Teaching",
  },
  {
    name: "Mr. Karthik S",
    empId: "EMP052",
    designation: "Assistant Professor",
    dept: "Mechanical",
    type: "Teaching",
  },
  {
    name: "Mrs. Latha Devi",
    empId: "EMP063",
    designation: "Admin Executive",
    dept: "Administration",
    type: "Non Teaching",
  },
  {
    name: "Mr. Suresh Babu",
    empId: "EMP071",
    designation: "Lab Assistant",
    dept: "Computer Science",
    type: "Non Teaching",
  },
  {
    name: "Mrs. Deepa Nair",
    empId: "EMP088",
    designation: "Professor",
    dept: "Civil",
    type: "Teaching",
  },
];

const roleOptions = [
  "All",
  "Assistant Professor",
  "Professor",
  "Associate Professor",
  "HOD",
];

const typeOptions = ["All", "Teaching", "Non Teaching"];

const typeStyles = {
  Teaching: {
    row: "hover:bg-[#123250]",
    stripe: "border-l-[#18d3bf]",
    badge: "bg-[#18d3bf1f] text-[#18d3bf]",
  },
  "Non Teaching": {
    row: "bg-[#f0a15f08] hover:bg-[#3a2a1f]",
    stripe: "border-l-[#f0a15f]",
    badge: "bg-[#f0a15f1f] text-[#f0a15f]",
  },
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

const FacultyManagementPage = () => {
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const departmentOptions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(facultyMembers.map((faculty) => faculty.dept))),
    ],
    [],
  );

  const filteredFaculty = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return facultyMembers.filter((faculty) => {
      const matchesSearch =
        !normalizedSearch ||
        [faculty.name, faculty.empId, faculty.designation, faculty.dept]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesRole =
        roleFilter === "All" || faculty.designation === roleFilter;
      const matchesDepartment =
        departmentFilter === "All" || faculty.dept === departmentFilter;
      const matchesType = typeFilter === "All" || faculty.type === typeFilter;

      return matchesSearch && matchesRole && matchesDepartment && matchesType;
    });
  }, [departmentFilter, roleFilter, searchQuery, typeFilter]);

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
              <div className="relative z-20 flex flex-col gap-3 px-4 py-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
                <h2 className="shrink-0 text-[18px] font-semibold text-white">
                  Faculty List <span>({filteredFaculty.length})</span>
                </h2>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_190px_220px_190px] 2xl:max-w-[840px]">
                  <div className="relative min-w-0">
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
                    label="Types"
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={typeOptions}
                  />
                </div>
              </div>

              <div className="relative z-0 max-h-[calc(100vh-275px)] overflow-auto table-custom-scrollbar">
                <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
                  <colgroup>
                    <col className="w-[24%]" />
                    <col className="w-[12%]" />
                    <col className="w-[18%]" />
                    <col className="w-[20%]" />
                    <col className="w-[14%]" />
                    <col className="w-[12%]" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="py-3 pl-5 pr-4 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Emp ID</th>
                      <th className="px-4 py-3 font-semibold">Designation</th>
                      <th className="px-4 py-3 font-semibold">Dept</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-[#cad7eb]">
                    {filteredFaculty.length > 0 ? (
                      filteredFaculty.map((faculty) => {
                        const styles = typeStyles[faculty.type];

                        return (
                          <tr
                            key={faculty.empId}
                            className={`border-b border-[#132944] transition last:border-0 ${styles.row}`}
                          >
                            <td
                              className={`border-l-[3px] py-3 pl-5 pr-4 font-semibold text-white ${styles.stripe}`}
                            >
                              <span className="block truncate">
                                {faculty.name}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.empId}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.designation}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate">
                                {faculty.dept}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${styles.badge}`}
                              >
                                <span className="h-[4px] w-[4px] rounded-full bg-current" />
                                {faculty.type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                                  aria-label={`View ${faculty.name}`}
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#3984ff12] text-[#78a7ff] transition hover:bg-[#3984ff24] hover:text-white"
                                  aria-label={`Edit ${faculty.name}`}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                                  aria-label={`Delete ${faculty.name}`}
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
        <AddFacultyForm onClose={() => setIsAddFacultyOpen(false)} />
      )}
    </div>
  );
};

export default FacultyManagementPage;
