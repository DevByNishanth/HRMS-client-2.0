import { Send, ShieldCheck, X, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";

const RegularizationDetailsPopup = ({ request, onClose }) => {
  if (!request) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const getActionColor = (action) => {
    if (action?.toLowerCase() === "approved") {
      return { bg: "bg-emerald-800", text: "text-[#10b981]", light: "bg-[#10b98115]" };
    } else if (action?.toLowerCase() === "rejected") {
      return { bg: "bg-[#ef4444]", text: "text-[#ef4444]", light: "bg-[#ef444415]" };
    }
    return { bg: "bg-[#f59e0b]", text: "text-[#f59e0b]", light: "bg-[#f59e0b15]" };
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "approved": return <CheckCircle2 size={18} />;
      case "rejected": return <AlertCircle size={18} />;
      default: return <Clock size={18} />;
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]" onClick={onClose}>
      <div className="flex h-full w-[26%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">Regularization Details</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">Review Request</h2>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 table-custom-scrollbar">
          <div className="rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#132b49] text-[18px] font-bold text-white uppercase">
                {request.facultyId?.firstName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[15px] font-semibold text-white">{request.facultyId?.firstName} {request.facultyId?.lastName}</p>
                <p className="text-[12px] font-medium text-[#8ca1bd]">{request.facultyId?.empId}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">Date</div>
                <p className="mt-1 text-[15px] font-medium text-white">{formatDate(request.attendanceDate)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">Status</div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.status}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">In Time</div>
                <p className="mt-1 text-[15px] font-medium text-[#18d3bf]">{formatTime(request.requestedInTime)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">Out Time</div>
                <p className="mt-1 text-[15px] font-medium text-[#f0a15f]">{formatTime(request.requestedOutTime)}</p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 flex items-center gap-2 text-[16px] text-white">
              <FileText size={15} className="text-[#3984ff]" /> Reason
            </p>
            <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
              {request.reason || "No reason provided"}
            </div>
          </div>

          {request.approvalHistory && request.approvalHistory.length > 0 && (
            <div className="mt-3 border-t border-gray-400/20 pt-4">
              <p className="mb-3 flex items-center gap-2 text-[16px] text-white">
                <ShieldCheck size={15} className="text-[#3984ff]" /> Approval Workflow
              </p>
              <div className="space-y-0">
                {request.approvalHistory.map((history, index) => {
                  const actionColor = getActionColor(history.action);
                  const isLast = index === request.approvalHistory.length - 1;
                  const isApproved = history.action?.toLowerCase() === "approved";
                  const isRejected = history.action?.toLowerCase() === "rejected";

                  return (
                    <div key={index} className="relative">
                      {!isLast && <div className={`absolute left-[19px] top-[50px] w-[2px] h-[60px] ${isApproved ? "bg-[#10b981]" : isRejected ? "bg-[#ef4444]" : "bg-[#444c63]"}`} />}
                      <div className="relative flex gap-3 pb-4">
                        <div className="flex-shrink-0">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isApproved ? `${actionColor.bg} border-emerald-200/20` : isRejected ? `${actionColor.bg} border-[#ef4444]` : `${actionColor.light} border-[#444c63]`} text-white`}>
                            {getActionIcon(history.action)}
                          </div>
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={`text-[13px] font-semibold capitalize text-[#8ca1bd]`}>{history.role}</p>
                            </div>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full whitespace-nowrap ${isApproved ? "bg-[#10b98120] text-[#10b981]" : isRejected ? "bg-[#ef444420] text-[#ef4444]" : "bg-[#f59e0b20] text-[#f59e0b]"}`}>
                              {history.action}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#cad7eb] ">{history.remarks}</p>
                          {history.actionDate && (
                            <p className="text-[11px] text-[#6f839f] mt-1.5 flex items-center gap-1">
                              <Clock size={11} /> {new Date(history.actionDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
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
          <button type="button" onClick={onClose} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]">
            Close Details <Send size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
export default RegularizationDetailsPopup;
