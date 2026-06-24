import {
  BriefcaseBusiness,
  CalendarMinus,
  ClipboardCheck,
  GraduationCap,
  Plus,
  Stethoscope,
  Building,
} from "lucide-react";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import LeaveTable from "./LeaveTable";
import { useState, useEffect } from "react";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const LEAVE_TYPE_DISPLAY = [
  { title: "Casual Leave", code: "CL", color: "#f05aa6", icon: BriefcaseBusiness },
  { title: "Medical Leave", code: "ML", color: "#18d3bf", icon: Stethoscope },
  { title: "Comp Off", code: "CO", color: "#f16868", icon: CalendarMinus },
  { title: "On Duty - Research", code: "OD-R", color: "#8b7cff", icon: GraduationCap },
  { title: "On Duty - Exam", code: "OD-E", color: "#2f80ff", icon: ClipboardCheck },
  { title: "On Duty - Official", code: "OD-O", color: "#f59d62", icon: Building },
];

const LeaveStatCard = ({ icon: Icon, title, code, used, total, color }) => {
  const usedPercentage = total > 0 ? Math.min(Math.round((used / total) * 100), 100) : 0;
  const progressDegree = (usedPercentage / 100) * 360;

  return (
    <div className="flex min-h-[76px] items-center justify-between gap-3 rounded-lg border border-[#183052] bg-[#0d2138] px-3 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${color}22`, color }}
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[12px] font- uppercase tracking-wide text-[#8ca1bd]">
            {title}
          </p>
          <p className="mt-1 text-[16px] font-semibold text-white">
            {used}
            <span className="text-[16px] font-medium text-[#9eb0cc]"> / {total} Days</span>
          </p>
        </div>
      </div>

      <div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${progressDegree}deg, #203755 ${progressDegree}deg 360deg)`,
        }}
      >
        <div
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#0d2138]"
          style={{ color }}
        >
          <span className="text-[14px] font-bold leading-none">{usedPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

const LeavePage = () => {
  const [isLeaveApplyForm, setIsLeaveApplyForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [balanceError, setBalanceError] = useState(null);

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      setIsLoadingBalances(true);
      setBalanceError(null);
      try {
        const token = localStorage.getItem("hrms_token");
        const response = await fetch(`${API_BASE_URL}/api/leave-balance/dashboard/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch leave balances");
        const data = await response.json();
        setLeaveBalances(data.leaveBalances || []);
      } catch (err) {
        setBalanceError(err.message || "Something went wrong");
      } finally {
        setIsLoadingBalances(false);
      }
    };
    fetchLeaveBalances();
  }, []);

  // Build lookup map from API response
  const leaveBalanceMap = Object.fromEntries(
    leaveBalances.map((item) => [item.leaveType, item])
  );

  // Map display config with API data
  const cards = LEAVE_TYPE_DISPLAY.map((config) => {
    const balance = leaveBalanceMap[config.title] || {};
    const available = Number(balance.available ?? 0);
    const used = Number(balance.used ?? 0);
    const total = available + used;
    return { ...config, available, used, total };
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <div className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-[#071425] pb-2 px-4 mt-2">
          <div>
            <h1 className="text-xl font-medium leading-tight text-white">Leaves</h1>
            <p className="mt-1 text-[16px] text-[#9eb0cc]">
              Review leave balances and track every leave request.
            </p>
          </div>
          <button
            onClick={() => setIsLeaveApplyForm(true)}
            type="submit"
            className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            <Plus size={14} />
            Apply for Leave
          </button>
        </div>
        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto space-y-2">
            {/* Leave Balance Cards */}
            <div className="rounded-lg border border-[#213857] bg-[#071a2d] p-3">
              <h3 className="mb-3 text-[14px] font-semibold text-[#ffffff]">General Leaves</h3>

              {isLoadingBalances && (
                <div className="flex items-center justify-center py-6 text-sm text-[#8ca1bd]">
                  Loading leave balances...
                </div>
              )}

              {balanceError && (
                <div className="flex items-center justify-center py-6 text-sm text-red-400">
                  Error: {balanceError}
                </div>
              )}

              {!isLoadingBalances && !balanceError && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card) => (
                    <LeaveStatCard key={card.title} {...card} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <LeaveTable key={refreshKey} />
          {isLeaveApplyForm && (
            <ApplyLeaveForm
              onClose={() => {
                setIsLeaveApplyForm(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default LeavePage;
