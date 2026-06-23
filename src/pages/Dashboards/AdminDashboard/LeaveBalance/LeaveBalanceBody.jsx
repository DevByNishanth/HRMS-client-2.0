import React, { useState, useEffect } from "react";
import EmployeLeaveBalanceTable from "./EmployeLeaveBalanceTable";
import { getfacultiesName } from "../../../../services/LeaveBalance/getEmployeNameService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { X, Search } from "lucide-react";

export default function LeaveBalanceBody() {
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [leaveBalanceData, setLeaveBalanceData] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            if (!searchTerm.trim()) {
                setEmployees([]);
                return;
            }

            try {
                const response = await getfacultiesName(searchTerm);
                setEmployees(response.data || []);
                setShowDropdown(true);
            } catch (error) {
                console.error(error);
            }
        };

        const timeout = setTimeout(fetchEmployees, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);

        setSearchTerm(
            `${employee.name} (${employee.empId})`
        );

        setShowDropdown(false);
        setHighlightedIndex(-1);
        setEmployees([]);
    };

    const handleKeyDown = (e) => {
        if (!employees.length) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < employees.length - 1
                        ? prev + 1
                        : 0
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev > 0
                        ? prev - 1
                        : employees.length - 1
                );
                break;

            case "Enter":
                e.preventDefault();

                const employee =
                    highlightedIndex >= 0
                        ? employees[highlightedIndex]
                        : employees[0];

                handleSelectEmployee(employee);
                break;

            default:
                break;
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        setSelectedEmployee(null);
        setEmployees([]);
        setShowDropdown(false);
        setHighlightedIndex(-1);
    };

    const handleExportExcel = () => {
        if (!leaveBalanceData.length) return;

        const exportData = leaveBalanceData
            .filter(
                (leave) =>
                    leave.leaveTypeId?.leaveName?.toUpperCase() !== "LOP"
            )
            .map((leave) => ({
                "Leave Type": leave.leaveTypeId?.leaveName,
                Allocated: leave.allocatedDays,
                Used: leave.usedDays,
                Available: leave.remainingDays,
            }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Leave Balance"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "Employee_Leave_Balance.xlsx");
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl font-medium text-white">
                    Leave Balance Management
                </h1>

                <p className="text-[16px] text-[#9eb0cc]">
                    Manage employee leave balances efficiently.
                </p>
            </div>

            {/* Card */}
            <div className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
                <div className="mb-4 flex flex-wrap items-center justify-between px-7 pt-7 pb-3">
                    <h1 className="text-[18px] font-semibold text-white">
                        Employee Leave Balance ({leaveBalanceData.length})
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="relative z-50">
                            <div className="relative">
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="
                                        h-11
                                        w-[350px]
                                        rounded-lg
                                        border
                                        border-[#244061]
                                        bg-[#0d2138]
                                        pl-11
                                        text-[14px]
                                        text-white
                                        outline-none
                                        transition
                                        placeholder:text-[#6f839f]
                                        hover:border-[#3984ff]
                                        focus:border-[#3984ff]
                                        focus:ring-2
                                        focus:ring-[#3984ff33]
                                    "
                                    placeholder="Search Employee Name or Employee ID..."
                                />
                            </div>

                            {showDropdown && employees.length > 0 && (
                                <div
                                    className="
                                        custom-scrollbar
                                        absolute z-50 mt-1 w-[350px]
                                        h-[300px]
                                        overflow-y-auto
                                        rounded-lg
                                        border border-[#244061]
                                        bg-[#0d2138]
                                        shadow-lg
                                    "
                                >
                                    {employees.map(
                                        (
                                            employee,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    employee.facultyId
                                                }
                                                onClick={() =>
                                                    handleSelectEmployee(
                                                        employee
                                                    )
                                                }
                                                className={`flex cursor-pointer items-center gap-3 border-b border-[#244061] px-4 py-3 text-white ${
                                                    highlightedIndex ===
                                                    index
                                                        ? "bg-[#244061]"
                                                        : "hover:bg-[#244061]"
                                                }`}
                                            >
                                                <div className="flex-shrink-0">
                                                    {employee.profileImage ? (
                                                        <img
                                                            src={
                                                                employee.profileImage
                                                            }
                                                            alt={
                                                                employee.name
                                                            }
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3984ff] text-lg font-semibold text-white">
                                                            {employee.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {
                                                            employee.name
                                                        }
                                                    </span>

                                                    <span className="text-xs text-[#6f839f]">
                                                        {
                                                            employee.empId
                                                        }
                                                    </span>
                                                </div>

                                                <span className="ml-auto text-xs text-[#9caec8]">
                                                    {
                                                        employee.department
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedEmployee && leaveBalanceData.length > 0 && (
                            <button
                                onClick={handleExportExcel}
                                className="
                                    h-11
                                    px-5
                                    rounded-lg
                                    border
                                    border-[#3984ff]
                                    text-[#3984ff]
                                    hover:bg-[#3984ff]
                                    hover:text-white
                                    cursor-pointer
                                "
                            >
                                Export Excel
                            </button>
                        )}

                        {selectedEmployee && (
                            <button
                                onClick={handleReset}
                                className="
                                    flex items-center gap-2
                                    h-11 px-4
                                    rounded-lg
                                    border border-[#244061]
                                    bg-[#0d2138]
                                    text-[#8ca1bd]
                                    cursor-pointer
                                "
                            >
                                Reset Filter
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-4 pb-4">
                    {selectedEmployee ? (
                        <EmployeLeaveBalanceTable
                            employee={
                                selectedEmployee
                            }
                            setLeaveBalanceData={setLeaveBalanceData}
                        />
                    ) : (
                        <div className="rounded-xl border border-[#183052] bg-[#071425] p-10 text-center">
                            <p className="text-[#9eb0cc]">
                                No employee selected
                            </p>

                            <p className="mt-2 text-sm text-[#6f839f]">
                                Search and select an employee
                                to view leave balance.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}