import React from "react";
import { X } from "lucide-react";

export default function ViewLeaveType({
    leaveType,
    onClose,
}) {
    if (!leaveType) return null;

    const DetailRow = ({ label, value }) => (
        <div className="py-3 border-b border-[#183052]">
            <p className="text-sm font-medium text-[#8ca1bd]">
                {label}
            </p>

            <p className="mt-1 text-white text-[15px]">
                {value || "-"}
            </p>
        </div>
    );

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/40"
                onClick={onClose}
            />

            <div className="fixed top-0 right-0 z-50 h-full w-[450px] bg-[#071425] border-l border-[#183052] shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#183052]">
                    <h2 className="text-lg font-semibold text-white">
                        View Leave Type
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-[#8ca1bd] hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pt-2 pb-6 overflow-y-auto h-[calc(100%-72px)]">
                    <DetailRow
                        label="Leave Name"
                        value={leaveType.leaveName}
                    />

                    <DetailRow
                        label="Leave Category"
                        value={leaveType.leaveCategory}
                    />

                    <DetailRow
                        label="Employee Categories"
                        value={leaveType.employeeCategories?.join(
                            " / "
                        )}
                    />

                    <DetailRow
                        label="Reset Frequency"
                        value={leaveType.resetFrequency}
                    />

                    <DetailRow
                        label="Number of Days"
                        value={leaveType.daysPerYear}
                    />

                    <DetailRow
                        label="Carry Forward Allowed"
                        value={
                            leaveType.carryForwardAllowed
                                ? "Yes"
                                : "No"
                        }
                    />

                    <DetailRow
                        label="Maximum Carry Forward Allowed"
                        value={
                            leaveType.carryForwardAllowed
                                ? leaveType.maxCarryForwardDays
                                : "-"
                        }
                    />

                    <DetailRow
                        label="Allow Half Day"
                        value={
                            leaveType.allowHalfDay
                                ? "Yes"
                                : "No"
                        }
                    />

                    <DetailRow
                        label="Sandwich Rule Applicable"
                        value={
                            leaveType.sandwichRuleApplicable
                                ? "Yes"
                                : "No"
                        }
                    />
                </div>
            </div>
        </>
    );
}