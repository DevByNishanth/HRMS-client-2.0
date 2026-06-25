import { useMemo, useState, useEffect, useCallback } from "react";
import { Check, ChevronDown, Download, Eye, RotateCcw, X } from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import CustomDatePicker from "../../../components/CustomDatePicker";
import PermissionDetailsPopup from "./PermissionDetailsPopup";
import ExportPasswordModal from "../../../components/ExportPasswordModal";
import { exportToExcel } from "../../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../../hooks/usePasswordProtectedExport";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const DropdownFilter = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-[150px]">
      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value !== "All" ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-[13px] transition ${value === option
                ? "bg-[#132b49] text-white"
                : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ConfirmationPopup = ({ action, request, reason, onReasonChange, onClose, onConfirm, submitting }) => {
  if (!action || !request) return null;

  const isReject = action === "reject";
  const isRevoke = action === "revoke";
  const title = isReject ? "Reject Permission" : "Revoke Permission Decision";

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
          {isReject && (
            <>
              <p className="text-[13px] leading-5 text-[#cad7eb]">
                Reject {request.name}'s permission request for {request.date}?
              </p>
              <div className="mt-4">
                <label
                  htmlFor="permission-reject-reason"
                  className="mb-2 block text-[13px] font-semibold text-white"
                >
                  Reason for rejection
                </label>
                <textarea
                  id="permission-reject-reason"
                  value={reason}
                  onChange={(event) => onReasonChange(event.target.value)}
                  rows={4}
                  placeholder="Type the reason..."
                  className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                />
              </div>
            </>
          )}
          {isRevoke && (
            <p className="text-[13px] leading-5 text-[#cad7eb]">
              Revoke the pending decision for {request.name}'s permission request for {request.date}?
            </p>
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
            disabled={(isReject && !reason.trim()) || submitting}
            className={`inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md px-4 text-[16px] font-semibold shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition disabled:cursor-not-allowed disabled:opacity-60 ${isRevoke
              ? "bg-[#f0a15f] text-[#071425] hover:bg-[#ffbd7f]"
              : "bg-[#2563EB] text-white hover:bg-[#0d2b55]"
              }`}
          >
            {submitting ? <div className="loader"></div> : (isRevoke ? "Revoke Decision" : "Reject Request")}
          </button>
        </div>
      </div>
    </section>
  );
};

const HodPermissionRequestTable = ({ onCountChange, onRefresh }) => {
  const [requests, setRequests] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [status, setStatus] = useState("All");
  const [session, setSession] = useState("All");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  const exportCurrentFilteredRows = () => {
    const rows = filteredRequests.map((p) => ({
      "Name": p.name || "",
      "Date": p.date || "",
      "Session": p.session || "",
      "Duration": p.duration || "",
      "Reason": p.reason || "",
      "Status": p.status || "Pending",
    }));
    exportToExcel(rows, "Team-Permission-Requests.xlsx");
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

  const mapApiToPermission = (p) => {
    const dateObj = p.permissionDate ? new Date(p.permissionDate) : null;
    const permissionDate = dateObj || new Date();
    const hour = p.fromTime ? parseInt(p.fromTime.split(":")[0], 10) : 9;
    const sessionLabel = hour >= 12 ? "Afternoon" : "Forenoon";
    const durationLabel = p.totalMinutes
      ? p.totalMinutes >= 120
        ? `${p.totalMinutes / 60} Hours`
        : `${p.totalMinutes / 60} Hour`
      : "";
    const name = p.facultyId
      ? `${p.facultyId.firstName || ""} ${p.facultyId.lastName || ""}`.trim()
      : "";
    const designation = p.facultyId?.department || "";

    return {
      id: p._id,
      raw: p,
      dateObj: dateObj,
      date: dateObj
        ? dateObj.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        : "",
      name,
      designation,
      session: sessionLabel,
      duration: durationLabel,
      reason: p.reason || "",
      status: p.approvalStatus?.hod || "Pending",
      currentApprovalLevel: p.currentApprovalLevel || "hod",
    };
  };

  const fetchTeamPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("hrms_token");
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/permissions/hod/list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load team permissions.");
      }

      const mappedRequests = (data.data || []).map(mapApiToPermission);
      setRequests(mappedRequests);
      if (typeof onCountChange === "function") {
        onCountChange(mappedRequests.length);
      }
    } catch (fetchError) {
      console.error("Failed to fetch HOD permissions:", fetchError);
      setError(fetchError.message || "Unable to load team permissions.");
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    fetchTeamPermissions();
  }, [fetchTeamPermissions]);

  const normalizeDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const filteredRequests = useMemo(
    () =>
      requests.filter((permission) => {
        const permissionDate = permission.dateObj || new Date(permission.date);
        const statusMatch = status === "All" || permission.status === status;
        const sessionMatch = session === "All" || permission.session === session;
        const fromMatch = !fromDate || normalizeDateOnly(permissionDate) >= normalizeDateOnly(fromDate);
        const toMatch = !toDate || normalizeDateOnly(permissionDate) <= normalizeDateOnly(toDate);

        return statusMatch && sessionMatch && fromMatch && toMatch;
      }),
    [fromDate, requests, session, status, toDate],
  );

  const hasFilters = status !== "All" || session !== "All" || fromDate || toDate;

  const resetFilters = () => {
    setStatus("All");
    setSession("All");
    setFromDate(null);
    setToDate(null);
  };

  const handleApprove = async (request) => {
    const url = `${API_BASE_URL.replace(/\/$/, "")}/api/permissions/${request.id}/approve`;

    setActionInProgress(request.id);
    setError(null);

    try {
      const token = getTokenFromLocalStorage();
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ remarks: "Approved Permission" }),
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to approve request.");
      }

      toast.success("Permission approved successfully");

      // Re-fetch table data
      await fetchTeamPermissions();

      if (typeof onRefresh === "function") {
        onRefresh();
      }
    } catch (fetchError) {
      console.error("Failed to approve permission:", fetchError);
      toast.error(fetchError.message || "Failed to approve permission");
      setError(fetchError.message || "Unable to approve request.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectClick = (request) => {
    setRejectReason("");
    setConfirmation({ action: "reject", request });
  };

  const handleRevokeClick = (request) => {
    setConfirmation({ action: "revoke", request });
  };

  const closeConfirmationPopup = () => {
    setConfirmation(null);
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!confirmation || !confirmation.request) return;
    if (confirmation.action === "reject" && !rejectReason.trim()) return;

    const requestId = confirmation.request.id;
    const action = confirmation.action;

    const url = action === "revoke"
      ? `${API_BASE_URL.replace(/\/$/, "")}/api/permissions/${requestId}/revoke`
      : `${API_BASE_URL.replace(/\/$/, "")}/api/permissions/${requestId}/reject`;

    if (action === "reject") {
      setActionInProgress(requestId);
    } else {
      setRevokeLoading(true);
    }
    setError(null);
console.log("")
    try {
      const token = getTokenFromLocalStorage();
      const body = action === "reject"
        ? JSON.stringify({ remarks: rejectReason.trim() })
        : JSON.stringify({});

      const response = await fetch(url, {
        method: action === "revoke" ? "PUT" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to process request.");
      }

      if (action === "reject") {
        toast.success("Permission rejected successfully");
      } else {
        toast.success("Permission decision revoked successfully");
      }

      closeConfirmationPopup();

      // Re-fetch table data
      await fetchTeamPermissions();

      if (typeof onRefresh === "function") {
        onRefresh();
      }
    } catch (fetchError) {
      console.error(`Failed to ${action} permission:`, fetchError);
      toast.error(fetchError.message || `Failed to ${action} permission`);
      setError(fetchError.message || `Unable to ${action} request.`);
    } finally {
      setActionInProgress(null);
      setRevokeLoading(false);
    }
  };

  return (
    <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="relative z-20 flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-start xl:justify-between">
        <h2 className="text-[18px] font-semibold text-white">
          Permission Requests <span>({filteredRequests.length})</span>
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <DropdownFilter
            value={session}
            onChange={setSession}
            options={["All", "Forenoon", "Afternoon"]}
            placeholder="Session"
          />
          <DropdownFilter
            value={status}
            onChange={setStatus}
            options={["All", "Approved", "Rejected", "Pending"]}
            placeholder="Status"
          />
          <div className="min-w-[160px]">
            <CustomDatePicker
              id="hod-permission-filter-from"
              value={fromDate}
              onChange={setFromDate}
              placeholder="From Date"
            />
          </div>
          <div className="min-w-[160px]">
            <CustomDatePicker
              id="hod-permission-filter-to"
              value={toDate}
              onChange={setToDate}
              placeholder="To Date"
              popupAlign="right"
            />
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-lg border border-[#244061] bg-[#0d2138] px-4 text-[12px] font-semibold text-[#8ca1bd] transition hover:border-[#3984ff] hover:bg-[#132b49] hover:text-white"
            >
              Reset Filters
            </button>
          )}
          <button
            type="button"
            onClick={handleExportClick}
            disabled={filteredRequests.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[14px] font-medium text-white transition hover:border-[#3984ff] hover:bg-[#132b49] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <ExportPasswordModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        onConfirm={(password) => handleConfirmExport(password, exportCurrentFilteredRows)}
        loading={exportLoading}
        error={exportError}
      />

      <div className="relative z-0 h-[calc(100vh-380px)] overflow-auto table-custom-scrollbar">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Session</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[#cad7eb]">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                  Loading team permission requests...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-[#f16868]">
                  {error}
                </td>
              </tr>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((permission, index) => {
                const permissionWithColor = {
                  ...permission,
                  statusColor: statusStyles[permission.status],
                };

                return (
                  <tr
                    key={`${permission.name}-${permission.date}-${permission.session}-${index}`}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[16px] font-semibold text-white">
                          {permission.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate">{permission.name}</p>
                          <p className="truncate text-[12px] font-normal text-[#8ca1bd]">
                            {permission.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{permission.date}</td>
                    <td className="px-4 py-3">{permission.session}</td>
                    <td className="px-4 py-3 font-semibold text-[#18d3bf]">
                      {permission.duration}
                    </td>
                    <td className="max-w-[260px] truncate px-4 py-3" title={permission.reason}>
                      {permission.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[permission.status]}`}
                      >
                        <span className="h-[4px] w-[4px] rounded-full bg-current" />
                        {permission.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                        {permission.currentApprovalLevel === "hod" && permission.status === "Pending" ? (
                          <>
                            {actionInProgress === permission.id ? (
                              <div className="loader"></div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleApprove(permission)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white"
                                aria-label="Approve permission request"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRejectClick(permission)}
                              disabled={actionInProgress === permission.id}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label="Reject permission request"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : permission.currentApprovalLevel !== "hod" ? (
                          <button
                            type="button"
                            onClick={() => handleRevokeClick(permission)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a15f12] text-[#f0a15f] transition hover:bg-[#f0a15f24] hover:text-white"
                            aria-label="Revoke permission decision"
                            title="Revoke"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setSelectedPermission(permissionWithColor)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                          aria-label="View permission request details"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                  No permission requests found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PermissionDetailsPopup
        permission={selectedPermission}
        onClose={() => setSelectedPermission(null)}
      />

      <ConfirmationPopup
        action={confirmation?.action}
        request={confirmation?.request}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeConfirmationPopup}
        onConfirm={confirmReject}
        submitting={confirmation?.action === "revoke" ? revokeLoading : actionInProgress === confirmation?.request?.id}
      />
    </section>
  );
};

export default HodPermissionRequestTable;
