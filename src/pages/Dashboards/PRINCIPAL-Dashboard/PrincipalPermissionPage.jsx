import { Clock3, FileText, Hourglass } from "lucide-react";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import PrincipalPermissionTable from "./PrincipalPermissionTable";
import ApplyPermission from "../../../components/ApplyPermission";
import FacultySearchPopup from "../../../components/FacultySearchPopup";
import ApplyDropdown from "../../../components/ApplyDropdown";
import { useState } from "react";

const permissionStats = [
  { title: "Total Permission", code: "TP", used: 4, total: 6, color: "#3984ff", icon: FileText },
  { title: "Permission Taken", code: "PT", used: 4, total: 6, color: "#18d3bf", icon: Clock3 },
  { title: "Remaining Permission", code: "RP", used: 2, total: 6, color: "#f0a15f", icon: Hourglass },
];

const PermissionStatCard = ({ icon: Icon, title, code, used, total, color }) => {
  return (
    <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: `${color}22`, color }}>
        <Icon size={15} />
      </div>
      <h3 className="text-[12px] uppercase tracking-wide text-white">{title} ({code})</h3>
      <p className="mt-1 text-[12px] font-semibold text-white">{total} Hours</p>
    </div>
  );
};

const PrincipalPermissionPage = () => {
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);
  const [isFacultySearch, setIsFacultySearch] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleForMe = () => {
    setSelectedEmployee(null);
    setIsPermissionApplyModal(true);
  };

  const handleForOthers = () => {
    setIsFacultySearch(true);
  };

  const handleFacultySelect = (faculty) => {
    setIsFacultySearch(false);
    setSelectedEmployee(faculty);
    setIsPermissionApplyModal(true);
  };

  const handleCloseForm = () => {
    setIsPermissionApplyModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">Permissions</h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Track monthly permission usage and request status across the institution.
                </p>
              </div>
              <ApplyDropdown label="Apply for Permission" onForMe={handleForMe} onForOthers={handleForOthers} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {permissionStats.map((item) => (
                <PermissionStatCard key={item.title} {...item} />
              ))}
            </div>

            <PrincipalPermissionTable />
          </div>
        </main>
      </div>

      {isPermissionApplyModal && (
        <ApplyPermission onClose={handleCloseForm} employee={selectedEmployee} />
      )}
      {isFacultySearch && (
        <FacultySearchPopup onClose={() => setIsFacultySearch(false)} onSelect={handleFacultySelect} />
      )}
    </div>
  );
};

export default PrincipalPermissionPage;
