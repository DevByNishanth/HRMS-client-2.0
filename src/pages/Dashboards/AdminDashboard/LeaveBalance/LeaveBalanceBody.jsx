import React, { useState, useEffect } from "react";
import EmployeLeaveBalanceTable from "./EmployeLeaveBalanceTable";
import { getfacultiesName } from "../../../../services/LeaveBalance/getEmployeNameService";

export default function LeaveBalanceBody() {
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

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
    };

    return (
        <div className="relative">
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="h-11 w-[350px] rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] pl-5 text-white outline-none"
                    placeholder="Search Employee Name or Employee ID..."
                />

                {showDropdown && employees.length > 0 && (
                    <div className="absolute z-50 mt-1 w-[350px] rounded-lg border border-[#244061] bg-[#0d2138] shadow-lg">
                        {employees.map((employee) => (
                            <div
                                key={employee.facultyId}
                                onClick={() => handleSelectEmployee(employee)}
                                className="flex cursor-pointer items-center justify-start gap-3 border-b border-[#244061] px-4 py-3 text-white hover:bg-[#244061]"
                            >
                                {/* Profile Image */}
                                <div className="flex-shrink-0">
                                    {employee.profileImage ? (
                                        <img
                                            src={employee.profileImage}
                                            alt={employee.name}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3984ff] text-lg font-semibold text-white">
                                            {employee.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Employee Details */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">
                                        {employee.name}
                                    </span>
                                    <span className="text-xs text-[#6f839f]">
                                        {employee.empId}
                                    </span>
                                </div>
                                {/* Employes department */}
                                <div>
                                    <span className="text-xs text-[#9caec8]">
                                        {employee.department}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                {selectedEmployee && (
                    <EmployeLeaveBalanceTable
                        employee={selectedEmployee}
                    />
                )}
            </div>
        </div>
    );
}