import { useState, useEffect } from "react";
import {
  ArrowRight,
  Clock,
  FileCheck2,
  FileText,
  Plus,
  CalendarCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getRoleFromToken,
  decodeToken,
  getTokenFromLocalStorage,
} from "../../../utils/tokenUtils";
import ActiveDayCalendar from "./ActiveDayCalendar";
import AttendanceGauge from "./AttendanceGauge";
import LeaveOverview from "./LeaveOverview";
import RecentLogs from "./RecentLogs";
import TimeTracker from "./TimeTracker";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import ApplyPermission from "../../../components/ApplyPermission";
import userImg from "../../../assets/userImg.svg";

const statusStyles = {
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
};

const DeanRequestsPanel = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = getTokenFromLocalStorage();
        if (!token) return;

        const decodedData = decodeToken(token);
        const dept = decodedData?.department || decodedData?.departmentName;
        const role = decodedData?.role;
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL ||
          "https://sece_hrms_server.onrender.com";

        // Fetch leave applications for the department
        const leaveRes = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/leave-application/?currentApprovalLevel=${role}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const leaveData = await leaveRes.json();

        if (leaveRes.ok && leaveData?.leaveApplications) {
          // Map to a simpler format
          const mappedRequests = leaveData.leaveApplications
            .slice(0, 10)
            .map((app) => {
              const name = app.facultyId
                ? `${app.facultyId?.firstName || ""} ${app.facultyId?.lastName || ""}`.trim()
                : "Unknown";
              const department =
                app.facultyId?.department || app.facultyId?.designation || "";
              return {
                _id: app._id,
                name,
                department,
                purpose: app.leaveTypeId?.leaveName || app.leaveType || "Leave",
                date: app.fromDate
                  ? new Date(app.fromDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  : "",
                status: app.status || "Pending",
              };
            });
          setRequests(mappedRequests);
        }
      } catch (err) {
        console.error("Error fetching OD requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleViewAll = () => {
    navigate("/dashboard-dean/od-approvals");
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2563eb24] text-[#3984ff]">
            <CalendarCheck size={16} />
          </span>
          <h2 className="truncate text-[16px] font-semibold text-white">
            Upcoming OD Requests
          </h2>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-[#3984ff] transition hover:text-white"
        >
          View All
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 table-custom-scrollbar">
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#8ca1bd]">
            Loading requests...
          </p>
        ) : requests.length > 0 ? (
          <div className="space-y-2">
            {requests.map((request, index) => (
              <div
                key={request._id || `${request.name}-${request.date}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-[#071425] px-3 py-2 border border-slate-800"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#172c46] text-[#9eb0cc]">
                    <img
                      src={userImg}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white">
                      {request.name}
                    </p>
                    <p className="truncate text-[11px] text-[#8ca1bd]">
                      {request.department}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-[#3984ff]">
                      {request.purpose}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-bold ${statusStyles[request.status] || "text-[#8ca1bd] bg-[#8ca1bd1f]"}`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-[13px] text-[#8ca1bd]">
            No OD requests found.
          </p>
        )}
      </div>
    </section>
  );
};

const DeanDashboardBody = () => {
  const role = getRoleFromToken()?.toLowerCase();
  const [isLeaveApplyModal, setIsLeaveApplyModal] = useState(false);
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);
  const isHod = role === "hod" || role === "dean" || role?.startsWith("dean-");

  // Decode token for greeting
  const token = localStorage.getItem("hrms_token");
  let firstName = "Alex";
  let lastName = "";
  if (token) {
    try {
      const decoded = decodeToken(token);
      firstName = decoded?.firstName || "Alex";
      lastName = decoded?.lastName || "";
    } catch (e) {
      // fallback
    }
  }

  return (
    <main className="max-h-[calc(100vh-56px)] overflow-y-auto table-custom-scrollbar bg-[#071425] px-4 py-4 text-white">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-xl font-semibold leading-tight text-white">
              Hello, {firstName} {lastName}!
            </h1>
            <p className="mt-1 text-[13px] text-[#9eb0cc]">
              Here's your weekly leave and attendance overview
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsLeaveApplyModal(true)}
              className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2564eba3] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
            >
              <Plus size={14} />
              Apply Leave
            </button>
            <button
              onClick={() => setIsPermissionApplyModal(true)}
              className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2564eba3] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
            >
              <Plus size={14} />
              Apply Permission
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <LeaveOverview />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TimeTracker />
            <ActiveDayCalendar />
            <AttendanceGauge />
          </div>

          <div className="recent-logs-section grid grid-cols-12 gap-2">
            <div className="table-container col-span-12 xl:col-span-8  ">
              <RecentLogs />
            </div>

            <div className="col-span-12 xl:col-span-4">
              <DeanRequestsPanel />
            </div>
          </div>
        </div>
      </div>

      {isLeaveApplyModal && (
        <ApplyLeaveForm onClose={() => setIsLeaveApplyModal(false)} />
      )}
      {isPermissionApplyModal && (
        <ApplyPermission onClose={() => setIsPermissionApplyModal(false)} />
      )}
    </main>
  );
};

export default DeanDashboardBody;
