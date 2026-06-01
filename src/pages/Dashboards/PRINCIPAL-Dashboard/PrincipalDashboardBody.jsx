import { useState } from "react";
import ActiveDayCalendar from "../FacultyDashboard/ActiveDayCalendar";
import AttendanceGauge from "../FacultyDashboard/AttendanceGauge";
import LeaveOverview from "../FacultyDashboard/LeaveOverview";
import RecentLogs from "../FacultyDashboard/RecentLogs";
import TimeTracker from "../FacultyDashboard/TimeTracker";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import ApplyPermission from "../../../components/ApplyPermission";
import FacultySearchPopup from "../../../components/FacultySearchPopup";
import ApplyDropdown from "../../../components/ApplyDropdown";

const PrincipalDashboardBody = () => {
  const [isLeaveApplyModal, setIsLeaveApplyModal] = useState(false);
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);
  const [isFacultySearchLeave, setIsFacultySearchLeave] = useState(false);
  const [isFacultySearchPermission, setIsFacultySearchPermission] = useState(false);
  const [selectedEmployeeForLeave, setSelectedEmployeeForLeave] = useState(null);
  const [selectedEmployeeForPermission, setSelectedEmployeeForPermission] = useState(null);

  const handleApplyLeaveForMe = () => {
    setSelectedEmployeeForLeave(null);
    setIsLeaveApplyModal(true);
  };

  const handleApplyLeaveForOthers = () => {
    setIsFacultySearchLeave(true);
  };

  const handleFacultySelectForLeave = (faculty) => {
    setIsFacultySearchLeave(false);
    setSelectedEmployeeForLeave(faculty);
    setIsLeaveApplyModal(true);
  };

  const handleApplyPermissionForMe = () => {
    setSelectedEmployeeForPermission(null);
    setIsPermissionApplyModal(true);
  };

  const handleApplyPermissionForOthers = () => {
    setIsFacultySearchPermission(true);
  };

  const handleFacultySelectForPermission = (faculty) => {
    setIsFacultySearchPermission(false);
    setSelectedEmployeeForPermission(faculty);
    setIsPermissionApplyModal(true);
  };

  const handleCloseLeave = () => {
    setIsLeaveApplyModal(false);
    setSelectedEmployeeForLeave(null);
  };

  const handleClosePermission = () => {
    setIsPermissionApplyModal(false);
    setSelectedEmployeeForPermission(null);
  };

  return (
    <main className="max-h-[calc(100vh-56px)] overflow-y-auto table-custom-scrollbar bg-[#071425] px-4 py-4 text-white">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-xl font-semibold leading-tight text-white">Hello, Principal!</h1>
            <p className="mt-1 text-[13px] text-[#9eb0cc]">
              Institution-wide leave and attendance overview
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ApplyDropdown
              label="Apply Leave"
              onForMe={handleApplyLeaveForMe}
              onForOthers={handleApplyLeaveForOthers}
            />
            <ApplyDropdown
              label="Apply Permission"
              onForMe={handleApplyPermissionForMe}
              onForOthers={handleApplyPermissionForOthers}
            />
          </div>
        </div>

        <div className="space-y-5">
          <LeaveOverview />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TimeTracker />
            <ActiveDayCalendar />
            <AttendanceGauge />
          </div>

          <div className="recent-logs-section">
            <RecentLogs />
          </div>
        </div>
      </div>

      {isLeaveApplyModal && (
        <ApplyLeaveForm
          onClose={handleCloseLeave}
          employee={selectedEmployeeForLeave}
        />
      )}
      {isPermissionApplyModal && (
        <ApplyPermission
          onClose={handleClosePermission}
          employee={selectedEmployeeForPermission}
        />
      )}
      {isFacultySearchLeave && (
        <FacultySearchPopup
          onClose={() => setIsFacultySearchLeave(false)}
          onSelect={handleFacultySelectForLeave}
        />
      )}
      {isFacultySearchPermission && (
        <FacultySearchPopup
          onClose={() => setIsFacultySearchPermission(false)}
          onSelect={handleFacultySelectForPermission}
        />
      )}
    </main>
  );
};

export default PrincipalDashboardBody;
