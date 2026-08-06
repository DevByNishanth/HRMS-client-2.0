import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromLocalStorage } from "../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

export default function ResignPopup({ facultyId, onClose }) {
  const [resignDate, setResignDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!resignDate || !reason.trim()) {
      toast.error("Please enter resign date and reason.");
      return;
    }

    try {
      setLoading(true);
      const token = getTokenFromLocalStorage();

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${facultyId}/resign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ resignDate, resignReason: reason }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Failed to resign faculty.");
      }

      toast.success(data?.message || "Resignation submitted successfully.");
      if (onClose) onClose();
      // Optionally refresh page
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      toast.error(error.message || "An error occurred while resigning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-xl border border-[#1d395e] bg-[#071425] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Confirm Resignation</h2>
            <p className="mt-1 text-sm text-[#8fa3bf]">Enter resignation details below.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#8fa3bf] transition hover:bg-[#0f1b2e] hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[#c9d7f2]">Resign Date</label>
            <input
              type="date"
              value={resignDate}
              onChange={(e) => setResignDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#31415d] bg-[#0f1b2e] py-2 px-3 text-sm text-white outline-none placeholder:text-[#64748b] focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#c9d7f2]">Reason for Resignation</label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-[#31415d] bg-[#0f1b2e] p-3 text-sm text-white outline-none placeholder:text-[#64748b] focus:border-[#2563EB]"
              placeholder="Describe the reason for resignation"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#31415d] px-4 py-2 text-sm font-semibold text-[#c9d7f2] transition hover:bg-[#0f1b2e]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-[13px] font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
          </button>
        </div>
      </div>
    </section>
  );
}
