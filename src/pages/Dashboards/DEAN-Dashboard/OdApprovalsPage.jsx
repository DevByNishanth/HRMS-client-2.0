import { Check, Clock, Eye, FileText, Search, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import { decodeToken, getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import userImg from "../../../assets/userImg.svg";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const OdDetailsPopup = ({ request, onClose }) => {
  if (!request) return null;

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
              OD Request Details
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Review On-Duty Request
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close OD details"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
          <p className="text-[12px] leading-5 text-[#b8c7dd]">
            Review the faculty member's request details and take appropriate action.
          </p>

          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex min-w-0 items-center gap-3">
              <img src={userImg} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold text-white">{request.name}</p>
                <p className="mt-1 truncate text-[12px] text-[#8ca1bd]">
                  {request.designation}
                </p>
              </div>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <FileText size={14} className="text-[#b8c7dd]" />
                  Leave Type
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.leaveType || "On Duty"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock size={14} className="text-[#b8c7dd]" />
                  Status
                </div>
                <p className={`mt-1 text-[15px] font-medium ${request.status === "Approved" ? "text-[#18d3bf]" : request.status === "Rejected" ? "text-[#f16868]" : "text-[#f0a15f]"}`}>
                  {request.status}
                </p>
              </div>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock size={14} className="text-[#b8c7dd]" />
                  From Date
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.fromDate || request.date}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock size={14} className="text-[#b8c7dd]" />
                  To Date
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.toDate || request.date}</p>
              </div>
            </div>

            {request.reason && (
              <>
                <div className="my-3 h-px bg-[#1a3556]" />
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                    <FileText size={15} className="text-[#3984ff]" />
                    Reason
                  </p>
                  <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
                    {request.reason}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            Close Details
            <X size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

const RejectReasonPopup = ({ request, reason, onReasonChange, onClose, onConfirm, submitting }) => {
  if (!request) return null;

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
              Reject Request
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
            Reject {request.name}'s {request.leaveType || "request"}?
          </p>

          <div className="mt-4">
            <label
              htmlFor="od-reject-reason"
              className="mb-2 block text-[13px] font-semibold text-white"
            >
              Reason for rejection
            </label>
            <textarea
              id="od-reject-reason"
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
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-[#c44848] px-4 text-[16px] font-semibold text-white transition hover:bg-[#d94f4f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Rejecting..." : "Reject Request"}
          </button>
        </div>
      </div>
    </section>
  );
};

const OdApprovalsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const statuses = ["All", "Pending", "Approved", "Rejected"];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = getTokenFromLocalStorage();
        if (!token) return;

        const decodedData = decodeToken(token);
        const dept = decodedData?.department || decodedData?.departmentName;

        const res = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();

        console.log(data.leaveApplications);
        if (res.ok && data?.leaveApplications) {
          const mapped = data.leaveApplications.map((app) => {
            const name = app.facultyId
              ? `${app.facultyId?.firstName || ""} ${app.facultyId?.lastName || ""}`.trim()
              : "Unknown";
            const designation = app.facultyId?.designation || "";
            const department = app.facultyId?.department || "";
            const leaveType = app.leaveTypeId?.leaveName || app.leaveType || "Leave";
            const leaveTypeCategory = app.leaveTypeId?.leaveCategory;
            return {
              _id: app._id,
              name,
              designation,
              department,
              leaveType,
              leaveTypeCategory,
              date: app.fromDate
                ? new Date(app.fromDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
                : "",
              fromDate: app.fromDate
                ? new Date(app.fromDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
                : "",
              toDate: app.toDate
                ? new Date(app.toDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
                : "",
              session: "Full Day",
              purpose: app.reason || leaveType,
              reason: app.reason || "",
              status: app.status || "Pending",
            };
          });

          let finalData = mapped.filter((item) => {
            return item.leaveTypeCategory == "On Duty"
          })
          setRequests(finalData);
        }
      } catch (err) {
        console.error("Error fetching OD requests:", err);
        // toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  console.log("req : ", requests)


  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchMatch =
        !searchTerm ||
        request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "All" || request.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [requests, searchTerm, statusFilter]);

  const handleApprove = async (request) => {
    try {
      setActionLoadingId(request._id);
      const token = getTokenFromLocalStorage();
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/${request._id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to approve request");
      }

      setRequests((prev) =>
        prev.map((r) => (r._id === request._id ? { ...r, status: "Approved" } : r)),
      );
      toast.success("Request approved successfully");
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error(err.message || "Failed to approve request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectClick = (request) => {
    setRejectReason("");
    setRejectTarget(request);
  };

  const closeRejectPopup = () => {
    setRejectTarget(null);
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;

    try {
      setActionLoadingId(rejectTarget._id);
      const token = getTokenFromLocalStorage();
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/${rejectTarget._id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ remarks: rejectReason.trim() }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to reject request");
      }

      setRequests((prev) =>
        prev.map((r) => (r._id === rejectTarget._id ? { ...r, status: "Rejected" } : r)),
      );
      toast.success("Request rejected");
      closeRejectPopup();
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error(err.message || "Failed to reject request");
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">
                  OD Approvals
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Review and approve on-duty requests from faculty members.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3984ff1f]">
                  <FileText size={18} className="text-[#3984ff]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] uppercase tracking-wide text-[#8ca1bd]">Total Requests</p>
                  <p className="text-[16px] font-medium text-white">{requests.length}</p>
                </div>
              </div>
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4 flex items-start gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e07f306b]">
                  <Clock size={18} className="text-[#ffffff]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] uppercase tracking-wide text-[#8ca1bd]">Pending</p>
                  <p className="text-[16px] font-medium text-[#ffffff]">{pendingCount}</p>
                </div>
              </div>
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4 flex items-start gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf1f]">
                  <Check size={18} className="text-[#18d3bf]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] uppercase tracking-wide text-[#8ca1bd]">Approved</p>
                  <p className="mt-1 text-[16px] font-medium text-[#ffffff]">
                    {requests.filter((r) => r.status === "Approved").length}
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
              <div className="relative z-20 flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
                <h2 className="text-[18px] font-semibold text-white">
                  On-Duty Requests <span>({filteredRequests.length})</span>
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative min-w-[220px]">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
                    />
                    <input
                      type="text"
                      placeholder="Search by name, department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] pl-10 pr-3 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex gap-1 rounded-lg border border-[#244061] bg-[#0d2138] p-1">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition ${statusFilter === status
                          ? "bg-[#2563EB] text-white"
                          : "text-[#8ca1bd] hover:text-white"
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-0 h-[calc(100vh-380px)] overflow-auto table-custom-scrollbar">
                <table className="w-full min-w-[980px] border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Leave Type</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Purpose</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-[#cad7eb]">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                          Loading requests...
                        </td>
                      </tr>
                    ) : filteredRequests.length > 0 ? (
                      filteredRequests.map((request, index) => (
                        <tr
                          key={request._id || `${request.name}-${request.date}-${index}`}
                          className="border-b border-[#132944] last:border-0"
                        >
                          <td className="px-4 py-3 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <img src={userImg} alt="" className="h-10 w-10 rounded-full object-cover" />
                              <div className="min-w-0">
                                <p className="truncate">{request.name}</p>
                                <p className="truncate text-[12px] font-normal text-[#8ca1bd]">
                                  {request.designation}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{request.department}</td>
                          <td className="px-4 py-3 font-semibold text-[#3984ff]">{request.leaveType}</td>
                          <td className="px-4 py-3 font-semibold text-white">{request.date}</td>
                          <td className="max-w-[260px] truncate px-4 py-3" title={request.purpose}>
                            {request.purpose}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[request.status]}`}
                            >
                              <span className="h-[4px] w-[4px] rounded-full bg-current" />
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                              {request.status === "Pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(request)}
                                    disabled={actionLoadingId === request._id}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                    aria-label="Approve request"
                                    title="Approve"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectClick(request)}
                                    disabled={actionLoadingId === request._id}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                    aria-label="Reject request"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(request)}
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
                        <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                          {requests.length === 0
                            ? "No requests found."
                            : "No requests found matching your filters."}
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

      <OdDetailsPopup
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      <RejectReasonPopup
        request={rejectTarget}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeRejectPopup}
        onConfirm={confirmReject}
        submitting={actionLoadingId === rejectTarget?._id}
      />
    </div>
  );
};

export default OdApprovalsPage;
