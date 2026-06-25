import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { updateLeaveBalance } from "../../../../services/LeaveBalance/updateEmployeLeaveBalanceService";

export default function UpdateEmployeeLeaveBalance({
    leaveData,
    onClose,
    refreshData,
}) {
    const [formData, setFormData] = useState({
        allocatedDays: "",
        usedDays: "",
        remainingDays: "",
    });

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (leaveData) {
            setFormData({
                allocatedDays:
                    leaveData.allocatedDays || 0,
                usedDays:
                    leaveData.usedDays || 0,
                remainingDays:
                    leaveData.remainingDays || 0,
            });
        }
    }, [leaveData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...formData,
            [name]: Number(value),
        };

        updatedData.remainingDays =
            Number(updatedData.allocatedDays) -
            Number(formData.usedDays);

        setFormData(updatedData);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setApiError("");

            console.log("Selected Leave:", leaveData);

            const payload = {
                leaveBalanceId: leaveData?._id,
                allocatedDays: Number(formData.allocatedDays),
                usedDays: Number(formData.usedDays),
                remainingDays: Number(formData.remainingDays),
            };

            await updateLeaveBalance(
                leaveData._id,
                payload
            );

            refreshData?.();
            onClose();
        } catch (error) {
            setApiError(
                error.response?.data?.message ||
                    "Failed to update leave balance"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 backdrop-blur-[4px]">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            <div className="absolute right-0 top-0 h-full w-[500px] bg-[#020817] shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-blue-900 px-6 py-5">
                    <div>
                        <p className="text-blue-400 text-xs uppercase tracking-widest">
                            Leave Management
                        </p>

                        <h2 className="text-white text-xl font-semibold">
                            Update Leave Balance
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0f2749] text-white cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* Leave Type - Read Only */}
                    <div>
                        <label className="block text-white mb-2">
                            Leave Type
                        </label>

                        <input
                            type="text"
                            value={
                                leaveData?.leaveTypeId
                                    ?.leaveName || ""
                            }
                            disabled
                            className="
                                w-full
                                rounded-lg
                                p-3
                                bg-[#091726]
                                border
                                border-blue-900
                                text-gray-400
                                cursor-not-allowed
                                outline-none
                            "
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">
                            Allocated Days
                        </label>

                        <input
                            type="number"
                            name="allocatedDays"
                            value={
                                formData.allocatedDays
                            }
                            onChange={handleChange}
                            className="w-full rounded-lg p-3 bg-[#0D2138] border border-blue-900 text-white outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">
                            Used Days
                        </label>

                        <input
                            type="number"
                            name="usedDays"
                            value={formData.usedDays}
                            readOnly
                            className="
                                w-full
                                rounded-lg
                                p-3
                                bg-[#091726]
                                border
                                border-blue-900
                                text-gray-400
                                cursor-not-allowed
                                outline-none
                            "
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">
                            Available Days
                        </label>

                        <input
                            type="number"
                            value={formData.remainingDays}
                            disabled
                            className="
                                w-full
                                rounded-lg
                                p-3
                                bg-[#091726]
                                border
                                border-blue-900
                                text-gray-400
                                cursor-not-allowed
                            "
                        />
                    </div>
                </div>

                {apiError && (
                    <p className="text-red-400 text-sm px-6">
                        {apiError}
                    </p>
                )}

                {/* Footer */}
                <div className="border-t border-blue-900 bg-[#071a35] p-5 flex justify-between">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg border border-gray-500 text-white cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 rounded-md bg-[#2563EB] text-white hover:bg-[#1049c4] cursor-pointer"
                    >
                        {loading
                            ? "Updating..."
                            : "Update Leave Balance"}
                    </button>
                </div>
            </div>
        </div>
    );
}