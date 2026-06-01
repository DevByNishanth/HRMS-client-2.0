import { useState } from "react";
import { ChevronDown, FileText, Send, X } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";

const leaveTypes = [
    "Casual Leave",
    "Medical Leave",
    "Vacation Leave",
    "Compensatory Leave",
    "Loss of Pay",
];

const dayOptions = ["Full Day", "First Half", "Second Half"];

const ApplyLeaveForm = ({ onClose, employee }) => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [leaveType, setLeaveType] = useState("");
    const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);
    const [dayType, setDayType] = useState(dayOptions[0]);

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <section
            className="fixed inset-0 z-50 flex justify-end bg-[#020817]/60 backdrop-blur-[4px]"
            onClick={onClose}
        >
            <form
                className="flex h-full w-[26%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
                            Leave Request
                        </p>
                        <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
                            {employee ? `Apply Leave for ${employee.name}` : 'Apply Leave'}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                        aria-label="Close leave form"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 table-custom-scrollbar">
                    {/* Employee Details Banner */}
                    {employee && (
                        <div className="mb-4 rounded-lg border border-[#1e3a5f] bg-[#0d2138] p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#3984ff]">
                                Employee Details
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#172c46] text-[#9eb0cc]">
                                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239eb0cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>
                                </span>
                                <div>
                                    <p className="text-[14px] font-semibold text-white">{employee.name}</p>
                                    <p className="text-[12px] text-[#8ca1bd]">{employee.role}</p>
                                    <p className="text-[11px] text-[#3984ff]">{employee.empid}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="text-[13px] leading-5 text-[#b8c7dd]">
                        {employee
                            ? `Select the leave period, choose the leave type, and add notes for ${employee.name}'s approval.`
                            : 'Select your leave period, choose the leave type, and add notes for approval.'
                        }
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <CustomDatePicker
                                id="leave-from-date"
                                label="From"
                                value={fromDate}
                                onChange={setFromDate}
                                placeholder="From date"
                            />

                            <CustomDatePicker
                                id="leave-to-date"
                                label="To"
                                value={toDate}
                                onChange={setToDate}
                                placeholder="To date"
                                popupAlign="right"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="leave-type" className="mb-2 block text-[13px] font-semibold text-white">
                                Select Leave Type
                            </label>
                            <button
                                id="leave-type"
                                type="button"
                                onClick={() => setIsLeaveTypeOpen((currentState) => !currentState)}
                                className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                            >
                                <span className={leaveType ? "text-white" : "text-[#6f839f]"}>
                                    {leaveType || "Choose leave type"}
                                </span>
                                <ChevronDown size={16} className="text-[#3984ff]" />
                            </button>

                            {isLeaveTypeOpen && (
                                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                                    {leaveTypes.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                setLeaveType(type);
                                                setIsLeaveTypeOpen(false);
                                            }}
                                            className={`block w-full px-4 py-3 text-left text-[13px] transition ${
                                                leaveType === type
                                                    ? "bg-[#132b49] text-white"
                                                    : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="mb-2 text-[13px] font-semibold text-white">Day Type</p>
                            <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#244061] bg-[#0d2138] p-1.5">
                                {dayOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setDayType(option)}
                                        className={`h-9 rounded-md text-[12px] font-semibold transition ${
                                            dayType === option
                                                ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                                                : "text-[#9eb0cc] hover:bg-[#132b49] hover:text-white"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="leave-notes"
                                className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white"
                            >
                                <FileText size={15} className="text-[#3984ff]" />
                                Notes
                            </label>
                            <textarea
                                id="leave-notes"
                                rows={5}
                                placeholder="Add notes for your leave request..."
                                className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                            />
                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
                    <button
                        type="submit"
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4]"
                    >
                        Submit Leave Request
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ApplyLeaveForm;
