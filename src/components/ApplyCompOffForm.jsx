import { useState, useEffect } from "react";
import { FileText, Send, X, Upload, CalendarDays, File } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import { getTokenFromLocalStorage } from "../utils/tokenUtils";
import { jwtDecode } from "jwt-decode";

const calculateNoOfDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;

    const startDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const endDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

    if (endDate < startDate) return 0;

    const oneDayInMs = 24 * 60 * 60 * 1000;
    return Math.floor((endDate - startDate) / oneDayInMs) + 1;
};

const ApplyCompOffForm = ({ onClose, onSuccess }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [reason, setReason] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [employee, setEmployee] = useState(null);

    // Decode token to get employee details
    useEffect(() => {
        try {
            const token = getTokenFromLocalStorage();
            if (token) {
                const decoded = jwtDecode(token);
                setEmployee({
                    name: `${decoded?.firstName || ""} ${decoded?.lastName || ""}`.trim() || "Employee",
                    role: decoded?.role || "Faculty",
                    empid: decoded?.empid || decoded?.employeeCode || decoded?.facultyId || "",
                });
            }
        } catch (err) {
            console.error("Failed to decode token:", err);
        }
    }, []);

    const noOfDays = calculateNoOfDays(fromDate, toDate);

    const validateForm = () => {
        const errors = {};

        if (!fromDate) errors.fromDate = "From date is required";
        if (!toDate) errors.toDate = "To date is required";

        if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
            errors.toDate = "To date must be after from date";
        }

        if (!reason.trim()) errors.reason = "Reason is required";

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
            formData.append("workedFromDate", formatDateToString(fromDate));
            formData.append("workedToDate", formatDateToString(toDate));
            formData.append("reason", reason);
            formData.append("compOffDays", noOfDays);

            if (uploadedFile) {
                formData.append("files", uploadedFile);
            }

            const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/comp-off/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || data?.error || "Failed to submit comp off application");
            }

            // Success - reset form and close
            setFromDate(null);
            setToDate(null);
            setReason("");
            setUploadedFile(null);
            setValidationErrors({});

            // Close the form after a short delay
            setTimeout(() => {
                onClose();
                if (typeof onSuccess === "function") onSuccess();
            }, 500);
        } catch (err) {
            setError(err.message || "An error occurred while submitting the form");
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
                            Comp Off Request
                        </p>
                        <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
                            Apply Comp Off</h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                        aria-label="Close comp off form"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 table-custom-scrollbar">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 rounded-lg bg-[#f168681f] border border-[#f16868] px-4 py-3 text-[13px] text-[#f16868]">
                            {error}
                        </div>
                    )}



                    <p className="text-[13px] leading-5 text-[#b8c7dd]">
                        Select the worked dates, add reason, and upload supporting documents for comp off approval.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <CustomDatePicker
                                    id="comp-off-from-date"
                                    label="Worked From"
                                    value={fromDate}
                                    onChange={(date) => {
                                        setFromDate(date);
                                        setValidationErrors(prev => ({ ...prev, fromDate: "" }));
                                    }}
                                    placeholder="From date"
                                />
                                {validationErrors.fromDate && (
                                    <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.fromDate}</p>
                                )}
                            </div>

                            <div>
                                <CustomDatePicker
                                    id="comp-off-to-date"
                                    label="Worked To"
                                    value={toDate}
                                    onChange={(date) => {
                                        setToDate(date);
                                        setValidationErrors(prev => ({ ...prev, toDate: "" }));
                                    }}
                                    placeholder="To date"
                                    popupAlign="right"
                                />
                                {validationErrors.toDate && (
                                    <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.toDate}</p>
                                )}
                            </div>
                        </div>

                        {/* No of Days - Display Only */}
                        {fromDate && toDate && (
                            <div className="flex items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-3">
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={15} className="text-[#3984ff]" />
                                    <span className="text-[13px] text-[#cad7eb]">No of Days</span>
                                </div>
                                <span className="text-[15px] font-semibold text-white">{noOfDays} day{noOfDays !== 1 ? "s" : ""}</span>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="comp-off-reason"
                                className={`mb-2 flex items-center gap-2 text-[13px] font-semibold ${validationErrors.reason ? "text-[#f16868]" : "text-white"}`}
                            >
                                <FileText size={15} className="text-[#3984ff]" />
                                Reason {validationErrors.reason && <span>*</span>}
                            </label>
                            <textarea
                                id="comp-off-reason"
                                rows={4}
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setValidationErrors(prev => ({ ...prev, reason: "" }));
                                }}
                                placeholder="Add reason for your comp off request..."
                                className={`w-full resize-none rounded-lg border px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] ${validationErrors.reason
                                    ? "border-[#f16868] bg-[#f168681f]"
                                    : "border-[#244061] bg-[#0d2138] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                                    }`}
                            />
                            {validationErrors.reason && (
                                <p className="mt-1 text-[11px] text-[#f16868]">{validationErrors.reason}</p>
                            )}
                        </div>

                        {/* File Upload - Always visible */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                                <Upload size={15} className="text-[#3984ff]" />
                                Upload Document
                            </label>
                            <div className="relative rounded-lg border-2 border-dashed border-[#244061] bg-[#0d2138] px-4 py-6 text-center transition hover:border-[#3984ff]">
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="pointer-events-none">
                                    <Upload size={24} className="mx-auto mb-2 text-[#3984ff]" />

                                    <p className="text-[11px] text-[#6f839f]">PDF, DOC, DOCX, Image (Max 5MB)</p>
                                </div>
                            </div>

                            {uploadedFile && <div className="preview-container mt-2 py-2 px-3 bg-blue-800/30 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <File className="text-white" />
                                    <p className="text-[12px] text-white">
                                        {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                                    </p>
                                </div>
                                <X className="text-red-400 hover:text-red-500 cursor-pointer " />
                            </div>}


                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Comp Off Request"}
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ApplyCompOffForm;
