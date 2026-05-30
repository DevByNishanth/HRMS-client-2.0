import { useState } from "react";
import { Plus } from "lucide-react";
import ActiveDayCalendar from "./ActiveDayCalendar";
import AttendanceGauge from "./AttendanceGauge";
import LeaveOverview from "./LeaveOverview";
import RecentLogs from "./RecentLogs";
import TimeTracker from "./TimeTracker";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import ApplyPermission from "../../../components/ApplyPermission";

const FacultyDashboardBody = () => {
  const [isLeaveApplyModal, setIsLeaveApplyModal] = useState(false);
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);

  return (
    <main className="max-h-[calc(100vh-56px)]  overflow-y-auto table-custom-scrollbar bg-[#071425] px-4 py-4 text-white">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-xl font-semibold leading-tight text-white">Hello, Alex!</h1>
            <p className="mt-1 text-[13px] text-[#9eb0cc]">
              Here's your weekly leave and attendance overview
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setIsLeaveApplyModal(true)} className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2563EB] px-5 text-[14px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.35)] transition hover:bg-[#1049c4]">
              <Plus size={14} />
              Apply Leave
            </button>
            <button onClick={() => setIsPermissionApplyModal(true)} className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2563EB] px-5 text-[14px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.35)] transition hover:bg-[#1049c4]">
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

          <RecentLogs />
        </div>
      </div>

      {isLeaveApplyModal && <ApplyLeaveForm onClose={() => setIsLeaveApplyModal(false)} />}
      {isPermissionApplyModal && <ApplyPermission onClose={() => setIsPermissionApplyModal(false)} />}
    </main>
  );
};

export default FacultyDashboardBody;
