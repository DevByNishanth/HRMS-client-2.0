import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import PermissionDetailsPopup from "../FacultyDashboard/PermissionDetailsPopup";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const allPermissions = [
  { employee: "Surya Chandran", empid: "EMP001", date: "May 30, 2026", session: "Forenoon", duration: "1 Hour", reason: "Bank appointment during working hours.", status: "Pending" },
  { employee: "Nivetha Kumar", empid: "EMP002", date: "May 24, 2026", session: "Afternoon", duration: "2 Hours", reason: "Parent teacher meeting at school.", status: "Approved" },
  { employee: "Arjun Prakash", empid: "EMP003", date: "May 16, 2026", session: "Forenoon", duration: "1 Hour", reason: "Personal documentation work.", status: "Rejected" },
  { employee: "Maya Srinivasan", empid: "EMP004", date: "May 09, 2026", session: "Afternoon", duration: "1 Hour", reason: "Medical consultation.", status: "Approved" },
  { employee: "Karthik Raman", empid: "EMP005", date: "May 03, 2026", session: "Forenoon", duration: "2 Hours", reason: "Family emergency.", status: "Pending" },
  { employee: "Priya Menon", empid: "EMP006", date: "Apr 28, 2026", session: "Forenoon", duration: "1 Hour", reason: "School appointment.", status: "Approved" },
  { employee: "Vikram Raj", empid: "EMP007", date: "Apr 20, 2026", session: "Afternoon", duration: "2 Hours", reason: "Personal work.", status: "Pending" },
];

const tabs = ["All Permissions", "Pending", "Approved", "Rejected"];

const PrincipalPermissionTable = () => {
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [activeTab, setActiveTab] = useState("All Permissions");

  const filteredPermissions = useMemo(() => {
    if (activeTab === "All Permissions") return allPermissions;
    return allPermissions.filter((perm) => perm.status === activeTab);
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
              className={`px-6 py-2 text-sm font-medium transition ${
                tab === activeTab
                  ? "rounded-md bg-[#2563EB] text-white"
                  : "rounded-md hover:bg-slate-600/20"
              }`}
            >
              {tab}
              {tab === "All Permissions" && (
                <span className={`ml-1 rounded px-2 py-[2px] text-xs ${
                  tab === activeTab
                    ? "bg-white font-semibold text-blue-700"
                    : "bg-slate-700 text-white"
                }`}>
                  {allPermissions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
        <div className="px-4 py-3">
          <h2 className="text-[18px] font-semibold text-white">
            All Permission Requests <span>({filteredPermissions.length})</span>
          </h2>
        </div>

        <div className="relative z-0 h-[calc(100vh-450px)] overflow-auto table-custom-scrollbar">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Session</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#cad7eb]">
              {filteredPermissions.length > 0 ? (
                filteredPermissions.map((permission, index) => (
                  <tr
                    key={`${permission.empid}-${permission.date}-${index}`}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div>
                        <p className="truncate">{permission.employee}</p>
                        <p className="text-[11px] font-normal text-[#3984ff]">{permission.empid}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{permission.date}</td>
                    <td className="px-4 py-3">{permission.session}</td>
                    <td className="px-4 py-3 font-semibold text-[#18d3bf]">{permission.duration}</td>
                    <td className="max-w-[200px] truncate px-4 py-3">{permission.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[permission.status]}`}>
                        <span className="h-[4px] w-[4px] rounded-full bg-current" />
                        {permission.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                        <button
                          type="button"
                          onClick={() => setSelectedPermission(permission)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                          aria-label={`View details for ${permission.employee}`}
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
                    No permission requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PermissionDetailsPopup permission={selectedPermission} onClose={() => setSelectedPermission(null)} />
      </section>
    </>
  );
};

export default PrincipalPermissionTable;
