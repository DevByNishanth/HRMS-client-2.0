import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import ActiveDayCalendar from "../DEAN-Dashboard/ActiveDayCalendar";
import AttendanceGauge from "../DEAN-Dashboard/AttendanceGauge";
import TimeTracker from "../DEAN-Dashboard/TimeTracker";
import AttendanceTable from "../DEAN-Dashboard/AttendanceTable";

const PrincipalAttendancePage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto space-y-3">
            <div>
              <h1 className="text-xl font-medium leading-tight text-white">
                Attendance
              </h1>
              <p className="mt-1 text-[16px] text-[#9eb0cc]">
                Track attendance records and working hours across the institution.
              </p>
            </div>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div className="xl:col-span-4">
                <AttendanceGauge />
              </div>
              <div className="xl:col-span-4">
                <ActiveDayCalendar />
              </div>
              <div className="xl:col-span-4">
                <TimeTracker />
              </div>
            </section>

            <AttendanceTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrincipalAttendancePage;
