import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../../components/Siedbar";
import CommonHeader from "../../../../components/CommonHeader";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece-hrms-server.onrender.com";
const summaryColumns = ["P", "A", "OFF", "OD"];
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

  if (normalizedStatus === "A") return "attendance-cell attendance-cell-absent";
  if (normalizedStatus === "P")
    return "attendance-cell attendance-cell-present";
  if (normalizedStatus === "OFF") return "attendance-cell attendance-cell-off";
  if (normalizedStatus === "OD") return "attendance-cell attendance-cell-od";
  if (normalizedStatus.includes(":"))
    return "attendance-cell attendance-cell-partial";
  return `attendance-cell ${isWeekend ? "attendance-cell-weekend" : ""}`;
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
          <section className="attendance-report flex h-full flex-col overflow-hidden rounded p-2">
            <div className="attendance-filter-bar">
              <div>
                <h1>Attendance Report</h1>
                <p>{isLoading ? "Loading attendance..." : monthTitle}</p>
              </div>
              <div className="attendance-filter-controls">
                <div
                  className="attendance-status-legend"
                  aria-label="Attendance status legend"
                >
                  <span className="attendance-status-legend-item">
                    <span className="attendance-status-dot attendance-cell-present" />{" "}
                    Present
                  </span>
                  <span className="attendance-status-legend-item">
                    <span className="attendance-status-dot attendance-cell-absent" />{" "}
                    Absent
                  </span>
                  <span className="attendance-status-legend-item">
                    <span className="attendance-status-dot attendance-cell-off" />{" "}
                    OFF
                  </span>
                  <span className="attendance-status-legend-item">
                    <span className="attendance-status-dot attendance-cell-od" />{" "}
                    OD
                  </span>
                </div>
                <label className="attendance-search-field">
                  <span>Search</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Name /Employee ID "
                  />
                </label>
                <label>
                  <span>Department</span>
                  <select
                    value={selectedDepartment}
                    onChange={(event) =>
                      setSelectedDepartment(event.target.value)
                    }
                  >
                    {departmentOptions.map((department) => (
                      <option value={department} key={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Month</span>
                  <select
                    value={selectedMonth}
                    onChange={(event) =>
                      setSelectedMonth(Number(event.target.value))
                    }
                  >
                    {monthOptions.map((month, index) => (
                      <option value={index} key={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Year</span>
                  <select
                    value={selectedYear}
                    onChange={(event) =>
                      setSelectedYear(Number(event.target.value))
                    }
                  >
                    {yearOptions.map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {errorMessage && (
              <div className="attendance-alert">{errorMessage}</div>
            )}
            <div className="attendance-table-wrap">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th className="employee-header sticky-employee" rowSpan="2">
                      Employee
                    </th>
                    <th
                      className="month-header"
                      colSpan={dates.length}
                      aria-hidden="true"
                    />
                    {summaryColumns.map((column) => (
                      <th className="summary-header" rowSpan="2" key={column}>
                        {column}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {dates.map((date) => (
                      <th className="date-header" key={date.key}>
                        <span>{date.day}</span>
                        <small>{date.weekday}</small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td
                        className="attendance-empty-state"
                        colSpan={dates.length + summaryColumns.length + 1}
                      >
                        Loading attendance muster...
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    visibleEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <th
                          className="employee-cell sticky-employee"
                          scope="row"
                        >
                          <strong>
                            {employee.name} [{employee.id}]
                          </strong>
                          <span>{employee.designation}</span>
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
                        {summaryColumns.map((column) => (
                          <td
                            className="summary-cell"
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
                        className="attendance-empty-state"
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
        <style>{`
          .attendance-report {
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.16);
            background: #071425;
          }

          .attendance-filter-bar {
            align-items: center;
            background: #071425;
            border-bottom: 1px solid rgba(255,255,255,0.12);
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            justify-content: space-between;
            padding: 12px 16px;
          }

          .attendance-filter-bar h1 {
            color: #ffffff;
            font-size: 18px;
            font-weight: 800;
            line-height: 1.25;
            margin: 0;
          }

          .attendance-filter-bar p {
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            margin: 2px 0 0;
          }

          .attendance-filter-controls {
            align-items: end;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .attendance-status-legend {
            align-items: center;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 999px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 6px 10px;
          }

          .attendance-status-legend-item {
            align-items: center;
            color: #ffffff;
            display: inline-flex;
            font-size: 12px;
            font-weight: 700;
            gap: 6px;
          }

          .attendance-status-dot {
            border-radius: 999px;
            display: inline-block;
            height: 10px;
            width: 10px;
          }

          .attendance-filter-controls label {
            color: #ffffff;
            display: grid;
            font-size: 12px;
            font-weight: 800;
            gap: 5px;
            text-transform: uppercase;
          }

          .attendance-filter-controls select,
          .attendance-filter-controls input {
            appearance: none;
            background: #071425 !important;
            border: 1px solid rgba(255,255,255,0.18) !important;
            border-radius: 6px;
            color: #ffffff !important;
            font-size: 14px;
            font-weight: 700;
            min-height: 36px;
            min-width: 120px;
            padding: 7px 10px;
          }

          .attendance-filter-controls select option {
            background: #071425;
            color: #ffffff;
          }

          .attendance-filter-controls input::placeholder {
            color: rgba(255,255,255,0.65);
          }

          .attendance-filter-controls input {
            min-width: 220px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: none;
            border-right: 1px solid rgba(255,255,255,0.18);
          }

          .attendance-alert {
            background: #fff7ed;
            border-bottom: 1px solid #fed7aa;
            color: #9a3412;
            font-size: 13px;
            font-weight: 700;
            padding: 10px 16px;
          }

          .attendance-table-wrap {
            flex: 1;
            min-height: 0;
            overflow: auto;
            background: #071425;
            scrollbar-color: #b7c4d3 #eef2f7;
            scrollbar-width: thin;
          }

          .attendance-table-wrap::-webkit-scrollbar {
            height: 10px;
            width: 10px;
          }

          .attendance-table-wrap::-webkit-scrollbar-track {
            background: #eef2f7;
          }

          .attendance-table-wrap::-webkit-scrollbar-thumb {
            background: #b7c4d3;
            border-radius: 999px;
          }

          .attendance-table {
            min-width: 1750px;
            width: max-content;
            border-collapse: separate;
            border-spacing: 0;
            color: #1f2937;
            font-size: 14px;
            background: #071425;
          }

          .attendance-table th,
          .attendance-table td {
            border-right: 1px dotted rgba(255,255,255,0.12);
            border-bottom: 1px solid rgba(255,255,255,0.12);
            height: 42px;
            padding: 0;
            text-align: center;
            white-space: nowrap;
          }

          .attendance-table thead th {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #071425;
            color: #ffffff;
            font-weight: 700;
          }

          .attendance-table thead tr:nth-child(2) th {
            position: sticky;
            top: 42px;
            z-index: 15;
          }

          .employee-header {
            width: 270px;
            min-width: 270px;
            font-size: 16px;
          }

          .sticky-employee {
            left: 0;
            position: sticky;
            z-index: 20;
          }

          .attendance-table thead .sticky-employee {
            z-index: 30;
          }

          .month-header {
            background: transparent;
            border: 0;
            height: 0;
            min-width: 1240px;
            padding: 0;
          }

          .date-header {
            width: 40px;
            min-width: 40px;
            height: 40px;
            color: #ffffff;
          }

          .date-header span,
          .date-header small {
            display: block;
            line-height: 1.3;
            color: #ffffff;
          }

          .date-header span {
            font-size: 16px;
          }

          .date-header small {
            font-size: 13px;
            font-weight: 700;
          }

          .summary-header,
          .summary-cell {
            width: 38px;
            min-width: 38px;
          }

          .employee-cell {
            background: #071425;
            padding: 6px 10px !important;
            text-align: left !important;
            vertical-align: middle;
          }

          .employee-cell strong,
          .employee-cell span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .employee-cell strong {
            color: #ffffff;
            font-size: 14px;
            line-height: 1.25;
          }

          .employee-cell span {
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.35;
            margin-top: 2px;
          }

          .attendance-table tbody tr:nth-child(even) .employee-cell,
          .attendance-table tbody tr:nth-child(even) .summary-cell,
          .attendance-table tbody tr:nth-child(even) .attendance-cell:not(.attendance-cell-absent):not(.attendance-cell-present):not(.attendance-cell-partial):not(.attendance-cell-off):not(.attendance-cell-od) {
            background: #0a1a2e;
          }

          .attendance-cell {
            background: #1a2847;
            color: #ffffff;
            font-weight: 500;
            height: 42px;
          }

          .attendance-cell-absent {
            background: #ef4444;
            color: #ffffff;
          }

          .attendance-cell-partial {
            background: #3b82f6;
            color: #ffffff;
          }

          .attendance-cell-present {
            background: #22c55e;
            color: #ffffff;
          }

          .attendance-cell-off {
            background: #fef3c7;
            color: #92400e;
          }

          .attendance-cell-od {
            background: #8b5cf6;
            color: #ffffff;
          }

          .attendance-cell-weekend {
            background: #0f1e36;
            color: #ffffff;
          }

          .summary-cell {
            background: #1a2847;
            color: #ffffff;
            font-weight: 700;
          }

          /* Make the right-most summary columns sticky (fixed) so only date columns scroll */
          .attendance-table th.summary-header {
            position: sticky;
            background: #071425;
            color: #ffffff;
            z-index: 35;
            top: 0;
          }

          .attendance-table td.summary-cell {
            position: sticky;
            background: #1a2847;
            color: #ffffff;
            z-index: 25;
          }

          /* Adjust right offset for each of the four summary columns so they stack correctly */
          .attendance-table th.summary-header:nth-last-child(1),
          .attendance-table td.summary-cell:nth-last-child(1) {
            right: 0px;
          }

          .attendance-table th.summary-header:nth-last-child(2),
          .attendance-table td.summary-cell:nth-last-child(2) {
            right: 38px;
          }

          .attendance-table th.summary-header:nth-last-child(3),
          .attendance-table td.summary-cell:nth-last-child(3) {
            right: 76px;
          }

          .attendance-table th.summary-header:nth-last-child(4),
          .attendance-table td.summary-cell:nth-last-child(4) {
            right: 114px;
          }

          /* Ensure summary headers sit above the date header row */
          .attendance-table thead th.summary-header {
            z-index: 35;
            top: 0;
          }

          .attendance-empty-state {
            background: #1a2847;
            color: #ffffff;
            font-size: 14px;
            font-weight: 700;
            height: 120px !important;
          }

          @media (max-width: 768px) {
            .attendance-filter-bar {
              align-items: stretch;
            }

            .attendance-filter-controls,
            .attendance-filter-controls label {
              width: 100%;
            }

            .attendance-filter-controls select {
              width: 100%;
            }

            .attendance-table {
              min-width: 1620px;
              font-size: 13px;
            }

            .employee-header,
            .employee-cell {
              width: 240px;
              min-width: 240px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
