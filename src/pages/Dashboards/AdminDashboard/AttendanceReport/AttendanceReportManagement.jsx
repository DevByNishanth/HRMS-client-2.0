import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../../components/Siedbar";
import CommonHeader from "../../../../components/CommonHeader";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece-hrms-server.onrender.com";
const summaryColumns = ["P", "A", "OFF", "OD"];
const stickyRightClasses = ["right-[114px]", "right-[76px]", "right-[38px]", "right-[0px]"];
const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const yearOptions = [2024, 2025, 2026, 2027, 2028];

const fallbackEmployees = [
  {
    id: "SECENAD002",
    name: "A.ANBARASAN",
    designation: "Senior Lab Technician, Coimbatore",
    attendance: {
      "2026-06-01": "A",
      "2026-06-02": "A",
      "2026-06-03": "A",
      "2026-06-04": "A",
      "2026-06-05": "A",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "A",
      "2026-06-09": "A",
      "2026-06-10": "A",
      "2026-06-11": "A",
      "2026-06-12": "A",
      "2026-06-13": "A",
      "2026-06-14": "OFF",
      "2026-06-15": "A",
    },
    summary: { P: 0, L: 0, H: 0, A: 12, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
  {
    id: "SECETCS136",
    name: "ABINAYA M",
    designation: "ASSISTANT PROFESSOR, Coimbatore",
    attendance: {
      "2026-06-01": "A",
      "2026-06-02": "A",
      "2026-06-03": "A",
      "2026-06-04": "A",
      "2026-06-05": "A",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "A",
      "2026-06-09": "A",
      "2026-06-10": "A",
      "2026-06-11": "A",
      "2026-06-12": "A",
      "2026-06-13": "A",
      "2026-06-14": "OFF",
      "2026-06-15": "A",
    },
    summary: { P: 0, L: 0, H: 0, A: 12, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
  {
    id: "SECEADM161",
    name: "ABISHEK K",
    designation: "Software Developer, Coimbatore",
    attendance: {
      "2026-06-01": "P",
      "2026-06-02": "P",
      "2026-06-03": "A",
      "2026-06-04": "P",
      "2026-06-05": "A:P",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "A:P",
      "2026-06-09": "A:P",
      "2026-06-10": "A:P",
      "2026-06-11": "A:P",
      "2026-06-12": "A",
      "2026-06-13": "A",
      "2026-06-14": "OFF",
      "2026-06-15": "A:P",
    },
    summary: { P: 6.5, L: 0, H: 0, A: 5.5, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
  {
    id: "SECETCS127",
    name: "AGALYA K",
    designation: "ASSISTANT PROFESSOR, Coimbatore",
    attendance: {
      "2026-06-01": "A",
      "2026-06-02": "A",
      "2026-06-03": "A",
      "2026-06-04": "A",
      "2026-06-05": "A",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "A",
      "2026-06-09": "A",
      "2026-06-10": "A",
      "2026-06-11": "A",
      "2026-06-12": "A",
      "2026-06-13": "A",
      "2026-06-14": "OFF",
      "2026-06-15": "P",
    },
    summary: { P: 1, L: 0, H: 0, A: 11, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
  {
    id: "SECETMA012",
    name: "AKILADEVI N",
    designation: "ASSISTANT PROFESSOR, Coimbatore",
    attendance: {
      "2026-06-01": "A",
      "2026-06-02": "A:P",
      "2026-06-03": "A",
      "2026-06-04": "P",
      "2026-06-05": "A",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "A",
      "2026-06-09": "A",
      "2026-06-10": "P",
      "2026-06-11": "A",
      "2026-06-12": "A",
      "2026-06-13": "A",
      "2026-06-14": "OFF",
      "2026-06-15": "P",
    },
    summary: { P: 3.5, L: 0, H: 0, A: 8.5, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
  {
    id: "SECEPLC013",
    name: "ALOYSIUS JUDE L D",
    designation: "Softskills Trainer, Coimbatore",
    attendance: {
      "2026-06-01": "A",
      "2026-06-02": "A",
      "2026-06-03": "A",
      "2026-06-04": "A",
      "2026-06-05": "A",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "A",
      "2026-06-09": "P",
      "2026-06-10": "A",
      "2026-06-11": "A:P",
      "2026-06-12": "P",
      "2026-06-13": "A:P",
      "2026-06-14": "OFF",
      "2026-06-15": "P",
    },
    summary: { P: 4, L: 0, H: 0, A: 8, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
  {
    id: "SECEADM102",
    name: "ANAND BABU P",
    designation: "Creative Head, Coimbatore",
    attendance: {
      "2026-06-01": "A",
      "2026-06-02": "P",
      "2026-06-03": "A",
      "2026-06-04": "P:A",
      "2026-06-05": "A",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "P",
      "2026-06-09": "P",
      "2026-06-10": "P",
      "2026-06-11": "P",
      "2026-06-12": "A",
      "2026-06-13": "A",
      "2026-06-14": "OFF",
      "2026-06-15": "A",
    },
    summary: { P: 5.5, L: 0, H: 0, A: 6.5, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
  {
    id: "SECETCS073",
    name: "ANANDARAJ A",
    designation: "ASSISTANT PROFESSOR, Coimbatore",
    attendance: {
      "2026-06-01": "P",
      "2026-06-02": "P",
      "2026-06-03": "A",
      "2026-06-04": "P",
      "2026-06-05": "P",
      "2026-06-06": "OFF",
      "2026-06-07": "OFF",
      "2026-06-08": "P",
      "2026-06-09": "P",
      "2026-06-10": "A",
      "2026-06-11": "P",
      "2026-06-12": "P",
      "2026-06-13": "P",
      "2026-06-14": "OFF",
      "2026-06-15": "A:P",
    },
    summary: { P: 9.5, L: 0, H: 0, A: 2.5, OFF: 3, R: 0, OD: 0, "?": 0 },
  },
];

function getMonthDates(year, monthIndex) {
  const dates = [];
  const cursor = new Date(year, monthIndex, 1);

  while (cursor.getMonth() === monthIndex) {
    const date = new Date(cursor);
    dates.push({
      date,
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function getCellClass(status, isWeekend) {
  const normalizedStatus = String(status || "").trim();
  const baseClass = "h-[42px] min-w-[40px] px-2 text-center whitespace-nowrap text-sm font-medium text-white";

  if (normalizedStatus === "A") return `${baseClass} bg-[#ef4444]`;
  if (normalizedStatus === "P") return `${baseClass} bg-[#22c55e]`;
  if (normalizedStatus === "OFF") return `${baseClass} bg-[#f59e0b] text-[#78350f]`;
  if (normalizedStatus === "OD") return `${baseClass} bg-[#8b5cf6]`;
  if (normalizedStatus.includes(":")) return `${baseClass} bg-[#3b82f6]`;
  return `${baseClass} ${isWeekend ? "bg-[#0f1e36]" : "bg-[#1a2847]"}`;
}

function getEmployeeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.employees)) return payload.employees;
  if (Array.isArray(payload?.data?.employees)) return payload.data.employees;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.data?.records)) return payload.data.records;
  if (Array.isArray(payload?.muster)) return payload.muster;
  if (Array.isArray(payload?.data?.muster)) return payload.data.muster;
  if (Array.isArray(payload?.attendance)) return payload.attendance;
  if (Array.isArray(payload?.data?.attendance)) return payload.data.attendance;
  return [];
}

function getEmployeeName(employee) {
  return (
    employee.name ||
    employee.employeeName ||
    employee.facultyName ||
    [employee.firstName, employee.lastName].filter(Boolean).join(" ").trim() ||
    [employee.facultyId?.firstName, employee.facultyId?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Unnamed Employee"
  );
}

function getEmployeeId(employee) {
  return (
    employee.id ||
    employee.empId ||
    employee.employeeId ||
    employee.employeeCode ||
    employee.facultyId?.empId ||
    employee._id
  );
}

function getEmployeeDesignation(employee) {
  // console.log("Employee:", employee);
  return employee.department || "";
}

function getEmployeeDepartmentType(employee) {
  const designation = getEmployeeDesignation(employee);

  if (!designation) return "";

  return designation.split(",")[0].trim();
}

function normalizeAttendanceMap(employee) {
  const rawAttendance =
    employee.attendance ||
    employee.attendanceMap ||
    employee.days ||
    employee.dailyAttendance ||
    employee.muster ||
    {};

  if (Array.isArray(rawAttendance)) {
    return rawAttendance.reduce((attendance, item) => {
      const dateKey = item.date || item.attendanceDate || item.day || item.key;
      const status =
        item.status || item.attendance || item.value || item.mark || "-";

      if (dateKey) {
        const parsedDate = new Date(dateKey);
        const normalizedKey = Number.isNaN(parsedDate.getTime())
          ? dateKey
          : `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(
              parsedDate.getDate(),
            ).padStart(2, "0")}`;
        attendance[normalizedKey] = status;
      }

      return attendance;
    }, {});
  }

  return rawAttendance || {};
}

function calculateSummary(attendance) {
  return Object.values(attendance).reduce(
    (summary, rawStatus) => {
      const status = String(rawStatus || "-");

      if (status === "P") summary.P += 1;
      else if (status === "A") summary.A += 1;
      else if (status === "OFF") summary.OFF += 1;
      else if (status === "L") summary.L += 1;
      else if (status === "H") summary.H += 1;
      else if (status === "R") summary.R += 1;
      else if (status === "OD") summary.OD += 1;
      else if (status.includes(":")) {
        status.split(":").forEach((part) => {
          if (summary[part] !== undefined) summary[part] += 0.5;
        });
      } else if (status !== "-") {
        summary["?"] += 1;
      }

      return summary;
    },
    { P: 0, L: 0, H: 0, A: 0, OFF: 0, R: 0, OD: 0, "?": 0 },
  );
}

function normalizeEmployees(payload) {
  return getEmployeeList(payload).map((employee, index) => {
    const attendance = normalizeAttendanceMap(employee);

    return {
      id: getEmployeeId(employee) || `employee-${index}`,
      name: getEmployeeName(employee),
      department: getEmployeeDepartmentType(employee),
      designation: getEmployeeDesignation(employee),
      attendance,
      summary:
        employee.summary ||
        employee.totals ||
        employee.counts ||
        calculateSummary(attendance),
    };
  });
}

function getAttendanceStatus(attendance, date) {
  return (
    attendance[date.key] ||
    attendance[String(date.day)] ||
    attendance[date.day] ||
    attendance[date.key.split("-").reverse().join("-")] ||
    "-"
  );
}

export default function AttendanceManagement() {
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const dates = useMemo(
    () => getMonthDates(selectedYear, selectedMonth),
    [selectedMonth, selectedYear],
  );
  const monthTitle = new Date(selectedYear, selectedMonth).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const departmentOptions = useMemo(() => {
    const types = employees
      .map((employee) => getEmployeeDepartmentType(employee))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    return ["All", ...new Set(types)];
  }, [employees]);

  const visibleEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        [employee.name, employee.id, employee.designation]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch),
          );

      const departmentType = getEmployeeDepartmentType(employee);
      const matchesDepartment =
        selectedDepartment === "All" || departmentType === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, selectedDepartment]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAttendanceMuster() {
      const token = localStorage.getItem("hrms_token");

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/attendance/muster?month=${selectedMonth + 1}&year=${selectedYear}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          },
        );
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message || data?.error || "Unable to load attendance muster.",
          );
        }

        setEmployees(normalizeEmployees(data));
      } catch (error) {
        if (error.name === "AbortError") return;
        setEmployees([]);
        setErrorMessage(error.message || "Unable to load attendance muster.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchAttendanceMuster();

    return () => controller.abort();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <main className="min-h-0 flex-1 overflow-hidden">
          <section className="flex h-full flex-col overflow-hidden rounded bg-[#071425] p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 bg-[#071425] px-4 py-3">
              <div>
                <h1 className="text-white text-lg font-extrabold leading-[1.25]">
                  Attendance Report
                </h1>
                <p className="text-white text-xs font-bold mt-1">
                  {isLoading ? "Loading attendance..." : monthTitle}
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <div
                  className="flex flex-wrap items-center gap-2 rounded-full border border-white/18 bg-transparent px-2.5 py-1.5"
                  aria-label="Attendance status legend"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" /> Present
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> Absent
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#fef3c7]" /> OFF
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" /> OD
                  </span>
                </div>
                <label className="grid gap-1.5 text-[10px] font-extrabold uppercase text-white">
                  <span>Search</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Name /Employee ID"
                    className="min-w-[220px] rounded-lg border border-white/18 bg-[#071425] px-2.5 py-2 text-sm font-bold text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none"
                  />
                </label>
                <label className="grid gap-1.5 text-[10px] font-extrabold uppercase text-white">
                  <span>Department</span>
                  <select
                    value={selectedDepartment}
                    onChange={(event) =>
                      setSelectedDepartment(event.target.value)
                    }
                    className="min-w-[120px] rounded-lg border border-white/18 bg-[#071425] px-2.5 py-2 text-sm font-bold text-white focus:border-white/40 focus:outline-none"
                  >
                    {departmentOptions.map((department) => (
                      <option value={department} key={department} className="bg-[#071425] text-white">
                        {department}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-[10px] font-extrabold uppercase text-white">
                  <span>Month</span>
                  <select
                    value={selectedMonth}
                    onChange={(event) =>
                      setSelectedMonth(Number(event.target.value))
                    }
                    className="min-w-[120px] rounded-lg border border-white/18 bg-[#071425] px-2.5 py-2 text-sm font-bold text-white focus:border-white/40 focus:outline-none"
                  >
                    {monthOptions.map((month, index) => (
                      <option value={index} key={month} className="bg-[#071425] text-white">
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-[10px] font-extrabold uppercase text-white">
                  <span>Year</span>
                  <select
                    value={selectedYear}
                    onChange={(event) =>
                      setSelectedYear(Number(event.target.value))
                    }
                    className="min-w-[120px] rounded-lg border border-white/18 bg-[#071425] px-2.5 py-2 text-sm font-bold text-white focus:border-white/40 focus:outline-none"
                  >
                    {yearOptions.map((year) => (
                      <option value={year} key={year} className="bg-[#071425] text-white">
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {errorMessage && (
              <div className="rounded-b-lg bg-[#fff7ed] border-b border-[#fed7aa] px-4 py-2 text-sm font-bold text-[#9a3412]">
                {errorMessage}
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-auto bg-[#071425]">
              <table className="min-w-[1750px] w-max border-separate border-spacing-0 text-sm text-white bg-[#071425]">
                <thead>
                  <tr>
                    <th className="sticky top-0 left-0 z-30 h-[42px] min-w-[270px] bg-[#071425] px-2 text-left text-base font-bold text-white" rowSpan="2">
                      Employee
                    </th>
                    <th className="min-w-[1240px] bg-transparent border-0 p-0" colSpan={dates.length} aria-hidden="true" />
                    {summaryColumns.map((column, index) => (
                      <th
                        className={`sticky top-0 z-30 h-[42px] w-[38px] min-w-[38px] bg-[#071425] px-2 font-bold text-white ${stickyRightClasses[index]}`}
                        rowSpan="2"
                        key={column}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {dates.map((date) => (
                      <th
                        className="sticky top-[42px] h-[40px] min-w-[40px] border-r border-white/12 border-b border-white/12 bg-[#071425] px-0 py-0 text-white"
                        key={date.key}
                      >
                        <span className="block text-base">{date.day}</span>
                        <small className="block text-[13px] font-bold">{date.weekday}</small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td
                        className="h-[120px] bg-[#1a2847] px-4 py-3 text-sm font-bold text-white"
                        colSpan={dates.length + summaryColumns.length + 1}
                      >
                        Loading attendance muster...
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    visibleEmployees.map((employee) => (
                      <tr key={employee.id} className="even:bg-[#0a1a2e]">
                        <th
                          className="sticky left-0 z-20 bg-[#071425] px-2 py-2 text-left align-middle"
                          scope="row"
                        >
                          <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-white">
                            {employee.name} [{employee.id}]
                          </strong>
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-white/90 mt-1">
                            {employee.designation}
                          </span>
                        </th>
                        {dates.map((date) => {
                          const status = getAttendanceStatus(
                            employee.attendance,
                            date,
                          );

                          return (
                            <td
                              className={getCellClass(status, date.isWeekend)}
                              key={`${employee.id}-${date.key}`}
                            >
                              {status}
                            </td>
                          );
                        })}
                        {summaryColumns.map((column, index) => (
                          <td
                            className={`sticky z-20 h-[42px] w-[38px] min-w-[38px] bg-[#1a2847] px-2 font-bold text-white ${stickyRightClasses[index]}`}
                            key={`${employee.id}-${column}`}
                          >
                            {employee.summary?.[column] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  {!isLoading && visibleEmployees.length === 0 && (
                    <tr>
                      <td
                        className="h-[120px] bg-[#1a2847] px-4 py-3 text-sm font-bold text-white"
                        colSpan={dates.length + summaryColumns.length + 1}
                      >
                        No attendance records found for {monthTitle}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
