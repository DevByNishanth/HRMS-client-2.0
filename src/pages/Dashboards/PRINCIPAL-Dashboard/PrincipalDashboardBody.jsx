import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AttendancePieCard from "./AttendancePieCard";
import PrincipalDashboardHeader from "./PrincipalDashboardHeader";
import PendingApprovalsCard from "./PendingApprovalsCard";
import RecentRequestsCard from "./RecentRequestsCard";
import StaffDistributionChart from "./StaffDistributionChart";
import RecentFacultyListTable from "./RecentFacultyListTable";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const PrincipalDashboardBody = () => {
  const [pendingCounts, setPendingCounts] = useState({
    leave: 0,
    permission: 0,
    regularize: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchPendingCounts = useCallback(async () => {
    setLoading(true);
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = API_BASE_URL.replace(/\/$/, "");

      // Fetch all 3 APIs in parallel
      const [leaveRes, permissionRes, regularizationRes] =
        await Promise.allSettled([
          axios.get(`${baseUrl}/api/leave-application`, { headers }),
          axios.get(`${baseUrl}/api/permissions/principal/list`, { headers }),
          axios.get(`${baseUrl}/api/attendance-regularization/principal/list`, {
            headers,
          }),
        ]);

      // Leave: count Pending items at principal level
      let leaveCount = 0;
      if (leaveRes.status === "fulfilled") {
        const leaves = leaveRes.value.data?.leaveApplications || [];
        leaveCount = leaves.filter(
          (l) =>
            l.status === "Pending" &&
            (l.currentApprovalLevel?.toLowerCase() === "principal" ||
              l.currentApprovalLevel?.toLowerCase() === "completed"),
        ).length;
      }

      // Permission: count Pending items
      let permissionCount = 0;
      if (permissionRes.status === "fulfilled") {
        const permissions = permissionRes.value.data?.data || [];
        permissionCount = permissions.filter(
          (p) => p.status === "Pending",
        ).length;
      }

      // Regularization: count Pending items
      let regularizeCount = 0;
      if (regularizationRes.status === "fulfilled") {
        const regularizations = regularizationRes.value.data?.requests || [];
        regularizeCount = regularizations.filter(
          (r) => r.status === "Pending",
        ).length;
      }

      setPendingCounts({
        leave: leaveCount,
        permission: permissionCount,
        regularize: regularizeCount,
      });
    } catch (err) {
      console.error("Error fetching pending counts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingCounts();
  }, [fetchPendingCounts]);

  const totalPending =
    pendingCounts.leave + pendingCounts.permission + pendingCounts.regularize;

  const pendingRequests = [
    { name: "Leave", value: pendingCounts.leave, color: "#1666ba" },
    { name: "Permission", value: pendingCounts.permission, color: "#368ce7" },
    { name: "Regularize", value: pendingCounts.regularize, color: "#7ab3ef" },
  ];

  return (
    <main className="max-h-[calc(100vh-56px)] overflow-y-auto table-custom-scrollbar bg-[#071425] px-4 py-4 text-white">
      <div className="mx-auto max-w-[1440px] space-y-5">
        {/* // ? ===============================  this is the header ================================  */}
        <PrincipalDashboardHeader totalPending={totalPending} />

        {/*// ?   ============================== first container / section ============================= */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
          <RecentFacultyListTable className="min-h-[300px] xl:col-span-3" />
          <StaffDistributionChart className="min-h-[300px] xl:col-span-2" />
        </div>

        {/*// ?   ============================== second container / section ============================= */}
        <div className="grid grid-cols-12  gap-4">
          <AttendancePieCard className="min-h-[330px] xl:col-span-4" />
          <RecentRequestsCard className="max-h-[330px] overflow-auto xl:col-span-4" />
          <PendingApprovalsCard
            pendingRequests={pendingRequests}
            className="min-h-[330px] xl:col-span-4"
          />
        </div>
      </div>
    </main>
  );
};

export default PrincipalDashboardBody;
