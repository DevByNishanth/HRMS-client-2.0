import { useState, useEffect } from "react";
import { ChevronDown, FileText, Send, X, Upload } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import { getTokenFromLocalStorage } from "../utils/tokenUtils";

const dayOptions = ["Full Day", "First Half", "Second Half"];
const requiresFileUpload = ["medical", "maternity", "paternity"];
const backdateGraceDays = 2;

const getCurrentAcademicYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (month >= 7) {
        return `${year}-${year + 1}`;
    }

    return `${year - 1}-${year}`;
};

const getDateOnly = (date) => {
    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getMinimumApplyDate = () => {
    const minimumDate = getDateOnly(new Date());
    minimumDate.setDate(minimumDate.getDate() - backdateGraceDays);

    return minimumDate;
};

const calculateTotalLeaveDays = (fromDate, toDate, dayType) => {
    if (!fromDate || !toDate) return 0;

    const startDate = getDateOnly(fromDate);
    const endDate = getDateOnly(toDate);

    if (endDate < startDate) return 0;

    const oneDayInMs = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((endDate - startDate) / oneDayInMs) + 1;

    if (totalDays === 1 && dayType !== "Full Day") {
        return 0.5;
    }

    return totalDays;
};

const isCasualLeave = (leaveName = "") => leaveName.toLowerCase() === "casual leave";

const isFileUploadRequired = (leaveName = "") => {
    const normalizedLeaveName = leaveName.toLowerCase();

    return (
        normalizedLeaveName.startsWith("onduty")
        || requiresFileUpload.includes(normalizedLeaveName)
    );
};

const ApplyLeaveForm = ({ onClose, employee }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [leaveType, setLeaveType] = useState("");
    const [leaveTypeId, setLeaveTypeId] = useState("");
    const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);
    const [dayType, setDayType] = useState(dayOptions[0]);
    const [reason, setReason] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const minimumApplyDate = getMinimumApplyDate();


    // Fetch leave balance and types on component mount
    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const token = getTokenFromLocalStorage();
                if (!token) {
                    setError("Authentication token not found");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/leave-balance/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });


                if (!response.ok) {
                    throw new Error("Failed to fetch leave types");
                }

                const data = await response.json();
                const currentAcademicYear = getCurrentAcademicYear();
                const balanceData = data?.balances || [];
                const currentYearBalances = balanceData.filter(
                    (balance) => balance.academicYear === currentAcademicYear && balance.leaveTypeId
                );

                setLeaveTypes(currentYearBalances);
                setError("");
            } catch (err) {
                setError(err.message || "Failed to load leave types");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveTypes();
    }, [API_BASE_URL]);

    const validateForm = () => {
        const errors = {};

        if (!fromDate) errors.fromDate = "From date is required";
        if (!toDate) errors.toDate = "To date is required";

        if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
            errors.toDate = "To date must be after from date";
        }

        if (fromDate && getDateOnly(fromDate) < minimumApplyDate) {
            errors.fromDate = "Leave can be applied only within 2 days from today for past dates";
        }

        if (toDate && getDateOnly(toDate) < minimumApplyDate) {
            errors.toDate = "Leave can be applied only within 2 days from today for past dates";
        }

        if (!leaveTypeId) errors.leaveType = "Leave type is required";
        if (!dayType) errors.dayType = "Day type is required";
        if (!reason.trim()) errors.reason = "Reason is required";

        // Check if file upload is required
        const selectedLeaveType = leaveTypes.find(lt => lt.leaveTypeId?._id === leaveTypeId);
        const selectedLeaveName = selectedLeaveType?.leaveTypeId?.leaveName || "";
        const totalLeaveDays = calculateTotalLeaveDays(fromDate, toDate, dayType);

        if (selectedLeaveType && isCasualLeave(selectedLeaveName) && totalLeaveDays > 3) {
            errors.leaveType = "Casual leave is not applicable for more than 3 leaves. Apply LOP for remaining days.";
        }

        if (selectedLeaveType && isFileUploadRequired(selectedLeaveName)) {
            if (!uploadedFile) {
                errors.file = "File upload is mandatory for this leave type";
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setValidationErrors(prev => ({ ...prev, file: "" }));
        }
    };

    const formatDateToString = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const token = getTokenFromLocalStorage();
            if (!token) {
                setError("Authentication token not found");
                setSubmitting(false);
                return;
            }

            const formData = new FormData();
            formData.append("leaveTypeId", leaveTypeId);
            formData.append("fromDate", formatDateToString(fromDate));
            formData.append("toDate", formatDateToString(toDate));
            formData.append("leaveSession", dayType);
            formData.append("reason", reason);

            if (uploadedFile) {
                formData.append("files", uploadedFile);
            }

            const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || data?.error || "Failed to submit leave application");
            }

            // Success - reset form and close
            setFromDate(null);
            setToDate(null);
            setLeaveType("");
            setLeaveTypeId("");
            setDayType(dayOptions[0]);
            setReason("");
            setUploadedFile(null);
            setValidationErrors({});

            // Close the form after a short delay
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (err) {
            setError(err.message || "An error occurred while submitting the form");
        } finally {
            setSubmitting(false);
        }
    };

    const selectedLeaveType = leaveTypes.find(lt => lt.leaveTypeId?._id === leaveTypeId);
    const selectedLeaveName = selectedLeaveType?.leaveTypeId?.leaveName || "";
    const totalLeaveDays = calculateTotalLeaveDays(fromDate, toDate, dayType);
    const showFileUpload = selectedLeaveType && isFileUploadRequired(selectedLeaveName);
    const showCasualLeaveLimitMessage = isCasualLeave(selectedLeaveName) && totalLeaveDays > 3;

    if (loading) {
        return (
            <section
                className="fixed inset-0 z-50 flex justify-end bg-[#020817]/60 backdrop-blur-[4px]"
                onClick={onClose}
            >
                <div className="flex h-full w-[26%] min-w-[380px] flex-col items-center justify-center bg-[#071425]/">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3984ff] border-t-transparent"></div>
                    <p className="mt-4 text-[13px] text-[#8ca1bd]">Loading leave types...</p>
                </div>
            </section>
        );
    }

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
                                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239eb0cc' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' /><circle cx='12' cy='7' r='4' /></svg>
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
                            <div>
                                <CustomDatePicker
                                    id="leave-from-date"
                                    label="From"
                                    value={fromDate}
                                    onChange={(date) => {
                                        setFromDate(date);
                                        setValidationErrors(prev => ({ ...prev, fromDate: "" }));
                                    }}
                                    placeholder="From date"
                                    minDate={minimumApplyDate}
                                />
                                {validationErrors.fromDate && (
                                    <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.fromDate}</p>
                                )}
                            </div>

                            <div>
                                <CustomDatePicker
                                    id="leave-to-date"
                                    label="To"
                                    value={toDate}
                                    onChange={(date) => {
                                        setToDate(date);
                                        setValidationErrors(prev => ({ ...prev, toDate: "" }));
                                    }}
                                    placeholder="To date"
                                    popupAlign="right"
                                    minDate={minimumApplyDate}
                                />
                                {validationErrors.toDate && (
                                    <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.toDate}</p>
                                )}
                            </div>
                        </div>

                        {fromDate && toDate && (
                            <div className={`rounded-lg border px-3 py-2 text-[13px] ${showCasualLeaveLimitMessage
                                ? "border-[#f16868] bg-[#f168681f] text-[#f16868]"
                                : "border-[#244061] bg-[#0d2138] text-[#cad7eb]"
                                }`}>
                                Total Leave Days: <span className="font-semibold text-white">{totalLeaveDays}</span>
                                {showCasualLeaveLimitMessage && (
                                    <p className="mt-1 text-[12px] text-[#f16868]">
                                        Casual leave is not applicable for more than 3 leaves. Apply LOP for remaining days.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="relative">
                            <label htmlFor="leave-type" className="mb-2 block text-[13px] font-semibold text-white">
                                Select Leave Type {validationErrors.leaveType && <span className="text-[#f16868]">*</span>}
                            </label>
                            <button
                                id="leave-type"
                                type="button"
                                onClick={() => setIsLeaveTypeOpen((currentState) => !currentState)}
                                className={`flex h-11 w-full items-center justify-between rounded-lg border px-3 text-left text-[13px] outline-none transition ${validationErrors.leaveType
                                    ? "border-[#f16868] bg-[#f168681f]"
                                    : "border-[#244061] bg-[#0d2138] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                                    } text-white`}
                            >
                                <span className={leaveType ? "text-white" : "text-[#6f839f]"}>
                                    {leaveType ? `${leaveType} (Balance: ${selectedLeaveType?.remainingDays || 0})` : "Choose leave type"}
                                </span>
                                <ChevronDown size={16} className="text-[#3984ff]" />
                            </button>

                            {validationErrors.leaveType && (
                                <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.leaveType}</p>
                            )}

                            {isLeaveTypeOpen && (
                                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                                    {leaveTypes.length === 0 ? (
                                        <div className="px-4 py-3 text-[13px] text-[#6f839f]">
                                            No leave types available
                                        </div>
                                    ) : (
                                        leaveTypes.map((type) => {
                                            const typeId = type.leaveTypeId?._id;
                                            const leaveName = type.leaveTypeId?.leaveName || "Unnamed Leave";
                                            const remainingDays = type.remainingDays || 0;
                                            const isLOP = leaveName.toLowerCase().includes("lop") || leaveName.toLowerCase().includes("loss of pay");
                                            const isDisabled = (remainingDays === 0 && !isLOP) || !typeId;
                                            return (
                                                <button
                                                    key={type._id}
                                                    type="button"
                                                    disabled={isDisabled}
                                                    onClick={() => {
                                                        if (!isDisabled) {
                                                            setLeaveType(leaveName);
                                                            setLeaveTypeId(typeId);
                                                            setIsLeaveTypeOpen(false);
                                                            setValidationErrors(prev => ({ ...prev, leaveType: "" }));
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between w-full px-4 py-3 text-left text-[13px] transition ${isDisabled
                                                        ? "cursor-not-allowed bg-[#0a1a2d] text-[#4f5f7f] opacity-50"
                                                        : leaveTypeId === typeId
                                                            ? "bg-[#132b49] text-white"
                                                            : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                                                        }`}
                                                >
                                                    {leaveName}  <span className="bg-gray-700/20 px-1.5 py-[2px] rounded">{remainingDays}
                                                    </span>                                                 </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className={`mb-2 text-[13px] font-semibold ${validationErrors.dayType ? "text-[#f16868]" : "text-white"}`}>
                                Day Type {validationErrors.dayType && <span>*</span>}
                            </p>
                            <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#244061] bg-[#0d2138] p-1.5">
                                {dayOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setDayType(option);
                                            setValidationErrors(prev => ({ ...prev, dayType: "" }));
                                        }}
                                        className={`h-9 rounded-md text-[12px] font-semibold transition ${dayType === option
                                            ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                                            : "text-[#9eb0cc] hover:bg-[#132b49] hover:text-white"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {validationErrors.dayType && (
                                <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.dayType}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="leave-reason"
                                className={`mb-2 flex items-center gap-2 text-[13px] font-semibold ${validationErrors.reason ? "text-[#f16868]" : "text-white"}`}
                            >
                                <FileText size={15} className="text-[#3984ff]" />
                                Reason {validationErrors.reason && <span>*</span>}
                            </label>
                            <textarea
                                id="leave-reason"
                                rows={4}
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setValidationErrors(prev => ({ ...prev, reason: "" }));
                                }}
                                placeholder="Add reason for your leave request..."
                                className={`w-full resize-none rounded-lg border px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] ${validationErrors.reason
                                    ? "border-[#f16868] bg-[#f168681f]"
                                    : "border-[#244061] bg-[#0d2138] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                                    }`}
                            />
                            {validationErrors.reason && (
                                <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.reason}</p>
                            )}
                        </div>

                        {/* File Upload - Conditional */}
                        {showFileUpload && (
                            <div>
                                <label className={`mb-2 flex items-center gap-2 text-[13px] font-semibold ${validationErrors.file ? "text-[#f16868]" : "text-white"}`}>
                                    <Upload size={15} className="text-[#3984ff]" />
                                    Upload Document {validationErrors.file && <span>*</span>}
                                </label>
                                <div className={`relative rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${validationErrors.file
                                    ? "border-[#f16868] bg-[#f168681f]"
                                    : "border-[#244061] bg-[#0d2138] hover:border-[#3984ff]"
                                    }`}>
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="pointer-events-none">
                                        <Upload size={24} className="mx-auto mb-2 text-[#3984ff]" />
                                        <p className="text-[12px] text-[#cad7eb]">
                                            {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-[11px] text-[#6f839f]">PDF, DOC, DOCX (Max 5MB)</p>
                                    </div>
                                </div>
                                {validationErrors.file && (
                                    <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.file}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 rounded-lg bg-[#f168681f] border border-[#f16868] px-4 py-3 text-[13px] text-[#f16868]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Leave Request"}
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ApplyLeaveForm;

