import {
  CalendarDays,
  Clock3,
  FileText,
  Layers,
  Send,
  ShieldCheck,
  TimerReset,
  X,
} from "lucide-react";

const LeaveDetailsPopup = ({ leave, onClose }) => {
  if (!leave) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-[26%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Leave Details
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Review Leave Request
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close leave details"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
          <p className="text-[12px] leading-5 text-[#b8c7dd]">
            Review the selected leave request details and current approval status.
          </p>

          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]">
                  <Layers size={13} className="text-[#3984ff]" />
                  Leave Type
                </div>
                <p className="mt-1 text-[16px] font-semibold text-white">{leave.type}</p>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${leave.statusColor}`}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {leave.status}
              </span>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <CalendarDays size={14} className="text-[#b8c7dd]" />
                  From
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{leave.from}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <CalendarDays size={14} className="text-[#b8c7dd]" />
                  To
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{leave.to}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                  <TimerReset size={18} />
                </div>
                <p className="text-[13px] font-medium text-[#cad7eb]">Leave Duration</p>
              </div>
              <p className="text-[15px] font-semibold text-white">{leave.duration}</p>
            </div>
          </div>

          {/* <div className="mt-3 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock3 size={14} className="text-[#b8c7dd]" />
                  Leave Period
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">
                  {leave.from} - {leave.to}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <ShieldCheck size={14} className="text-[#b8c7dd]" />
                  Status
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{leave.status}</p>
              </div>
            </div>
          </div> */}

          <div className="mt-3">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
              <FileText size={15} className="text-[#3984ff]" />
              Notes
            </p>
            <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
              {leave.notes}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            Close Details
            <Send size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LeaveDetailsPopup;
