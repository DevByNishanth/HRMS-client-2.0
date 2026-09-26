import { useState } from "react";
import { Loader2, X } from "lucide-react";

const BulkApproveModal = ({
  title,
  message,
  confirmLabel = "Approve",
  onConfirm,
  onClose,
  loading = false,
  error = "",
}) => {
  const [remarks, setRemarks] = useState("");

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <section
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[440px] rounded-xl border border-[#1d395e] bg-white dark:bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#173150] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
              Bulk Approval
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 dark:border-[#223b5f] bg-gary-300 dark:bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] "
            aria-label="Close bulk approval"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-slate-700 dark:text-[#cad7eb]">{message}</p>

          {error && (
            <p className="mt-3 rounded-lg bg-[#f168681f] px-3 py-2 text-[12px] font-semibold text-[#f16868]">
              {error}
            </p>
          )}

          <div className="mt-4">
            <label
              htmlFor="bulk-approve-remarks"
              className="mb-2 block text-[13px] font-semibold text-gray-900 dark:text-white"
            >
              Remarks
            </label>
            <textarea
              id="bulk-approve-remarks"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              rows={4}
              placeholder="Add remarks (optional)..."
              className="w-full resize-none rounded-lg border border-slate-200 dark:border-[#244061] bg-[#f8fafc] dark:bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-[#173150] px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="h-10 rounded-md border border-slate-200 dark:border-[#244061] px-4 text-[13px] font-semibold text-gray-900 dark:text-[#cad7eb] transition  disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(remarks)}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-[13px] font-semibold text-white transition  disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BulkApproveModal;
