import React, { useState, useEffect } from "react";
import AddLeaveType from "./AddLeaveType";
import { Pencil, Trash2 } from "lucide-react";

import { getLeaveTypes } from "../../../../services/leaveType/getLeaveTypeService";
import { deleteLeaveType } from "../../../../services/leaveType/deleteLeaveTypeService";

export default function LeaveTypeBody() {
    const [showDrawer, setShowDrawer] = useState(false);
    const [loading, setLoading] = useState(true);

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);

    const [deletingLeaveType, setDeletingLeaveType] =
        useState(null);

    const [isDeletingLeaveType, setIsDeletingLeaveType] =
        useState(false);

    const [deleteError, setDeleteError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    useEffect(() => {
        console.log("leaveTypes state:", leaveTypes);
    }, [leaveTypes]);

    const fetchLeaveTypes = async () => {
        try {
            setLoading(true);

            const response = await getLeaveTypes();

            console.log(
                "Leave Type API Response:",
                response
            );

            setLeaveTypes(response?.leaveTypes || []);
        } catch (error) {
            console.error(
                "Error fetching leave types:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingLeaveType) return;

        try {
            setIsDeletingLeaveType(true);
            setDeleteError("");

            await deleteLeaveType(
                deletingLeaveType._id
            );

            setLeaveTypes((prev) =>
                prev.filter(
                    (leave) =>
                        leave._id !==
                        deletingLeaveType._id
                )
            );

            setDeletingLeaveType(null);
        } catch (error) {
            console.error(error);

            setDeleteError(
                error?.response?.data?.message ||
                    "Failed to delete leave type"
            );
        } finally {
            setIsDeletingLeaveType(false);
        }
    };

    const filteredLeaveTypes = Array.isArray(leaveTypes)
        ? leaveTypes.filter((leave) =>
            leave.leaveName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    : [];

    return (
        <div className="p-6">
            {/* Header */}

            <div className="flex justify-between items-center mb-5">
                <div className="flex flex-col">
                    <h1 className="text-xl font-medium leading-tight text-white">
                        Leave Type Management
                    </h1>

                    <p className="text-[16px] text-[#9eb0cc]">
                        Manage leave types efficiently and
                        effectively.
                    </p>
                </div>

                <button
                    onClick={() => setShowDrawer(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Leave Type
                </button>
            </div>

            {/* Table */}

            <div className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
                <div className="mb-4 pl-7 pr-7 pt-7 pb-3 flex items-center justify-between gap-4">
                    <h1 className="shrink-0 text-[18px] font-semibold text-white">
                        Leave Type List
                    </h1>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        className="h-11 w-[330px] rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] pl-5 text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                        placeholder="Search Leave Name"
                    />
                </div>

                <div className="overflow-hidden">
                    <div
                        className="
                            max-h-[420px]
                            overflow-y-auto
                            scrollbar-thin
                            scrollbar-track-[#0a1a2d]
                            scrollbar-thumb-[#244061]
                            hover:scrollbar-thumb-[#3984ff]
                        "
                    >
                        <table className="w-full table-auto border-collapse text-left">
                            <thead className="sticky top-0 z-10 bg-[#172c46] text-[15px] uppercase tracking-wide text-[#9aacc7]">
                                <tr>
                                    <th className="px-5 py-4">
                                        Leave Name
                                    </th>

                                    <th className="px-5 py-4">
                                        Category
                                    </th>

                                    <th className="px-5 py-4">
                                        Employee Categories
                                    </th>

                                    <th className="px-5 py-4">
                                        Number of Days
                                    </th>

                                    <th className="px-5 py-4">
                                        Reset Frequency
                                    </th>

                                    <th className="px-5 py-4">
                                        Carry Forward Allowed
                                    </th>

                                    <th className="px-5 py-4">
                                        Max Carry Forward
                                    </th>

                                    <th className="px-5 py-4 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-[15px] text-[#cad7eb]">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredLeaveTypes.length ===
                                  0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4"
                                        >
                                            No leave types found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeaveTypes.map(
                                        (leave) => (
                                            <tr
                                                key={leave._id}
                                                className="border-b border-[#132944] last:border-0"
                                            >
                                                <td className="px-5 py-3">
                                                    {
                                                        leave.leaveName
                                                    }
                                                </td>

                                                <td className="px-5 py-3">
                                                    {
                                                        leave.leaveCategory
                                                    }
                                                </td>

                                                <td className="px-5 py-3">
                                                    {leave.employeeCategories?.join(
                                                        ", "
                                                    )}
                                                </td>

                                                <td className="px-5 py-3">
                                                    {
                                                        leave.daysPerYear
                                                    }
                                                </td>

                                                <td className="px-5 py-3">
                                                    {
                                                        leave.resetFrequency
                                                    }
                                                </td>

                                                <td className="px-5 py-3">
                                                    {leave.carryForwardAllowed ? "Yes" : "No"}
                                                </td>

                                                <td className="px-5 py-3">
                                                    {leave.carryForwardAllowed
                                                        ? leave.maxCarryForwardDays ?? "-"
                                                        : "-"}
                                                </td>

                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLeaveType(
                                                                    leave
                                                                );
                                                                setShowDrawer(
                                                                    true
                                                                );
                                                            }}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D213B] text-green-400/60 transition hover:bg-[#183052] hover:text-white"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setDeletingLeaveType(
                                                                    leave
                                                                );
                                                                setDeleteError(
                                                                    ""
                                                                );
                                                            }}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#183052] hover:text-white"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>

                        {showDrawer && (
                            <AddLeaveType
                                leaveTypeData={
                                    selectedLeaveType
                                }
                                refreshLeaveTypes={
                                    fetchLeaveTypes
                                }
                                onClose={() => {
                                    setShowDrawer(false);
                                    setSelectedLeaveType(
                                        null
                                    );
                                    fetchLeaveTypes();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}

            {deletingLeaveType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-[4px]">
                    <div className="w-full max-w-[420px] rounded-xl border border-[#183052] bg-[#071425]">
                        <header className="border-b border-[#183052] py-3 px-4">
                            <p className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#f16868]">
                                Delete Leave Type
                            </p>
                        </header>

                        <div className="px-4 py-3">
                            <h3 className="mt-2 text-[18px] font-semibold text-white">
                                Remove{" "}
                                {
                                    deletingLeaveType.leaveName
                                }
                                ?
                            </h3>

                            <p className="mt-2 text-[13px] text-[#9eb0cc]">
                                This action will permanently
                                delete the leave type.
                            </p>
                        </div>

                        {deleteError && (
                            <div className="px-4">
                                <p className="rounded-lg bg-[#f168681f] px-3 py-2 text-[12px] font-semibold text-[#f16868]">
                                    {deleteError}
                                </p>
                            </div>
                        )}

                        <div className="mt-5 flex items-center justify-end gap-2 px-4 mb-3">
                            <button
                                onClick={() =>
                                    setDeletingLeaveType(
                                        null
                                    )
                                }
                                disabled={
                                    isDeletingLeaveType
                                }
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] px-6 text-sm font-medium text-[#cad7eb]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={
                                    isDeletingLeaveType
                                }
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FF4B4B] px-6 text-sm font-medium text-white"
                            >
                                {isDeletingLeaveType
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}