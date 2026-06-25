import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Check,
  X,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  FileText,
  CalendarDays,
  Clock3,
  SunMedium,
  ShieldCheck,
  RotateCcw,
  Loader2,
  Download,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  getRoleFromToken,
  getTokenFromLocalStorage,
} from "../../utils/tokenUtils";
import Sidebar from "../../components/Siedbar";
import CommonHeader from "../../components/CommonHeader";
import CustomDatePicker from "../../components/CustomDatePicker";
import ExportPasswordModal from "../../components/ExportPasswordModal";
import { exportToExcel } from "../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../hooks/usePasswordProtectedExport";
import userImg from "../../assets/userImg.svg";
import noDataFoundImg from "../../assets/no-data-found.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${
      statusStyles[status] || statusStyles.Pending
    }`}
  >
    <span className="h-[4px] w-[4px] rounded-full bg-current" />
    {status || "Pending"}
  </span>
);

const EmptyTableRow = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-10">
      <div className="flex flex-col items-center justify-center">
        <img
          src={noDataFoundImg}
          alt="No data found"
          className="h-32 w-auto opacity-95"
        />
        <p className="mt-2 text-[14px] font-semibold text-[#cad7eb]">
          No data found
        </p>
      </div>
    </td>
  </tr>
);

const getRegularizationList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.regularizationRequests))
    return data.regularizationRequests;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getFacultyName = (request) => {
  const fullName =
    `${request?.facultyId?.firstName || ""} ${request?.facultyId?.lastName || ""}`.trim();
  return fullName || request?.name || "Faculty";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const calculateWorkingHours = (inTime, outTime) => {
  if (!inTime || !outTime) return null;
  const start = new Date(inTime);
  const end = new Date(outTime);
  const diffMs = end - start;
  if (diffMs < 0) return null;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
};

const RejectConfirmationPopup = ({
  request,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  submitting,
}) => {
  if (!request) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-xl border border-[#1d395e] bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Confirmation
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-white">
              Reject Regularization
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close rejection confirmation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-[#cad7eb]">
            Reject {getFacultyName(request)}'s regularization request for{" "}
            {formatDate(request.attendanceDate || request.date)}?
          </p>

          <div className="mt-4">
            <label
              htmlFor="regularization-reject-reason"
              className="mb-2 block text-[13px] font-semibold text-white"
            >
              Reason for rejection
            </label>
            <textarea
              id="regularization-reject-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              rows={4}
              placeholder="Type the reason..."
              className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#173150] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!reason.trim() || submitting}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-[#2563EB] px-4 text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Rejecting..." : "Reject Request"}
          </button>
        </div>
      </div>
    </section>
  );
};

const RegularizationDetailsPanel = ({ request, onClose }) => {
  if (!request) return null;

  const getActionColor = (action) => {
    if (action?.toLowerCase() === "approved") {
      return {
        bg: "bg-emerald-800",
        text: "text-[#10b981]",
        light: "bg-[#10b98115]",
      };
    } else if (action?.toLowerCase() === "rejected") {
      return {
        bg: "bg-[#ef4444]",
        text: "text-[#ef4444]",
        light: "bg-[#ef444415]",
      };
    } else if (action?.toLowerCase() === "cancelled") {
      return {
        bg: "bg-[#f59e0b]",
        text: "text-[#f59e0b]",
        light: "bg-[#f59e0b15]",
      };
    }
    return {
      bg: "bg-[#f59e0b]",
      text: "text-[#f59e0b]",
      light: "bg-[#f59e0b15]",
    };
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "approved":
        return <CheckCircle2 size={18} />;
      case "rejected":
        return <AlertCircle size={18} />;
      case "cancelled":
        return <X size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const approvalHistory = request.approvalHistory || [];

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
              Regularization Details
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Review Regularization Request
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close regularization details"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
          {/* Faculty Info Card */}
          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={userImg}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-white">
                    {getFacultyName(request)}
                  </p>
                  <p className="mt-1 truncate text-[12px] text-[#8ca1bd]">
                    {request.facultyId?.empId ||
                      request.facultyId?.department ||
                      "--"}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${statusStyles[request.status] || statusStyles.Pending}`}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {request.status}
              </span>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]">
                <CalendarDays size={13} className="text-[#3984ff]" />
                Attendance Date
              </div>
              <p className="mt-1 text-[16px] font-semibold text-white">
                {formatDate(request.attendanceDate)}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <SunMedium size={14} className="text-[#b8c7dd]" />
                  In Time
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">
                  {formatTime(request.requestedInTime)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock3 size={14} className="text-[#b8c7dd]" />
                  Out Time
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">
                  {formatTime(request.requestedOutTime)}
                </p>
              </div>
            </div>

            {(() => {
              const wh = calculateWorkingHours(
                request.requestedInTime,
                request.requestedOutTime,
              );
              if (!wh) return null;
              return (
                <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                      <Clock size={18} />
                    </div>
                    <p className="text-[13px] font-medium text-[#cad7eb]">
                      Working Hours
                    </p>
                  </div>
                  <p className="text-[15px] font-semibold text-white">
                    {wh.hours}h {wh.minutes}m
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Reason */}
          <div className="mt-3">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
              <FileText size={15} className="text-[#3984ff]" />
              Reason
            </p>
            <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
              {request.reason || "No reason provided"}
            </div>
          </div>

          {/* Approval History Stepper */}
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
                  const isApproved =
                    history.action?.toLowerCase() === "approved";
                  const isRejected =
                    history.action?.toLowerCase() === "rejected";

                  return (
                    <div key={history._id || index} className="relative">
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[19px] top-[50px] w-[2px] h-[60px] ${
                            isApproved
                              ? "bg-[#10b981]"
                              : isRejected
                                ? "bg-[#ef4444]"
                                : "bg-[#444c63]"
                          }`}
                        />
                      )}

                      {/* Step content */}
                      <div className="relative flex gap-3 pb-4">
                        {/* Step circle */}
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                              isApproved
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
                              className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full whitespace-nowrap ${
                                isApproved
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

                          {history.actionDate && (
                            <p className="text-[11px] text-[#6f839f] mt-1.5 flex items-center gap-1">
                              <Clock size={11} />
                              {new Date(history.actionDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
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

const CancelConfirmationPopup = ({
  request,
  onClose,
  onConfirm,
  submitting,
}) => {
  if (!request) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/50 backdrop-blur-[8px] px-4 "
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-xl border border-[#1d395e] bg-gray-700/15 backdrop-blur-xl shadow-[0_26px_80px_rgba(0,0,0,0.48)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Confirmation
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-white">
              Cancel Regularization
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close cancel confirmation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-[#cad7eb]">
            Are you sure you want to cancel your regularization request for{" "}
            <span className="font-semibold text-white">
              {formatDate(request.attendanceDate)}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#173150] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white"
          >
            No, Keep It
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-[#f0a15f] px-4 text-[13px] font-semibold text-[#071425] shadow-[0_2px_10px_rgba(240,161,95,0.2)] transition hover:bg-[#ffbd7f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#071425] border-t-transparent" />
            ) : (
              <RotateCcw size={14} />
            )}
            {submitting ? "Cancelling..." : "Yes, Cancel Request"}
          </button>
        </div>
      </div>
    </section>
  );
};

const RevokeConfirmationPopup = ({
  request,
  onClose,
  onConfirm,
  submitting,
}) => {
  if (!request) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/50 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-xl border border-[#1d395e] bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Confirmation
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-white">
              Revoke Decision
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close revoke confirmation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-[#cad7eb]">
            Are you sure you want to revoke your decision for{" "}
            <span className="font-semibold text-white">
              {getFacultyName(request)}&apos;s regularization request
            </span>{" "}
            for {formatDate(request.attendanceDate)}?
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#173150] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-[#f0a15f] px-4 text-[13px] font-semibold text-[#071425] shadow-[0_2px_10px_rgba(240,161,95,0.2)] transition hover:bg-[#ffbd7f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#071425] border-t-transparent" />
            ) : (
              <RotateCcw size={14} />
            )}
            {submitting ? "Revoking..." : "Yes, Revoke Decision"}
          </button>
        </div>
      </div>
    </section>
  );
};

const MyRegularizationTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancelRequest, setCancelRequest] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const {
    isExportModalOpen: isMyExportOpen,
    exportLoading: myExportLoading,
    exportError: myExportError,
    handleExportClick: handleMyExportClick,
    closeExportModal: closeMyExport,
    handleConfirmExport: handleMyConfirmExport,
  } = usePasswordProtectedExport();

  const exportMyFilteredRows = () => {
    const rows = filteredRequests.map((r) => ({
      "Date": formatDate(r.attendanceDate),
      "In Time": formatTime(r.requestedInTime),
      "Out Time": formatTime(r.requestedOutTime),
      "Reason": r.reason || "",
      "Status": r.status || "",
    }));
    exportToExcel(rows, "My-Regularizations.xlsx");
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const normalizeDate = (date) => {
        if (!date) return null;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };

      const reqDate = normalizeDate(new Date(request.attendanceDate));
      const fromDate = normalizeDate(filterFromDate);
      const toDate = normalizeDate(filterToDate);

      const matchesFromDate = !fromDate || reqDate >= fromDate;
      const matchesToDate = !toDate || reqDate <= toDate;
      const matchesStatus =
        selectedStatus === "All" || request.status === selectedStatus;

      return matchesFromDate && matchesToDate && matchesStatus;
    });
  }, [requests, filterFromDate, filterToDate, selectedStatus]);

  const fetchMyRegularizations = useCallback(async () => {
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/my`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        setRequests(getRegularizationList(data));
      } else {
        console.error(
          "Failed to fetch regularizations:",
          data?.message || data,
        );
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching regularizations:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchMyRegularizations();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchMyRegularizations]);

  const handleCancelClick = (item) => {
    setCancelRequest(item);
  };

  const confirmCancel = async () => {
    const token = getTokenFromLocalStorage();
    const requestId = cancelRequest?._id;
    if (!token || !requestId) return;

    try {
      setCancellingId(requestId);
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/${requestId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        setCancelRequest(null);
        await fetchMyRegularizations();
      } else {
        console.error(
          "Failed to cancel regularization:",
          data?.message || data,
        );
      }
    } catch (err) {
      console.error("Error cancelling regularization:", err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section className="mt-4 rounded-xl border border-[#183052] min-h-[400px] max-h-[calc(100vh-200px)] overflow-y-auto bg-[#0a1a2d] ">
      <div className="relative z-20 flex items-center justify-between px-4 py-3">
        <h2 className="text-[18px] font-semibold text-white">
          My regularization requests <span>({filteredRequests.length})</span>
        </h2>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <div className="w-[160px]">
              <CustomDatePicker
                id="my-regularization-from-date"
                value={filterFromDate}
                onChange={setFilterFromDate}
                placeholder="From Date"
                popupAlign="right"
              />
            </div>
            <div className="w-[160px]">
              <CustomDatePicker
                id="my-regularization-to-date"
                value={filterToDate}
                onChange={setFilterToDate}
                placeholder="To Date"
                popupAlign="right"
              />
            </div>
            {(filterFromDate || filterToDate) && (
              <button
                type="button"
                onClick={() => {
                  setFilterFromDate(null);
                  setFilterToDate(null);
                }}
                className="inline-flex h-11 w-9 items-center justify-center rounded-md border border-[#244061] bg-[#0d2138] text-[#9eb0cc] transition hover:border-[#f16868] hover:text-[#f16868]"
                aria-label="Clear date filters"
                title="Clear date filters"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={handleMyExportClick}
              disabled={filteredRequests.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[14px] font-medium text-white transition hover:border-[#3984ff] hover:bg-[#132b49] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="h-11 rounded-md border border-[#244061] bg-[#0d2138] px-3 text-[13px] font-medium text-[#cad7eb] outline-none transition focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
            aria-label="Filter my regularizations by status"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="relative z-0 mt-3 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">In Time</th>
              <th className="px-4 py-3 font-semibold">Out Time</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#cad7eb]">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[#9eb0cc]"
                >
                  Loading regularization requests...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <EmptyTableRow colSpan={6} />
            ) : (
              filteredRequests.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-[#132944] last:border-0"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {formatDate(item.attendanceDate)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {formatTime(item.requestedInTime)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {formatTime(item.requestedOutTime)}
                  </td>
                  <td
                    className="max-w-[260px] truncate px-4 py-3 text-white"
                    title={item.reason}
                  >
                    {item.reason}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === "Pending" &&
                        item.currentApprovalLevel == "hod" && (
                          <button
                            type="button"
                            onClick={() => handleCancelClick(item)}
                            disabled={cancellingId === item._id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a15f12] text-[#f0a15f] transition hover:bg-[#f0a15f24] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Cancel regularization request"
                            title="Cancel Request"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                        aria-label="View regularization details"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RegularizationDetailsPanel
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      <ExportPasswordModal
        isOpen={isMyExportOpen}
        onClose={closeMyExport}
        onConfirm={(password) => handleMyConfirmExport(password, exportMyFilteredRows)}
        loading={myExportLoading}
        error={myExportError}
      />

      <CancelConfirmationPopup
        request={cancelRequest}
        onClose={() => setCancelRequest(null)}
        onConfirm={confirmCancel}
        submitting={cancellingId === cancelRequest?._id}
      />
    </section>
  );
};

const HodRegularizationTable = ({
  requests: externalRequests,
  loading: externalLoading,
  onRefresh,
  onCountChange,
}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [revokeRequest, setRevokeRequest] = useState(null);
  const [revokeSubmitting, setRevokeSubmitting] = useState(false);

  const {
    isExportModalOpen: isHodExportOpen,
    exportLoading: hodExportLoading,
    exportError: hodExportError,
    handleExportClick: handleHodExportClick,
    closeExportModal: closeHodExport,
    handleConfirmExport: handleHodConfirmExport,
  } = usePasswordProtectedExport();

  const exportHodFilteredRows = () => {
    const rows = filteredRequests.map((r) => ({
      "Name": getFacultyName(r),
      "Date": formatDate(r.attendanceDate),
      "In Time": formatTime(r.requestedInTime),
      "Out Time": formatTime(r.requestedOutTime),
      "Reason": r.reason || "",
      "Status": r.approvalStatus?.hod || r.status || "Pending",
    }));
    exportToExcel(rows, "Team-Regularizations.xlsx");
  };

  // Use externally provided data when available (parent-fetched), else fall back to internal state
  const effectiveRequests = externalRequests || requests;
  const effectiveLoading =
    externalLoading !== undefined ? externalLoading : loading;

  const filteredRequests = useMemo(() => {
    return effectiveRequests.filter((request) => {
      const normalizeDate = (date) => {
        if (!date) return null;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };

      const reqDate = normalizeDate(new Date(request.attendanceDate));
      const fromDate = normalizeDate(filterFromDate);
      const toDate = normalizeDate(filterToDate);

      const matchesFromDate = !fromDate || reqDate >= fromDate;
      const matchesToDate = !toDate || reqDate <= toDate;
      const hodStatus = request.approvalStatus?.hod || "Pending";
      const matchesStatus =
        selectedStatus === "All" || hodStatus === selectedStatus;

      return matchesFromDate && matchesToDate && matchesStatus;
    });
  }, [effectiveRequests, filterFromDate, filterToDate, selectedStatus]);

  const fetchHodRegularizations = useCallback(async () => {
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/hod/list`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        setRequests(getRegularizationList(data));
        return getRegularizationList(data);
      } else {
        console.error(
          "Failed to fetch HOD regularizations:",
          data?.message || data,
        );
        setRequests([]);
        return [];
      }
    } catch (err) {
      console.error("Error fetching HOD regularizations:", err);
      setRequests([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fallback: if no external data, fetch internally
  useEffect(() => {
    if (!externalRequests) {
      const timer = window.setTimeout(() => {
        fetchHodRegularizations();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [fetchHodRegularizations, externalRequests]);

  useEffect(() => {
    onCountChange?.(effectiveRequests.length);
  }, [onCountChange, effectiveRequests.length]);

  const handleApprove = async (request) => {
    const token = getTokenFromLocalStorage();
    const requestId = request?._id;
    if (!token || !requestId) return;

    try {
      setProcessingId(requestId);
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/${requestId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approvalRemarks: "Approved" }),
        },
      );
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        await fetchHodRegularizations();
        onRefresh?.();
      } else {
        console.error(
          "Failed to approve regularization:",
          data?.message || data,
        );
      }
    } catch (err) {
      console.error("Error approving regularization:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = (request) => {
    setRejectReason("");
    setRejectRequest(request);
  };

  const closeRejectPopup = () => {
    setRejectRequest(null);
    setRejectReason("");
  };

  const confirmReject = async () => {
    const token = getTokenFromLocalStorage();
    const requestId = rejectRequest?._id;
    if (!token || !requestId || !rejectReason.trim()) return;

    try {
      setProcessingId(requestId);
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/${requestId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approvalRemarks: rejectReason.trim() }),
        },
      );
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        await fetchHodRegularizations();
        onRefresh?.();
        closeRejectPopup();
      } else {
        console.error(
          "Failed to reject regularization:",
          data?.message || data,
        );
      }
    } catch (err) {
      console.error("Error rejecting regularization:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevokeClick = (request) => {
    setRevokeRequest(request);
  };

  const closeRevokePopup = () => {
    setRevokeRequest(null);
  };

  const confirmRevoke = async () => {
    const token = getTokenFromLocalStorage();
    const requestId = revokeRequest?._id;
    if (!token || !requestId) return;

    try {
      setRevokeSubmitting(true);
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/${requestId}/revoke`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        },
      );
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        toast.success("Regularization decision revoked successfully");
        await fetchHodRegularizations();
        onRefresh?.();
        closeRevokePopup();
      } else {
        toast.error(data?.message || "Failed to revoke regularization");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setRevokeSubmitting(false);
    }
  };

  const isProcessing = (request) => processingId === request?._id;

  return (
    <>
      <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
        <div className="relative z-20 flex items-center justify-between px-4 py-3">
          <h2 className="text-[18px] font-semibold text-white">
            Team regularization requests{" "}
            <span>({filteredRequests.length})</span>
          </h2>

          <div className="flex items-center gap-2">
            <div className="w-[160px]">
              <CustomDatePicker
                id="hod-regularization-from-date"
                value={filterFromDate}
                onChange={setFilterFromDate}
                placeholder="From Date"
                popupAlign="right"
              />
            </div>
            <div className="w-[160px]">
              <CustomDatePicker
                id="hod-regularization-to-date"
                value={filterToDate}
                onChange={setFilterToDate}
                placeholder="To Date"
                popupAlign="right"
              />
            </div>
            {(filterFromDate || filterToDate) && (
              <button
                type="button"
                onClick={() => {
                  setFilterFromDate(null);
                  setFilterToDate(null);
                }}
                className="inline-flex h-11 w-9 items-center justify-center rounded-md border border-[#244061] bg-[#0d2138] text-[#9eb0cc] transition hover:border-[#f16868] hover:text-[#f16868]"
                aria-label="Clear date filters"
                title="Clear date filters"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={handleHodExportClick}
              disabled={filteredRequests.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[14px] font-medium text-white transition hover:border-[#3984ff] hover:bg-[#132b49] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export
            </button>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-11 rounded-md border border-[#244061] bg-[#0d2138] px-3 text-[13px] font-medium text-[#cad7eb] outline-none transition focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
              aria-label="Filter team regularizations by status"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="relative z-0 mt-3 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">In Time</th>
                <th className="px-4 py-3 font-semibold">Out Time</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#cad7eb]">
              {effectiveLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-[#9eb0cc]"
                  >
                    Loading regularization requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <EmptyTableRow colSpan={7} />
              ) : (
                filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <img
                          src={userImg}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate">{getFacultyName(request)}</p>
                          <p className="truncate text-[12px] font-normal text-[#8ca1bd]">
                            {request.facultyId?.empId ||
                              request.facultyId?.department ||
                              "--"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatDate(request.attendanceDate)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatTime(request.requestedInTime)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatTime(request.requestedOutTime)}
                    </td>
                    <td
                      className="max-w-[260px] truncate px-4 py-3"
                      title={request.reason}
                    >
                      {request.reason}
                    </td>
                    <td className="">
                      <StatusBadge status={request.approvalStatus?.hod || "Pending"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {request.approvalStatus?.hod === "Pending" &&
                        request.currentApprovalLevel === "hod" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(request)}
                              disabled={isProcessing(request)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Approve regularization request"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(request)}
                              disabled={isProcessing(request)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Reject regularization request"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : request.currentApprovalLevel !== "hod" &&
                          request.currentApprovalLevel !== "completed" ? (
                          <button
                            type="button"
                            onClick={() => handleRevokeClick(request)}
                            disabled={revokeSubmitting}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a15f12] text-[#f0a15f] transition hover:bg-[#f0a15f24] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Revoke regularization decision"
                            title="Revoke Decision"
                          >
                            {revokeSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4" />
                            )}
                          </button>
                        ) : (
                          // <StatusBadge status={request.approvalStatus?.hod || "Pending"} /> 
                          ""
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(request)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                          aria-label="View regularization details"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <RegularizationDetailsPanel
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      <RejectConfirmationPopup
        request={rejectRequest}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeRejectPopup}
        onConfirm={confirmReject}
        submitting={processingId === rejectRequest?._id}
      />

      <ExportPasswordModal
        isOpen={isHodExportOpen}
        onClose={closeHodExport}
        onConfirm={(password) => handleHodConfirmExport(password, exportHodFilteredRows)}
        loading={hodExportLoading}
        error={hodExportError}
      />

      <RevokeConfirmationPopup
        request={revokeRequest}
        onClose={closeRevokePopup}
        onConfirm={confirmRevoke}
        submitting={revokeSubmitting}
      />
    </>
  );
};

const RegularaizationListPage = () => {
  const role = getRoleFromToken()?.toLowerCase();
  const location = useLocation();
  const hodTabs = ["My Regularizations", "Team Regularizations"];
  const initialHodSelectedTab = hodTabs.includes(location.state?.hodSelectedTab)
    ? location.state.hodSelectedTab
    : "My Regularizations";
  const [hodSelectedTab, setHodSelectedTab] = useState(initialHodSelectedTab);
  const [hodRegularizationCount, setHodRegularizationCount] = useState(0);
  const [hodRequests, setHodRequests] = useState(null);
  const [hodLoading, setHodLoading] = useState(false);

  // Prefetch team regularization data when parent mounts so count is available immediately
  const prefetchHodRegularizations = useCallback(async () => {
    if (role !== "hod") return;
    try {
      setHodLoading(true);
      const token = getTokenFromLocalStorage();
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/hod/list`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        const list = getRegularizationList(data);
        setHodRequests(list);
        setHodRegularizationCount(list.length);
      } else {
        setHodRequests([]);
        setHodRegularizationCount(0);
      }
    } catch (err) {
      console.error("Error prefetching HOD regularizations:", err);
      setHodRequests([]);
      setHodRegularizationCount(0);
    } finally {
      setHodLoading(false);
    }
  }, [role]);

  useEffect(() => {
    prefetchHodRegularizations();
  }, [prefetchHodRegularizations]);

  const content =
    hodSelectedTab === "My Regularizations" ? (
      <MyRegularizationTable />
    ) : (
      <HodRegularizationTable
        requests={hodRequests}
        loading={hodLoading}
        onRefresh={prefetchHodRegularizations}
        onCountChange={setHodRegularizationCount}
      />
    );

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div>
            <h1 className="text-xl font-medium leading-tight text-white">
              Regularization History
            </h1>
            <p className="mt-1 text-[16px] text-[#9eb0cc]">
              Review regularization history and track approvals.
            </p>
          </div>

          {role === "hod" && (
            <div className="mt-4 w-full rounded-lg border border-[#213857] bg-[#0d2138] px-4 py-2">
              <div className="flex items-center gap-2">
                {hodTabs.map((tab) => (
                  <button
                    type="button"
                    onClick={() => setHodSelectedTab(tab)}
                    key={tab}
                    className={`px-6 py-2 text-sm font-medium transition ${
                      tab === hodSelectedTab
                        ? "rounded-md bg-[#2563EB] text-white"
                        : "rounded-md hover:bg-slate-600/20"
                    }`}
                  >
                    {tab}
                    {tab === "Team Regularizations" && (
                      <span
                        className={`ml-1 rounded px-2 py-[2px] text-xs ${
                          tab === hodSelectedTab
                            ? "bg-white font-semibold text-blue-700"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {hodRegularizationCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {role === "hod" ? content : <MyRegularizationTable />}
        </main>
      </div>
    </div>
  );
};

export default RegularaizationListPage;
