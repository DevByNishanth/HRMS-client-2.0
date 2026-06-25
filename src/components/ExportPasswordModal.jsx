import { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertCircle, Download, Eye, EyeOff } from "lucide-react";

const ExportPasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  error = "",
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      // Focus input after modal animation
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!password.trim() || loading) return;
    onConfirm(password);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <section
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-xl border border-[#1d395e] bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Export
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-white">
              Confirm Export
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close export modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-[#cad7eb]">
            Enter your password to export this table.
          </p>

          <div className="mt-4">
            <label
              htmlFor="export-password"
              className="mb-2 block text-[13px] font-semibold text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="export-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your password..."
                disabled={loading}
                className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] pr-10 pl-4 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ca1bd] transition hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#f1686833] bg-[#f1686812] px-3 py-2.5">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#f16868]" />
              <p className="text-[12px] leading-5 text-[#ffd1d1]">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#173150] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!password.trim() || loading}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2563EB] px-4 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Download size={15} />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExportPasswordModal;
