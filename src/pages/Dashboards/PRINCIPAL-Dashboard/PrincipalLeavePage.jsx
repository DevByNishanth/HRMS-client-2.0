import {
  Baby,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarMinus,
  Heart,
  Plane,
  Stethoscope,
  Users,
} from "lucide-react";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import PrincipalLeaveTable from "./PrincipalLeaveTable";
import { useState } from "react";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import FacultySearchPopup from "../../../components/FacultySearchPopup";
import ApplyDropdown from "../../../components/ApplyDropdown";

const leaveStats = [
  { title: "Casual Leave", code: "CL", used: 8, total: 12, color: "#f05aa6", icon: BriefcaseBusiness },
  { title: "Medical Leave", code: "ML", used: 4, total: 10, color: "#18d3bf", icon: Stethoscope },
  { title: "Maternity Leave", code: "MTL", used: 0, total: 90, color: "#8b7cff", icon: Baby },
  { title: "Paternity Leave", code: "PTL", used: 0, total: 15, color: "#2f80ff", icon: Users },
  { title: "Vacation Leave", code: "VL", used: 6, total: 15, color: "#f59d62", icon: Plane },
  { title: "Marriage Leave", code: "MRL", used: 0, total: 7, color: "#ffcf5a", icon: Heart },
  { title: "Compensation Leave", code: "CPL", used: 2, total: 5, color: "#f16868", icon: CalendarMinus },
  { title: "On-Duty", code: "OD", used: 5, total: 12, color: "#18d3bf", icon: CalendarCheck },
];

const LeaveStatCard = ({ icon: Icon, title, code, used, total, color }) => {
  const percentage = Math.min((used / total) * 100, 100);
  const progressDegree = (percentage / 100) * 360;

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
          <p className="truncate text-[12px] font- uppercase tracking-wide text-[#8ca1bd]">{title}</p>
          <p className="mt-1 text-[16px] font-semibold text-white">
            {used}
            <span className="text-[16px] font-medium text-[#9eb0cc]"> / {total} Days</span>
          </p>
        </div>
      </div>
      <div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(${color} ${progressDegree}deg, #203755 ${progressDegree}deg 360deg)` }}
      >
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#0d2138]" style={{ color }}>
          <span className="text-[14px] font-bold leading-none">{percentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

const PrincipalLeavePage = () => {
  const [isLeaveApplyForm, setIsLeaveApplyForm] = useState(false);
  const [isFacultySearch, setIsFacultySearch] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleForMe = () => {
    setSelectedEmployee(null);
    setIsLeaveApplyForm(true);
  };

  const handleForOthers = () => {
    setIsFacultySearch(true);
  };

  const handleFacultySelect = (faculty) => {
    setIsFacultySearch(false);
    setSelectedEmployee(faculty);
    setIsLeaveApplyForm(true);
  };

  const handleCloseForm = () => {
    setIsLeaveApplyForm(false);
    setSelectedEmployee(null);
  };

  const leaveStatGroups = [
    { title: "General Leaves", items: ["Casual Leave", "On-Duty", "Medical Leave", "Vacation Leave"] },
    { title: "Special Leaves", items: ["Marriage Leave", "Compensation Leave", "Paternity Leave", "Maternity Leave"] },
  ].map((group) => ({
    ...group,
    items: group.items.map((title) => leaveStats.find((item) => item.title === title)),
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <div className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-[#071425] pb-2 px-4 mt-2">
          <div>
            <h1 className="text-xl font-medium leading-tight text-white">Leaves</h1>
            <p className="mt-1 text-[16px] text-[#9eb0cc]">
              Review leave balances and track every leave request across the institution.
            </p>
          </div>
          <ApplyDropdown label="Apply for Leave" onForMe={handleForMe} onForOthers={handleForOthers} />
        </div>
        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto space-y-2">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {leaveStatGroups.map((group) => (
                <div key={group.title} className="rounded-lg border border-[#213857] bg-[#071a2d] p-3">
                  <h3 className="mb-3 text-[14px] font-semibold text-[#ffffff]">{group.title}</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <LeaveStatCard key={item.title} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PrincipalLeaveTable />
        </main>
      </div>

      {isLeaveApplyForm && (
        <ApplyLeaveForm onClose={handleCloseForm} employee={selectedEmployee} />
      )}
      {isFacultySearch && (
        <FacultySearchPopup onClose={() => setIsFacultySearch(false)} onSelect={handleFacultySelect} />
      )}
    </div>
  );
};

export default PrincipalLeavePage;
