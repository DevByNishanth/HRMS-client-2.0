import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, X, User } from "lucide-react";
import { utils, writeFile } from "xlsx";
import Sidebar from "../../../../components/Siedbar";
import CommonHeader from "../../../../components/CommonHeader";
import { updateAttendanceOverrideSingle } from "../../../../services/AttendanceOverride/UpdateAttendanceOverrideSingle";

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
const toolbarInputBase =
  "h-11 w-full appearance-none rounded-2xl border border-[#2c4a75] bg-[#0c2038] px-4 text-sm font-medium text-white outline-none transition-colors placeholder:text-[#8fa3bf] focus:border-[#3b82f6] focus:ring-0";

const summaryRightClasses = [
  "right-[114px]",
  "right-[76px]",
  "right-[38px]",
  "right-0",
];

function getMonthDates(year, monthIndex) {
  const dates = [];
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startDate = new Date(year, monthIndex - 1, 26);
  const endDate = new Date(year, monthIndex, 25);
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const date = new Date(cursor);
    const day = date.getDate();
    dates.push({
      date,
      day,
      weekday: weekdayNames[date.getDay()],
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        day,
      ).padStart(2, "0")}`,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function _logDatesForDebug(dates) {
  if (typeof console !== "undefined")
    console.debug("Attendance window dates:", dates);
}

function getCellClass(
  status,
  isWeekend,
  isAlternateRow = false,
  isOverridden = false,
  regularization = false,
) {
  const normalizedStatus = String(status || "").trim();
  const baseClass = `${tableCellBase} font-medium text-white`;
  const defaultBackground = isAlternateRow ? "bg-[#0a1a2e]" : "bg-[#1a2847]";
  if (isOverridden) {
    return `${baseClass} bg-orange-400`;
  }
  if (regularization) {
    return `${baseClass} bg-yellow-400`;
  }
  if (normalizedStatus === "A") return `${baseClass} bg-[#85444C]`;
  if (normalizedStatus === "P") return `${baseClass} bg-[#0A5D4D]`;
  if (normalizedStatus === "OFF") return `${baseClass} bg-[#0f1e36]`;
  if (normalizedStatus === "OD") return `${baseClass} bg-[#8b5cf6]`;
  if (normalizedStatus.includes(":")) return `${baseClass} bg-[#3b82f6]`;
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

function isObjectId(value) {
  return typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);
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

function getEmployeeDbId(employee) {
  if (!employee || typeof employee !== "object") return null;

  if (isObjectId(employee._id)) return employee._id;
  if (employee.facultyId) {
    if (
      typeof employee.facultyId === "string" &&
      isObjectId(employee.facultyId)
    ) {
      return employee.facultyId;
    }
    if (
      typeof employee.facultyId === "object" &&
      isObjectId(employee.facultyId._id)
    ) {
      return employee.facultyId._id;
    }
  }

  if (isObjectId(employee.employeeId)) return employee.employeeId;
  if (isObjectId(employee.id)) return employee.id;
  if (isObjectId(employee.empId)) return employee.empId;

  return null;
}

function getEmployeeDesignation(employee) {
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

      if (dateKey !== undefined && dateKey !== null) {
        const rawKey = String(dateKey).trim();
        let normalizedKey = rawKey;

        if (!/^\d{1,2}$/.test(rawKey)) {
          const parsedDate = new Date(rawKey);
          if (!Number.isNaN(parsedDate.getTime())) {
            normalizedKey = `${parsedDate.getFullYear()}-${String(
              parsedDate.getMonth() + 1,
            ).padStart(
              2,
              "0",
            )}-${String(parsedDate.getDate()).padStart(2, "0")}`;
          }
        }

        if (normalizedKey) {
          attendance[normalizedKey] = status;
          if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedKey)) {
            const dayOnly = String(Number(normalizedKey.split("-")[2]));
            if (!(dayOnly in attendance)) {
              attendance[dayOnly] = status;
            }
          }
        }
      }

      return attendance;
    }, {});
  }

  return rawAttendance || {};
}

function calculateSummary(attendance) {
  return Object.values(attendance).reduce(
    (summary, rawStatus) => {
      const status = String(
        typeof rawStatus === "object" ? rawStatus.status : rawStatus || "-",
      );

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
      dbId: getEmployeeDbId(employee),
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
  if (!attendance || typeof attendance !== "object") {
    return {
      status: "-",
      isOverridden: false,
      regularization: false,
    };
  }

  const value = attendance[date.key] ?? attendance[String(date.day)];

  if (value === undefined) {
    return {
      status: "-",
      isOverridden: false,
      regularization: false,
    };
  }

  if (typeof value === "string") {
    return {
      status: value,
      isOverridden: false,
      regularization: false,
    };
  }

  return value;
}

export default function AttendanceManagementOverride() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function getToggleStatus(status) {
    if (status === "A") return "P";
    if (status === "P") return "A";
    if (status === "A:P") return "P:A";
    if (status === "P:A") return "A:P";
    return null;
  }

  function parseSessionsFromStatus(status) {
    if (status === "A") return { session1: "A", session2: "A" };
    if (status === "P") return { session1: "P", session2: "P" };
    if (status === "A:P") return { session1: "A", session2: "P" };
    if (status === "P:A") return { session1: "P", session2: "A" };
    return { session1: "A", session2: "A" };
  }

  async function handleSaveStatus() {
    if (!selectedAttendance) return;

    setIsSaving(true);

    try {
      const { session1, session2 } = parseSessionsFromStatus(editedStatus);
      const payload = {
        firstIn: `${selectedAttendance.date}T03:12:12.000Z`,
        lastOut: `${selectedAttendance.date}T11:28:57.000Z`,
        session1,
        session2,
        remarks:
          remarks.trim() ||
          `Attendance override set to ${editedStatus} for ${selectedAttendance.date}`,
      };

      let requestEmployeeId = selectedAttendance.empDbId;
      if (!requestEmployeeId && isObjectId(selectedAttendance.empId)) {
        requestEmployeeId = selectedAttendance.empId;
      }

      if (!requestEmployeeId) {
        throw new Error("Unable to determine employee id for override update.");
      }

      await updateAttendanceOverrideSingle(
        requestEmployeeId,
        selectedAttendance.date,
        payload,
      );

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) => {
          if (employee.id !== selectedAttendance.empId) return employee;

          const currentValue =
            employee.attendance?.[selectedAttendance.date] ??
            employee.attendance?.[String(selectedAttendance.day)];
          const overrideValue =
            currentValue && typeof currentValue === "object"
              ? {
                  ...currentValue,
                  status: editedStatus,
                  isOverridden: true,
                }
              : {
                  status: editedStatus,
                  isOverridden: true,
                  regularization: false,
                };

          const updatedAttendance = {
            ...employee.attendance,
            [selectedAttendance.date]: overrideValue,
          };

          if (selectedAttendance.day !== undefined) {
            updatedAttendance[String(selectedAttendance.day)] = overrideValue;
          }

          return {
            ...employee,
            attendance: updatedAttendance,
            summary: calculateSummary(updatedAttendance),
          };
        }),
      );

      setSelectedAttendance((prev) =>
        prev ? { ...prev, status: editedStatus } : prev,
      );
      setShowPopup(false);
      setRemarks("");
    } catch (error) {
      console.error("Override update failed", error);
      alert(
        error?.response?.data?.message ||
          "Unable to update override attendance.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const effectiveMonth = useMemo(
    () =>
      selectedMonth === "" ? new Date().getMonth() : Number(selectedMonth),
    [selectedMonth],
  );

  const effectiveYear = useMemo(
    () =>
      selectedYear === "" ? new Date().getFullYear() : Number(selectedYear),
    [selectedYear],
  );

  const dates = useMemo(
    () => getMonthDates(effectiveYear, effectiveMonth),
    [effectiveMonth, effectiveYear],
  );

  useEffect(() => {
    try {
      if (typeof console !== "undefined") {
        console.debug(
          "Attendance window effectiveMonth/effectiveYear:",
          effectiveMonth,
          effectiveYear,
        );
      }
      _logDatesForDebug(
        dates.map((d) => ({ key: d.key, day: d.day, weekday: d.weekday })),
      );
    } catch (e) {}
  }, [dates, effectiveMonth, effectiveYear]);
  const monthTitle = new Date(effectiveYear, effectiveMonth).toLocaleDateString(
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

    return Array.from(new Set(types));
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
        !selectedDepartment || departmentType === selectedDepartment;

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
        ...dates.map(
          (date) => getAttendanceStatus(employee.attendance, date).status,
        ),
        ...summaryColumns.map((column) => employee.summary?.[column] ?? 0),
      ];
      return row;
    });

    const worksheet = utils.aoa_to_sheet([
      [monthTitle],
      headerRow,
      ...dataRows,
    ]);
    if (worksheet.A1) {
      worksheet.A1.s = {
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true, sz: 14 },
      };
    }
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: headerRow.length - 1 },
      },
    ];
    worksheet["!rows"] = [{ hpx: 28 }];

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
        const month = effectiveMonth + 1;
        const year = effectiveYear;

        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/attendance/muster/v1?month=${month}&year=${year}`,
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
  }, [effectiveMonth, effectiveYear]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <main className="min-h-0 flex-1 overflow-hidden">
          <section className="flex h-full flex-col overflow-hidden rounded bg-[#071425] p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
            <div className="flex items-center justify-between bg-[#071425] px-4 py-3">
              <div>
                <h1 className="m-0 text-2xl font-black text-white">
                  Attendance Report Management (Override)
                </h1>
              </div>

              <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-[rgba(255,255,255,0.18)] bg-transparent px-3 py-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0A5D4D]" />
                  Present
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#85444C]" />
                  Absent
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-3.5 w-3.5 rounded-sm bg-[#0f1e36]" />
                  OFF
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
                  OD
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-400" />
                  Override
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-600" />
                  Regularized
                </span>
              </div>
            </div>
            <div className="mt-3 flex w-full flex-wrap items-center gap-2">
              <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-5">
                <label className="relative w-full max-w-[320px] min-w-0 text-xs font-extrabold text-white">
                  <span className="sr-only">Search</span>
                  <Search
                    className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#8fa3bf]"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search faculty..."
                    className={`${toolbarInputBase} pl-12`}
                  />
                </label>

                <label className="relative w-full min-w-0 text-xs font-extrabold text-white">
                  <span className="sr-only">Role</span>
                  <select
                    value={selectedDepartment}
                    onChange={(event) =>
                      setSelectedDepartment(event.target.value)
                    }
                    className={`${toolbarInputBase} pr-10`}
                  >
                    <option
                      value=""
                      disabled
                      hidden
                      style={{ display: "none" }}
                      className="bg-[#071425] text-[#9ca3af]"
                    >
                      Department
                    </option>
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
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8fa3bf]" />
                </label>

                <label className="relative w-full min-w-0 text-xs font-extrabold text-white">
                  <span className="sr-only">Month</span>
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className={`${toolbarInputBase} pr-10`}
                  >
                    <option
                      value=""
                      disabled
                      hidden
                      className="bg-[#071425] text-[#9ca3af]"
                    >
                      Month
                    </option>
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
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8fa3bf]" />
                </label>

                <label className="relative w-full min-w-0 text-xs font-extrabold text-white">
                  <span className="sr-only">Year</span>
                  <select
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value)}
                    className={`${toolbarInputBase} pr-10`}
                  >
                    <option
                      value=""
                      disabled
                      hidden
                      className="bg-[#071425] text-[#9ca3af]"
                    >
                      Year
                    </option>
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
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8fa3bf]" />
                </label>

                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[#3b82f6] bg-transparent px-5 text-sm font-bold text-[#3b82f6] transition-all duration-300 hover:bg-[#3b82f6] hover:text-white"
                  onClick={exportToExcel}
                >
                  Export Excel
                </button>
              </div>
            </div>
            {errorMessage && (
              <div className="border-b border-b-[#fed7aa] bg-[#fff7ed] px-4 py-2.5 text-[13px] font-bold text-[#9a3412]">
                {errorMessage}
              </div>
            )}
            <div className="min-h-0  flex-1 overflow-auto bg-[#071425] [scrollbar-color:#b7c4d3_#eef2f7] scrollbar-thin [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#b7c4d3] [&::-webkit-scrollbar-track]:bg-[#eef2f7]">
              <table className="w-max min-w-437.5 border-separate border-spacing-0 bg-[#071425] text-sm text-[#1f2937] max-md:min-w-405 max-md:text-[13px]">
                <thead>
                  <tr>
                    <th
                      className={`${tableHeadCellBase} left-0 z-30 w-67.5 min-w-67.5 text-base`}
                    >
                      Employee
                    </th>

                    {dates.map((date) => (
                      <th
                        key={date.key}
                        className={`${tableCellBase} sticky top-0 z-15 h-10 w-10 min-w-10 bg-[#071425] font-bold text-white`}
                      >
                        <span className="block text-base">{date.day}</span>
                        <small className="block text-[13px] font-bold">
                          {date.weekday}
                        </small>
                      </th>
                    ))}

                    {summaryColumns.map((column, index) => (
                      <th
                        key={column}
                        className={`${tableHeadCellBase} ${summaryRightClasses[index]} z-35 w-9.5 min-w-9.5`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td
                        className={`${tableCellBase} h-30 bg-[#1a2847] text-sm font-bold text-white`}
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
                          className={`${tableCellBase} sticky left-0 z-20 w-67.5 min-w-67.5 ${
                            employeeIndex % 2 === 1
                              ? "bg-[#0a1a2e]"
                              : "bg-[#071425]"
                          } px-2.5 py-1.5 text-left align-middle max-md:w-60 max-md:min-w-60`}
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
                          const attendance = getAttendanceStatus(
                            employee.attendance,
                            date,
                          );

                          return (
                            <td
                              key={`${employee.id}-${date.key}`}
                              onClick={() => {
                                setSelectedAttendance({
                                  employee: employee.name,
                                  empId: employee.id,
                                  empDbId: employee.dbId,
                                  date: date.key,
                                  day: date.day,
                                  status: attendance.status,
                                });

                                setEditedStatus(attendance.status);
                                setShowPopup(true);
                              }}
                              className={`${getCellClass(
                                attendance.status,
                                date.isWeekend,
                                employeeIndex % 2 === 1,
                                attendance.isOverridden,
                                attendance.regularization,
                              )} border border-white cursor-pointer hover:brightness-110`}
                            >
                              {attendance.status}
                            </td>
                          );
                        })}
                        {summaryColumns.map((column, index) => (
                          <td
                            className={`${tableCellBase} sticky ${summaryRightClasses[index]} z-25 w-9.5 min-w-9.5 ${
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
                        className={`${tableCellBase} h-30 bg-[#1a2847] text-sm font-bold text-white`}
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
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/60 backdrop-blur-[4px]">
          <div className="w-[50%] rounded-xl bg-[#071425]/80 text-white shadow-[-18px_0_50px_rgba(0,0,0, 0.35)]  border border-[#2f4764] ">
            <header className="border-b border-gray-700 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Attendance Details</h2>
              <X className="cursor-pointer" onClick={() => setShowPopup(false)} />
            </header>

            <section className="px-4 py-2">
              <p className="">
                <strong> Employee:</strong> {selectedAttendance.employee}
              </p>
              <p>
                <strong>ID:</strong> {selectedAttendance.empId}
              </p>
              <p>
                <strong>Date:</strong> {selectedAttendance.date}
              </p>
              <p>
                <strong>Status:</strong> {selectedAttendance.status}
              </p>
            </section>

            <div className="mt-4 space-y-3 px-4">
              <div className="rounded-lg border border-[#173150] p-3 text-sm text-white">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Current status</span>
                  <span className="font-bold">
                    {selectedAttendance?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Edited status</span>
                  <span className="font-bold text-cyan-300">
                    {editedStatus}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold ">
                  Override status
                </label>
                <select
                  value={editedStatus}
                  onChange={(event) => setEditedStatus(event.target.value)}
                  className="w-full rounded-lg border border-[#173150] outline-none p-2 text-sm text-white bg-[#071425]"
                >
                  <option value="P">Present (P)</option>
                  <option value="A">Absent (A)</option>
                  <option value="A:P">Absent:Present (A:P)</option>
                  <option value="P:A">Present:Absent (P:A)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Override remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[#173150] outline-none p-4 text-sm text-white bg-[#071425]"
                  placeholder="Enter remarks for this override"
                />
              </div>

              <div className="flex justify-end gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="rounded bg-gray-700 px-4 py-2 text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={isSaving}
                  className="rounded bg-[#2563eb] px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
