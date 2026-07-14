import { useRef, useState } from "react";
import { FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";

const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];
const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const BulkUploadCanvas = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    const extension = "." + selectedFile.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError("Invalid file type. Only Excel files (.xlsx, .xls) are allowed.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleInputChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an Excel file to upload.");
      return;
    }

    const token = localStorage.getItem("hrms_token");
    if (!token) {
      setError("Login token is missing. Please sign in again.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("faculties", file);

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/import-faculty`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to upload file.",
        );
      }

      toast.success(data?.message || "Faculty data imported successfully.");
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-[80%] md:w-[45%] xl:w-[38%] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#173150] bg-[#08182a] px-5 py-4">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a9c7ff]">
                BULK UPLOAD
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-tight text-[#e4e9ff]">
                Upload Faculty Excel
              </h3>
              <p className="mt-1 text-[12px] leading-5 text-[#8ca1bd]">
                Upload an Excel file to add multiple faculty records at once.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
              aria-label="Close bulk upload"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-6 pb-4 table-custom-scrollbar">
          <div
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${
              isDragging
                ? "border-[#3984ff] bg-[#3984ff08]"
                : file
                  ? "border-[#18d3bf] bg-[#18d3bf08]"
                  : "border-[#244061] bg-[#0a1a2d] hover:border-[#3984ff] hover:bg-[#0d2138]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleInputChange}
            />

            {file ? (
              <div
                className="flex w-full items-center gap-4"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#18d3bf1a]">
                  <FileSpreadsheet size={28} className="text-[#18d3bf]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#8ca1bd]">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                  aria-label="Remove file"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#3984ff12]">
                  <UploadCloud size={30} className="text-[#3984ff]" />
                </div>
                <p className="mt-4 text-[14px] font-semibold text-white">
                  Click to upload or drag & drop
                </p>
                <p className="mt-1 text-[12px] text-[#8ca1bd]">
                  Only Excel files (.xlsx, .xls) are supported
                </p>
              </>
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-[#f168681f] px-3 py-2 text-[12px] font-semibold text-[#f16868]">
              {error}
            </p>
          )}

          <div className="mt-6 rounded-lg border border-[#183052] bg-[#0a1a2d] p-4">
            <h4 className="text-[13px] font-semibold text-white">
              File Requirements
            </h4>
            <ul className="mt-3 space-y-2 text-[12px] text-[#8ca1bd]">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3984ff]" />
                File must be in <strong className="text-white">.xlsx</strong> or{" "}
                <strong className="text-white">.xls</strong> format
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3984ff]" />
                Only <strong className="text-white">one file</strong> can be
                uploaded at a time
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3984ff]" />
                The sheet should contain required faculty fields as headers in
                the first row
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3984ff]" />
                Duplicate entries will be skipped based on Employee ID
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#173150] px-5 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] px-5 text-[13px] font-semibold text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 text-[13px] font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkUploadCanvas;
