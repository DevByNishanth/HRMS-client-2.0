import React, { useState, useEffect } from "react";
import CustomDropdown from "../../../../components/CustomDropdown";
import { X,Search } from "lucide-react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { getAttendanceOverrideHistory } from "../../../../services/AttendanceOverride/GetAttendanceOverrideHistory";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";
import CustomDatePicker from '../../../../components/CustomDatePicker';
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export default function OverrideTable({ data = [] }) {  
    // const [attendanceDate, setAttendanceDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [overrideData, setOverrideData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [employeeCategory, setEmployeeCategory] = useState("");

    const {
        isExportModalOpen,
        exportLoading,
        exportError,
        handleExportClick,
        closeExportModal,
        handleConfirmExport,
    } = usePasswordProtectedExport();

    useEffect(() => {
        console.log("overrideData:", overrideData);
    }, [overrideData]);

    useEffect(() => {
        overrideData.forEach(item => {
            console.log("attendanceDate:", item.attendanceDate);
        });
    }, [overrideData]);

    const formatDate = (value) => {
        if (!value) return "-";
        if (value.includes?.(" to ")) {
            const [startDate, endDate] = value.split(" to ");
            return `${formatDate(startDate.trim())} to ${formatDate(endDate.trim())}`;
        }
        // Parse date parts directly to avoid UTC timezone shift
        const datePart = value.split("T")[0].trim(); // "2026-05-31"
        const [year, month, day] = datePart.split("-");
        return `${day}-${month}-${year}`;
    };

    const formatTime = (value) => {
        if (!value) return "-";

        return new Date(value).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );
    };

    const formatDateTime = (value) => {
        if (!value) return "-";

        const date = new Date(value);

        return `${date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })} ${date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })}`;
    };

    // const dateOptions = [
    //     ...new Set(
    //         overrideData.map(
    //             item => item.attendanceDate
    //         )
    //     )
    // ];

    const hasActiveFilters =
        fromDate ||
        toDate ||
        employeeSearch ||
        department ||
        employeeCategory;

    const filteredData = overrideData.filter((item) => {
        let dateMatch = true;
        if (fromDate || toDate) {
            const filterFrom = fromDate
                ? dayjs(fromDate).startOf("day")
                : null;
            const filterTo = toDate
                ? dayjs(toDate).endOf("day")
                : null;
            if (item.attendanceDate?.includes(" to ")) {
                const [startDate, endDate] =
                    item.attendanceDate.split(" to ");
                const itemStart =
                    dayjs(startDate).startOf("day");
                const itemEnd =
                    dayjs(endDate).endOf("day");
                dateMatch =
                    (!filterFrom || itemEnd.isSame(filterFrom) || itemEnd.isAfter(filterFrom)) &&
                    (!filterTo || itemStart.isSame(filterTo) || itemStart.isBefore(filterTo));
            } else {
                const itemDate =
                    dayjs(item.attendanceDate);
                dateMatch =
                    (!filterFrom || itemDate.isSame(filterFrom) || itemDate.isAfter(filterFrom)) &&
                    (!filterTo || itemDate.isSame(filterTo) || itemDate.isBefore(filterTo));
            }
        }

        const employeeMatch =
            !employeeSearch ||
            item.employeeName
                ?.toLowerCase()
                .includes(employeeSearch.toLowerCase());

        const departmentMatch =
            !department ||
            item.department === department;

        const employeeCategoryMatch =
            !employeeCategory ||
            item.employeeCategory === employeeCategory;

        return (
            dateMatch &&
            employeeMatch &&
            departmentMatch &&
            employeeCategoryMatch
        );
    });

    useEffect(() => {
        fetchOverrideHistory();
    }, []);

    const fetchOverrideHistory = async () => {
        try {
            setLoading(true);

            const response = await getAttendanceOverrideHistory();

            // Fix attendanceDate using firstIn converted to IST
            const fixedData = response.data.map((item) => {
                if (item.firstIn) {
                    const istDate = new Date(item.firstIn).toLocaleDateString("en-CA", {
                        timeZone: "Asia/Kolkata", // en-CA gives "YYYY-MM-DD" format
                    });

                    // If it's a range, fix only the start date, keep end date from lastOut
                    if (item.attendanceDate?.includes(" to ")) {
                        const endIstDate = new Date(item.lastOut).toLocaleDateString("en-CA", {
                            timeZone: "Asia/Kolkata",
                        });
                        return {
                            ...item,
                            attendanceDate: `${istDate} to ${endIstDate}`,
                        };
                    }

                    return {
                        ...item,
                        attendanceDate: istDate,
                    };
                }
                return item;
            });

            const sortedData = [...fixedData].sort(
                (a, b) => new Date(b.overriddenOn) - new Date(a.overriddenOn)
            );

            setOverrideData(sortedData);

        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowSelection = (employeeId) => {
        setSelectedRows((prev) =>
            prev.includes(employeeId)
                ? prev.filter(
                    (id) => id !== employeeId
                )
                : [...prev, employeeId]
        );
    };

    const handleSelectAll = () => {
        if (
            selectedRows.length ===
            filteredData.length
        ) {

            setSelectedRows([]);

        } else {

            setSelectedRows(
                filteredData.map(
                    (item) => item.employeeId
                )
            );
        }
    };

    const exportSelectedEmployees = () => {
        const selectedData =
            filteredData.filter((item) =>
                selectedRows.includes(
                    item.employeeId
                )
            );

        if (selectedData.length === 0) {
            alert(
                "Please select at least one employee."
            );
            return;
        }

        const excelData =
            selectedData.map((item) => ({
                Employee_Name:
                    item.employeeName,
                Employee_ID:
                    item.employeeId,
                Employee_Category: item.employeeCategory,
                Department:
                    item.department,
                Attendance_Date:
                    formatDate(item.attendanceDate),
                First_In:
                    item.firstIn,
                Last_Out:
                    item.lastOut,
                Status:
                    item.statusCode,
                Overridden_On:
                    item.overriddenOn,
                Remarks:
                    item.remarks
            }));

        const worksheet =
            XLSX.utils.json_to_sheet(
                excelData
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Override History"
        );

        const excelBuffer =
            XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array"
            });

        const fileData = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

        saveAs(
            fileData,
            `Override_History_${new Date().getTime()}.xlsx`
        );
    };

    
    useEffect(() => {
        console.log("overrideData:", overrideData);

        overrideData.forEach(item => {
            console.log(
                "Raw Attendance Date:",
                item.attendanceDate
            );
        });
    }, [overrideData]);

    const getStatusColor = (value) => {
        switch (value) {
            case "P":
                return "text-[#155DFC]";
                // return "text-green-500"
            case "A":
                return "text-[#155DFC]";
            case "OD":
                return "text-[#155DFC]";
            default:
                return "";
        }
    };
    console.log("status color",getStatusColor);

    return (
        <>
            {/* Filters */}

            <div className="mb-4 pl-7 pr-7 pt-7 pb-3 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-[18px] font-semibold text-white">
                    Override History ({filteredData.length})
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-[160px]">
                        <CustomDatePicker
                            value={fromDate}
                            onChange={setFromDate}
                            placeholder="Date From"
                        />
                    </div>

                    <span className="text-[#8ca1bd]">
                        to
                    </span>

                    <div className="w-[160px]">
                        <CustomDatePicker
                            value={toDate}
                            onChange={setToDate}
                            placeholder="Date To"
                        />
                    </div>
                    <div className="w-[250px] relative">
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
                            onChange={(e) => setEmployeeSearch(e.target.value)}
                            placeholder="Search Employee"
                            className="
                                w-full
                                h-12
                                pl-11
                                px-4
                                rounded-lg
                                border
                                border-[#244061]
                                bg-[#0d2138]
                                text-white
                                placeholder:text-[#8ca1bd]
                                focus:outline-none
                                focus:border-[#3984ff]
                            "
                        />
                    </div>
                    <div className="w-[150px]">
                        <CustomDropdown
                            value={department}
                            placeholder="Department"
                            options={[
                                "CSE",
                                "ECE",
                                "EEE",
                                "MECH",
                                "CIVIL",
                                "CCE"
                            ]}
                            onChange={setDepartment}
                        />
                    </div>
                    <div className="w-[200px]">
                        <CustomDropdown
                            value={employeeCategory}
                            placeholder="Employee Category"
                            options={[
                                "Teaching",
                                "Non-Teaching",
                                "HouseKeeping",
                                "Driver",
                            ]}
                            onChange={setEmployeeCategory}
                        />
                    </div>
                    <button
                        onClick={handleExportClick}
                        className="
                            h-12
                            px-5
                            rounded-lg
                            border
                            border-[#3984ff]
                            text-[#3984ff]
                            hover:bg-[#3984ff]
                            hover:text-white
                            cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        Export Excel
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                // setDateRange("");
                                setFromDate(null);
                                setToDate(null);
                                setEmployeeSearch("");
                                setDepartment("");
                                setEmployeeCategory("");
                            }}
                            className="flex items-center gap-2 h-12 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[#8ca1bd] cursor-pointer"
                        >
                            Reset Filter
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <ExportPasswordModal
                isOpen={isExportModalOpen}
                onClose={closeExportModal}
                onConfirm={(password) => handleConfirmExport(password, exportSelectedEmployees)}
                loading={exportLoading}
                error={exportError}
            />

            {/* Table */}

            <div className="overflow-hidden">
                <div className="max-h-[55vh] overflow-y-auto scrollbar-thin scrollbar-track-[#0a1a2d] scrollbar-thumb-[#244061]">

                    <table className="w-full table-auto border-collapse text-left">

                        <thead className="sticky top-0 z-10 bg-[#172c46] text-[14px] uppercase tracking-wide text-[#9aacc7]">

                            <tr>
                                <th className="px-5 py-4">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredData.length > 0 &&
                                            selectedRows.length ===
                                            filteredData.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </th>

                                <th className="px-5 py-4">
                                    Employee
                                </th>

                                <th className="px-5 py-4">
                                    Category
                                </th>

                                <th className="px-5 py-4">
                                    Department
                                </th>

                                <th className="px-5 py-4">
                                    Attendance Date
                                </th>

                                <th className="px-5 py-4">
                                    First In
                                </th>

                                <th className="px-5 py-4">
                                    Last Out
                                </th>

                                <th className="px-5 py-4">
                                    Status
                                </th>

                                <th className="px-5 py-4">
                                    Overridden On
                                </th>

                                <th className="px-5 py-4">
                                    Remarks
                                </th>
                            </tr>

                        </thead>

                        <tbody className="text-[14px] text-[#cad7eb]">

                            {filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-10"
                                    >
                                        No Override History Found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-[#132944]"
                                    >
                                        <td className="px-5 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(item.employeeId)}
                                                onChange={() =>
                                                    handleRowSelection(
                                                        item.employeeId
                                                    )
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">
                                                    {item.employeeName || "-"}
                                                </span>

                                                <span className="text-sm text-[#8ca1bd]">
                                                    {item.employeeId || "-"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.employeeCategory || "-"}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.department}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.attendanceDate?.includes(" to ") ? (
                                                <div className="flex flex-col">
                                                    <span>{formatDate(item.attendanceDate.split(" to ")[0])}</span>
                                                    <span className="text-xs text-[#8ca1bd]">to</span>
                                                    <span>{formatDate(item.attendanceDate.split(" to ")[1])}</span>
                                                </div>
                                            ) : (
                                                formatDate(item.attendanceDate)
                                            )}
                                        </td>

                                        <td className="px-5 py-3">
                                            <span>{formatTime(item.firstIn)}</span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span>{formatTime(item.lastOut)}</span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={`${
                                                    item.oldSession1 !== item.newSession1
                                                        ? `font-bold ${getStatusColor(item.newSession1)}`
                                                        : ""
                                                }`}
                                            >
                                                {item.newSession1}
                                            </span>

                                            {" : "}

                                            <span
                                                className={`${
                                                    item.oldSession2 !== item.newSession2
                                                        ? `font-bold ${getStatusColor(item.newSession2)}`
                                                        : ""
                                                }`}
                                            >
                                                {item.newSession2}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <div className="flex flex-col">
                                                <span>{formatDate(item.overriddenOn)}</span>
                                                <span className="text-xs text-[#8ca1bd]">
                                                    {formatTime(item.overriddenOn)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3">
                                            <div
                                                className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                                                title={item.remarks}
                                            >
                                                {item.remarks || "-"}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>

                </div>
            </div>
        </>
    );
}