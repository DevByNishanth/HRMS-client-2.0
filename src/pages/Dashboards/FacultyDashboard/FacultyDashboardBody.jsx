import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Clock, FileCheck2, FileText, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleFromToken, getTokenFromLocalStorage, decodeToken } from "../../../utils/tokenUtils";
import ActiveDayCalendar from "./ActiveDayCalendar";
import AttendanceGauge from "./AttendanceGauge";
import LeaveOverview from "./LeaveOverview";
import RecentLogs from "./RecentLogs";
import TimeTracker from "./TimeTracker";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import ApplyPermission from "../../../components/ApplyPermission";
import userImg from "../../../assets/userImg.svg";
import { jwtDecode } from "jwt-decode";


const requestTabs = [
  { label: "Leave Requests", value: "leave", icon: FileText },
  { label: "Permission Requests", value: "permission", icon: Clock },
  { label: "Regularization Requests", value: "regularization", icon: FileCheck2 },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const getFacultyName = (faculty) => {
  if (!faculty) return "Faculty";
  const name = `${faculty?.firstName || ""} ${faculty?.lastName || ""}`.trim();
  return name || faculty?.name || "Faculty";
};

const getRegularizationList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.regularizationRequests)) return data.regularizationRequests;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const FacultyRequestsPanel = () => {
  const navigate = useNavigate();
  const [selectedRequestType, setSelectedRequestType] = useState("leave");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [regularizationRequests, setRegularizationRequests] = useState([]);
  const [loading, setLoading] = useState({ leave: false, permission: false, regularization: false });
  const [error, setError] = useState({ leave: "", permission: "", regularization: "" });

  const activeTab = requestTabs.find((tab) => tab.value === selectedRequestType);
  const ActiveIcon = activeTab.icon;
  const dept = decodeToken(getTokenFromLocalStorage())?.department;

  const fetchLeaveRequests = useCallback(async () => {
    if (!dept) return;
    setLoading((prev) => ({ ...prev, leave: true }));
    setError((prev) => ({ ...prev, leave: "" }));
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL}/api/leave-application/?department=${dept}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const applications = data?.leaveApplications || [];
      setLeaveRequests(applications.slice(0, 10).map((app) => ({
        name: getFacultyName(app?.facultyId),
        meta: app?.leaveType || app?.leaveCategory || "Leave",
        count: app?.totalDays ? `${app.totalDays} Day${app.totalDays > 1 ? "s" : ""}` : "",
      })));
    } catch (err) {
      setError((prev) => ({ ...prev, leave: "Failed to load" }));
    } finally {
      setLoading((prev) => ({ ...prev, leave: false }));
    }
  }, [dept]);

  const fetchPermissionRequests = useCallback(async () => {
    setLoading((prev) => ({ ...prev, permission: true }));
    setError((prev) => ({ ...prev, permission: "" }));
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL}/api/permissions/hod/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const items = data?.data || [];
      setPermissionRequests(items.slice(0, 10).map((p) => ({
        name: getFacultyName(p?.facultyId),
        meta: p?.reason || p?.permissionType || "Permission",
        count: p?.totalMinutes ? `${Math.round(p.totalMinutes / 60)}h` : "",
      })));
    } catch (err) {
      setError((prev) => ({ ...prev, permission: "Failed to load" }));
    } finally {
      setLoading((prev) => ({ ...prev, permission: false }));
    }
  }, []);

  const fetchRegularizationRequests = useCallback(async () => {
    setLoading((prev) => ({ ...prev, regularization: true }));
    setError((prev) => ({ ...prev, regularization: "" }));
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL}/api/attendance-regularization/hod/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const items = getRegularizationList(data);
      setRegularizationRequests(items.slice(0, 10).map((r) => ({
        name: getFacultyName(r?.facultyId),
        meta: r?.reason || r?.requestType || "Regularization",
        count: "",
      })));
    } catch (err) {
      setError((prev) => ({ ...prev, regularization: "Failed to load" }));
    } finally {
      setLoading((prev) => ({ ...prev, regularization: false }));
    }
  }, []);

  useEffect(() => {
    fetchLeaveRequests();
    fetchPermissionRequests();
    fetchRegularizationRequests();
  }, [fetchLeaveRequests, fetchPermissionRequests, fetchRegularizationRequests]);

  const handleViewAll = () => {
    if (selectedRequestType === "leave") {
      navigate("/dashboard-faculty/leaves", {
        state: { hodSelectedTab: "Team Leaves" },
      });
      return;
    }

    if (selectedRequestType === "permission") {
      navigate("/dashboard-faculty/permissions", {
        state: { hodSelectedTab: "Team Permissions" },
      });
      return;
    }

    navigate("/dashboard/regularizationList", {
      state: { hodSelectedTab: "Team Regularizations" },
    });
  };

  const requestLists = {
    leave: leaveRequests,
    permission: permissionRequests,
    regularization: regularizationRequests,
  };

  const isLoading = loading[selectedRequestType];
  const hasError = error[selectedRequestType];
  const currentList = requestLists[selectedRequestType];

  return (
    <section className="flex h-[410px] flex-col overflow-hidden rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2563eb24] text-[#3984ff]">
            <ActiveIcon size={16} />
          </span>
          <h2 className="truncate text-[18px] font-semibold text-white">{activeTab.label}</h2>
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

      <div className="mx-4 mb-3 grid grid-cols-3 gap-1 rounded-lg border border-[#183052] bg-[#071425] p-1">
        {requestTabs.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelectedRequestType(value)}
            className={`flex h-9 items-center justify-center gap-1 rounded-md text-[11px] font-semibold transition ${selectedRequestType === value
              ? "bg-[#2563EB] text-white"
              : "text-[#8ca1bd] hover:bg-[#132b49] hover:text-white"
              }`}
            title={label}
          >
            <Icon size={13} />
            <span className="hidden min-w-0 truncate xl:inline">{label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 table-custom-scrollbar">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 size={20} className="animate-spin text-[#3984ff]" />
          </div>
        ) : hasError ? (
          <p className="mt-8 text-center text-[12px] text-[#f16868]">{hasError}</p>
        ) : currentList.length === 0 ? (
          <p className="mt-8 text-center text-[12px] text-[#8ca1bd]">No {selectedRequestType} requests found.</p>
        ) : (
          <div className="space-y-2">
            {currentList.map((request, index) => (
              <div
                key={`${selectedRequestType}-${request.name}-${request.meta}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-[#071425] px-3 py-2 border border-slate-800"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#172c46] text-[#9eb0cc]">
                    <img src={userImg} alt="" className="h-8 w-8 rounded-full object-cover" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white">{request.name}</p>
                    <p className="mt-1 truncate text-[11px] font-medium text-[#3984ff]">{request.meta}</p>
                  </div>
                </div>

                {request.count && (
                  <span className="shrink-0 rounded-md bg-[#18d3bf1f] px-2 py-1 text-[12px] font-bold text-[#18d3bf]">
                    {request.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const FacultyDashboardBody = () => {
  const role = getRoleFromToken()?.toLowerCase();
  const [isLeaveApplyModal, setIsLeaveApplyModal] = useState(false);
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);
  const isHod = role === "hod";


  // decoding token 
  let token = localStorage.getItem("hrms_token");
  const decodedToken = jwtDecode(token);
  console.log("decoded", decodedToken)

  return (
    <main className="max-h-[calc(100vh-56px)]  overflow-y-auto table-custom-scrollbar bg-[#071425] px-4 py-4 text-white">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-xl font-semibold leading-tight text-white">Hello, {decodedToken?.firstName} {decodedToken?.lastName} !</h1>
            <p className="mt-1 text-[13px] text-[#9eb0cc]">
              Here's your weekly leave and attendance overview
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setIsLeaveApplyModal(true)} className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2564eba3] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]">
              <Plus size={14} />
              Apply Leave
            </button>
            <button onClick={() => setIsPermissionApplyModal(true)} className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2564eba3] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]">
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

          <div className={isHod ? "recent-logs-section grid grid-cols-12 gap-2" : "recent-logs-section"}>
            <div className={isHod ? "table-container col-span-12 xl:col-span-8" : "table-container"}>
              <RecentLogs />
            </div>
            {isHod && (
              <div className="col-span-12 xl:col-span-4 ">
                <FacultyRequestsPanel />
              </div>
            )}
          </div>

        </div>
      </div>

      {isLeaveApplyModal && <ApplyLeaveForm onClose={() => setIsLeaveApplyModal(false)} />}
      {isPermissionApplyModal && <ApplyPermission onClose={() => setIsPermissionApplyModal(false)} />}
    </main>
  );
};

export default FacultyDashboardBody;
