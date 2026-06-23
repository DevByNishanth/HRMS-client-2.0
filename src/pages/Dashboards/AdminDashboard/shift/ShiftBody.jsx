import React,{useState,useEffect} from 'react'
import AddShiftForm from './AddShiftForm';
import { Pencil,Trash2, X,Plus,Search } from 'lucide-react';
import {getShifts} from '../../../../services/shift/getShiftService'
import {deleteShift} from '../../../../services/shift/deleteShiftService'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ShiftBody() {
    const [showDrawer, setShowDrawer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null);
    const [deletingShift, setDeletingShift] = useState(null);
    const [isDeletingShift, setIsDeletingShift] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(()=>{
        fetchShifts();
    },[]);

    const fetchShifts = async () => {
        try {
        setLoading(true);

        const response = await getShifts();

        console.log("Shift API Response:", response);

        setShifts(response.data);
        } catch (error) {
        console.error("Error fetching shifts:", error);
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingShift) return;

        try {
            setIsDeletingShift(true);
            setDeleteError("");

            await deleteShift(deletingShift._id);

            setShifts((prev) =>
                prev.filter((shift) => shift._id !== deletingShift._id)
            );

            setDeletingShift(null);
        } catch (error) {
            console.error("Delete failed:", error);

            setDeleteError(
                error?.response?.data?.message ||
                "Failed to delete shift"
            );
        } finally {
            setIsDeletingShift(false);
        }
    };
    
    const filteredShifts = shifts.filter((shift) =>
        shift.shiftName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResetFilter = () => {
        setSearchTerm("");
    };

    const handleExportExcel = () => {
        const exportData = filteredShifts.map((shift) => ({
            "Shift Name": shift.shiftName,
            "Start Time": shift.startTime,
            "End Time": shift.endTime,
            "Grace Time (Minutes)": shift.graceTime,
            "Working Hours": shift.workingHours,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Shifts");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(file, "Shift_List.xlsx");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <div className="flex flex-col">
                    <h1 className="text-xl font-medium leading-tight text-white">Shift Management</h1>
                    <p className="text-[16px] text-[#9eb0cc]">Manage your shifts efficiently and effectively.</p>
                </div>

                <button
                    onClick={() => setShowDrawer(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex flex-row items-center gap-2 cursor pointer"
                >
                <span><Plus className='w-4'/></span>
                Add Shift
                </button>
            </div>
            <div className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
                <div className="mb-4 pl-7 pr-7 pt-7 pb-3 flex items-center justify-between gap-4">
                    <h1 className="shrink-0 text-[18px] font-semibold text-white">Shift List ({shifts.length})</h1>
                    <div className="flex items-center gap-3">
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
                                className="h-11 w-[330px] rounded-lg border border-[#244061] bg-[#0d2138] text-[14px] pl-11 text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                                placeholder="Search Shift Name"
                            />
                        </div>
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
                        {searchTerm.trim() !== "" && (
                            <button
                                onClick={handleResetFilter}
                                className="flex items-center gap-2 h-11 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[#8ca1bd] cursor-pointer"
                            >
                                Reset Filter
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="overflow-hidden ">
                    <div className="
                        max-h-[420px]
                        overflow-y-auto
                        scrollbar-thin
                        scrollbar-track-[#0a1a2d]
                        scrollbar-thumb-[#244061]
                        hover:scrollbar-thumb-[#3984ff]
                    ">
                        <table className="w-full table-auto border-collapse text-left"> 
                            <thead className="sticky top-0 z-10 bg-[#172c46] text-[14px] uppercase tracking-wide text-[#9aacc7]">
                                <tr>
                                    <th className="px-5 py-4 font-semibold w-[20%]">Shift Name</th>
                                    <th className="px-5 py-4 font-semibold w-[20%]">Start Time</th>
                                    <th className="px-5 py-4 font-semibold w-[20%]">End Time</th>
                                    <th className="px-5 py-4 font-semibold w-[20%]">Grace Time</th>
                                    <th className="px-5 py-4 font-semibold w-[20%]">Working Hours</th>
                                    <th className="px-5 py-4 font-semibold w-[20%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-[#cad7eb]">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                        Loading...
                                        </td>
                                    </tr>
                                    ) : filteredShifts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                        No matching shifts found
                                        </td>
                                    </tr>
                                    ) : (
                                    filteredShifts.map((shift) => (
                                        <tr
                                        key={shift._id}
                                        className="border-b border-[#132944] last:border-0"
                                        >
                                            <td className="px-5 py-3">{shift.shiftName}</td>
                                            <td className="px-5 py-3">{shift.startTime}</td>
                                            <td className="px-5 py-3">{shift.endTime}</td>
                                            <td className="px-5 py-3">{shift.graceTime} minutes</td>
                                            <td className="px-5 py-3">
                                                {(shift.workingHours ??
                                                    (shift.workingMinutes / 60).toFixed(2))} hours
                                            </td>
                                            <td className="px-5 py-3 text-[#8ca1bd]">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedShift(shift);
                                                            setShowDrawer(true);
                                                        }}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D213B] text-green-400/60 transition hover:bg-[#183052] hover:text-white cursor-pointer"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setDeletingShift(shift);
                                                            setDeleteError("");
                                                        }}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#183052] hover:text-white cursor-pointer"
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
                            <AddShiftForm
                                shiftData={selectedShift}
                                refreshShifts={fetchShifts}
                                onClose={() => {
                                    setShowDrawer(false);
                                    setSelectedShift(null);
                                    fetchShifts();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
            {deletingShift && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-[4px]">
                    <div className="w-full max-w-[420px] rounded-xl border border-[#183052] bg-[#071425] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">

                        <header className="border-b border-[#183052] py-3 px-4">
                            <p className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#f16868]">
                                Delete Shift
                            </p>
                        </header>

                        <div className="px-4 py-3">
                            <h3 className="mt-2 text-[18px] font-semibold text-white">
                                Remove {deletingShift.shiftName}?
                            </h3>

                            <p className="mt-2 text-[13px] leading-5 text-[#9eb0cc]">
                                This action will permanently delete the shift from the system.
                            </p>
                        </div>

                        {deleteError && (
                            <div className="px-4">
                                <p className="rounded-lg bg-[#f168681f] px-3 py-2 text-[12px] font-semibold text-[#f16868]">
                                    {deleteError}
                                </p>
                            </div>
                        )}

                        <div className="mt-5 flex items-center  justify-end gap-2 px-4 mb-3">
                            <button
                                type="button"
                                onClick={() => setDeletingShift(null)}
                                disabled={isDeletingShift}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] px-6 text-sm font-medium text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeletingShift}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FF4B4B] px-6 text-sm font-medium text-white transition hover:bg-[#bd3434] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                {isDeletingShift ? "Deleting..." : "Delete"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
