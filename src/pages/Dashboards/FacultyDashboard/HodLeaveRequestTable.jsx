import {
    Eye,
    Check,
    X,
    ChevronDown,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    FileText,
    Layers,
    RotateCcw,
    Send,
    TimerReset,
    ShieldCheck,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import userImg from '../../../assets/userImg.svg';
import { decodeToken, getTokenFromLocalStorage } from '../../../utils/tokenUtils';
import axios from "axios";

const statusStyles = {
    Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
    Rejected: "text-[#f16868] bg-[#f168681f]",
    Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const leaveRequests = [
    {
        name: "John Doe",
        designation: "Assistant Professor",
        type: "Casual Leave",
        date: "Oct 24, 2023",
        duration: "1 Day",
        reason: "Personal work planned in advance for important matters.",
        status: "Pending",
    },
    {
        name: "Sarah Smith",
        designation: "Associate Professor",
        type: "Medical Leave",
        date: "Oct 18, 2023 - Oct 19, 2023",
        duration: "2 Days",
        reason: "Health consultation and recovery time needed.",
        status: "Approved",
    },
    {
        name: "Michael Johnson",
        designation: "Lab Instructor",
        type: "Vacation Leave",
        date: "Sep 28, 2023 - Oct 02, 2023",
        duration: "5 Days",
        reason: "Family trip request for vacation.",
        status: "Pending",
    },
    {
        name: "Emma Wilson",
        designation: "Assistant Professor",
        type: "On-Duty",
        date: "Sep 12, 2023",
        duration: "1 Day",
        reason: "External academic review meeting attendance.",
        status: "Approved",
    },
    {
        name: "David Brown",
        designation: "Associate Professor",
        type: "Compensation Leave",
        date: "Aug 30, 2023",
        duration: "1 Day",
        reason: "Compensation for weekend duty work.",
        status: "Pending",
    },
    {
        name: "Lisa Anderson",
        designation: "Assistant Professor",
        type: "Vacation Leave",
        date: "May 29, 2026 - May 30, 2026",
        duration: "2 Days",
        reason: "Summer vacation and relaxation time.",
        status: "Pending",
    },
];

// Custom Dropdown Component
const CustomDropdown = ({ placeholder = "Select", value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-8 w-full min-w-[140px] items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
            >
                <span className={value ? "text-white" : "text-[#6f839f]"}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                    <div className="max-h-[200px] overflow-y-auto table-custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-[12px] transition ${value === option
                                    ? "bg-[#2563EB] text-white"
                                    : "text-[#cad7eb] hover:bg-[#132b49]"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Filter Date Picker Component
const FilterDatePicker = ({
    id,
    value,
    onChange,
    placeholder = "Select date",
    popupAlign = "left",
    isOpen,
    onOpen,
    onClose,
}) => {
    const [viewDate, setViewDate] = useState(value || new Date());
    const [showAbove, setShowAbove] = useState(true);

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates = [];

        for (let index = 0; index < firstDay.getDay(); index += 1) {
            dates.push(null);
        }

        for (let day = 1; day <= lastDay.getDate(); day += 1) {
            dates.push(new Date(year, month, day));
        }

        return dates;
    }, [viewDate]);

    const moveMonth = (direction) => {
        setViewDate(
            (currentDate) =>
                new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
        );
    };

    const isSelectedDate = (date) =>
        value &&
        date &&
        value.getFullYear() === date.getFullYear() &&
        value.getMonth() === date.getMonth() &&
        value.getDate() === date.getDate();

    const handleSelectDate = (date) => {
        onChange(date);
        onClose();
    };

    const handleToggle = (e) => {
        if (!isOpen) {
            const buttonElement = e.currentTarget;
            const rect = buttonElement.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
            setShowAbove(spaceAbove > 320 || spaceBelow < 320);
            onOpen();
            return;
        }

        onClose();
    };

    return (
        <div className="relative">
            <button
                id={id}
                type="button"
                onClick={handleToggle}
                className="flex h-8 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
            >
                <span className={value ? "text-white" : "text-[#6f839f]"}>
                    {value ? formatDate(value) : placeholder}
                </span>
                <CalendarDays size={16} className="text-[#3984ff]" />
            </button>

            {isOpen && (
                <div
                    className={`absolute ${showAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
                        } z-[9999] w-[280px] rounded-lg border border-[#244061] bg-[#0a1a2d] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${popupAlign === "right" ? "right-0" : "left-0"
                        }`}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => moveMonth(-1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <p className="text-[13px] font-semibold text-white">
                            {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </p>
                        <button
                            type="button"
                            onClick={() => moveMonth(1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
                            aria-label="Next month"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {days.map((day) => (
                            <span
                                key={day}
                                className="py-1 text-[10px] font-semibold text-[#8ca1bd]"
                            >
                                {day}
                            </span>
                        ))}

                        {calendarDays.map((date, index) => (
                            <button
                                key={date ? date.toISOString() : `empty-${index}`}
                                type="button"
                                disabled={!date}
                                onClick={() => handleSelectDate(date)}
                                className={`h-8 rounded-md text-[12px] font-semibold transition ${isSelectedDate(date)
                                    ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                                    : "text-[#cad7eb] hover:bg-[#132b49] hover:text-white"
                                    } disabled:pointer-events-none disabled:opacity-0`}
                            >
                                {date?.getDate()}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const HodLeaveDetailsCanvas = ({ request, onClose, onRevoke }) => {
    if (!request) return null;

    const canRevoke = request.status === "Approved" || request.status === "Rejected";

    // Get color based on action status
    const getActionColor = (action) => {
        if (action?.toLowerCase() === "approved") {
            return { bg: "bg-emerald-800", text: "text-[#10b981]", light: "bg-[#10b98115]" };
        } else if (action?.toLowerCase() === "rejected") {
            return { bg: "bg-[#ef4444]", text: "text-[#ef4444]", light: "bg-[#ef444415]" };
        }
        return { bg: "bg-[#f59e0b]", text: "text-[#f59e0b]", light: "bg-[#f59e0b15]" };
    };

    // Get icon for action
    const getActionIcon = (action) => {
        switch (action?.toLowerCase()) {
            case "approved":
                return <CheckCircle2 size={18} />;
            case "rejected":
                return <AlertCircle size={18} />;
            case "submitted":
                return <Clock size={18} />;
            default:
                return <Clock size={18} />;
        }
    };

    return (
        <section
            className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="flex h-full w-[26%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
                            Leave Request
                        </p>
                        <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
                            Review Faculty Leave
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                        aria-label="Close leave request details"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
                    <p className="text-[12px] leading-5 text-[#b8c7dd]">
                        Review the request details, current status, and reason before taking an action.
                    </p>

                    <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <img src={userImg} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                                <div className="min-w-0">
                                    <p className="truncate text-[16px] font-semibold text-white">{request.name}</p>
                                    <p className="mt-1 truncate text-[12px] text-[#8ca1bd]">
                                        {request.designation}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${statusStyles[request.status]}`}
                            >
                                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                                {request.status}
                            </span>
                        </div>

                        <div className="my-3 h-px bg-[#1a3556]" />

                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]">
                                <Layers size={13} className="text-[#3984ff]" />
                                Leave Type
                            </div>
                            <p className="mt-1 text-[16px] font-semibold text-white">{request.type}</p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                                    <CalendarDays size={14} className="text-[#b8c7dd]" />
                                    Date
                                </div>
                                <p className="mt-1 text-[15px] font-medium text-white">{request.date}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                                    <TimerReset size={14} className="text-[#b8c7dd]" />
                                    Duration
                                </div>
                                <p className="mt-1 text-[15px] font-medium text-white">{request.duration}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                            <FileText size={15} className="text-[#3984ff]" />
                            Reason
                        </p>
                        <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
                            {request.reason}
                        </div>
                    </div>

                    {request.rejectionReason && (
                        <div className="mt-3">
                            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                                <FileText size={15} className="text-[#f16868]" />
                                Rejection Reason
                            </p>
                            <div className="rounded-lg border border-[#f1686833] bg-[#f1686812] px-4 py-3 text-[13px] leading-5 text-[#ffd1d1]">
                                {request.rejectionReason}
                            </div>
                        </div>
                    )}

                    {/* Approval Workflow */}
                    {request.approvalHistory && request.approvalHistory.length > 0 && (
                        <div className="mt-4 border-t border-gray-400/20 pt-4">
                            <p className="mb-3 flex items-center gap-2 text-[16px] text-white">
                                <ShieldCheck size={15} className="text-[#3984ff]" />
                                Approval Workflow
                            </p>

                            <div className="space-y-0">
                                {request.approvalHistory.map((history, index) => {
                                    const actionColor = getActionColor(history.action);
                                    const isLast = index === request.approvalHistory.length - 1;
                                    const isApproved = history.action?.toLowerCase() === "approved";
                                    const isRejected = history.action?.toLowerCase() === "rejected";

                                    return (
                                        <div key={index} className="relative">
                                            {/* Connector line */}
                                            {!isLast && (
                                                <div
                                                    className={`absolute left-[19px] top-[50px] w-[2px] h-[60px] ${isApproved ? "bg-[#10b981]" : isRejected ? "bg-[#ef4444]" : "bg-[#444c63]"
                                                        }`}
                                                />
                                            )}

                                            {/* Step content */}
                                            <div className="relative flex gap-3 pb-4">
                                                {/* Step circle */}
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isApproved
                                                            ? `${actionColor.bg} border-emerald-200/20`
                                                            : isRejected
                                                                ? `${actionColor.bg} border-[#ef4444]`
                                                                : `${actionColor.light} border-[#444c63]`
                                                            } text-white`}
                                                    >
                                                        {getActionIcon(history.action)}
                                                    </div>
                                                </div>

                                                {/* Step details */}
                                                <div className="flex-1 pt-0.5">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-[13px] font-semibold capitalize text-[#8ca1bd]">
                                                                {history.role}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full whitespace-nowrap ${isApproved
                                                                ? "bg-[#10b98120] text-[#10b981]"
                                                                : isRejected
                                                                    ? "bg-[#ef444420] text-[#ef4444]"
                                                                    : "bg-[#f59e0b20] text-[#f59e0b]"
                                                                }`}
                                                        >
                                                            {history.action}
                                                        </span>
                                                    </div>

                                                    <p className="text-[12px] text-[#cad7eb] mt-1">
                                                        {history.remarks}
                                                    </p>

                                                    {history.actionDate && (
                                                      <p className="text-[11px] text-[#6f839f] mt-1.5 flex items-center gap-1">
                                                        <Clock size={11} />
                                                        {new Date(history.actionDate).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                      </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
                    {canRevoke ? (
                        <button
                            type="button"
                            onClick={() => onRevoke(request)}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#f0a15f] text-[13px] font-semibold text-[#071425] shadow-[0_5px_20px_rgba(240,161,95,0.2)] transition hover:bg-[#ffbd7f]"
                        >
                            Revoke {request.status}
                            <RotateCcw size={14} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
                        >
                            Close Details
                            <Send size={14} />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

const ConfirmationPopup = ({
    action,
    request,
    reason,
    onReasonChange,
    onClose,
    onConfirm,
    revokeLoading,
}) => {
    if (!action || !request) return null;

    const isReject = action === "reject";
    const isRevoke = action === "revoke";
    const title = isReject ? "Reject Leave Request" : "Revoke Leave Decision";
    const message = isReject
        ? `Reject ${request.name}'s ${request.type}?`
        : `Revoke the ${request.status.toLowerCase()} decision for ${request.name}?`;

    return (
        <section
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[440px] rounded-xl border border-[#1d395e] bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
                            Confirmation
                        </p>
                        <h2 className="mt-1 text-[18px] font-semibold text-white">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                        aria-label="Close confirmation"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="px-5 py-4">
                    {/* <p className="text-[13px] leading-5 text-[#cad7eb]">{message}</p> */}

                    {isReject && (
                        <div className="">
                            <label
                                htmlFor="reject-reason"
                                className="mb-2 block text-[13px] font-semibold text-white"
                            >
                                Reason for rejection
                            </label>
                            <textarea
                                id="reject-reason"
                                value={reason}
                                onChange={(event) => onReasonChange(event.target.value)}
                                rows={4}
                                placeholder="Type the reason..."
                                className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-[#173150] px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={(isReject && !reason.trim()) || (isRevoke && revokeLoading)}
                        className={`h-10 rounded-md px-4 text-[16px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${isRevoke
                            ? "bg-[#f0a15f] text-[#071425] hover:bg-[#ffbd7f]"
                            : "bg-[#c44848] text-white hover:bg-[#d94f4f]"
                            }`}
                    >
                        {isRevoke && revokeLoading ? <div className="loader"></div> : (isRevoke ? "Revoke Decision" : "Reject Request")}
                    </button>
                </div>
            </div>
        </section>
    );
};

const HodLeaveRequestTable = ({ onCountChange }) => {

    // Auth 
    const token = getTokenFromLocalStorage();
    let decodedData = decodeToken(token);
    let dept = decodedData ? decodedData.department : null;
    console.log(decodedData);

    // States
    const [requests, setRequests] = useState([]);
    const [filterLeaveType, setFilterLeaveType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDate, setFilterDate] = useState(null);
    const [openDateFilter, setOpenDateFilter] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [approvingId, setApprovingId] = useState(null);
    const [revokeLoading, setRevokeLoading] = useState(false);

    // Get unique leave types
    const leaveTypes = ["All", ...new Set(requests.map((request) => request.type))];
    const statuses = ["All", "Approved", "Rejected", "Pending"];

    // Filter requests based on selected filters
    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const leaveTypeMatch = filterLeaveType === "All" || request.type === filterLeaveType;
            const statusMatch = filterStatus === "All" || request.status === filterStatus;

            // Parse request dates for comparison
            const requestFromDate = request.fromDate || request.from || (request.date ? new Date(request.date.split(" - ")[0]) : null);
            const filterDateCheck =
                !filterDate ||
                (requestFromDate && new Date(requestFromDate).toDateString() === filterDate.toDateString());

            return leaveTypeMatch && statusMatch && filterDateCheck;
        });
    }, [filterLeaveType, filterStatus, filterDate, requests]);

    const resetFilters = () => {
        setFilterLeaveType("All");
        setFilterStatus("All");
        setFilterDate(null);
        setOpenDateFilter(false);
    };

    const hasActiveFilters =
        filterLeaveType !== "All" || filterStatus !== "All" || filterDate;

    // Truncate reason text to specific length
    const truncateReason = (reason, maxLength = 40) => {
        if (reason.length > maxLength) {
            return reason.substring(0, maxLength) + "...";
        }
        return reason;
    };


    async function fetchLeaveRequests() {
        console.log("fetching req")
        const reponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/leave-application/?department=${dept}`, {
            headers: {
                Authorization: `Bearer ${getTokenFromLocalStorage()}`
            }
        });
        console.log(reponse.data);
        setRequests(reponse.data?.leaveApplications);
    }


    const handleApprove = async (request) => {
        console.log("request id:", request?._id);
        try {
            setApprovingId(request?._id);
            const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/leave-application/${request?._id}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${getTokenFromLocalStorage()}`
                }
            })
            console.log("leave approved : ", res);
            await fetchLeaveRequests();
            setApprovingId(null);
        } catch (error) {
            console.error("Error approving leave:", error);
            setApprovingId(null);
        }
    };

    const handleReject = (request) => {
        setRejectReason("");
        setConfirmation({ action: "reject", request });
    };

    const handleRevoke = (request) => {
        setConfirmation({ action: "revoke", request });
    };

    const handleView = (request) => {
        setSelectedRequest(request);
    };

    const closeConfirmation = () => {
        setConfirmation(null);
        setRejectReason("");
    };

    const handleConfirmAction = async () => {
        if (!confirmation) return;

        try {
            if (confirmation.action === "reject") {
                // Call API to reject leave
                await axios.patch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/leave-application/${confirmation.request?._id}/reject`,
                    { remarks: rejectReason.trim() },
                    {
                        headers: {
                            Authorization: `Bearer ${getTokenFromLocalStorage()}`
                        }
                    }
                );
                console.log("leave rejected");
            } else if (confirmation.action === "revoke") {
                // Call API to revoke leave decision
                setRevokeLoading(true);
                const res = await axios.patch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/leave-application/${confirmation.request?._id}/revoke-hod`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${getTokenFromLocalStorage()}`
                        }
                    }
                );
                console.log("leave decision revoked: ", res);
                setRevokeLoading(false);
            }

            // Refresh the table after action
            await fetchLeaveRequests();
            closeConfirmation();
        } catch (error) {
            console.error("Error confirming action:", error);
            setRevokeLoading(false);
        }
    };


    // format date 
    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    // Report count to parent whenever requests change
    useEffect(() => {
        if (typeof onCountChange === "function") {
            onCountChange(requests.length);
        }
    }, [requests.length, onCountChange]);

    // API calls ================================ 


    useEffect(() => {
        if (dept) {
            const run = async () => {
                await fetchLeaveRequests();
            };
            run();
        }
    }, [dept])
    return (
        <>
            <section className="rounded-xl border border-[#183052] bg-[#0a1a2d] mt-4">
                <div className="relative z-20 space-y-3 px-4 py-3 flex items-start justify-between">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[18px] font-semibold text-white">
                            Leave Requests <span>({filteredRequests.length})</span>
                        </h2>
                    </div>

                    <div className="filter-container">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Leave Type Filter */}
                            <div className="flex-shrink-0">
                                <CustomDropdown
                                    placeholder="Leave Type"
                                    value={filterLeaveType}
                                    onChange={setFilterLeaveType}
                                    options={leaveTypes}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex-shrink-0">
                                <CustomDropdown
                                    placeholder="Status"
                                    value={filterStatus}
                                    onChange={setFilterStatus}
                                    options={statuses}
                                />
                            </div>

                            {/* Date Filter */}
                            <div className="flex-shrink-0 min-w-[160px]">
                                <FilterDatePicker
                                    id="filter-date"
                                    value={filterDate}
                                    onChange={setFilterDate}
                                    placeholder="Select Date"
                                    isOpen={openDateFilter}
                                    onOpen={() => setOpenDateFilter(true)}
                                    onClose={() => setOpenDateFilter(false)}
                                />
                            </div>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="flex-shrink-0 h-11 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[12px] font-semibold text-[#8ca1bd] transition hover:bg-[#132b49] hover:text-white hover:border-[#3984ff]"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative z-0 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
                    <table className="w-full min-w-[900px] border-collapse text-left">
                        <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Name</th>
                                <th className="px-4 py-3 font-semibold">Leave Type</th>
                                <th className="px-4 py-3 font-semibold">From Date</th>
                                <th className="px-4 py-3 font-semibold">To Date</th>
                                <th className="px-4 py-3 font-semibold">Reason</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 text-right font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-[12px] text-[#cad7eb]">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request, index) => (
                                    <tr
                                        key={`${request.name}-${request.date}-${index}`}
                                        className="border-b border-[#132944] last:border-0"
                                    >
                                        <td className="px-4 py-2 font-semibold text-white f">
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    <img src={userImg} alt="" className="h-10 w-10 rounded-full object-cover" />
                                                </span>
                                                <div className="flex flex-col">
                                                    {request.facultyId?.firstName} {request.facultyId?.lastName}
                                                    <p className="text-[#8ca1bd]">{request.facultyId?.designation}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{request.leaveTypeId?.leaveName}</td>
                                        <td className="px-4 py-2">{formatDate(request.fromDate || request.from || request.date) || request.fromDate || request.from || request.date}</td>
                                        <td className="px-4 py-2">{formatDate(request.toDate || request.to || request.date) || request.toDate || request.to || request.date}</td>
                                        <td className="px-4 py-2 truncate max-w-[120px]" title={request.reason}>
                                            {request.reason}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[request.status]
                                                    }`}
                                            >
                                                <span className="h-[4px] w-[4px] rounded-full bg-current" />
                                                {request.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                                                {request.currentApprovalLevel === "hod" && request.status === "Pending" ? (
                                                    <>
                                                        {approvingId === request?._id ? <div className="loader"></div> : <button
                                                            type="button"
                                                            onClick={() => handleApprove(request)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white"
                                                            aria-label="Approve request"
                                                            title="Approve"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReject(request)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                                                            aria-label="Reject request"
                                                            title="Reject"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRevoke(request)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a15f12] text-[#f0a15f] transition hover:bg-[#f0a15f24] hover:text-white"
                                                        aria-label="Revoke leave decision"
                                                        title={`Revoke ${request.status}`}
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleView(request)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                                                    aria-label="View request details"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                                        No leave requests found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            <HodLeaveDetailsCanvas
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onRevoke={handleRevoke}
            />
            <ConfirmationPopup
                action={confirmation?.action}
                request={confirmation?.request}
                reason={rejectReason}
                onReasonChange={setRejectReason}
                onClose={closeConfirmation}
                onConfirm={handleConfirmAction}
                revokeLoading={revokeLoading}
            />
        </>
    );
};

export default HodLeaveRequestTable;
