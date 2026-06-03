import { AlertTriangle, Send, X } from "lucide-react";
import axios from "axios";
import { useState } from "react";
const WithdrawLeavePopup = ({ leave, onClose, fetchLeaves }) => {
  const [isLoading, setIsLoading] = useState(false);
  if (!leave) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true)
      const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/leave-application/${leave._id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hrms_token")}`,
        },
      })
      console.log("Leave withdrawn successfully:", res.data);
      setIsLoading(false)
      fetchLeaves()
      onClose();
    } catch (err) {
      console.error("Error withdrawing leave:", err);
      setIsLoading(false)
      fetchLeaves()
      onClose();
    }


  };

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <form
        className="w-full max-w-[420px] rounded-xl border border-[#1d395e] bg-[#071425] shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4 border-b rounded-t-xl border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Withdraw Leave
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Confirm Request
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close withdraw leave popup"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex gap-3 rounded-lg border border-[#f0a15f40] bg-[#f0a15f12] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0a15f22] text-[#f0a15f]">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">
                Withdraw {leave.type}?
              </p>
              <p className="mt-1 text-[12px] leading-5 text-[#b8c7dd]">
                This will cancel the pending leave request from {leave.from} to{" "}
                {leave.to}.
              </p>
            </div>
          </div>

          <label
            htmlFor="withdraw-reason"
            className="mb-2 mt-4 block text-[13px] font-semibold text-white"
          >
            Reason for Withdrawal
          </label>
          <textarea
            id="withdraw-reason"
            rows={4}
            placeholder="Add a short reason..."
            className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t rounded-b-xl border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#244061] px-5 text-[13px] font-semibold text-[#b8c7dd] transition hover:border-[#3984ff] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4]"
          >
            {isLoading ? <div className="loader"></div> : <span className="flex items-center gap-2"> Withdraw
              <Send size={14} /></span>}
          </button>
        </div>
      </form>
    </section>
  );
};

export default WithdrawLeavePopup;
