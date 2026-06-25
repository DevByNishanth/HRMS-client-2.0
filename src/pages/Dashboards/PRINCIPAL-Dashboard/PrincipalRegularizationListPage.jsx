import {
  Check,
  X,
  ChevronDown,
  Eye,
  RotateCcw,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Clock3,
  Search,
  CalendarDays,
  TimerReset,
  FileText,
  ShieldCheck,
  Send,
  AlertCircle,
  SunMedium,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import userImg from "../../../assets/userImg.svg";
import {
  decodeToken,
  getTokenFromLocalStorage,
} from "../../../utils/tokenUtils";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const departments = [
  "All",
  "Computer Science",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical",
  "Civil",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Management Studies",
  "MBA",
];

// ---------- Detail Slide Panel ----------
const formatDateDisplay = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const calculateDuration = (request) => {
  if (request.duration) return request.duration;
  if (request.totalHours) return `${request.totalHours} Hours`;

  const inTime = request.requestedInTime || request.inTime;
  const outTime = request.requestedOutTime || request.outTime;

  if (!inTime || !outTime) return "N/A";

  const start = new Date(inTime);
  const end = new Date(outTime);
  const diffMs = end - start;

  if (isNaN(diffMs) || diffMs < 0) return "N/A";

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs}h ${diffMins}m`;
};

const RegularizationDetailsPanel = ({
  request,
  onClose,
  onApprove,
  onReject,
  onRevoke,
  approvingId,
}) => {
  if (!request) return null;

  const canApprove = request.status === "Pending";
  const canRevoke =
    request.status === "Approved" || request.status === "Rejected";

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
              Regularization Request
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
                    {request.facultyId?.firstName} {request.facultyId?.lastName}
                  </p>
                  <p className="mt-1 truncate text-[12px] text-[#8ca1bd]">
                    {request.facultyId?.designation}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${statusStyles[request.status]}`}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {request.status}
              </span>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]">
                <CalendarDays size={13} className="text-[#3984ff]" />
                Date
              </div>
              <p className="mt-1 text-[16px] font-semibold text-white">
                {console.log("principal regularization : ", request)}
                {request.date ||
                  formatDateDisplay(
                    request.fromDate ||
                      request.regularizationDate ||
                      request.attendanceDate,
                  )}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <SunMedium size={14} className="text-[#b8c7dd]" />
                  Session
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">
                  {request.session || request.leaveSession || "Full Day"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock3 size={14} className="text-[#b8c7dd]" />
                  Duration
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">
                  {calculateDuration(request)}
                </p>
              </div>
            </div>

            {request.currentApprovalLevel && (
              <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                    <TimerReset size={18} />
                  </div>
                  <p className="text-[13px] font-medium text-[#cad7eb]">
                    Approval Level
                  </p>
                </div>
                <p className="text-[15px] font-semibold text-white capitalize">
                  {request.currentApprovalLevel}
                </p>
              </div>
            )}
          </div>

          <div className="mt-3">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
              <FileText size={15} className="text-[#3984ff]" />
              Reason
            </p>
            <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
              {request.reason ||
                request.regularizationReason ||
                "No reason provided"}
            </div>
          </div>

          {request.rejectionReason && (
            <div className="mt-3">
              <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                <AlertCircle size={15} className="text-[#f16868]" />
                Rejection Reason
              </p>
              <div className="rounded-lg border border-[#f1686833] bg-[#f1686812] px-4 py-3 text-[13px] leading-5 text-[#ffd1d1]">
                {request.rejectionReason}
              </div>
            </div>
          )}

          {request.approvalHistory && request.approvalHistory.length > 0 && (
            <div className="mt-3 border-t border-gray-400/20 pt-4">
              <p className="mb-3 flex items-center gap-2 text-[16px] font-semibold text-white">
                <ShieldCheck size={15} className="text-[#3984ff]" />
                Approval Workflow
              </p>

              <div className="space-y-0">
                {request.approvalHistory.map((history, index) => {
                  const isLast = index === request.approvalHistory.length - 1;
                  const isApproved =
                    history.action?.toLowerCase() === "approved";
                  const isRejected =
                    history.action?.toLowerCase() === "rejected";

                  return (
                    <div key={history._id || index} className="relative">
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

                      <div className="relative flex gap-3 pb-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                              isApproved
                                ? "bg-emerald-800 border-emerald-200/20"
                                : isRejected
                                  ? "bg-[#ef4444] border-[#ef4444]"
                                  : "bg-[#f59e0b15] border-[#444c63]"
                            } text-white`}
                          >
                            {isApproved ? (
                              <CheckCircle2 size={18} />
                            ) : isRejected ? (
                              <XCircle size={18} />
                            ) : (
                              <Clock size={18} />
                            )}
                          </div>
                        </div>

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

                          <p className="text-[12px] text-[#cad7eb]">
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

        {/* <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          {canApprove ? (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onApprove(request)}
                disabled={approvingId === request._id}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#18d3bf] text-[13px] font-semibold text-[#071425] shadow-[0_5px_20px_rgba(24,211,191,0.2)] transition hover:bg-[#2ce8d4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {approvingId === request._id ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#071425] border-t-transparent" />
                ) : (
                  <>
                    Approve Request
                    <Check size={14} />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => onReject(request)}
                disabled={approvingId === request._id}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#c44848] bg-transparent text-[13px] font-semibold text-[#f16868] transition hover:bg-[#c4484812] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject Request
                <X size={14} />
              </button>
            </div>
          ) : canRevoke ? (
            <button
              type="button"
              onClick={() => onRevoke(request)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#f0a15f] text-[13px] font-semibold text-[#071425] shadow-[0_5px_20px_rgba(240,161,95,0.2)] transition hover:bg-[#ffbd7f]"
            >
              Revoke {request.status}
              <RotateCcw size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
            >
              Close Details
              <Send size={14} />
            </button>
          )}
        </div> */}
      </div>
    </section>
  );
};

// ---------- Confirmation Popup ----------
const ConfirmationPopup = ({
  action,
  request,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  revokeLoading,
  rejectLoading,
}) => {
  if (!action || !request) return null;

  const isReject = action === "reject";
  const isRevoke = action === "revoke";
  const title = isReject
    ? "Reject Regularization Request"
    : "Revoke Regularization Decision";
  const message = isReject
    ? `Reject ${request.facultyId?.firstName}'s regularization request?`
    : `Revoke the ${request.status.toLowerCase()} decision for ${request.facultyId?.firstName}?`;

  return (
    <section
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
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
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close confirmation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-[#cad7eb]">{message}</p>

          {isReject && (
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
          )}
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
            disabled={
              (isReject && (!reason.trim() || rejectLoading)) ||
              (isRevoke && revokeLoading)
            }
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-[16px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isRevoke
                ? "bg-[#f0a15f] text-[#071425] hover:bg-[#ffbd7f]"
                : "bg-[#c44848] text-white hover:bg-[#d94f4f]"
            }`}
          >
            {isRevoke && revokeLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#071425] border-t-transparent" />
            ) : isRevoke ? (
              "Revoke Decision"
            ) : isReject && rejectLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Rejecting...
              </>
            ) : (
              "Reject Request"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

// ---------- Stat Card ----------
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="rounded-xl border border-[#183052] bg-[#0a1a2d] px-4 py-3">
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <Icon size={18} />
      </div>
      <div>
        <span className="text-[14px] font-medium text-[#8ca1bd]">{label}</span>
        <p className="text-[16px] font-semibold leading-none text-white">
          {value}
        </p>
      </div>
    </div>
  </div>
);

// ---------- Main Component ----------
const PrincipalRegularizationListPage = () => {
  const token = getTokenFromLocalStorage();
  let decodedData = decodeToken(token);

  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const statuses = ["All", "Approved", "Rejected", "Pending"];

  // ---------- API Fetch ----------
  async function fetchRegularizationRequests() {
    try {
      const response = await axios.get(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/principal/list`,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
        },
      );
      setRequests(response.data?.requests || []);
    } catch (error) {
      console.error("Error fetching regularization requests:", error);
      setRequests([]);
    }
  }

  useEffect(() => {
    fetchRegularizationRequests();
  }, []);

  // ---------- Stat Cards (filtered by department) ----------
  const deptRequests = useMemo(() => {
    if (filterDepartment === "All") return requests;
    return requests.filter((r) => r.facultyId?.department === filterDepartment);
  }, [filterDepartment, requests]);

  const statCards = useMemo(() => {
    const total = deptRequests.length;
    const approved = deptRequests.filter((r) => r.status === "Approved").length;
    const rejected = deptRequests.filter((r) => r.status === "Rejected").length;
    const pending = deptRequests.filter((r) => r.status === "Pending").length;

    return [
      { label: "Total Requests", value: total, icon: Users, color: "#3984ff" },
      {
        label: "Approved",
        value: approved,
        icon: CheckCircle2,
        color: "#18d3bf",
      },
      { label: "Rejected", value: rejected, icon: XCircle, color: "#f16868" },
      { label: "Pending", value: pending, icon: Clock, color: "#f0a15f" },
    ];
  }, [deptRequests]);

  // ---------- Filtering ----------
  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return requests.filter((req) => {
      const name =
        `${req.facultyId?.firstName || ""} ${req.facultyId?.lastName || ""}`.trim();
      const matchesSearch =
        !normalizedSearch ||
        [name, req.facultyId?.empId, req.reason, req.regularizationReason]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const statusMatch = filterStatus === "All" || req.status === filterStatus;
      const deptMatch =
        filterDepartment === "All" ||
        req.facultyId?.department === filterDepartment;

      return matchesSearch && statusMatch && deptMatch;
    });
  }, [filterDepartment, filterStatus, requests, searchQuery]);

  const hasFilters =
    filterStatus !== "All" ||
    filterDepartment !== "All" ||
    searchQuery.trim() !== "";

  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setFilterDepartment("All");
  };

  // ---------- Actions ----------
  const handleApprove = async (request) => {
    const token = getTokenFromLocalStorage();
    if (!token) {
      console.error("No auth token found. Please login again.");
      return;
    }

    const requestId = request?._id;
    if (!requestId) return;

    try {
      setApprovingId(requestId);
      await axios.patch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchRegularizationRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error(
        "Error approving regularization:",
        error?.response?.data || error.message,
      );
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = (request) => {
    setRejectReason("");
    setConfirmation({ action: "reject", request });
  };

  const handleRevoke = (request) => {
    setConfirmation({ action: "revoke", request });
  };

  const handleView = (request) => {
    setSelectedRequest(request);
  };

  const closeConfirmation = () => {
    setConfirmation(null);
    setRejectReason("");
  };

  const handleConfirmAction = async () => {
    if (!confirmation) return;

    const token = getTokenFromLocalStorage();
    if (!token) {
      console.error("No auth token found. Please login again.");
      return;
    }

    try {
      if (confirmation.action === "reject") {
        setRejectLoading(true);
        await axios.patch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/${confirmation.request?._id}/reject`,
          { approvalRemarks: rejectReason.trim() },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else if (confirmation.action === "revoke") {
        setRevokeLoading(true);
        await axios.patch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/regularization-application/${confirmation.request?._id}/revoke-principal`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      setRejectLoading(false);
      setRevokeLoading(false);
      await fetchRegularizationRequests();
      closeConfirmation();
      setSelectedRequest(null);
    } catch (error) {
      console.error(
        "Error confirming action:",
        error?.response?.data || error.message,
      );
      setRejectLoading(false);
      setRevokeLoading(false);
    }
  };

  // ---------- Helper ----------
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  function formatDateDisplay(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">
                  Regularization Requests
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Review and manage attendance regularization requests from
                  faculty.
                </p>
              </div>

              {/* Department Filter */}
              <div className="relative min-w-[180px]">
                <button
                  type="button"
                  onClick={() => setIsDeptOpen(!isDeptOpen)}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                >
                  <span
                    className={
                      filterDepartment !== "All"
                        ? "text-white"
                        : "text-[#6f839f]"
                    }
                  >
                    {filterDepartment !== "All"
                      ? filterDepartment
                      : "Department"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#3984ff] transition ${isDeptOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDeptOpen && (
                  <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                    <div className="max-h-[220px] overflow-y-auto table-custom-scrollbar">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => {
                            setFilterDepartment(dept);
                            setIsDeptOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 text-left text-[12px] transition ${
                            filterDepartment === dept
                              ? "bg-[#2563EB] text-white"
                              : "text-[#cad7eb] hover:bg-[#132b49]"
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Stat Cards */}
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>

            {/* Table */}
            <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
              <div className="relative z-20 flex items-center justify-between gap-3 px-4 py-3">
                <h2 className="shrink-0 text-[18px] font-semibold text-white">
                  Regularization Requests{" "}
                  <span>({filteredRequests.length})</span>
                </h2>

                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative min-w-0 w-[240px]">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by name, ID..."
                      className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] px-3 pl-10 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    />
                  </div>

                  {/* Status Filter */}
                  <label className="relative inline-flex w-[160px]">
                    <span className="sr-only">Status</span>
                    <select
                      value={filterStatus}
                      onChange={(event) => setFilterStatus(event.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-[#244061] bg-[#0d2138] px-3 pr-9 text-[14px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    >
                      {statuses.map((option) => (
                        <option key={option} value={option}>
                          {option === "All" ? "All Status" : option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3984ff]"
                    />
                  </label>

                  {/* Reset */}
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="h-11 rounded-lg border border-[#244061] bg-[#0d2138] px-4 text-[12px] font-semibold text-[#8ca1bd] transition hover:border-[#3984ff] hover:bg-[#132b49] hover:text-white"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              <div className="relative z-0 max-h-[calc(100vh-320px)] overflow-auto table-custom-scrollbar">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Faculty Name</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Session</th>
                      <th className="px-4 py-3 font-semibold">Duration</th>
                      <th className="px-4 py-3 font-semibold">Reason</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] text-[#cad7eb]">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request, index) => (
                        <tr
                          key={`${request._id}-${index}`}
                          className="border-b border-[#132944] last:border-0"
                        >
                          <td className="px-4 py-3 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <img
                                src={userImg}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="truncate">
                                  {request.facultyId?.firstName}{" "}
                                  {request.facultyId?.lastName}
                                </span>
                                <p className="text-[11px] text-[#8ca1bd]">
                                  {request.facultyId?.designation}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(
                              request.date ||
                                request.fromDate ||
                                request.attendanceDate,
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {request.session ||
                              request.leaveSession ||
                              "Full Day"}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#18d3bf]">
                            {calculateDuration(request)}
                          </td>
                          <td
                            className="max-w-[200px] truncate px-4 py-3"
                            title={
                              request.reason || request.regularizationReason
                            }
                          >
                            {request.reason || request.regularizationReason}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[request.status]}`}
                            >
                              <span className="h-[4px] w-[4px] rounded-full bg-current" />
                              {request.status}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                              {request.status === "Pending" ? (
                                <>
                                  {approvingId === request._id ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#18d3bf] border-t-transparent" />
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleApprove(request)}
                                      disabled={approvingId !== null}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                      aria-label="Approve regularization"
                                      title="Approve"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleReject(request)}
                                    disabled={approvingId !== null}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Reject regularization"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                              <button
                                type="button"
                                onClick={() => handleView(request)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                                aria-label="View regularization details"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-8 text-center text-[#8ca1bd]"
                        >
                          No regularization requests found matching your
                          filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Detail Panel */}
      <RegularizationDetailsPanel
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRevoke={handleRevoke}
        approvingId={approvingId}
      />

      {/* Confirmation Popup */}
      <ConfirmationPopup
        action={confirmation?.action}
        request={confirmation?.request}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        revokeLoading={revokeLoading}
        rejectLoading={rejectLoading}
      />
    </div>
  );
};

export default PrincipalRegularizationListPage;
