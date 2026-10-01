import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import ActiveDayCalendar from "./ActiveDayCalendar";
import AttendanceTable from "./AttendanceTable";
import AttendanceGauge from "./AttendanceGauge";
import TimeTracker from "./TimeTracker";

const AttendancePage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7fafc] transition-colors duration-200 dark:bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="table-custom-scrollbar max-h-[calc(100vh-56px)] overflow-y-auto bg-[#f7fafc] px-4 py-4 text-slate-900 transition-colors duration-200 dark:bg-[#071425] dark:text-white">
          <div className="mx-auto space-y-3">
            <div>
              <h1 className="text-xl font-medium leading-tight text-slate-900 dark:text-white">Attendance</h1>

            </div>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div className="xl:col-span-4">
                {/* <WeeklyWorkBarChart /> */}
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

export default AttendancePage;
