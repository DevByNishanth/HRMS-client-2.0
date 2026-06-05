import React, { useEffect, useState } from "react";
import { getEmployeLeaveBalance } from "../../../../services/LeaveBalance/getEmployeLeaveBalanceService";

export default function EmployeLeaveBalanceTable({
    employee,
}) {
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);

    useEffect(() => {
        if (!employee?.facultyId) return;

        fetchLeaveBalance();
    }, [employee]);

    const fetchLeaveBalance = async () => {
        try {
            setLoading(true);

            const response =
                await getEmployeLeaveBalance(
                    employee.facultyId
                );

            setLeaveBalance(response.balances || []);
        } catch (error) {
            console.error(
                "Error fetching leave balance:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mt-4 text-white">
                Loading...
            </div>
        );
    }
    const handleEdit = (leave) => {
        setSelectedLeave(leave);
        setShowDrawer(true);
    };


    return (
        <div className="mt-4">
            {/* <div className="mb-4 rounded-lg bg-[#0d2138] p-4 text-white">
                <h3 className="text-lg font-semibold">
                    {employee.name}
                </h3>

                <p className="text-sm text-gray-400">
                    {employee.empId}
                </p>

                <p className="text-sm text-gray-400">
                    {employee.department}
                </p>
            </div> */}

            <table className="w-full border-collapse text-white">
                <thead>
                    <tr className="bg-[#0d2138]">
                        <th className="p-3 text-left">
                            Leave Type
                        </th>
                        <th className="p-3 text-left">
                            Total
                        </th>
                        <th className="p-3 text-left">
                            Used
                        </th>
                        <th className="p-3 text-left">
                            Available
                        </th>
                        <th className="p-3 text-left">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {leaveBalance.map((leave) => (
                        <tr
                            key={leave._id}
                            className="border-b border-[#244061]"
                        >
                            <td className="p-3">
                                {leave.leaveTypeId?.leaveName || "-"}
                            </td>

                            <td className="p-3">
                                {leave.allocatedDays}
                            </td>

                            <td className="p-3">
                                {leave.usedDays}
                            </td>

                            <td className="p-3">
                                {leave.remainingDays}
                            </td>

                            <td className="p-3">
                                <button
                                    onClick={() => handleEdit(leave)}
                                    className="rounded bg-blue-600 px-3 py-1 text-white"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}