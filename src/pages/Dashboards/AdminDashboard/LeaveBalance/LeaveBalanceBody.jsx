import React, { useState, useEffect } from "react";
import EmployeLeaveBalanceTable from "./EmployeLeaveBalanceTable";
import { getfacultiesName } from "../../../../services/LeaveBalance/getEmployeNameService";

export default function LeaveBalanceBody() {
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
                        Employee Leave Balance
                    </h1>

                    <div className="relative z-50">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            className="
                                h-11
                                w-[350px]
                                rounded-lg
                                border
                                border-[#244061]
                                bg-[#0d2138]
                                pl-5
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

                        {showDropdown &&
                            employees.length > 0 && (
                                <div className="absolute z-50 mt-1 w-[350px]
                                    h-[300px]
                                    overflow-y-auto
                                    rounded-lg
                                    border border-[#244061]
                                    bg-[#0d2138]
                                    shadow-lg
                                    scrollbar-thin
                                    scrollbar-track-[#0a1a2d]
                                    scrollbar-thumb-[#244061]">
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
                </div>

                <div className="px-4 pb-4">
                    {selectedEmployee ? (
                        <EmployeLeaveBalanceTable
                            employee={
                                selectedEmployee
                            }
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