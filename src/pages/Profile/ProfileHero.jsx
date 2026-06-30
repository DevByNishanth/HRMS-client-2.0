import React, { useState } from "react";
import { Camera, Edit3, Eye, EyeOff, Loader2, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import ProfileImageUploadModal from "../../components/ProfileImageUploadModal";
import { decodeToken, getTokenFromLocalStorage } from "../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const ProfileHero = ({ canEdit, onEdit, faculty }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fullName = [faculty?.firstName, faculty?.lastName].filter(Boolean).join(" ") || "User";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece-hrms-server.onrender.com";


  const isActive = faculty?.employmentStatus === true;
  const designation = faculty?.designation || "";
  const department = faculty?.department || "";
  const empId = faculty?.empId || "";
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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

  const openPasswordModal = () => {
    resetPasswordForm();
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    resetPasswordForm();
    setIsPasswordModalOpen(false);
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
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while updating the password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDeleteImage = async () => {
    if (!faculty?._id) return;
    setDeleting(true);
    try {
      const token = getTokenFromLocalStorage();
      await axios.delete(
        `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${faculty._id}/profile-image`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowDeleteConfirm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting profile image:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <section className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between sticky top-0 z-10 bg-[#071425] px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-[120px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-lg border-3 border-[#31415d] bg-[#18243a] shadow-[0_18px_35px_rgba(0,0,0,0.25)]">
            {faculty?.profileImage?.url ? (
              <img
                src={faculty.profileImage.url}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_25%,#52627f_0%,#1f2b3e_32%,#101827_72%)]">
                <span className="text-[48px] font-bold text-white">
                  {(faculty?.firstName || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {canEdit && (
              <div className="absolute bottom-1 right-1 flex gap-1">
                {faculty?.profileImage?.url ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-lg transition hover:bg-[#dc2626]"
                    title="Delete photo"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-lg transition hover:bg-[#1d4ed8]"
                    title="Upload photo"
                  >
                    <Camera size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold leading-tight text-white">
                {fullName}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  isActive
                    ? "bg-[#0f7e59]/25 text-[#26d39a]"
                    : "bg-[#f168681f] text-[#f16868]"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-1 text-[15px] font-medium text-[#c9d7f2]">
              {designation}
              {designation && department ? " • " : ""}
              {department}
            </p>
            <p className="mt-2 text-[12px] text-[#8092b1]">{empId}</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-3">
            <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            <Edit3 size={13} />
            Edit Profile
          </button>
            <button
            type="button"
            onClick={()=>setIsPasswordModalOpen(true)}
            className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            
            Change password
          </button>
          </div>
        )}
      </section>

      {showUploadModal && (
        <ProfileImageUploadModal
          facultyId={faculty?._id}
          currentImageUrl={faculty?.profileImage?.url}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <section
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-[400px] rounded-xl border border-[#1d395e] bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
                  Confirmation
                </p>
                <h2 className="mt-1 text-[18px] font-semibold text-white">Delete Profile Photo</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-[13px] leading-5 text-[#cad7eb]">
                Are you sure you want to delete your profile photo? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-5 pb-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-[#31415d] px-4 py-2 text-sm font-semibold text-[#c9d7f2] transition hover:bg-[#0f1b2e]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#ef4444] px-4 text-[13px] font-semibold text-white transition hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
      </section>

        )}

       

      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs"
          onClick={closePasswordModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#31415d] bg-[#07142580]  p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
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
      )}
    </>
  );
};

export default ProfileHero;
