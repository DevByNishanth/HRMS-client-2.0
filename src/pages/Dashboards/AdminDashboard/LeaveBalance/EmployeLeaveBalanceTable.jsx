import React, { useEffect, useState } from "react";
import { getEmployeLeaveBalance } from "../../../../services/LeaveBalance/getEmployeLeaveBalanceService";
import { Pencil, } from "lucide-react";
import UpdateEmployeeLeaveBalance from "./updateEmployeLeaveBlance";

export default function EmployeLeaveBalanceTable({
    employee,
    setLeaveBalanceData,
}) {
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);

    useEffect(() => {
        if (!employee?.facultyId) {
            setLeaveBalance([]);
            setLeaveBalanceData?.([]);
            return;
        }
        fetchLeaveBalance();
    }, [employee]);

    const fetchLeaveBalance = async () => {
        try {
            setLoading(true);

            const response =
                await getEmployeLeaveBalance(
                    employee.facultyId
            );

            const balances = response.balances || [];

            setLeaveBalance(balances);

            if (setLeaveBalanceData) {
                setLeaveBalanceData(balances);
            }

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
            <div className="rounded-xl border border-[#183052] bg-[#0a1a2d]">
                {/* <div className="px-7 pt-7 pb-3"> */}
                    {/* <h1 className="text-[18px] font-semibold text-white">
                        Leave Balance
                    </h1> */}
                {/* </div> */}

                <div
                    className="
                        max-h-[420px]
                        overflow-y-auto
                        scrollbar-thin
                        scrollbar-track-[#0a1a2d]
                        scrollbar-thumb-[#244061]
                    "
                >
                    <table className="w-full table-auto border-collapse text-left">
                        <thead className="sticky top-0 z-10 bg-[#172c46] text-[14px] uppercase tracking-wide text-[#9aacc7]">
                            <tr>
                                <th className="px-5 py-4 rounded-tl-xl">
                                    Leave Type
                                </th>

                                <th className="px-5 py-4">
                                    Allocated
                                </th>

                                <th className="px-5 py-4">
                                    Used
                                </th>

                                <th className="px-5 py-4">
                                    Available
                                </th>

                                <th className="px-5 py-4 text-center rounded-tr-xl">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-[14px] text-[#cad7eb]">
                            {leaveBalance.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-10 text-center text-[#9eb0cc]"
                                    >
                                        No leave balance found
                                    </td>
                                </tr>
                            ) : (
                                leaveBalance.filter(
                                        (leave) =>
                                            leave.leaveTypeId?.leaveName?.toUpperCase() !== "LOP"
                                    )
                                    .map((leave) => (
                                    <tr
                                        key={leave._id}
                                        className="border-b border-[#132944] last:border-0"
                                    >
                                        <td className="px-5 py-3">
                                            {leave.leaveTypeId?.leaveName}
                                        </td>

                                        <td className="px-5 py-3">
                                            {leave.allocatedDays}
                                        </td>

                                        <td className="px-5 py-3">
                                            {leave.usedDays}
                                        </td>

                                        <td className="px-5 py-3">
                                            {leave.remainingDays}
                                        </td>

                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(leave)
                                                    }
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D213B] text-green-400/60 transition hover:bg-[#183052] hover:text-white"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showDrawer && (
                <UpdateEmployeeLeaveBalance
                    leaveData={selectedLeave}
                    onClose={() => {
                        setShowDrawer(false);
                        setSelectedLeave(null);
                    }}
                    refreshData={fetchLeaveBalance}
                />
            )}
        </div>
    );
}