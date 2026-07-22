import { CalendarClock, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import PrincipalDashboardCard from "./PrincipalDashboardCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const getFacultyName = (faculty) => {
  if (!faculty) return "Faculty";
  return `${faculty?.firstName || ""} ${faculty?.lastName || ""}`.trim() || faculty?.name || "Faculty";
};

const getInitials = (name) => {
  if (!name || name === "Faculty") return "F";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "F";
};

const RecentRequestsCard = ({ className = "" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("leave");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [regularizationRequests, setRegularizationRequests] = useState([]);
  const [loading, setLoading] = useState({ leave: false, permission: false, regularization: false });
  const [error, setError] = useState({ leave: "", permission: "", regularization: "" });

  const handleViewAll = () => {
    switch (activeTab) {
      case "leave":
        navigate("/dashboard-principal/leaves");
        break;
      case "permission":
        navigate("/dashboard-principal/permissions");
        break;
      case "regularization":
        navigate("/dashboard-principal/regularizationList");
        break;
      default:
        navigate("/dashboard-principal/leaves");
    }
  };

  const fetchLeaveRequests = useCallback(async () => {
    setLoading((prev) => ({ ...prev, leave: true }));
    setError((prev) => ({ ...prev, leave: "" }));
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/leave-application`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const applications = data?.leaveApplications || [];
      // console.log("princiapl reqs : ", applications);
      const filtered = applications.filter(
        (l) =>
          l.status === "Pending" &&
          (l.currentApprovalLevel?.toLowerCase() === "principal" ||
            l.currentApprovalLevel?.toLowerCase() === "completed"),
      );
      setLeaveRequests(filtered.slice(0, 10).map((app) => {
        const name = getFacultyName(app?.facultyId);
        return {
          name,
          type: app?.leaveType || app?.leaveCategory || "Leave",
          duration: app?.totalDays ? `${app.totalDays} Day${app.totalDays > 1 ? "s" : ""}` : "",
          initials: getInitials(name),
        };
      }));
    } catch (err) {
      setError((prev) => ({ ...prev, leave: "Failed to load" }));
    } finally {
      setLoading((prev) => ({ ...prev, leave: false }));
    }
  }, []);

  const fetchPermissionRequests = useCallback(async () => {
    setLoading((prev) => ({ ...prev, permission: true }));
    setError((prev) => ({ ...prev, permission: "" }));
    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/permissions/principal/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const items = data?.data || [];
      setPermissionRequests(items.filter((p) => p.status === "Pending").slice(0, 10).map((p) => {
        const name = getFacultyName(p?.facultyId);
        return {
          name,
          type: "Permission",
          duration: p?.totalMinutes ? `${Math.round(p.totalMinutes / 60)} hr${Math.round(p.totalMinutes / 60) > 1 ? "s" : ""}` : "",
          initials: getInitials(name),
        };
      }));
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
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/attendance-regularization/principal/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const items = data?.requests || [];
      setRegularizationRequests(items.filter((r) => r.status === "Pending").slice(0, 10).map((r) => {
        const name = getFacultyName(r?.facultyId);
        return {
          name,
          type: "Regularization",
          duration: "",
          initials: getInitials(name),
        };
      }));
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

  const tabs = [
    { id: "leave", label: "Leave" },
    { id: "permission", label: "Permission" },
    { id: "regularization", label: "Regularization" },
  ];

  const requestDataMap = {
    leave: leaveRequests,
    permission: permissionRequests,
    regularization: regularizationRequests,
  };

  const currentRequests = requestDataMap[activeTab];
  const isLoading = loading[activeTab];
  const hasError = error[activeTab];

  return (
    <PrincipalDashboardCard
      title="Leave Requests"
      icon={CalendarClock}
      action="View All"
      onAction={handleViewAll}
      className={className}
    >
      <div className="flex flex-col gap-2 ">
        {/* Tabs */}
        <div className="flex gap-2  -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition ${activeTab === tab.id
                ? "border-[#2563eb] bg-[#2563eb] text-white"
                : "border-transparent text-[#8ca1bd] hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-1.5 max-h-[220px] pr-2 overflow-y-auto table-custom-scrollbar ">
          {isLoading ? (
            <div className="flex h-[120px] items-center justify-center">
              <Loader2 size={18} className="animate-spin text-[#3984ff]" />
            </div>
          ) : hasError ? (
            <p className="mt-8 text-center text-[11px] text-[#f16868]">{hasError}</p>
          ) : currentRequests.length === 0 ? (
            <p className="mt-8 text-center text-[11px] text-[#8ca1bd]">No pending {activeTab} requests.</p>
          ) : (
            currentRequests.map((request, index) => (
              <div
                key={`${request.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#1c3658] bg-[#071425] px-3 py-2 hover:border-[#2563eb] transition"
              >
                {/* Avatar and Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb24] text-[10px] font-semibold text-[#5d9bff]">
                    {request.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-white">{request.name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#60a5fa]">{request.type}</p>
                  </div>
                </div>

                {/* Duration */}
                {request.duration && (
                  <div className="shrink-0">
                    <span className="inline-flex items-center rounded-md bg-[#18d3bf1f] px-2.5 py-0.5 text-[11px] font-semibold text-[#18d3bf]">
                      {request.duration}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </PrincipalDashboardCard>
  );
};

export default RecentRequestsCard;
