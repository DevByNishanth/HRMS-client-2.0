import { useState, useEffect, useMemo } from "react";
import { Clock3, FileText, Send, X } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import CustomDropdown from "./CustomDropdown";
import { getFacultyIdFromToken, getTokenFromLocalStorage } from "../utils/tokenUtils";

const sessionOptions = ["Forenoon", "Afternoon"];
const durationOptions = ["1 Hour", "2 Hours"];
const permissionTypeOptions = ["Personal", "Official", "Medical", "Urgent"];

const slotDefinitions = {
  Forenoon: {
    "1 Hour": [
      { label: "8:40 AM - 9:40 AM", key: "8:40-9:40", fromTime: "08:40", toTime: "09:40" },
      { label: "9:40 AM - 10:40 AM", key: "9:40-10:40", fromTime: "09:40", toTime: "10:40" },
    ],
    "2 Hours": [
      { label: "8:40 AM - 10:40 AM", key: "8:40-10:40", fromTime: "08:40", toTime: "10:40" },
    ],
  },
  Afternoon: {
    "1 Hour": [
      { label: "2:10 PM - 3:10 PM", key: "14:10-15:10", fromTime: "14:10", toTime: "15:10" },
      { label: "3:10 PM - 4:10 PM", key: "15:10-16:10", fromTime: "15:10", toTime: "16:10" },
    ],
    "2 Hours": [
      { label: "2:10 PM - 4:10 PM", key: "14:10-16:10", fromTime: "14:10", toTime: "16:10" },
    ],
  },
};

const formatDateToString = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const calculateEndTime = (fromTime, totalMinutes) => {
    if (!fromTime) return "";
    const [hour, minute] = fromTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hour, minute, 0, 0);
    startDate.setMinutes(startDate.getMinutes() + totalMinutes);
    const endHour = String(startDate.getHours()).padStart(2, "0");
    const endMinute = String(startDate.getMinutes()).padStart(2, "0");
    return `${endHour}:${endMinute}`;
};

const getDefaultFromTime = (session) => {
    return session === "Afternoon" ? "14:00" : "09:00";
};

const formatTo12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
};

const ApplyPermission = ({ onClose, employee, remainingPermission = null, onPermissionSubmitted }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

    const [date, setDate] = useState(null);
    const [session, setSession] = useState(sessionOptions[0]);
    const [duration, setDuration] = useState(durationOptions[0]);
    const [permissionType, setPermissionType] = useState(permissionTypeOptions[0]);
    const [selectedSlotKey, setSelectedSlotKey] = useState(null);
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const availableSlots = slotDefinitions[session]?.[duration] || [];

    const effectiveSlot = useMemo(() => {
      if (!selectedSlotKey || !availableSlots.some(s => s.key === selectedSlotKey)) {
        return availableSlots[0];
      }
      return availableSlots.find(s => s.key === selectedSlotKey);
    }, [selectedSlotKey, availableSlots]);

    const totalMinutes = duration === "2 Hours" ? 120 : 60;
    const fromTime = effectiveSlot?.fromTime || getDefaultFromTime(session);
    const toTime = effectiveSlot?.toTime || calculateEndTime(fromTime, totalMinutes);
    const remainingMinutes = remainingPermission !== null ? remainingPermission * 60 : null;

    useEffect(() => {
      setSelectedSlotKey(null);
    }, [session, duration]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!date) {
            setError("Please select a permission date.");
            return;
        }

        if (remainingMinutes !== null && totalMinutes > remainingMinutes) {
            const availableHours = Math.floor(remainingMinutes / 60);
            setError(
                `You only have ${availableHours} hour${availableHours === 1 ? "" : "s"} remaining this month. ` +
                "Choose a shorter duration or contact your administrator."
            );
            return;
        }

        if (!reason.trim()) {
            setError("Please provide a reason for the permission request.");
            return;
        }

        setSubmitting(true);

        try {
            const token = getTokenFromLocalStorage();
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }

            const facultyId = getFacultyIdFromToken();
            if (!facultyId) {
                throw new Error("Unable to read faculty ID from token.");
            }

            const payload = {
                facultyId,
                permissionDate: formatDateToString(date),
                permissionType,
                slot: effectiveSlot?.key || "",
                fromTime,
                toTime,
                totalMinutes,
                reason: reason.trim(),
            };

            const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/permissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || "Failed to submit permission request.");
            }

            setDate(null);
            setSession(sessionOptions[0]);
            setDuration(durationOptions[0]);
            setPermissionType(permissionTypeOptions[0]);
            setReason("");

            if (typeof onPermissionSubmitted === "function") {
                onPermissionSubmitted();
            }
            setTimeout(() => onClose(), 500);
        } catch (err) {
            setError(err.message || "An error occurred while submitting your permission request.");
        } finally {
            setSubmitting(false);
        }
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
                            Permission Request
                        </p>
                        <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
                            {employee ? `Apply Permission for ${employee.name}` : 'Apply Permission'}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                        aria-label="Close permission form"
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
                                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239eb0cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' className='h-5 w-5'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' /><circle cx='12' cy='7' r='4' /></svg>
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
                            ? `Choose the permission date, session, duration, and provide the reason for ${employee.name}'s approval.`
                            : 'Choose the permission date, session, duration, and provide the reason for approval.'
                        }
                    </p>
                    <p className="mt-2 text-[12px] text-[#9eb0cc]">
                        {remainingPermission === null
                            ? 'Loading available permission hours...'
                            : `Available this month: ${remainingPermission} hour${remainingPermission === 1 ? '' : 's'}`}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                        <CustomDatePicker
                            id="permission-date"
                            label="Date"
                            value={date}
                            onChange={setDate}
                            placeholder="Select permission date"
                        />

                        <CustomDropdown
                            id="permission-type"
                            label="Permission Type"
                            options={permissionTypeOptions}
                            value={permissionType}
                            onChange={setPermissionType}
                            placeholder="Select permission type"
                        />

                        <div>
                            <p className="mb-2 text-[13px] font-semibold text-white">Session</p>
                            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#244061] bg-[#0d2138] p-1.5">
                                {sessionOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setSession(option)}
                                        className={`h-10 rounded-md text-[12px] font-semibold transition ${session === option
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
                            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                                <Clock3 size={15} className="text-[#3984ff]" />
                                Duration
                            </p>
                            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#244061] bg-[#0d2138] p-1.5">
                                {durationOptions.map((option) => {
                                    const optionMinutes = option === "2 Hours" ? 120 : 60;
                                    const disabled = remainingMinutes !== null && optionMinutes > remainingMinutes;

                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => !disabled && setDuration(option)}
                                            disabled={disabled}
                                            className={`h-10 rounded-md text-[12px] font-semibold transition ${duration === option
                                                ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                                                : "text-[#9eb0cc] hover:bg-[#132b49] hover:text-white"
                                                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Slot Selection - only visible for 1 Hour duration */}
                        {duration === "1 Hour" && availableSlots.length > 0 && (
                          <CustomDropdown
                            id="permission-slot"
                            label="Time Slot"
                            options={availableSlots.map(s => s.label)}
                            value={effectiveSlot?.label || ""}
                            onChange={(label) => {
                              const slot = availableSlots.find(s => s.label === label);
                              if (slot) setSelectedSlotKey(slot.key);
                            }}
                            placeholder="Select a time slot"
                          />
                        )}

                        <div className="rounded-lg border border-[#244061] bg-[#0d2138] p-4 text-[#cbd5e1]">
                            <p className="mb-2 text-[13px] font-semibold text-white">Time Summary</p>
                            <div className="grid gap-2 text-[13px]">
                                <div className="flex justify-between">
                                    <span>From</span>
                                    <span>{formatTo12Hour(fromTime)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>To</span>
                                    <span>{formatTo12Hour(toTime)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total minutes</span>
                                    <span>{totalMinutes}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="permission-reason"
                                className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white"
                            >
                                <FileText size={15} className="text-[#3984ff]" />
                                Reason for Permission
                            </label>
                            <textarea
                                id="permission-reason"
                                rows={6}
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                                placeholder="Explain why you need permission..."
                                className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                            />
                        </div>


                    </div>
                </div>

                <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4 ">
                    {error && (
                        <div className="rounded-md border border-red-500 bg-[#631a1a] p-3 text-sm text-red-100 mb-2">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition ${submitting ? "bg-[#1b3a66] cursor-not-allowed" : "bg-[#2563EB] hover:bg-[#1049c4]"}`}
                    >
                        {submitting ? "Submitting..." : "Submit Permission Request"}
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ApplyPermission;
