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
  Send,
  AlertCircle,
  SunMedium,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import userImg from "../../../assets/userImg.svg";
import { decodeToken, getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

// ---------- Custom Dropdown Component ----------
const CustomDropdown = ({ placeholder = "Select", value, onChange, options }) => {
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
                className={`w-full px-3 py-2 text-left text-[12px] transition ${value === option
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

// ---------- Detail Slide Panel ----------
const PermissionDetailsPanel = ({ request, onClose, onApprove, onReject, onRevoke, approvingId }) => {
  if (!request) return null;

  const canApprove = request.status === "Pending";
  const canRevoke = request.status === "Approved" || request.status === "Rejected";

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
              Permission Request
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
          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img src={userImg} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
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
              <p className="mt-1 text-[16px] font-semibold text-white">{request.date || formatDateDisplay(request.fromDate)}</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <SunMedium size={14} className="text-[#b8c7dd]" />
                  Session
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.session || request.leaveSession || "Full Day"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock3 size={14} className="text-[#b8c7dd]" />
                  Duration
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.duration || `${request.totalHours || 0} Hours`}</p>
              </div>
            </div>

            {request.currentApprovalLevel && (
              <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]">
                    <TimerReset size={18} />
                  </div>
                  <p className="text-[13px] font-medium text-[#cad7eb]">Approval Level</p>
                </div>
                <p className="text-[15px] font-semibold text-white capitalize">{request.currentApprovalLevel}</p>
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
        </div>

        <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
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
        </div>
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
}) => {
  if (!action || !request) return null;

  const isReject = action === "reject";
  const isRevoke = action === "revoke";
  const title = isReject ? "Reject Permission Request" : "Revoke Permission Decision";
  const message = isReject
    ? `Reject ${request.facultyId?.firstName}'s permission request?`
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
            <h2 className="mt-1 text-[18px] font-semibold text-white">{title}</h2>
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
            disabled={(isReject && !reason.trim()) || (isRevoke && revokeLoading)}
            className={`h-10 rounded-md px-4 text-[16px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${isRevoke
                ? "bg-[#f0a15f] text-[#071425] hover:bg-[#ffbd7f]"
                : "bg-[#c44848] text-white hover:bg-[#d94f4f]"
              }`}
          >
            {isRevoke && revokeLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#071425] border-t-transparent" />
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
        <p className="text-[16px] font-semibold leading-none text-white">{value}</p>
      </div>
    </div>
  </div>
);

// ---------- Main Component ----------
const PrincipalPermissionTable = ({ filterDepartment = "All" }) => {
  const token = getTokenFromLocalStorage();
  let decodedData = decodeToken(token);

  const [permissions, setPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSession, setFilterSession] = useState("All");
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const statuses = ["All", "Approved", "Rejected", "Pending"];
  const sessions = ["All", "Forenoon", "Afternoon"];

  // ---------- API Fetch ----------
  async function fetchPermissions() {
    try {
      const response = await axios.get(
        `${API_BASE_URL.replace(/\/$/, "")}/api/permission-application/?currentApprovalLevel=${decodedData?.role}`,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
        }
      );
      setPermissions(response.data?.permissionApplications || []);
    } catch (error) {
      console.error("Error fetching permission requests:", error);
      setPermissions([]);
    }
  }

  useEffect(() => {
    fetchPermissions();
  }, []);

  // ---------- Stat Cards (filtered by department) ----------
  const deptPermissions = useMemo(() => {
    if (filterDepartment === "All") return permissions;
    return permissions.filter((p) => p.facultyId?.department === filterDepartment);
  }, [filterDepartment, permissions]);

  const statCards = useMemo(() => {
    const total = deptPermissions.length;
    const approved = deptPermissions.filter((p) => p.status === "Approved").length;
    const rejected = deptPermissions.filter((p) => p.status === "Rejected").length;
    const pending = deptPermissions.filter((p) => p.status === "Pending").length;

    return [
      { label: "Total Permissions", value: total, icon: Users, color: "#3984ff" },
      { label: "Approved", value: approved, icon: CheckCircle2, color: "#18d3bf" },
      { label: "Rejected", value: rejected, icon: XCircle, color: "#f16868" },
      { label: "Pending", value: pending, icon: Clock, color: "#f0a15f" },
    ];
  }, [deptPermissions]);

  // ---------- Filtering ----------
  const filteredPermissions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return permissions.filter((perm) => {
      const name = `${perm.facultyId?.firstName || ""} ${perm.facultyId?.lastName || ""}`.trim();
      const matchesSearch =
        !normalizedSearch ||
        [name, perm.facultyId?.empId, perm.reason]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const statusMatch = filterStatus === "All" || perm.status === filterStatus;
      const sessionMatch = filterSession === "All" || (perm.session || perm.leaveSession) === filterSession;
      const deptMatch = filterDepartment === "All" || perm.facultyId?.department === filterDepartment;

      return matchesSearch && statusMatch && sessionMatch && deptMatch;
    });
  }, [filterDepartment, filterSession, filterStatus, permissions, searchQuery]);

  const hasFilters = filterStatus !== "All" || filterSession !== "All" || searchQuery.trim() !== "";

  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setFilterSession("All");
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
        `${API_BASE_URL.replace(/\/$/, "")}/api/permission-application/${requestId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("hrms_token")}` } }
      );
      await fetchPermissions();
      setSelectedPermission(null);
    } catch (error) {
      console.error("Error approving permission:", error?.response?.data || error.message);
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
    setSelectedPermission(request);
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
          `${API_BASE_URL.replace(/\/$/, "")}/api/permission-application/${confirmation.request?._id}/reject`,
          { remarks: rejectReason.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (confirmation.action === "revoke") {
        setRevokeLoading(true);
        await axios.patch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/permission-application/${confirmation.request?._id}/revoke-principal`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRevokeLoading(false);
      }

      await fetchPermissions();
      closeConfirmation();
      setSelectedPermission(null);
    } catch (error) {
      console.error("Error confirming action:", error?.response?.data || error.message);
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
    <>
      {/* Stat Cards */}
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Table Section */}
      <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
        <div className="relative z-20 flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="shrink-0 text-[18px] font-semibold text-white">
            All Permission Requests <span>({filteredPermissions.length})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-0 w-[220px]">
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

            {/* Session Filter
            <div className="flex-shrink-0">
              <CustomDropdown
                placeholder="Session"
                value={filterSession}
                onChange={setFilterSession}
                options={sessions}
              />
            </div> */}

            {/* Status Filter */}
            <div className="flex-shrink-0">
              <CustomDropdown
                placeholder="Status"
                value={filterStatus}
                onChange={setFilterStatus}
                options={statuses}
              />
            </div>

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
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#cad7eb]">
              {filteredPermissions.length > 0 ? (
                filteredPermissions.map((permission, index) => (
                  <tr
                    key={`${permission._id}-${index}`}
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
                            {permission.facultyId?.firstName}{" "}
                            {permission.facultyId?.lastName}
                          </span>
                          <p className="text-[11px] text-[#8ca1bd]">
                            {permission.facultyId?.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{formatDate(permission.fromDate || permission.date)}</td>
                    <td className="px-4 py-3">{permission.session || permission.leaveSession || "Full Day"}</td>
                    <td className="px-4 py-3 font-semibold text-[#18d3bf]">
                      {permission.duration || `${permission.totalHours || 0} Hours`}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3" title={permission.reason}>
                      {permission.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[permission.status]}`}
                      >
                        <span className="h-[4px] w-[4px] rounded-full bg-current" />
                        {permission.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                        {permission.status === "Pending" ? (
                          <>
                            {approvingId === permission._id ? (
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#18d3bf] border-t-transparent" />
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleApprove(permission)}
                                disabled={approvingId !== null}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Approve permission request"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleReject(permission)}
                              disabled={approvingId !== null}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Reject permission request"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRevoke(permission)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a15f12] text-[#f0a15f] transition hover:bg-[#f0a15f24] hover:text-white"
                            aria-label="Revoke permission decision"
                            title={`Revoke ${permission.status}`}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleView(permission)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                          aria-label="View permission request details"
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
                    No permission requests found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Panel */}
      <PermissionDetailsPanel
        request={selectedPermission}
        onClose={() => setSelectedPermission(null)}
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
      />
    </>
  );
};

export default PrincipalPermissionTable;
