import { useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    ClockArrowDown,
    ClockArrowUp,
    File,
    FileText,
    Paperclip,
    Send,
    TimerReset,
    UploadCloud,
    X,
    Loader2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";

const statusStyles = {
    Present: "text-[#18d3bf] bg-[#18d3bf1f]",
    "Partially Present": "text-[#f0a15f] bg-[#f0a15f1f]",
    "Second Half Leave": "text-[#f0a15f] bg-[#f0a15f1f]",
    Absent: "text-[#f16868] bg-[#f168681f]",
    "On Leave": "text-[#f16868] bg-[#f168681f]",
    Holiday: "text-[#3984ff] bg-[#3984ff1f]",
    "On Duty": "text-[#3984ff] bg-[#3984ff1f]",
};

const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatMinutesToHours = (minutes) => {
    if (minutes == null) return "--";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
};

const formatTime = (dateStr) => {
    if (!dateStr) return "--";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDateFromISO = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const ReqularizationCanvas = ({ log, onClose }) => {
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const attachmentsRef = useRef([]);

    useEffect(() => {
        attachmentsRef.current = attachments;
    }, [attachments]);

    useEffect(() => {
        return () => {
            attachmentsRef.current.forEach((attachment) => URL.revokeObjectURL(attachment.preview));
        };
    }, []);

    if (!log) return null;

    const statusColor = statusStyles[log.status] || "text-[#f0a15f] bg-[#f0a15f1f]";
    const displayDate = formatDateFromISO(log.checkIn);
    const displayCheckIn = formatTime(log.checkIn);
    const displayCheckOut = formatTime(log.checkOut);
    const displayHours = formatMinutesToHours(log.workingHours);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Clear previous errors
        setFormError("");
        setFieldErrors({});

        if (!reason.trim()) {
            setFieldErrors({ reason: "Please provide a reason for regularization." });
            return;
        }

        setSubmitting(true);

        try {
            const token = getTokenFromLocalStorage();
            if (!token) {
                setFormError("Authentication token not found. Please log in again.");
                setSubmitting(false);
                return;
            }

            // Extract the date (YYYY-MM-DD) from the checkIn timestamp
            const checkInDate = new Date(log.checkIn);
            const attendanceDate = checkInDate.toISOString().split("T")[0];

            const formData = new FormData();
            formData.append("attendanceDate", attendanceDate);
            formData.append("requestedInTime", log.checkIn);
            formData.append("requestedOutTime", log.checkOut);
            formData.append("reason", reason.trim());

            // Append all attachment files
            attachments.forEach(({ file }) => {
                formData.append("attachments", file);
            });

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";
            const res = await fetch(
                `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                },
            );

            const data = await res.json();

            if (res.ok && data?.success) {
                toast.success("Regularization request submitted successfully!");
                setReason("");
                setFormError("");
                setFieldErrors({});
                setTimeout(() => onClose(), 2000);
            } else {
                // Extract field-level errors if available
                const serverFieldErrors = {};
                if (data?.errors && typeof data.errors === "object") {
                    Object.entries(data.errors).forEach(([key, value]) => {
                        serverFieldErrors[key] = typeof value === "string" ? value : Array.isArray(value) ? value.join(", ") : String(value);
                    });
                }

                setFormError(data?.message || data?.error || "Failed to submit regularization request.");
                setFieldErrors(serverFieldErrors);
            }
        } catch (err) {
            console.error("Error submitting regularization:", err);
            setFormError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleFilesChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []).map((file) => ({
            id: `${file.name}-${file.lastModified}-${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        setAttachments((currentFiles) => [...currentFiles, ...selectedFiles]);
        event.target.value = "";
    };

    const removeAttachment = (id) => {
        setAttachments((currentFiles) => {
            const removedFile = currentFiles.find((attachment) => attachment.id === id);
            if (removedFile) URL.revokeObjectURL(removedFile.preview);
            return currentFiles.filter((attachment) => attachment.id !== id);
        });
    };

    return (
        <section
            className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]"
            onClick={() => { onClose(); setFormError(""); setReason("") }}
        >
            <form
                className="flex h-full w-[26%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
                            Regularization Request
                        </p>
                        <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
                            Review Logged Hours
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => { onClose(); setFormError(""); setReason("") }}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                        aria-label="Close regularization form"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">


                    <p className="text-[12px] leading-5 text-[#b8c7dd]">
                        Please review your logged hours for the selected date to identify any
                        discrepancies before submitting your regularization request.
                    </p>

                    <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]">
                                    <CalendarDays size={13} className="text-[#3984ff]" />
                                    Date
                                </div>
                                <p className="mt-1 text-[16px] font-semibold text-white">{displayDate}</p>
                            </div>

                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${statusColor}`}
                            >
                                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                                {log.status}
                            </span>
                        </div>

                        <div className="my-3 h-px bg-[#1a3556]" />

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                                    <ClockArrowDown size={14} className="text-[#b8c7dd]" />
                                    Check-in
                                </div>
                                <p className="mt-1 text-[15px] font-medium text-white">{displayCheckIn}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                                    <ClockArrowUp size={14} className="text-[#b8c7dd]" />
                                    Check-out
                                </div>
                                <p className="mt-1 text-[15px] font-medium text-white">{displayCheckOut}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                                    <TimerReset size={18} />
                                </div>
                                <p className="text-[13px] font-medium text-[#cad7eb]">Working Hours</p>
                            </div>
                            <p
                                className={`text-[15px] font-semibold ${log.workingHours == null ? "text-[#f16868]" : "text-white"}`}
                            >
                                {displayHours}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3">
                        <label
                            htmlFor="regularization-reason"
                            className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white"
                        >
                            <FileText size={15} className="text-[#3984ff]" />
                            Reasong for Regularization
                        </label>                            <textarea
                            id="regularization-reason"
                            rows={3}
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (fieldErrors.reason) {
                                    setFieldErrors((prev) => ({ ...prev, reason: "" }));
                                }
                            }}
                            placeholder="Explain the discrepancy..."
                            className={`w-full resize-none rounded-lg border px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:ring-2 ${fieldErrors.reason
                                ? "border-[#ef4444] bg-[#0d2138] focus:border-[#ef4444] focus:ring-[#ef4444]/20"
                                : "border-[#244061] bg-[#0d2138] focus:border-[#3984ff] focus:ring-[#3984ff33]"
                                }`}
                        />
                        {fieldErrors.reason && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#ef4444]">
                                <AlertCircle size={12} />
                                {fieldErrors.reason}
                            </p>
                        )}
                    </div>

                    <div className="mt-3">
                        <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                            <Paperclip size={15} className="text-[#3984ff]" />
                            Attach Files
                        </p>
                        <label
                            htmlFor="regularization-files"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#345276] bg-[#0d2138] px-4 py-3 text-center transition hover:border-[#3984ff] hover:bg-[#102640]"
                        >
                            <UploadCloud size={22} className="text-[#6ea1ff]" />
                            <span className="mt-2 text-[13px] font-semibold text-white">
                                Click to upload supporting files
                            </span>
                            <span className="mt-1 text-[11px] text-[#8ca1bd]">
                                Images, PDF, or documents
                            </span>
                            <input
                                id="regularization-files"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFilesChange}
                            />
                        </label>

                        {attachments.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 gap-2">
                                {attachments.map((attachment) => {
                                    const isImage = attachment.file.type.startsWith("image/");

                                    return (
                                        <div
                                            key={attachment.id}
                                            className="flex items-center gap-3 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-2"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#132b49] text-[#6ea1ff]">
                                                {isImage ? (
                                                    <img
                                                        src={attachment.preview}
                                                        alt={attachment.file.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <File size={18} />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12px] font-semibold text-white">
                                                    {attachment.file.name}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-[#8ca1bd]">
                                                    {formatFileSize(attachment.file.size)}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(attachment.id)}
                                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                                                aria-label={`Remove ${attachment.file.name}`}
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>

                <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
                    {formError && (
                        <div className="mb-3  mt-4 flex items-start gap-3 rounded-lg border border-[#ef4444]/40 bg-[#ef4444]/10 px-4 py-3">
                            <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#ef4444]" />
                            <p className="text-[13px] leading-5 text-[#ef4444]">{formError}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit Request
                                <Send size={14} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="!rounded-lg !text-[13px] !font-medium !shadow-lg"
            />
        </section>
    );
};

export default ReqularizationCanvas;
