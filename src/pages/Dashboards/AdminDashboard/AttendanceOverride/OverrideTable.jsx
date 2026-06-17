import React, { useState, useEffect } from "react";
import CustomDropdown from "../../../../components/CustomDropdown";
import { X } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAttendanceOverrideHistory } from "../../../../services/AttendanceOverride/GetAttendanceOverrideHistory";

export default function OverrideTable({ data = [] }) {  
    const [dateRange, setDateRange] = useState("");
    const [overrideData, setOverrideData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState("");

    useEffect(() => {
        console.log("overrideData:", overrideData);
    }, [overrideData]);

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
        });
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

    const dateOptions = [
        ...new Set(
            overrideData.map(
                item => item.attendanceDate
            )
        )
    ];
    

    const hasActiveFilters =
        dateRange ||
        employeeSearch ||
        department;

    const filteredData = overrideData.filter((item) => {
        const dateMatch =
            !dateRange ||
            item.attendanceDate === dateRange;

        const employeeMatch =
            !employeeSearch ||
            item.employeeName
                ?.toLowerCase()
                .includes(employeeSearch.toLowerCase());

        const departmentMatch =
            !department ||
            item.department === department;

        return (
            dateMatch &&
            employeeMatch &&
            departmentMatch
        );
    });

    useEffect(() => {
        fetchOverrideHistory();
    }, []);

    const fetchOverrideHistory = async () => {
        try {
            setLoading(true);

            const response = await getAttendanceOverrideHistory();

            console.log("API Response:", response);
            console.log("API Data:", response.data);

            setOverrideData(response.data);

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
                Department:
                    item.department,
                Attendance_Date:
                    item.attendanceDate,
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

    return (
        <>
            {/* Filters */}

            <div className="mb-4 pl-7 pr-7 pt-7 pb-3 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-[18px] font-semibold text-white">
                    Override History
                </h1>

                <div className="flex flex-wrap items-center gap-3">

                    <div className="w-[270px]">
                        <CustomDropdown
                            value={dateRange}
                            placeholder="Attendance Date"
                            options={dateOptions}
                            onChange={setDateRange}
                        />
                    </div>

                    <div className="w-[220px]">
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

                    <div className="w-[250px]">
                        <input
                            type="text"
                            value={employeeSearch}
                            onChange={(e) => setEmployeeSearch(e.target.value)}
                            placeholder="Search Employee"
                            className="
                                w-full
                                h-11
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

                    <button
                        onClick={exportSelectedEmployees}
                        className="
                            h-11
                            px-5
                            rounded-lg
                            border
                            border-[#3984ff]
                            text-[#3984ff]
                            hover:bg-[#3984ff]
                            hover:text-white
                        "
                    >
                        Export Excel
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setDateRange("");
                                setEmployeeSearch("");
                                setDepartment("");
                            }}
                            className="flex items-center gap-2 h-11 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[#8ca1bd]"
                        >
                            Reset Filter
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}

            <div className="overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-[#0a1a2d] scrollbar-thumb-[#244061]">

                    <table className="w-full table-auto border-collapse text-left">

                        <thead className="sticky top-0 z-10 bg-[#172c46] text-[15px] uppercase tracking-wide text-[#9aacc7]">

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

                        <tbody className="text-[15px] text-[#cad7eb]">

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
                                            {item.department}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.attendanceDate?.includes(" to ") ? (
                                                <div className="flex flex-col">
                                                    <span>{item.attendanceDate.split(" to ")[0]}</span>
                                                    <span className="text-xs text-[#8ca1bd]">
                                                        to
                                                    </span>
                                                    <span>{item.attendanceDate.split(" to ")[1]}</span>
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
                                            {item.statusCode}
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
                                            {item.remarks}
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