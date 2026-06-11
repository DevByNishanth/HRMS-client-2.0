import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getRoleFromToken, getTokenFromLocalStorage } from "../../utils/tokenUtils";
import Sidebar from "../../components/Siedbar";
import CommonHeader from "../../components/CommonHeader";
import CustomDatePicker from "../../components/CustomDatePicker";
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
    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[status] || statusStyles.Pending
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
        <img src={noDataFoundImg} alt="No data found" className="h-32 w-auto opacity-95" />
        <p className="mt-2 text-[14px] font-semibold text-[#cad7eb]">No data found</p>
      </div>
    </td>
  </tr>
);

const getRegularizationList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.regularizationRequests)) return data.regularizationRequests;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getFacultyName = (request) => {
  const fullName = `${request?.facultyId?.firstName || ""} ${request?.facultyId?.lastName || ""}`.trim();
  return fullName || request?.name || "Faculty";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
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

const MyRegularizationTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesDate =
        !selectedDate || isSameDay(new Date(request.attendanceDate), selectedDate);
      const matchesStatus = selectedStatus === "All" || request.status === selectedStatus;

      return matchesDate && matchesStatus;
    });
  }, [requests, selectedDate, selectedStatus]);

  const fetchMyRegularizations = useCallback(async () => {
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/my`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        setRequests(getRegularizationList(data));
      } else {
        console.error("Failed to fetch regularizations:", data?.message || data);
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

  return (
    <section className="mt-4 rounded-xl border border-[#183052] min-h-[400px] max-h-[calc(100vh-200px)] overflow-y-auto bg-[#0a1a2d] ">
      <div className="relative z-20 flex items-center justify-between px-4 py-3">
        <h2 className="text-[18px] font-semibold text-white">
          My regularization requests <span>({filteredRequests.length})</span>
        </h2>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center gap-1">
            <div className="w-[160px]">
              <CustomDatePicker
                id="my-regularization-date-filter"
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Filter by date"
                popupAlign="right"
              />
            </div>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="inline-flex h-11 w-9 items-center justify-center rounded-md border border-[#244061] bg-[#0d2138] text-[#9eb0cc] transition hover:border-[#f16868] hover:text-[#f16868]"
                aria-label="Clear date filter"
                title="Clear date filter"
              >
                <X size={14} />
              </button>
            )}
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
              <th className="px-8 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#cad7eb]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#9eb0cc]">
                  Loading regularization requests...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <EmptyTableRow colSpan={5} />
            ) : (
              filteredRequests.map((item) => (
                <tr key={item._id} className="border-b border-[#132944] last:border-0">
                  <td className="px-4 py-3 font-semibold text-white">{formatDate(item.attendanceDate)}</td>
                  <td className="px-4 py-3 font-semibold text-white">{formatTime(item.requestedInTime)}</td>
                  <td className="px-4 py-3 font-semibold text-white">{formatTime(item.requestedOutTime)}</td>
                  <td className="max-w-[260px] truncate px-4 py-3 text-white" title={item.reason}>
                    {item.reason}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const HodRegularizationTable = ({ onCountChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      return !selectedDate || isSameDay(new Date(request.attendanceDate), selectedDate);
    });
  }, [requests, selectedDate]);

  const fetchHodRegularizations = useCallback(async () => {
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/hod/list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        setRequests(getRegularizationList(data));
      } else {
        console.error("Failed to fetch HOD regularizations:", data?.message || data);
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching HOD regularizations:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchHodRegularizations();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchHodRegularizations]);

  useEffect(() => {
    onCountChange?.(requests.length);
  }, [onCountChange, requests.length]);

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
      } else {
        console.error("Failed to approve regularization:", data?.message || data);
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
        closeRejectPopup();
      } else {
        console.error("Failed to reject regularization:", data?.message || data);
      }
    } catch (err) {
      console.error("Error rejecting regularization:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const isProcessing = (request) => processingId === request?._id;

  return (
    <>
      <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
        <div className="relative z-20 flex items-center justify-between px-4 py-3">
          <h2 className="text-[18px] font-semibold text-white">
            Team regularization requests <span>({filteredRequests.length})</span>
          </h2>

          <div className="flex items-center gap-1">
            <div className="w-[160px]">
              <CustomDatePicker
                id="hod-regularization-date-filter"
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Filter by date"
                popupAlign="right"
              />
            </div>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="inline-flex h-11 w-9 items-center justify-center rounded-md border border-[#244061] bg-[#0d2138] text-[#9eb0cc] transition hover:border-[#f16868] hover:text-[#f16868]"
                aria-label="Clear date filter"
                title="Clear date filter"
              >
                <X size={14} />
              </button>
            )}
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
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#cad7eb]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#9eb0cc]">
                    Loading regularization requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <EmptyTableRow colSpan={6} />
              ) : (
                filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <img src={userImg} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="truncate">{getFacultyName(request)}</p>
                          <p className="truncate text-[12px] font-normal text-[#8ca1bd]">
                            {request.facultyId?.empId || request.facultyId?.department || "--"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{formatDate(request.attendanceDate)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatTime(request.requestedInTime)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatTime(request.requestedOutTime)}</td>
                    <td className="max-w-[260px] truncate px-4 py-3" title={request.reason}>
                      {request.reason}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {request.status === "Pending" ? (
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
                        ) : (
                          <StatusBadge status={request.status} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <RejectConfirmationPopup
        request={rejectRequest}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeRejectPopup}
        onConfirm={confirmReject}
        submitting={processingId === rejectRequest?._id}
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

  const content = hodSelectedTab === "My Regularizations"
    ? <MyRegularizationTable />
    : <HodRegularizationTable onCountChange={setHodRegularizationCount} />;

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
                    className={`px-6 py-2 text-sm font-medium transition ${tab === hodSelectedTab
                      ? "rounded-md bg-[#2563EB] text-white"
                      : "rounded-md hover:bg-slate-600/20"
                      }`}
                  >
                    {tab}
                    {tab === "Team Regularizations" && (
                      <span
                        className={`ml-1 rounded px-2 py-[2px] text-xs ${tab === hodSelectedTab
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
