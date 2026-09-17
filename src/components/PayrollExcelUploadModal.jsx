import { useState, useRef } from "react";
import {
  X,
  FileUp,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const years = Array.from({ length: 10 }, (_, i) => 2026 - i);

function SelectDropdown({ label, value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-[13px] font-semibold text-white">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:border-[#3984ff]/50 focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#8ca1bd] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-[#183052] bg-[#0d2138] p-1 shadow-lg">
          {options.map((option) => {
            const optValue = typeof option === "object" ? option.value : option;
            const optLabel = typeof option === "object" ? option.label : option;
            const isSelected = value === optLabel;
            return (
              <button
                key={optValue}
                type="button"
                onClick={() => {
                  onChange(optLabel);
                  setOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition hover:bg-[#183052]/40 ${
                  isSelected
                    ? "bg-[#0b50b1] font-medium text-white"
                    : "text-[#cad7eb]"
                }`}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const PayrollExcelUploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [payrollMonth, setPayrollMonth] = useState("");
  const [payrollYear, setPayrollYear] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const allowedExtensions = [".xlsx", ".xls", ".csv"];

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const ext = "." + selectedFile.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setUploadStatus({
        type: "error",
        message:
          "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.",
      });
      return false;
    }
    // Max 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadStatus({
        type: "error",
        message: "File size exceeds 5MB. Please upload a smaller file.",
      });
      return false;
    }
    setUploadStatus({ type: "", message: "" });
    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    // Validate month & year
    if (!payrollMonth) {
      setUploadStatus({ type: "error", message: "Please select a payroll month." });
      return;
    }
    if (!payrollYear) {
      setUploadStatus({ type: "error", message: "Please select a payroll year." });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("hrms_token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("payrollMonth", months.find((m) => m.label === payrollMonth)?.value);
      formData.append("payrollYear", payrollYear);

      const response = await axios.post(
        `${API_BASE_URL}/api/payroll/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadStatus({
        type: "success",
        message: response.data?.message || "File uploaded successfully!",
      });

      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Upload failed. Please try again.";
      setUploadStatus({ type: "error", message: errMsg });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus({ type: "", message: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020817]/60  px-4 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-xl border border-[#1d395e] bg-[#0a1a2d]/20 backdrop-blur-2xl shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Upload Payroll
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-white">
              Upload Excel File
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close upload modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-[13px] leading-5 text-[#cad7eb]">
            Upload an Excel or CSV file containing payroll data. The file should
            include employee IDs and salary details.
          </p>

          {/* Month & Year Selection */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SelectDropdown
              label="Payroll Month"
              value={payrollMonth}
              options={months}
              onChange={setPayrollMonth}
              placeholder="Select month"
            />
            <SelectDropdown
              label="Payroll Year"
              value={payrollYear}
              options={years}
              onChange={setPayrollYear}
              placeholder="Select year"
            />
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 transition ${
              isDragOver
                ? "border-[#3984ff] bg-[#3984ff10]"
                : file
                  ? "border-[#26d39a]/40 bg-[#26d39a08]"
                  : "border-[#125baf] bg-[#0d2138]/70 hover:border-[#3984ff]/50 hover:bg-[#0d2138]/80"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleInputChange}
              className="hidden"
            />

            {file ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26d39a15]">
                  <CheckCircle size={24} className="text-[#26d39a]" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium text-white">
                    {file.name}
                  </p>
                  <p className="mt-1 text-[12px] text-[#8ca1bd]">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="mt-1 inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#f16868] transition hover:bg-[#f1686815]"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3984ff12]">
                  <FileUp size={24} className="text-[#3984ff]" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium text-white">
                    Drag & drop your file here
                  </p>
                  <p className="mt-1 text-[12px] text-[#8ca1bd]">
                    or{" "}
                    <span className="font-semibold text-[#3984ff]">
                      browse files
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-[#6f839f]">
                  Supports .xlsx, .xls, .csv — Max 5MB
                </p>
              </>
            )}
          </div>

          {/* Status message */}
          {uploadStatus.message && (
            <div
              className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 ${
                uploadStatus.type === "error"
                  ? "border-[#f1686833] bg-[#f1686812]"
                  : "border-[#26d39a33] bg-[#26d39a12]"
              }`}
            >
              {uploadStatus.type === "error" ? (
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-[#f16868]"
                />
              ) : (
                <CheckCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-[#26d39a]"
                />
              )}
              <p
                className={`text-[12px] leading-5 ${
                  uploadStatus.type === "error"
                    ? "text-[#ffd1d1]"
                    : "text-[#a8f0d8]"
                }`}
              >
                {uploadStatus.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#173150] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || !payrollMonth || !payrollYear || isUploading}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2563EB] px-4 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1a4fc9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={15} />
                Upload File
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PayrollExcelUploadModal;
