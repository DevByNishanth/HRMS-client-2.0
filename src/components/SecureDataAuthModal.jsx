import { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, Mail, KeyRound } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const SecureDataAuthModal = ({
  isOpen,
  onClose,
  facultyId,
  onSuccess,
}) => {
  const [step, setStep] = useState(1); // 1 = Password, 2 = OTP
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const passwordInputRef = useRef(null);
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPassword("");
      setOtp("");
      setError("");
      setMaskedEmail("");
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleRequestOtp = async (isResend = false) => {
    if (!password.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error("Login token is missing. Please sign in again.");
      }

      const id = facultyId;
      if (!id) {
        throw new Error("Faculty ID is missing.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      let response;
      try {
        response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${id}/request-secure-data`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ password }),
          }
        );
        if (response.status === 404) {
          throw new Error("404");
        }
      } catch (err) {
        if (err.message === "404") {
          response = await fetch(
            `${API_BASE_URL.replace(/\/$/, "")}/api/faculty/${id}/request-secure-data`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({ password }),
            }
          );
        } else {
          throw err;
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Password verification failed. Please try again."
        );
      }

      const returnedEmail = data?.email || data?.data?.email || "";
      if (returnedEmail) {
        setMaskedEmail(returnedEmail);
      }

      setStep(2);
      setResendCooldown(30);
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    } catch (err) {
      setError(err.message || "Failed to request OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        throw new Error("Login token is missing. Please sign in again.");
      }

      const id = facultyId;
      if (!id) {
        throw new Error("Faculty ID is missing.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      let response;
      try {
        response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${id}/verify-secure-data`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ otp: otp.trim() }),
          }
        );
        if (response.status === 404) {
          throw new Error("404");
        }
      } catch (err) {
        if (err.message === "404") {
          response = await fetch(
            `${API_BASE_URL.replace(/\/$/, "")}/api/faculty/${id}/verify-secure-data`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({ otp: otp.trim() }),
            }
          );
        } else {
          throw err;
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "OTP verification failed. Please try again."
        );
      }

      const securedData = data?.data || data;
      onSuccess?.(securedData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-xl border border-slate-200 dark:border-[#1d395e] bg-white dark:bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#173150] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 dark:bg-[#3984ff]/20 text-[#2563EB] dark:text-[#3984ff]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
                Security Verification
              </p>
              <h2 className="mt-0.5 text-[17px] font-semibold text-gray-900 dark:text-white">
                {step === 1 ? "Verify Your Password" : "Enter Verification Code"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 dark:border-[#223b5f] bg-gray-50 dark:bg-[#102640] text-slate-500 dark:text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-slate-900 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close verification modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 border-b border-slate-100 dark:border-[#173150] text-[12px] font-medium text-center">
          <div
            className={`py-2.5 transition border-b-2 ${
              step === 1
                ? "border-[#2563EB] text-[#2563EB] dark:text-[#3984ff] bg-blue-50/50 dark:bg-[#0e243f]"
                : "border-transparent text-slate-400 dark:text-[#6a7d9c]"
            }`}
          >
            1. Password
          </div>
          <div
            className={`py-2.5 transition border-b-2 ${
              step === 2
                ? "border-[#2563EB] text-[#2563EB] dark:text-[#3984ff] bg-blue-50/50 dark:bg-[#0e243f]"
                : "border-transparent text-slate-400 dark:text-[#6a7d9c]"
            }`}
          >
            2. Email OTP
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-3 text-[12px] text-red-600 dark:text-[#f16868]">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p className="flex-1">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <div>
              <p className="text-[13px] leading-relaxed text-slate-600 dark:text-[#cad7eb]">
                To view sensitive identity and banking details, please confirm your account password. An OTP will be dispatched to your registered email.
              </p>

              <div className="mt-4">
                <label className="mb-2 block text-[13px] font-semibold text-gray-900 dark:text-white">
                  Account Password
                </label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRequestOtp()}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-lg border border-slate-300 dark:border-[#244061] bg-white dark:bg-[#0d2138] pl-3 pr-10 text-[14px] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 dark:border-[#244061] px-4 py-2 text-[13px] font-medium text-slate-700 dark:text-[#cad7eb] transition hover:bg-slate-100 dark:hover:bg-[#132b49] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRequestOtp()}
                  disabled={!password.trim() || loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-[#0c233c] p-3 text-[12px] text-blue-700 dark:text-[#9fc7ff] flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-[#2563EB] dark:text-[#3984ff]" />
                <p>
                  A verification code has been sent to your registered email address
                  {maskedEmail ? ` (${maskedEmail})` : ""}.
                </p>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[13px] font-semibold text-gray-900 dark:text-white">
                  Enter One-Time Password (OTP)
                </label>
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                    placeholder="Enter 6-digit OTP"
                    maxLength={10}
                    className="h-11 w-full rounded-lg border border-slate-300 dark:border-[#244061] bg-white dark:bg-[#0d2138] px-3 text-[15px] tracking-wider text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[12px]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="text-slate-500 hover:text-slate-800 dark:text-[#8ca1bd] dark:hover:text-white underline cursor-pointer"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => handleRequestOtp(true)}
                  disabled={resendCooldown > 0 || loading}
                  className="text-[#2563EB] dark:text-[#3984ff] hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 dark:border-[#244061] px-4 py-2 text-[13px] font-medium text-slate-700 dark:text-[#cad7eb] transition hover:bg-slate-100 dark:hover:bg-[#132b49] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otp.trim() || loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? "Verifying..." : "Verify & Unlock"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecureDataAuthModal;
