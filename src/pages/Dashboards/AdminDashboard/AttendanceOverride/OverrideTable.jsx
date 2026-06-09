import React, { useState } from "react";
import CustomDropdown from "../../../../components/CustomDropdown";
import { X } from "lucide-react";

export default function OverrideTable({ data = [] }) {
    const [dateRange, setDateRange] = useState("");
    const [employeeFilter, setEmployeeFilter] = useState("");
    const [employee, setEmployee] = useState("");

    const hasActiveFilters =
        dateRange ||
        employeeFilter ||
        employee;

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
                            placeholder="Date Range"
                            options={[
                                "Jul 2025 - Jun 2026",
                                "Jul 2024 - Jun 2025",
                            ]}
                            onChange={setDateRange}
                        />
                    </div>

                    <div className="w-[220px]">
                        <CustomDropdown
                            value={employeeFilter}
                            placeholder="Employee Filters"
                            options={[
                                "Teaching",
                                "Non Teaching",
                            ]}
                            onChange={setEmployeeFilter}
                        />
                    </div>

                    <div className="w-[220px]">
                        <CustomDropdown
                            value={employee}
                            placeholder="Employee"
                            options={[
                                "DHARSHAN",
                                "ABINAYA",
                            ]}
                            onChange={setEmployee}
                        />
                    </div>

                    <button
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
                                setEmployeeFilter("");
                                setEmployee("");
                            }}
                            className="flex items-center gap-2 h-11 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[#8ca1bd]"
                        >
                            Reset
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}

            <div className="overflow-hidden">
                <div className="max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-track-[#0a1a2d] scrollbar-thumb-[#244061]">

                    <table className="w-full table-auto border-collapse text-left">

                        <thead className="sticky top-0 z-10 bg-[#172c46] text-[15px] uppercase tracking-wide text-[#9aacc7]">

                            <tr>
                                <th className="px-5 py-4">
                                    <input type="checkbox" />
                                </th>

                                <th className="px-5 py-4">
                                    Employee Name
                                </th>

                                <th className="px-5 py-4">
                                    Employee No
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

                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-10"
                                    >
                                        No Override History Found
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-[#132944]"
                                    >
                                        <td className="px-5 py-3">
                                            <input type="checkbox" />
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.employeeName}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.employeeNo}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.attendanceDate}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.firstIn}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.lastOut}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.status}
                                        </td>

                                        <td className="px-5 py-3">
                                            {item.overriddenOn}
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