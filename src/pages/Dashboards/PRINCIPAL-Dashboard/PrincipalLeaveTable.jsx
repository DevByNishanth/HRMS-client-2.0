import { Eye } from "lucide-react";
import { useState, useMemo } from "react";
import LeaveDetailsPopup from "../FacultyDashboard/LeaveDetailsPopup";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const allLeaves = [
  { employee: "Surya Chandran", empid: "EMP001", type: "Casual Leave", from: "Oct 24, 2023", to: "Oct 24, 2023", duration: "1 Day", status: "Approved", notes: "Personal work planned in advance." },
  { employee: "Nivetha Kumar", empid: "EMP002", type: "Medical Leave", from: "Oct 18, 2023", to: "Oct 19, 2023", duration: "2 Days", status: "Pending", notes: "Health consultation and recovery time." },
  { employee: "Arjun Prakash", empid: "EMP003", type: "Vacation Leave", from: "Sep 28, 2023", to: "Oct 02, 2023", duration: "5 Days", status: "Rejected", notes: "Family trip request." },
  { employee: "Maya Srinivasan", empid: "EMP004", type: "On-Duty", from: "Sep 12, 2023", to: "Sep 12, 2023", duration: "1 Day", status: "Approved", notes: "External academic review meeting." },
  { employee: "Karthik Raman", empid: "EMP005", type: "Casual Leave", from: "Sep 10, 2023", to: "Sep 10, 2023", duration: "1 Day", status: "Pending", notes: "Personal work." },
  { employee: "Priya Menon", empid: "EMP006", type: "Medical Leave", from: "Sep 05, 2023", to: "Sep 06, 2023", duration: "2 Days", status: "Approved", notes: "Medical appointment." },
  { employee: "Vikram Raj", empid: "EMP007", type: "Compensation Leave", from: "Aug 30, 2023", to: "Aug 30, 2023", duration: "1 Day", status: "Pending", notes: "Compensation for weekend duty." },
  { employee: "Ananya Ravi", empid: "EMP008", type: "Vacation Leave", from: "Aug 20, 2023", to: "Aug 25, 2023", duration: "6 Days", status: "Approved", notes: "Annual vacation." },
  { employee: "Deepak Kumar", empid: "EMP009", type: "Marriage Leave", from: "Aug 15, 2023", to: "Aug 21, 2023", duration: "7 Days", status: "Approved", notes: "Wedding ceremony." },
];

const tabs = ["All Leaves", "Pending", "Approved", "Rejected"];

const PrincipalLeaveTable = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [activeTab, setActiveTab] = useState("All Leaves");

  const filteredLeaves = useMemo(() => {
    if (activeTab === "All Leaves") return allLeaves;
    return allLeaves.filter((leave) => leave.status === activeTab);
  }, [activeTab]);

  return (
    <>
      <div className="tab-container mt-4 w-full rounded-lg border border-[#213857] bg-[#0d2138] px-4 py-2">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              type="button"
              onClick={() => setActiveTab(tab)}
              key={tab}
              className={`px-6 py-2 text-sm font-medium transition ${tab === activeTab
                ? "rounded-md bg-[#2563EB] text-white"
                : "rounded-md hover:bg-slate-600/20"
                }`}
            >
              {tab}
              {tab === "All Leaves" && (
                <span className={`ml-1 rounded px-2 py-[2px] text-xs ${tab === activeTab
                  ? "bg-white font-semibold text-blue-700"
                  : "bg-slate-700 text-white"
                  }`}>
                  {allLeaves.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-xl border border-[#183052] bg-[#0a1a2d] mt-4">
        <div className="px-4 py-3">
          <h2 className="text-[18px] font-semibold text-white">
            All  Leave Requests <span>({filteredLeaves.length})</span>
          </h2>
        </div>

        <div className="relative z-0 max-h-[calc(100vh-450px)] overflow-auto table-custom-scrollbar">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Leave Type</th>
                <th className="px-4 py-3 font-semibold">From</th>
                <th className="px-4 py-3 font-semibold">To</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#cad7eb]">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave, index) => (
                  <tr
                    key={`${leave.empid}-${leave.from}-${index}`}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div>
                        <p className="truncate">{leave.employee}</p>
                        <p className="text-[11px] font-normal text-[#3984ff]">{leave.empid}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{leave.type}</td>
                    <td className="px-4 py-3">{leave.from}</td>
                    <td className="px-4 py-3">{leave.to}</td>
                    <td className="px-4 py-3 font-semibold text-[#18d3bf]">{leave.duration}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[leave.status]}`}>
                        <span className="h-[4px] w-[4px] rounded-full bg-current" />
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                        <button
                          type="button"
                          onClick={() => setSelectedLeave(leave)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                          aria-label={`View details for ${leave.employee}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <LeaveDetailsPopup leave={selectedLeave} onClose={() => setSelectedLeave(null)} />
      </section>
    </>
  );
};

export default PrincipalLeaveTable;
