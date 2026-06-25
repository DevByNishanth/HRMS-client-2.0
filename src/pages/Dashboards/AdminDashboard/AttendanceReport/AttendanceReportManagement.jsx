import React, { useEffect, useMemo, useState } from "react";
import { utils, writeFile } from "xlsx";
import Sidebar from "../../../../components/Siedbar";
import CommonHeader from "../../../../components/CommonHeader";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";

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

const tableCellBase =
  "h-[42px] whitespace-nowrap border-r border-r-[rgba(255,255,255,0.12)] [border-right-style:dotted] border-b border-b-[rgba(255,255,255,0.12)] p-0 text-center";
const tableHeadCellBase = `${tableCellBase} sticky top-0 z-10 bg-[#071425] font-bold text-white`;
const filterInputBase =
  "min-h-9 w-full appearance-none rounded-md border border-[rgba(255,255,255,0.18)] bg-[#071425] px-2.5 py-[7px] text-sm font-bold text-white outline-none";
const summaryRightClasses = ["right-[114px]", "right-[76px]", "right-[38px]", "right-0"];

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

function getCellClass(status, isWeekend, isAlternateRow = false) {
  const normalizedStatus = String(status || "").trim();
  const baseClass = `${tableCellBase} font-medium text-white`;
  const defaultBackground = isAlternateRow ? "bg-[#0a1a2e]" : "bg-[#1a2847]";

  if (normalizedStatus === "A") return `${baseClass} bg-[#ef4444]`;
  if (normalizedStatus === "P")
    return `${baseClass} bg-[#22c55e]`;
  if (normalizedStatus === "OFF")
    return `${baseClass} ${isWeekend ? "bg-[#0f1e36]" : defaultBackground}`;
  if (normalizedStatus === "OD") return `${baseClass} bg-[#8b5cf6]`;
  if (normalizedStatus.includes(":"))
    return `${baseClass} bg-[#3b82f6]`;
  return `${baseClass} ${isWeekend ? "bg-[#0f1e36]" : defaultBackground}`;
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

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();
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

  function exportToExcel() {
    const headerRow = [
      "Employee",
      ...dates.map((date) => `${date.day}-${date.weekday}`),
      ...summaryColumns,
    ];

    const dataRows = visibleEmployees.map((employee) => {
      const row = [
        `${employee.name} [${employee.id}]`,
        ...dates.map((date) => getAttendanceStatus(employee.attendance, date)),
        ...summaryColumns.map((column) => employee.summary?.[column] ?? 0),
      ];
      return row;
    });

    const worksheet = utils.aoa_to_sheet([[monthTitle], headerRow, ...dataRows]);
    worksheet.A1.s = {
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      font: {
        bold: true,
      },
    };
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: headerRow.length - 1 },
      },
    ];

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    writeFile(
      workbook,
      `Attendance_Report_${selectedYear}_${String(selectedMonth + 1).padStart(2, "0")}.xlsx`,
    );
  }

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
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5 bg-[#071425] px-4 py-3 max-md:grid-cols-1 max-md:items-start">
              <div className="min-w-0">
                <h1 className="m-0 text-2xl font-black text-white">
                  Attendance Report Management
                </h1>
                <p className="mt-1 mb-0 text-base font-bold text-white">
                  {monthTitle}
                </p>
              </div>
              <div
                className="justify-self-center inline-flex flex-none flex-wrap items-center gap-2 rounded-full border border-[rgba(255,255,255,0.18)] bg-transparent px-2.5 py-1.5 max-md:justify-self-start"
                aria-label="Attendance status legend"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#22c55e]" />{" "}
                  Present
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ef4444]" />{" "}
                  Absent
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />{" "}
                  OFF
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />{" "}
                  OD
                </span>
              </div>
              <button
                type="button"
                className={`${filterInputBase} ml-auto inline-flex !w-auto cursor-pointer items-center justify-center whitespace-nowrap !bg-[#2563eb] transition-colors hover:!bg-[#1d4ed8] disabled:!bg-[#1a3a6a] disabled:cursor-not-allowed disabled:opacity-50`}
                onClick={handleExportClick}
                disabled={visibleEmployees.length === 0}
              >
                Export Excel
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3.5 border-b border-b-[rgba(255,255,255,0.12)] bg-[#071425] px-4 py-3 max-md:items-stretch">
              <div className="grid w-4/5 grid-cols-[260px_170px_150px_135px] items-end gap-5 max-md:w-full max-md:grid-cols-1">
                <label className="grid gap-[5px] text-xs font-extrabold text-white uppercase max-md:w-full">
                  <span>Search</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Name /Employee ID "
                    className={`${filterInputBase} border-r border-r-[rgba(255,255,255,0.18)] bg-none placeholder:text-[rgba(255,255,255,0.65)]`}
                  />
                </label>
                <label className="grid gap-[5px] text-xs font-extrabold text-white uppercase max-md:w-full">
                  <span>Department</span>
                  <select
                    value={selectedDepartment}
                    onChange={(event) =>
                      setSelectedDepartment(event.target.value)
                    }
                    className={filterInputBase}
                  >
                    {departmentOptions.map((department) => (
                      <option
                        className="bg-[#071425] text-white"
                        value={department}
                        key={department}
                      >
                        {department}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-[5px] text-xs font-extrabold text-white uppercase max-md:w-full">
                  <span>Month</span>
                  <select
                    value={selectedMonth}
                    onChange={(event) =>
                      setSelectedMonth(Number(event.target.value))
                    }
                    className={filterInputBase}
                  >
                    {monthOptions.map((month, index) => (
                      <option
                        className="bg-[#071425] text-white"
                        value={index}
                        key={month}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-[5px] text-xs font-extrabold text-white uppercase max-md:w-full">
                  <span>Year</span>
                  <select
                    value={selectedYear}
                    onChange={(event) =>
                      setSelectedYear(Number(event.target.value))
                    }
                    className={filterInputBase}
                  >
                    {yearOptions.map((year) => (
                      <option
                        className="bg-[#071425] text-white"
                        value={year}
                        key={year}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {errorMessage && (
              <div className="border-b border-b-[#fed7aa] bg-[#fff7ed] px-4 py-2.5 text-[13px] font-bold text-[#9a3412]">
                {errorMessage}
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-auto bg-[#071425] [scrollbar-color:#b7c4d3_#eef2f7] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#b7c4d3] [&::-webkit-scrollbar-track]:bg-[#eef2f7]">
              <table className="w-max min-w-[1750px] border-separate border-spacing-0 bg-[#071425] text-sm text-[#1f2937] max-md:min-w-[1620px] max-md:text-[13px]">
                <thead>
                  <tr>
                    <th
                      className={`${tableHeadCellBase} left-0 z-30 w-[270px] min-w-[270px] text-base max-md:w-[240px] max-md:min-w-[240px]`}
                      rowSpan="2"
                    >
                      Employee
                    </th>
                    <th
                      className={`${tableHeadCellBase} h-[42px] min-w-[1240px] border border-[rgba(255,255,255,0.12)] border-b-0 p-0`}
                      colSpan={dates.length}
                      aria-hidden="true"
                    />
                    {summaryColumns.map((column, index) => (
                      <th
                        className={`${tableHeadCellBase} ${summaryRightClasses[index]} z-[35] w-[38px] min-w-[38px]`}
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
                        className={`${tableCellBase} sticky top-[42px] z-[15] h-10 w-10 min-w-10 border-t border-t-[rgba(255,255,255,0.12)] bg-[#071425] font-bold text-white`}
                        key={date.key}
                      >
                        <span className="block text-base leading-[1.3] text-white">
                          {date.day}
                        </span>
                        <small className="block text-[13px] leading-[1.3] font-bold text-white">
                          {date.weekday}
                        </small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td
                        className={`${tableCellBase} h-[120px] bg-[#1a2847] text-sm font-bold text-white`}
                        colSpan={dates.length + summaryColumns.length + 1}
                      >
                        Loading attendance muster...
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    visibleEmployees.map((employee, employeeIndex) => (
                      <tr key={employee.id}>
                        <th
                          className={`${tableCellBase} sticky left-0 z-20 w-[270px] min-w-[270px] ${
                            employeeIndex % 2 === 1
                              ? "bg-[#0a1a2e]"
                              : "bg-[#071425]"
                          } px-2.5 py-1.5 text-left align-middle max-md:w-[240px] max-md:min-w-[240px]`}
                          scope="row"
                        >
                          <strong className="block overflow-hidden text-ellipsis text-sm leading-tight font-bold text-white">
                            {employee.name} [{employee.id}]
                          </strong>
                          <span className="mt-0.5 block overflow-hidden text-ellipsis text-xs leading-[1.35] font-bold text-white">
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
                              className={getCellClass(
                                status,
                                date.isWeekend,
                                employeeIndex % 2 === 1,
                              )}
                              key={`${employee.id}-${date.key}`}
                            >
                              {status}
                            </td>
                          );
                        })}
                        {summaryColumns.map((column, index) => (
                          <td
                            className={`${tableCellBase} sticky ${summaryRightClasses[index]} z-[25] w-[38px] min-w-[38px] ${
                              employeeIndex % 2 === 1
                                ? "bg-[#0a1a2e]"
                                : "bg-[#1a2847]"
                            } font-bold text-white`}
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
                        className={`${tableCellBase} h-[120px] bg-[#1a2847] text-sm font-bold text-white`}
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

          <ExportPasswordModal
            isOpen={isExportModalOpen}
            onClose={closeExportModal}
            onConfirm={(password) => handleConfirmExport(password, exportToExcel)}
            loading={exportLoading}
            error={exportError}
          />
        </main>
      </div>
    </div>
  );
}
