import { useState } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { decodeToken, getTokenFromLocalStorage } from "../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const ChangePasswordModal = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const resetPasswordForm = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setFeedback({ type: "", message: "" });
  };

  const closePasswordModal = () => {
    resetPasswordForm();
    onClose();
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setFeedback({
        type: "error",
        message: "Please enter both password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback({ type: "", message: "" });

      const token = getTokenFromLocalStorage();
      let decoded = decodeToken(token);

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            newPassword,
            confirmPassword,
            email: decoded?.email,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update password.");
      }

      toast.success(data?.message || "Changed Password Successfully");
      resetPasswordForm();
      onClose();
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while updating the password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs"
      onClick={closePasswordModal}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#31415d] bg-[#07142580] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-[#8fa3bf]">
              Set a new password for your account.
            </p>
          </div>
          <button
            type="button"
            onClick={closePasswordModal}
            className="rounded-full p-2 text-[#8fa3bf] transition hover:bg-[#0f1b2e] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {feedback.message ? (
            <div
              className={`rounded-lg border px-3 py-2 text-sm ${
                feedback.type === "error"
                  ? "border-[#f16868]/40 bg-[#f168681a] text-[#f16868]"
                  : "border-[#26d39a]/40 bg-[#0f7e59]/15 text-[#26d39a]"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#c9d7f2]">
              Enter a New Password
            </label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 shrink-0 text-[#8b9bb8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V7.875a4.125 4.125 0 10-8.25 0V10.5m-.75 0h9.75A2.25 2.25 0 0119.5 12.75v5.625A2.25 2.25 0 0117.25 20.625H6.75A2.25 2.25 0 014.5 18.375V12.75A2.25 2.25 0 016.75 10.5z"
                />
              </svg>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-11 w-full rounded-xl border border-[#31415d] bg-[#0f1b2e] py-2 pl-10 pr-11 text-sm text-white outline-none placeholder:text-[#64748b] focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b9bb8] transition hover:text-white"
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#c9d7f2]">
              Re-Enter New Password
            </label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 shrink-0 text-[#8b9bb8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V7.875a4.125 4.125 0 10-8.25 0V10.5m-.75 0h9.75A2.25 2.25 0 0119.5 12.75v5.625A2.25 2.25 0 0117.25 20.625H6.75A2.25 2.25 0 014.5 18.375V12.75A2.25 2.25 0 016.75 10.5z"
                />
              </svg>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="h-11 w-full rounded-xl border border-[#31415d] bg-[#0f1b2e] py-2 pl-10 pr-11 text-sm text-white outline-none placeholder:text-[#64748b] focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b9bb8] transition hover:text-white"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={closePasswordModal}
            className="rounded-xl border border-[#31415d] px-4 py-2 text-sm font-semibold text-[#c9d7f2] transition hover:bg-[#0f1b2e]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-[13px] font-semibold text-white transition hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Change password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
