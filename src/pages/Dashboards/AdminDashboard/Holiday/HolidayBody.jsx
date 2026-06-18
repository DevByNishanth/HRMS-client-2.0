import React, { useState, useEffect } from "react";
import AddHoliday from "./AddHoliday";
import { Pencil, Trash2, X } from "lucide-react";
import { getHolidays } from "../../../../services/holiday/getHolidayService";
import { deleteHoliday } from "../../../../services/holiday/deleteHolidayService";
import CustomDropdown from "../../../../components/CustomDropdown";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function HolidayBody() {
    const [showDrawer, setShowDrawer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [holidays, setHolidays] = useState([]);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [deletingHoliday, setDeletingHoliday] = useState(null);
    const [isDeletingHoliday, setIsDeletingHoliday] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    // const [holidayDateFilter, setHolidayDateFilter] = useState("");
    const [employeeCategoryFilter, setEmployeeCategoryFilter] = useState("");
    const [holidayTypeFilter, setHolidayTypeFilter] = useState("");
    const [holidayDateFilter, setHolidayDateFilter] = useState(null);

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            setLoading(true);

            const response = await getHolidays();

            console.log("Holiday API Response:", response);

            setHolidays(response || []);
        } catch (error) {
            console.error("Error fetching holidays:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log("holidays state:", holidays);
    }, [holidays]);

    const handleDelete = async () => {
        if (!deletingHoliday) return;

        try {
            setIsDeletingHoliday(true);
            setDeleteError("");

            await deleteHoliday(deletingHoliday._id);

            setHolidays((prev) =>
                prev.filter(
                    (holiday) => holiday._id !== deletingHoliday._id
                )
            );

            setDeletingHoliday(null);
        } catch (error) {
            console.error("Delete failed:", error);

            setDeleteError(
                error?.response?.data?.message ||
                "Failed to delete holiday"
            );
        } finally {
            setIsDeletingHoliday(false);
        }
    };

    const employeeCategories = [
        ...new Set(
            holidays.flatMap(
                (holiday) => holiday.applicableEmployeeCategories || []
            )
        ),
    ];

    const holidayTypes = [
        ...new Set([
            ...holidays
                .map((holiday) => holiday.holidayType)
                .filter(Boolean),
            "College",
        ]),
    ];

    const filteredHolidays = holidays.filter((holiday) => {
        const matchesSearch =
            holiday.holidayName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesDate =
            !holidayDateFilter ||
            (() => {
                const holidayDate = new Date(holiday.holidayDate);

                return (
                    holidayDate.getDate() === holidayDateFilter.getDate() &&
                    holidayDate.getMonth() === holidayDateFilter.getMonth() &&
                    holidayDate.getFullYear() === holidayDateFilter.getFullYear()
                );
        })();

        const matchesCategory =
            !employeeCategoryFilter ||
            employeeCategoryFilter === "All" ||
            holiday.applicableEmployeeCategories?.includes(
                employeeCategoryFilter
            );

        const matchesType =
            !holidayTypeFilter ||
            holidayTypeFilter === "All" ||
            holiday.holidayType === holidayTypeFilter;

        return (
            matchesSearch &&
            matchesDate &&
            matchesCategory &&
            matchesType
        );
    });

    const hasActiveFilters =
        searchTerm ||
        holidayDateFilter ||
        employeeCategoryFilter ||
        holidayTypeFilter;

    const handleExportExcel = () => {
        const exportData = filteredHolidays.map((holiday) => ({
            "Holiday Name": holiday.holidayName,
            "Holiday Date": new Date(
                holiday.holidayDate
            ).toLocaleDateString("en-GB"),
            "Employee Categories":
                holiday.applicableEmployeeCategories?.join(", "),
            "Holiday Type": holiday.holidayType,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Holidays"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(file, "Holiday_List.xlsx");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <div className="flex flex-col">
                    <h1 className="text-xl font-medium leading-tight text-white">
                        Holiday Management
                    </h1>

                    <p className="text-[16px] text-[#9eb0cc]">
                        Manage holidays efficiently and effectively.
                    </p>
                </div>

                <button
                    onClick={() => setShowDrawer(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Holiday
                </button>
            </div>

            <div className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
                <div className="mb-4 pl-7 pr-7 pt-7 pb-3 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="shrink-0 text-[18px] font-semibold text-white">
                            Holiday List
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="h-11 w-[230px] rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] pl-5 text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                            placeholder="Search Holiday Name..."
                        />
                        <div className="w-[180px]">
                            <CustomDatePicker
                                value={holidayDateFilter}
                                onChange={setHolidayDateFilter}
                                placeholder="Holiday Date"
                            />
                        </div>

                        <div className="w-[220px]">
                            <CustomDropdown
                                value={employeeCategoryFilter}
                                placeholder="Employee Categories"
                                options={employeeCategories}
                                onChange={setEmployeeCategoryFilter}
                            />
                        </div>

                        <div className="w-[180px]">
                            <CustomDropdown
                                value={holidayTypeFilter}
                                placeholder="Holiday Types"
                                options={holidayTypes}
                                onChange={setHolidayTypeFilter}
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
                            "
                        >
                            Export Excel
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setHolidayDateFilter(null);
                                    setEmployeeCategoryFilter("");
                                    setHolidayTypeFilter("");
                                }}
                                className="flex flex-row items-center gap-2  h-12 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] font-semibold text-[#8ca1bd] transition hover:bg-[#132b49] hover:text-white hover:border-[#3984ff]"
                            >
                                Reset Filters <X className="w-5 h-5"/>
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
                            <thead className="sticky top-0 z-10 bg-[#172c46] text-[15px] uppercase tracking-wide text-[#9aacc7]">
                                <tr>
                                    <th className="px-5 py-4 w-[25%] font-semibold">Holiday Name</th>
                                    <th className="px-5 py-4 w-[25%] font-semibold">Holiday Date</th>
                                    <th className="px-5 py-4 w-[25%] font-semibold">Employee Category</th>
                                    <th className="px-5 py-4 w-[20%] font-semibold">Holiday Type</th>
                                    {/* <th className="px-5 py-4 font-semibold">
                                        Description
                                    </th> */}
                                    <th className="px-5 py-4 w-[25%] font-semibold text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-[15px] text-[#cad7eb]">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredHolidays.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            No holidays found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHolidays.map((holiday) => (
                                        <tr
                                            key={holiday._id}
                                            className="border-b border-[#132944] last:border-0"
                                        >
                                            <td className="px-5 py-3">
                                                {holiday.holidayName}
                                            </td>

                                            <td className="px-5 py-3">
                                                {new Date(
                                                    holiday.holidayDate
                                                ).toLocaleDateString(
                                                    "en-GB"
                                                )}
                                            </td>

                                            <td className="px-5 py-3">
                                                {holiday.applicableEmployeeCategories?.join(
                                                    ", "
                                                )}
                                            </td>

                                            <td className="px-5 py-3">
                                                {holiday.holidayType}
                                            </td>

                                            {/* <td className="px-5 py-3 max-w-[250px] truncate">
                                                {holiday.description}
                                            </td> */}

                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedHoliday(
                                                                holiday
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
                                                        type="button"
                                                        onClick={() => {
                                                            setDeletingHoliday(
                                                                holiday
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
                                    ))
                                )}
                            </tbody>
                        </table>

                        {showDrawer && (
                            <AddHoliday
                                holidayData={selectedHoliday}
                                holidays={holidays}
                                refreshHolidays={fetchHolidays}
                                onClose={() => {
                                    setShowDrawer(false);
                                    setSelectedHoliday(null);
                                    fetchHolidays();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {deletingHoliday && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-[4px]">
                    <div className="w-full max-w-[420px] rounded-xl border border-[#183052] bg-[#071425] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                        <header className="border-b border-[#183052] py-3 px-4">
                            <p className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#f16868]">
                                Delete Holiday
                            </p>
                        </header>

                        <div className="px-4 py-3">
                            <h3 className="mt-2 text-[18px] font-semibold text-white">
                                Remove{" "}
                                {deletingHoliday.holidayName}?
                            </h3>

                            <p className="mt-2 text-[13px] leading-5 text-[#9eb0cc]">
                                This action will permanently delete
                                the holiday from the system.
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
                                type="button"
                                onClick={() =>
                                    setDeletingHoliday(null)
                                }
                                disabled={isDeletingHoliday}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] px-6 text-sm font-medium text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeletingHoliday}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FF4B4B] px-6 text-sm font-medium text-white transition hover:bg-[#bd3434] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isDeletingHoliday
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