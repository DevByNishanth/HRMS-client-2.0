import { useState } from "react";
import { Camera, Trash2, UploadCloud, X } from "lucide-react";
import axios from "axios";
import { getTokenFromLocalStorage } from "../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const ProfileImageUploadModal = ({ facultyId, currentImageUrl, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const ALLOWED_TYPES = ["image/jpeg", "image/png"];

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only JPEG, JPG, and PNG files are allowed.");
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !facultyId) return;
    setUploading(true);
    try {
      const token = getTokenFromLocalStorage();
      const formData = new FormData();
      formData.append("profileImage", selectedFile);
      const response = await axios.patch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${facultyId}/profile-image`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/50 backdrop-blur-[12px]" onClick={onClose}>
      <div
        className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-xl border border-gray-600/60 bg-gray-700/15 backdrop-blur-xl shadow-[0_26px_80px_rgba(0,0,0,0.48)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d]/10 px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#74aaff]">Profile Photo</p>
            <h2 className="mt-1 text-[18px] font-semibold text-[#d8e3f7]">Update Profile Picture</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="flex flex-col items-center gap-4">
            {/* Preview */}
            <div className="flex h-[160px] w-[160px] items-center justify-center overflow-hidden rounded-full border-3 border-[#31415d] bg-[#18243a] shadow-[0_18px_35px_rgba(0,0,0,0.25)]">
              {preview || currentImageUrl ? (
                <img
                  src={preview || currentImageUrl}
                  alt="Preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_25%,#52627f_0%,#1f2b3e_32%,#101827_72%)]">
                  <Camera size={36} className="text-[#8ca1bd]" />
                </div>
              )}
            </div>

            {/* File input */}
            <label className="group flex cursor-pointer items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-2.5 text-[13px] text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white">
              <UploadCloud size={16} />
              <span>{selectedFile ? selectedFile.name : "Choose a file"}</span>
              <input
                type="file"
                accept=".jpeg,.jpg,.png"
                onChange={handleFileSelect}
                className="absolute opacity-0"
              />
            </label>

            {selectedFile && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 text-[12px] text-[#f16868] transition hover:text-white"
              >
                <Trash2 size={13} />
                Remove selection
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <UploadCloud size={15} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileImageUploadModal;
