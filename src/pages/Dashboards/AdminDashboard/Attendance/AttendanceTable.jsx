import { Download, RotateCcw, Search, X } from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { getAttendanceTableData } from "../../../../services/Attendance/getAttendanceTableDataService";
import CustomDropdown from "../../../../components/CustomDropdown";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import { getfacultiesName } from "../../../../services/LeaveBalance/getEmployeNameService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";

export default function AttendanceTable() {
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [shift, setShift] = useState("");
  const [checkInStatus, setCheckInStatus] = useState("");
  const [lateCheckIn, setLateCheckIn] = useState("");

  const dropdownRef = useRef();

  const observerRef = useRef();

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  const hasFilters =
    employeeSearch || department || category || fromDate || shift || toDate || checkInStatus || lateCheckIn;

  // const filteredData = attendanceData;
  const filteredData = useMemo(() => {
    let data = [...attendanceData];

    if (shift) {
      data = data.filter(
        (item) => item.shiftName?.toLowerCase() === shift.toLowerCase(),
      );
    }

    return data;
  }, [attendanceData, shift]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);

    setEmployeeSearch(`${employee.name} (${employee.empId})`);

    setShowDropdown(false);
  };

  const searchEmployees = async (value) => {
    setEmployeeSearch(value);

    if (value.trim() === "") {
      setSelectedEmployee(null);
    }
    if (value.trim().length < 2) {
      setEmployeeSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await getfacultiesName(value);

      if (response?.success) {
        setEmployeeSuggestions(response.data || []);

        setShowDropdown(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setVisibleCount(10);
  }, [employeeSearch, department, category, fromDate, shift, toDate, checkInStatus, lateCheckIn]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 10);
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const visibleData = filteredData.slice(0, visibleCount);

  const resetFilters = () => {
    setEmployeeSearch("");
    setSelectedEmployee(null);
    setDepartment("");
    setCategory("");
    setShift("");
    setFromDate(null);
    setToDate(null);
    setCheckInStatus("");
    setLateCheckIn("");
  };

  const formatApiDate = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedEmployee, department, category, fromDate, toDate, checkInStatus, lateCheckIn]);
  console.log("selected", selectedEmployee);
  console.log("fetchAttendanceData called");
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const currentDate = formatApiDate(new Date());
      const payload = {
        search: selectedEmployee?.firstName || selectedEmployee?.empId || "",
        department,
        employeeCategory: category,
        fromDate: fromDate ? formatApiDate(fromDate) : currentDate,
        toDate: toDate ? formatApiDate(toDate) : currentDate,
      };

      // Handle status filter
      if (lateCheckIn === "Late Punch In" || lateCheckIn === "Late Checked In") {
        payload.status = "Late Checked In";
      } else if (checkInStatus) {
        payload.status = checkInStatus;
      }

      if (checkInStatus === "Not Checked In") {
        payload.date = currentDate; // Always today's date
      } else {
        payload.fromDate = fromDate ? formatApiDate(fromDate) : currentDate;
        payload.toDate = toDate ? formatApiDate(toDate) : currentDate;
      }

      const response = await getAttendanceTableData(payload);

      console.log("Response:", response);

      setAttendanceData(response?.attendance || []);
    } catch (error) {
      console.error("Error:", error);
      console.error("Message:", error.message);
      console.error("Response:", error.response);
      console.error("Request:", error.request);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!attendanceData.length) {
      alert("No data available to export");
      return;
    }

    const excelData = attendanceData.map((row) => ({
      "Record ID": row._id,
      "Faculty ID": row.facultyId,
      "Shift ID": row.shiftID,
      "Employee ID": row.empId,
      "Employee Name": row.employeeName,
      "Department": row.department,
      "Designation": row.designation,
      "Employee Category": row.employeeCategory,

      "Attendance Date": row.attendanceDate
        ? new Date(row.attendanceDate).toLocaleDateString("en-GB", {
            timeZone: "Asia/Kolkata",
          })
        : "",

      "Shift Name": row.shiftName,
      "Shift Start Time": row.startTime,
      "Shift End Time": row.endTime,
      "Grace Time (mins)": row.graceTime,

      "In Time": row.inTime
        ? new Date(row.inTime).toLocaleString("en-IN")
        : "",

      "Out Time": row.outTime
        ? new Date(row.outTime).toLocaleString("en-IN")
        : "",

      "Working Minutes": row.workingMinutes,
      "Working Hours": row.workingHours,
      "Late Minutes": row.lateMinutes,

      "Status": row.status,
      "Is Late": row.isLate ? "Yes" : "No",
      "Is Overridden": row.isOverridden ? "Yes" : "No",
      "Regularization": row.regularization ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `Attendance_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-[#0B303E] text-[#14B299]";

      case "absent":
        return "bg-[#1A1F30] text-[#713C46]";

      case "late":
      case "late checked in":
        return "bg-[#3A2D12] text-[#F5B041]";

      case "half day":
        return "bg-[#2B2140] text-[#B084F5]";

      default:
        return "bg-[#24364D] text-[#9EB0CC]";
    }
  };

  const getWorkingHoursStyle = (workingMinutes, startTime, endTime) => {
    if (workingMinutes == null || !startTime || !endTime) {
      return "text-[#9eb0cc]";
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);

    const [endHour, endMinute] = endTime.split(":").map(Number);

    const shiftMinutes =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);

    return workingMinutes >= shiftMinutes
      ? "text-[#14B299]" // green
      : "text-[#f16868]"; // red
  };

  return (
    <section className="mt-4 mb-4 rounded-xl border border-[#183052] bg-[#0a1a2d] flex flex-col h-[400px] overflow-hidden">
      <div className="p-4 border-b border-[#183052] flex flex-col gap-4 ">
        <div>
          <h1>Employee ({filteredData.length})</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative" ref={dropdownRef}>
            <Search
              size={18}
              className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-[#6f839f]
                            "
            />

            <input
              type="text"
              value={employeeSearch}
              onChange={(e) => searchEmployees(e.target.value)}
              placeholder="Search Employee Name / ID"
              className="
                                h-12
                                pl-11
                                w-[300px]
                                rounded-lg
                                border
                                border-[#244061]
                                bg-[#0d2138]
                                text-white
                                px-4
                            "
            />

            {showDropdown && employeeSuggestions.length > 0 && (
              <div
                className="
                                        absolute
                                        top-12
                                        z-50
                                        w-[300px]
                                        max-h-[300px]
                                        overflow-y-auto
                                        custom-scrollbar
                                        rounded-lg
                                        border
                                        border-[#244061]
                                        bg-[#172c46]
                                        shadow-xl
                                    "
              >
                {employeeSuggestions.map((employee) => (
                  <div
                    key={employee.facultyId}
                    onClick={() => selectEmployee(employee)}
                    className="
                                                    cursor-pointer
                                                    border-b
                                                    border-[#244061]
                                                    p-3
                                                    hover:bg-[#1f3a5c]
                                                "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                                                            h-10
                                                            w-10
                                                            rounded-full
                                                            bg-[#3984ff]
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-white
                                                            font-semibold
                                                        "
                      >
                        {employee.name?.charAt(0)}
                      </div>

                      <div>
                        <div className="text-white font-medium">
                          {employee.name}
                        </div>

                        <div className="text-xs text-[#9eb3cf]">
                          {employee.empId}
                        </div>

                        <div className="text-xs text-[#9eb3cf]">
                          {employee.department}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <CustomDropdown
            value={department}
            placeholder="Department"
            options={[
              "AIML",
              "AIDS",
              "CYS",
              "CSE",
              "CCE",
              "CSBS",
              "ECE",
              "EEE",
              "Mech",
              "S&H",
            ]}
            onChange={setDepartment}
          />

          <CustomDropdown
            className="w-[150px]"
            value={category}
            placeholder="Category"
            options={["Teaching", "Non Teaching", "Housekeeping", "Driver"]}
            onChange={setCategory}
          />

          <CustomDropdown
            className="w-[150px]"
            value={shift}
            placeholder="Shift"
            options={[
              "Morning Shift",
              "General Shift",
              "Evening Shift",
              "Night Shift",
            ]}
            onChange={setShift}
          />
          <CustomDropdown
            className="w-[200px]"
            value={checkInStatus}
            placeholder="Check In Status"
            options={["Present", "Not Checked In", "Leave", "Absent"]}
            onChange={setCheckInStatus}
          />
          <CustomDropdown
            className="w-[200px]"
            value={lateCheckIn}
            placeholder="Late Check In"
            options={["Late Checked In", "Late Punch In"]}
            onChange={setLateCheckIn}
          />
          <div className="flex flex-wrap items-center gap-3">
            <CustomDatePicker
              value={fromDate}
              onChange={setFromDate}
              placeholder="From Date"
            />
            <span className="text-[#8ca1bd]">to</span>
            <CustomDatePicker
              value={toDate}
              onChange={setToDate}
              placeholder="To Date"
              minDate={fromDate}
            />
          </div>

          <button
            onClick={handleExportClick}
            disabled={attendanceData.length === 0}
            className="h-12
                                px-5
                                rounded-lg
                                border
                                border-[#3984ff]
                                text-[#3984ff]
                                text-[14px]
                                font-semibold
                                transition
                                hover:bg-[#3984ff]
                                hover:text-white
                                cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {/* <Download size={16} /> */}
            Export Excel
          </button>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="flex flex-row items-center gap-2  h-12 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] font-semibold text-[#8ca1bd] transition hover:bg-[#132b49] hover:text-white hover:border-[#3984ff] cursor-pointer"
            >
              Reset Filter <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto table-custom-scrollbar">
        <table className="w-full min-w-[1200px]">
          <thead className="sticky top-0 z-10 bg-[#172c46] text-[#9eb0cc]">
            <tr>
              <th className="px-4 py-3 text-left">Employee Details</th>

              <th className="px-4 py-3 text-left">Department</th>

              <th className="px-4 py-3 text-left">Category</th>

              <th className="px-4 py-3 text-left">Date</th>

              <th className="px-4 py-3 text-left">Shift</th>

              <th className="px-4 py-3 text-left">In Time</th>

              <th className="px-4 py-3 text-left">Out Time</th>

              <th className="px-4 py-3 text-left">Working Hours</th>

              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#244061] border-t-[#3984ff]" />
                    <p className="text-sm text-[#9eb0cc] font-medium">
                      Loading attendance...
                    </p>
                  </div>
                </td>
              </tr>
            ) : visibleData.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-[#9eb0cc]"
                >
                  No attendance records found.
                </td>
              </tr>
            ) : (
              visibleData.map((row, index) => (
                <tr key={index} className="border-b border-[#183052]">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-white font-medium">
                        {row.employeeName}
                      </div>

                      <div className="text-[#9eb0cc] text-xs">
                        {row.empId}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {row.department}
                  </td>

                  <td className="px-4 py-3">
                    {row.employeeCategory}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(row.attendanceDate).toLocaleDateString("en-GB", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>

                  <td className="px-4 py-3">
                    {row.shiftName}
                  </td>

                  <td className="px-4 py-3">
                    {row.inTime
                      ? new Date(row.inTime).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "--"}
                  </td>

                  <td className="px-4 py-3">
                    {row.outTime
                      ? new Date(row.outTime).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "--"}
                  </td>

                  <td
                    className={`px-4 py-3 font-medium ${getWorkingHoursStyle(
                      row.workingMinutes,
                      row.startTime,
                      row.endTime
                    )}`}
                  >
                    {row.workingHours}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div ref={observerRef} className="h-5" />
      </div>

      <ExportPasswordModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        onConfirm={(password) => handleConfirmExport(password, exportExcel)}
        loading={exportLoading}
        error={exportError}
      />
    </section>
  );
}