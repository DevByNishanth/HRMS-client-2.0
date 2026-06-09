import { useState } from "react";
import { ArrowRight, Clock, FileCheck2, FileText, Plus, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleFromToken } from "../../../utils/tokenUtils";
import ActiveDayCalendar from "./ActiveDayCalendar";
import AttendanceGauge from "./AttendanceGauge";
import LeaveOverview from "./LeaveOverview";
import RecentLogs from "./RecentLogs";
import TimeTracker from "./TimeTracker";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import ApplyPermission from "../../../components/ApplyPermission";
import userImg from "../../../assets/userImg.svg";


const odRequests = [
  {
    name: "Priya Sharma",
    department: "Computer Science",
    purpose: "IEEE Conference at IIT Madras",
    date: "Jun 10, 2026",
    status: "Pending",
  },
  {
    name: "Rahul Verma",
    department: "Electronics",
    purpose: "Industrial Visit - BHEL",
    date: "Jun 12, 2026",
    status: "Pending",
  },
  {
    name: "Sneha Patel",
    department: "Mechanical",
    purpose: "Workshop on Advanced Manufacturing",
    date: "Jun 08, 2026",
    status: "Approved",
  },
  {
    name: "Ankit Kumar",
    department: "Mathematics",
    purpose: "Seminar on Applied Statistics",
    date: "Jun 15, 2026",
    status: "Pending",
  },
  {
    name: "Divya Nair",
    department: "Chemistry",
    purpose: "FDP on Green Chemistry",
    date: "Jun 18, 2026",
    status: "Pending",
  },
];

const odStatusTabs = [
  { label: "Pending OD", value: "Pending", icon: Clock },
  { label: "Approved OD", value: "Approved", icon: FileCheck2 },
  { label: "All OD", value: "All", icon: CalendarCheck },
];

const statusStyles = {
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
};

const DeanRequestsPanel = () => {
  console.log("Rendering DeanRequestsPanel");
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const filteredODs = selectedStatus === "All"
    ? odRequests
    : odRequests.filter((req) => req.status === selectedStatus);

  const handleViewAll = () => {
    navigate("/dashboard-dean/od-approvals");
  };

  return (
    <section className="flex h-[410px] flex-col overflow-hidden rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2563eb24] text-[#3984ff]">
            <CalendarCheck size={16} />
          </span>
          <h2 className="truncate text-[18px] font-semibold text-white">OD Requests</h2>
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

      {/* <div className="mx-4 mb-3 grid grid-cols-3 gap-1 rounded-lg border border-[#183052] bg-[#071425] p-1">
        {odStatusTabs.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelectedStatus(value)}
            className={`flex h-9 items-center justify-center gap-1 rounded-md text-[11px] font-semibold transition ${selectedStatus === value
              ? "bg-[#2563EB] text-white"
              : "text-[#8ca1bd] hover:bg-[#132b49] hover:text-white"
              }`}
            title={label}
          >
            <Icon size={13} />
            <span className="hidden min-w-0 truncate xl:inline">{label.split(" ")[0]}</span>
          </button>
        ))}
      </div> */}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 table-custom-scrollbar">
        <div className="space-y-2">
          {filteredODs.length > 0 ? (
            filteredODs.map((request, index) => (
              <div
                key={`${request.name}-${request.date}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-[#071425] px-3 py-2 border border-slate-800"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#172c46] text-[#9eb0cc]">
                    <img src={userImg} alt="" className="h-8 w-8 rounded-full object-cover" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white">{request.name}</p>
                    <p className="truncate text-[11px] text-[#8ca1bd]">{request.department}</p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-[#3984ff]">{request.purpose}</p>
                  </div>
                </div>

                <span className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-bold ${statusStyles[request.status] || "text-[#8ca1bd] bg-[#8ca1bd1f]"}`}>
                  {request.status}
                </span>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-[13px] text-[#8ca1bd]">
              No {selectedStatus.toLowerCase()} OD requests.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

const DeanDashboardBody = () => {
  const role = getRoleFromToken()?.toLowerCase();
  const [isLeaveApplyModal, setIsLeaveApplyModal] = useState(false);
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);
  const isHod = role === "hod" || role === "dean";


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

          <div className="recent-logs-section grid grid-cols-12 gap-4">
            <div className="table-container col-span-12 xl:col-span-8">
              <RecentLogs />
            </div>

            <div className="col-span-12 xl:col-span-4">
              <DeanRequestsPanel />
            </div>

          </div>

        </div>
      </div>

      {isLeaveApplyModal && <ApplyLeaveForm onClose={() => setIsLeaveApplyModal(false)} />}
      {isPermissionApplyModal && <ApplyPermission onClose={() => setIsPermissionApplyModal(false)} />}
    </main>
  );
};

export default DeanDashboardBody;
