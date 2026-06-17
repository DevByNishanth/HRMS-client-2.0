import {
  CalendarDays,
  Clock,
  Clock3,
  FileText,
  Send,
  SunMedium,
  TimerReset,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const PermissionDetailsPopup = ({ permission, onClose }) => {
  if (!permission) return null;

  // Get color based on action status
  const getActionColor = (action) => {
    if (action?.toLowerCase() === "approved") {
      return { bg: "bg-emerald-800", text: "text-[#10b981]", light: "bg-[#10b98115]" };
    } else if (action?.toLowerCase() === "rejected") {
      return { bg: "bg-[#ef4444]", text: "text-[#ef4444]", light: "bg-[#ef444415]" };
    }
    return { bg: "bg-[#f59e0b]", text: "text-[#f59e0b]", light: "bg-[#f59e0b15]" };
  };

  // Get icon for action
  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "approved":
        return <CheckCircle2 size={18} />;
      case "rejected":
        return <AlertCircle size={18} />;
      case "submitted":
        return <Clock size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const approvalHistory = permission.raw?.approvalHistory || [];

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
              Permission Details
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Review Permission Request
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close permission details"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
          <p className="text-[12px] leading-5 text-[#b8c7dd]">
            Review the selected permission request and approval status.
          </p>

          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]">
                  <CalendarDays size={13} className="text-[#3984ff]" />
                  Date
                </div>
                <p className="mt-1 text-[16px] font-semibold text-white">{permission.date}</p>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${permission.statusColor}`}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {permission.status}
              </span>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <SunMedium size={14} className="text-[#b8c7dd]" />
                  Session
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{permission.session}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock3 size={14} className="text-[#b8c7dd]" />
                  Duration
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{permission.duration}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                  <TimerReset size={18} />
                </div>
                <p className="text-[13px] font-medium text-[#cad7eb]">Permission Hours</p>
              </div>
              <p className="text-[15px] font-semibold text-white">{permission.duration}</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
              <FileText size={15} className="text-[#3984ff]" />
              Reason
            </p>
            <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
              {permission.reason}
            </div>
          </div>

          {approvalHistory.length > 0 && (
            <div className="mt-3 border-t border-gray-400/20 pt-4">
              <p className="mb-3 flex items-center gap-2 text-[16px] text-white">
                <ShieldCheck size={15} className="text-[#3984ff]" />
                Approval Workflow
              </p>

              <div className="space-y-0">
                {approvalHistory.map((history, index) => {
                  const actionColor = getActionColor(history.action);
                  const isLast = index === approvalHistory.length - 1;
                  const isApproved = history.action?.toLowerCase() === "approved";
                  const isRejected = history.action?.toLowerCase() === "rejected";

                  return (
                    <div key={history._id || index} className="relative">
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[19px] top-[50px] w-[2px] h-[60px] ${isApproved ? "bg-[#10b981]" : isRejected ? "bg-[#ef4444]" : "bg-[#444c63]"
                            }`}
                        />
                      )}

                      {/* Step content */}
                      <div className="relative flex gap-3 pb-4">
                        {/* Step circle */}
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isApproved
                              ? `${actionColor.bg} border-emerald-200/20`
                              : isRejected
                                ? `${actionColor.bg} border-[#ef4444]`
                                : `${actionColor.light} border-[#444c63]`
                              } text-white`}
                          >
                            {getActionIcon(history.action)}
                          </div>
                        </div>

                        {/* Step details */}
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[13px] font-semibold capitalize text-[#8ca1bd]">
                                {history.role}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full whitespace-nowrap ${isApproved
                                ? "bg-[#10b98120] text-[#10b981]"
                                : isRejected
                                  ? "bg-[#ef444420] text-[#ef4444]"
                                  : "bg-[#f59e0b20] text-[#f59e0b]"
                                }`}
                            >
                              {history.action}
                            </span>
                          </div>

                          <p className="text-[12px] text-[#cad7eb] mt-1">
                            {history.remarks}
                          </p>

                          <p className="text-[11px] text-[#6f839f] mt-1.5 flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(history.actionDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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

export default PermissionDetailsPopup;
