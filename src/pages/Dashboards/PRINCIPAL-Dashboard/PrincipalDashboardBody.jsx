import AttendancePieCard from "./AttendancePieCard";
import PrincipalDashboardHeader from "./PrincipalDashboardHeader";
import PendingApprovalsCard from "./PendingApprovalsCard";
import RecentRequestsCard from "./RecentRequestsCard";
import StaffDistributionChart from "./StaffDistributionChart";
import WeeklyAvailabilityChart from "./WeeklyAvailabilityChart";
import { attendanceSummary, pendingRequests } from "./principalDashboardData";

const PrincipalDashboardBody = () => {
  const totalAttendance = attendanceSummary.reduce((sum, item) => sum + item.value, 0);
  const totalPending = pendingRequests.reduce((sum, item) => sum + item.value, 0);

  return (
    <main className="max-h-[calc(100vh-56px)] overflow-y-auto table-custom-scrollbar bg-[#071425] px-4 py-4 text-white">
      <div className="mx-auto max-w-[1440px] space-y-5">

        {/* // ? ===============================  this is the header ================================  */}
        <PrincipalDashboardHeader totalPending={totalPending} />

        {/*// ?   ============================== first container / section ============================= */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
          <WeeklyAvailabilityChart className="min-h-[300px] xl:col-span-3" />
          <StaffDistributionChart className="min-h-[300px] xl:col-span-2" />
        </div>

        {/*// ?   ============================== second container / section ============================= */}
        <div className="grid grid-cols-12  gap-4">
          <AttendancePieCard
            totalAttendance={totalAttendance}
            className="min-h-[330px] xl:col-span-4"
          />
          <RecentRequestsCard className="max-h-[330px] overflow-auto xl:col-span-4" />
          <PendingApprovalsCard
            totalPending={totalPending}
            className="min-h-[330px] xl:col-span-4"
          />
        </div>
      </div>

    </main>
  );
};

export default PrincipalDashboardBody;
