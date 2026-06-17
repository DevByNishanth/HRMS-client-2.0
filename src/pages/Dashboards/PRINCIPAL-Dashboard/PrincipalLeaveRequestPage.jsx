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
  Layers,
  ShieldCheck,
  Send,
  AlertCircle,
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

const CustomDropdown = ({
  placeholder = "Select",
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full min-w-[140px] items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <div className="max-h-[200px] overflow-y-auto table-custom-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[12px] transition ${
                  value === option
                    ? "bg-[#2563EB] text-white"
                    : "text-[#cad7eb] hover:bg-[#132b49]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SelectFilter = ({ label, value, onChange, options }) => (
  <label className="relative inline-flex  w-[200px] max-w-full">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full appearance-none rounded-lg border border-[#244061] bg-[#0d2138] px-3 pr-9 text-[14px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "All" ? `All ${label}` : option}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3984ff]"
    />
  </label>
);

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
        <p className=" text-[16px] font-semibold leading-none text-white">
          {value}
        </p>
      </div>
    </div>
  </div>
);

// Leave Details Slide Panel
const LeaveDetailsPanel = ({ request, onClose, onRevoke }) => {
  if (!request) return null;

  const canRevoke =
    request.status === "Approved" || request.status === "Rejected";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

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
              Leave Request
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
                <Layers size={13} className="text-[#3984ff]" />
                Leave Type
              </div>
              <p className="mt-1 text-[16px] font-semibold text-white">
                {request.leaveTypeId?.leaveName || "N/A"}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <CalendarDays size={14} className="text-[#b8c7dd]" />
                  From
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">
                  {formatDate(request.fromDate)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <CalendarDays size={14} className="text-[#b8c7dd]" />
                  To
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">
                  {formatDate(request.toDate)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                  <TimerReset size={18} />
                </div>
                <p className="text-[13px] font-medium text-[#cad7eb]">
                  Leave Duration
                </p>
              </div>
              <p className="text-[15px] font-semibold text-white">
                {request.totalDays || 0}{" "}
                {request.totalDays === 1 ? "Day" : "Days"}
              </p>
            </div>

            {request.leaveSession && (
              <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                    <Clock3 size={18} />
                  </div>
                  <p className="text-[13px] font-medium text-[#cad7eb]">
                    Leave Session
                  </p>
                </div>
                <p className="text-[15px] font-semibold text-white">
                  {request.leaveSession}
                </p>
              </div>
            )}

            {request.currentApprovalLevel && (
              <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                    <ShieldCheck size={18} />
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
              {request.reason || "No reason provided"}
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
                    <div key={index} className="relative">
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
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* 
        <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          {canRevoke ? (
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

// Confirmation Popup for Reject/Revoke
const ConfirmationPopup = ({
  action,
  request,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  revokeLoading,
}) => {
  if (!action || !request) return null;

  const isReject = action === "reject";
  const isRevoke = action === "revoke";
  const title = isReject ? "Reject Leave Request" : "Revoke Leave Decision";
  const message = isReject
    ? `Reject ${request.facultyId?.firstName}'s leave?`
    : `Revoke the ${request.status.toLowerCase()} decision?`;

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
                htmlFor="reject-reason"
                className="mb-2 block text-[13px] font-semibold text-white"
              >
                Reason for rejection
              </label>
              <textarea
                id="reject-reason"
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
              (isReject && !reason.trim()) || (isRevoke && revokeLoading)
            }
            className={`h-10 rounded-md px-4 text-[16px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isRevoke
                ? "bg-[#f0a15f] text-[#071425] hover:bg-[#ffbd7f]"
                : "bg-[#c44848] text-white hover:bg-[#d94f4f]"
            }`}
          >
            {isRevoke && revokeLoading ? (
              <div className="loader"></div>
            ) : isRevoke ? (
              "Revoke Decision"
            ) : (
              "Reject Request"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

const PrincipalLeaveRequestPage = () => {
  const token = getTokenFromLocalStorage();
  let decodedData = decodeToken(token);
  let dept = decodedData ? decodedData.department : null;

  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const statuses = ["All", "Approved", "Rejected", "Pending"];

  const departmentOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(requests.map((r) => r.facultyId?.department).filter(Boolean)),
      ),
    ],
    [requests],
  );

  async function fetchLeaveRequests() {
    try {
      const response = await axios.get(
        `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application`,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
        },
      );
      let filteredRequests = response.data?.leaveApplications.filter((item) => {
        return (
          item.currentApprovalLevel.toLowerCase() == "completed" ||
          item.currentApprovalLevel.toLowerCase() == "principal"
        );
      });

      console.log("filtered principal reqs : ", filteredRequests);
      setRequests(filteredRequests || []);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setRequests([]);
    }
  }

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Stat card counts based on department filter
  const deptRequests = useMemo(() => {
    if (filterDepartment === "All") return requests;
    return requests.filter((r) => r.facultyId?.department === filterDepartment);
  }, [requests, filterDepartment]);

  const statCards = useMemo(() => {
    const total = deptRequests.length;
    const approved = deptRequests.filter((r) => r.status === "Approved").length;
    const rejected = deptRequests.filter((r) => r.status === "Rejected").length;
    const pending = deptRequests.filter((r) => r.status === "Pending").length;

    return [
      { label: "Total Requests", value: total, icon: Users, color: "#3984ff" },
      {
        label: "Approved Leaves",
        value: approved,
        icon: CheckCircle2,
        color: "#18d3bf",
      },
      {
        label: "Rejected Leaves",
        value: rejected,
        icon: XCircle,
        color: "#f16868",
      },
      {
        label: "Pending Leaves",
        value: pending,
        icon: Clock,
        color: "#f0a15f",
      },
    ];
  }, [deptRequests]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const name =
        `${request.facultyId?.firstName || ""} ${request.facultyId?.lastName || ""}`.trim();
      const matchesSearch =
        !normalizedSearch ||
        [
          name,
          request.facultyId?.empId,
          request.leaveTypeId?.leaveName,
          request.reason,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const statusMatch =
        filterStatus === "All" || request.status === filterStatus;
      const deptMatch =
        filterDepartment === "All" ||
        request.facultyId?.department === filterDepartment;

      return matchesSearch && statusMatch && deptMatch;
    });
  }, [filterDepartment, filterStatus, requests, searchQuery]);

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
        `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/${requestId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hrms_token")}`,
          },
        },
      );
      await fetchLeaveRequests();
    } catch (error) {
      console.error(
        "Error approving leave:",
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
        await axios.patch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/${confirmation.request?._id}/reject`,
          { remarks: rejectReason.trim() },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else if (confirmation.action === "revoke") {
        setRevokeLoading(true);
        await axios.patch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/${confirmation.request?._id}/revoke-principal`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setRevokeLoading(false);
      }

      await fetchLeaveRequests();
      closeConfirmation();
    } catch (error) {
      console.error(
        "Error confirming action:",
        error?.response?.data || error.message,
      );
      setRevokeLoading(false);
    }
  };

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto">
            <header className="flex items-center justify-between ">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">
                  Leave Requests
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Review and manage leave requests across all departments.
                </p>
              </div>
              <div className="flex justify-end">
                <SelectFilter
                  label="Department"
                  value={filterDepartment}
                  onChange={setFilterDepartment}
                  options={departmentOptions}
                />
              </div>
            </header>

            {/* Department Filter for Stat Cards
            <div className="mt-5 flex items-center gap-3">
              <span className="text-[13px] font-semibold text-[#8ca1bd]">
                Filter by Department:
              </span>
              <SelectFilter
                label="Department"
                value={filterDepartment}
                onChange={setFilterDepartment}
                options={departmentOptions}
              />
            </div> */}

            {/* Stat Cards */}

            <div className="grid grid-cols-1 mt-3 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>

            {/* Leave Requests Table */}
            <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
              <div className="relative z-20 flex items-center justify-between gap-3 px-4 py-3 ">
                <h2 className="shrink-0 text-[18px] font-semibold text-white">
                  Leave Requests <span>({filteredRequests.length})</span>
                </h2>

                <div className="flex items-center gap-4">
                  <div className="relative min-w-0 w-[240px]">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search leave requests..."
                      className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] px-3 pl-10 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    />
                  </div>

                  <CustomDropdown
                    placeholder="Status"
                    value={filterStatus}
                    onChange={setFilterStatus}
                    options={statuses}
                  />
                </div>
              </div>

              <div className="relative z-0 max-h-[calc(100vh-320px)] overflow-auto table-custom-scrollbar">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Faculty Name</th>
                      <th className="px-4 py-3 font-semibold">Leave Type</th>
                      <th className="px-4 py-3 font-semibold">From</th>
                      <th className="px-4 py-3 font-semibold">To</th>
                      <th className="px-4 py-3 font-semibold">Duration</th>
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
                            {request.leaveTypeId?.leaveName}
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(request.fromDate)}
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(request.toDate)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#18d3bf]">
                            {request.totalDays || 0} Day
                            {request.totalDays !== 1 ? "s" : ""}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${
                                statusStyles[request.status]
                              }`}
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
                                    <div className="loader"></div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleApprove(request)}
                                      disabled={approvingId !== null}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                      aria-label="Approve request"
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
                                    aria-label="Reject request"
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
                                aria-label="View request details"
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
                          No leave requests found matching your filters.
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

      {/* Leave Details Panel */}
      <LeaveDetailsPanel
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onRevoke={handleRevoke}
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
      />
    </div>
  );
};

export default PrincipalLeaveRequestPage;
