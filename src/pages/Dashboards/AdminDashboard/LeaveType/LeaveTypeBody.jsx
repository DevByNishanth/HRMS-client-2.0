import React, { useState, useEffect } from "react";
import AddLeaveType from "./AddLeaveType";
import { Pencil, Trash2, X, Eye,Plus,Search  } from "lucide-react";
import { getLeaveTypes } from "../../../../services/leaveType/getLeaveTypeService";
import { deleteLeaveType } from "../../../../services/leaveType/deleteLeaveTypeService";
import CustomDropdown from "../../../../components/CustomDropdown";
import ViewLeaveType from "./ViewLeaveType";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function LeaveTypeBody() {
    const [showDrawer, setShowDrawer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [deletingLeaveType, setDeletingLeaveType] = useState(null);
    const [isDeletingLeaveType, setIsDeletingLeaveType] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [leaveCategoryFilter, setLeaveCategoryFilter] = useState("");
    const [employeeCategoryFilter, setEmployeeCategoryFilter] = useState("");
    const [resetFrequencyFilter, setResetFrequencyFilter] = useState("");
    const [showViewDrawer, setShowViewDrawer] = useState(false);
    const [viewLeaveType, setViewLeaveType] = useState(null);

    const LEAVE_CATEGORIES = [
        "Regular",
        "On Duty"
    ];

    const RESET_FREQUENCIES = [
        "Academic Year",
        "Semester"
    ];

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
    const employeeCategories = [
        ...new Set(
            leaveTypes.flatMap(
                (leave) => leave.employeeCategories || []
            )
        ),
    ];
    const filteredLeaveTypes = Array.isArray(leaveTypes)
        ? leaveTypes.filter((leave) => {
            const matchesSearch =
                leave.leaveName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesCategory =
                !leaveCategoryFilter ||
                leave.leaveCategory === leaveCategoryFilter;

            const matchesEmployeeCategory =
                !employeeCategoryFilter ||
                leave.employeeCategories?.includes(
                    employeeCategoryFilter
                );

            const matchesResetFrequency =
                !resetFrequencyFilter ||
                leave.resetFrequency ===
                    resetFrequencyFilter;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesEmployeeCategory &&
                matchesResetFrequency
            );
        })
        : [];

        const hasActiveFilters =
            searchTerm ||
            leaveCategoryFilter ||
            employeeCategoryFilter ||
            resetFrequencyFilter;

        const handleExportExcel = () => {
            const exportData = filteredLeaveTypes.map((leave) => ({
                "Leave Name": leave.leaveName,
                "Category": leave.leaveCategory,
                "Employee Categories":
                    leave.employeeCategories?.join(", "),
                "Number of Days": leave.daysPerYear,
                "Reset Frequency": leave.resetFrequency,
                "Carry Forward Allowed":
                    leave.carryForwardAllowed ? "Yes" : "No",
                "Max Carry Forward Days":
                    leave.carryForwardAllowed
                        ? leave.maxCarryForwardDays ?? "-"
                        : "-"
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Leave Types"
            );

            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            const file = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(file, "Leave_Type_List.xlsx");
        };

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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex flex-row items-center gap-2 cursor-pointer"
                >   
                    <span><Plus className="w-4"/></span>
                    Add Leave Type
                </button>
            </div>

            {/* Table */}

            <div className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
                <div className="mb-4 pl-7 pr-7 pt-7 pb-3 flex flex-wrap  items-center justify-between">
                    <h1 className="shrink-0 text-[18px] font-semibold text-white">
                        Leave Type List ({filteredLeaveTypes.length})
                    </h1>

                    <div className="flex flex-wrap items-center gap-2">
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
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="h-11 w-[230px] rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] pl-11 text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                                placeholder="Search Leave Name..."
                            />
                        </div>

                        <div className="w-[180px]">
                            <CustomDropdown
                                value={leaveCategoryFilter}
                                placeholder="Category"
                                options={LEAVE_CATEGORIES}
                                onChange={setLeaveCategoryFilter}
                            />
                        </div>

                        <div className="w-[200px]">
                            <CustomDropdown
                                value={employeeCategoryFilter}
                                placeholder="Employee Categories"
                                options={employeeCategories}
                                onChange={setEmployeeCategoryFilter}
                            />
                        </div>

                        <div className="w-[170px]">
                            <CustomDropdown
                                value={resetFrequencyFilter}
                                placeholder="Reset Frequency"
                                options={RESET_FREQUENCIES}
                                onChange={setResetFrequencyFilter}
                            />
                        </div>

                        <button
                            onClick={handleExportExcel}
                            className="
                                h-12
                                px-5
                                rounded-lg
                                border
                                border-[#3984ff]
                                text-[#3984ff]
                                text-[14px]
                                font-semibold
                                transition
                                hover:bg-[#3984ff]
                                hover:text-white
                                cursor-pointer
                            "
                        >
                            Export Excel
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setLeaveCategoryFilter("");
                                    setEmployeeCategoryFilter("");
                                    setResetFrequencyFilter("");
                                }}
                                className="flex flex-row items-center gap-2 h-12 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] font-semibold text-[#8ca1bd] transition hover:bg-[#132b49] hover:text-white hover:border-[#3984ff] cursor-pointer"
                            >
                                Reset Filters
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
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
                            <thead className="sticky top-0 z-10 bg-[#172c46] text-[14px] uppercase tracking-wide text-[#9aacc7]">
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

                                    {/* <th className="px-5 py-4">
                                        Carry Forward Allowed
                                    </th>

                                    <th className="px-5 py-4">
                                        Max Carry Forward
                                    </th> */}

                                    <th className="px-5 py-4 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-[14px] text-[#cad7eb]">
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

                                                {/* <td className="px-5 py-3">
                                                    {leave.carryForwardAllowed ? "Yes" : "No"}
                                                </td>

                                                <td className="px-5 py-3">
                                                    {leave.carryForwardAllowed
                                                        ? leave.maxCarryForwardDays  ?? "-"
                                                        : "-"}
                                                </td> */}

                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-center gap-3">
                                                        {/* View */}
                                                        <button
                                                            onClick={() => {
                                                                setViewLeaveType(leave);
                                                                setShowViewDrawer(true);
                                                            }}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D213B] text-blue-400/60 transition hover:bg-[#183052] hover:text-white cursor-pointer"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        {/* Edit */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLeaveType(leave);
                                                                setShowDrawer(true);
                                                            }}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D213B] text-green-400/60 transition hover:bg-[#183052] hover:text-white cursor-pointer"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => {
                                                                setDeletingLeaveType(leave);
                                                                setDeleteError("");
                                                            }}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#183052] hover:text-white cursor-pointer"
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

                        {showViewDrawer && (
                            <ViewLeaveType
                                leaveType={viewLeaveType}
                                onClose={() => {
                                    setShowViewDrawer(false);
                                    setViewLeaveType(null);
                                }}
                            />
                        )}

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
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] px-6 text-sm font-medium text-[#cad7eb] cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={
                                    isDeletingLeaveType
                                }
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FF4B4B] px-6 text-sm font-medium text-white cursor-pointer"
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