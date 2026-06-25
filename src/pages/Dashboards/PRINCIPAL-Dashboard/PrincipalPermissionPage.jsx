import { ChevronDown } from "lucide-react";
import { useState } from "react";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import PrincipalPermissionTable from "./PrincipalPermissionTable";
import ApplyPermission from "../../../components/ApplyPermission";
import FacultySearchPopup from "../../../components/FacultySearchPopup";
import ApplyDropdown from "../../../components/ApplyDropdown";

const PrincipalPermissionPage = () => {
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);
  const [isFacultySearch, setIsFacultySearch] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState(["All"]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePermissionSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
  };

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
        <main className="h-[calc(100vh-64px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">Permissions</h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Track monthly permission usage and request status across the institution.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Department Filter */}
                <div className="relative min-w-[180px]">
                  <button
                    type="button"
                    onClick={() => setIsDeptOpen(!isDeptOpen)}
                    className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                  >
                    <span className={filterDepartment !== "All" ? "text-white" : "text-[#6f839f]"}>
                      {filterDepartment !== "All" ? filterDepartment : "Department"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#3984ff] transition ${isDeptOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDeptOpen && (
                    <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                      <div className="max-h-[220px] overflow-y-auto table-custom-scrollbar">
                        {departmentOptions.map((dept) => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => {
                              setFilterDepartment(dept);
                              setIsDeptOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 text-left text-[12px] transition ${
                              filterDepartment === dept
                                ? "bg-[#2563EB] text-white"
                                : "text-[#cad7eb] hover:bg-[#132b49]"
                            }`}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* <ApplyDropdown label="Apply for Permission" onForMe={handleForMe} onForOthers={handleForOthers} /> */}
              </div>
            </div>

            <PrincipalPermissionTable key={refreshKey} filterDepartment={filterDepartment} onDepartmentOptionsChange={setDepartmentOptions} />
          </div>
        </main>
      </div>

      {isPermissionApplyModal && (
        <ApplyPermission onClose={handleCloseForm} employee={selectedEmployee} onPermissionSubmitted={handlePermissionSubmitted} />
      )}
      {isFacultySearch && (
        <FacultySearchPopup onClose={() => setIsFacultySearch(false)} onSelect={handleFacultySelect} />
      )}
    </div>
  );
};

export default PrincipalPermissionPage;
