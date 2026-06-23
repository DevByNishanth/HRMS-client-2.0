import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import PrincipalCompOffTable from "../../../components/PrincipalCompOffTable";

const departments = ["All", "Computer Science", "Electronics", "Mechanical", "Civil"];

const PrincipalCompOffPage = () => {
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium leading-tight text-white">
                Comp Off
              </h1>
              <p className="mt-1 text-[16px] text-[#9eb0cc]">
                Review and manage comp-off requests across the institution.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-11 w-full min-w-[180px] items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
              >
                <span className={filterDepartment !== "All" ? "text-white" : "text-[#6f839f]"}>
                  {filterDepartment}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#3984ff] transition ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                  <div className="max-h-[200px] overflow-y-auto table-custom-scrollbar">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          setFilterDepartment(dept);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-[12px] transition ${filterDepartment === dept
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
          </div>
          <PrincipalCompOffTable filterDepartment={filterDepartment} />
        </main>
      </div>
    </div>
  );
};

export default PrincipalCompOffPage;
