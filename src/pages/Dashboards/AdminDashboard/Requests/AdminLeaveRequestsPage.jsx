import { Download, Eye, FileText, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import CommonHeader from "../../../../components/CommonHeader";
import Sidebar from "../../../../components/Siedbar";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { exportToExcel } from "../../../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";
import { isFileUploadRequired, getLeaveSupportingDocument } from "../../../../utils/leaveDocumentUtils";
import LeaveDetailsPopup from "../../FacultyDashboard/LeaveDetailsPopup";
import { getTokenFromLocalStorage } from "../../../../utils/tokenUtils";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const AdminLeaveRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterApprovalLevel, setFilterApprovalLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedLeave, setSelectedLeave] = useState(null);

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  async function fetchLeaveRequests() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/leave-application/`,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` }
        }
      );
      console.log(" leave data",response)
      setRequests(response.data?.leaveApplications || []);
    } catch (error) {
      console.error("Error fetching admin leave requests:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Derive filter options
  const departments = ["All", ...new Set(requests.map(req => req.facultyId?.department).filter(Boolean))];
  const leaveTypes = ["All", ...new Set(requests.map(req => req.leaveTypeId?.leaveName).filter(Boolean))];
  const statuses = ["All", "Approved", "Rejected", "Pending"];
  const approvalLevels = ["All", ...new Set(requests.map(req => req.currentApprovalLevel).filter(Boolean))];

  const filteredLeaves = useMemo(() => {
    return requests.filter((req) => {
      const deptMatch = filterDepartment === "All" || req.facultyId?.department === filterDepartment;
      const typeMatch = filterLeaveType === "All" || req.leaveTypeId?.leaveName === filterLeaveType;
      
      const reqStatus = req.approvalStatus?.hrStatus || req.status || "Pending";
      const statusMatch = filterStatus === "All" || reqStatus === filterStatus;
      
      const levelMatch = filterApprovalLevel === "All" || req.currentApprovalLevel === filterApprovalLevel;
      
      let dateMatch = true;
      if (filterStartDate && filterEndDate) {
        const reqDate = new Date(req.fromDate);
        reqDate.setHours(0,0,0,0);
        const start = new Date(filterStartDate);
        start.setHours(0,0,0,0);
        const end = new Date(filterEndDate);
        end.setHours(0,0,0,0);
        dateMatch = reqDate >= start && reqDate <= end;
      }
      
      const searchMatch = !searchQuery || 
        `${req.facultyId?.firstName || ""} ${req.facultyId?.lastName || ""}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.facultyId?.empId || req.facultyId?.facultyId || "").toLowerCase().includes(searchQuery.toLowerCase());
        
      return deptMatch && typeMatch && statusMatch && levelMatch && dateMatch && searchMatch;
    });
  }, [requests, filterDepartment, filterLeaveType, filterStatus, filterApprovalLevel, filterStartDate, filterEndDate, searchQuery]);

  const exportCurrentFilteredRows = () => {
    const rows = filteredLeaves.map((leave) => ({
      "Employee": `${leave.facultyId?.salutation || ""} ${leave.facultyId?.firstName || ""} ${leave.facultyId?.lastName || ""}`,
      "Emp ID": leave.facultyId?.empId || "",
      "Department": leave.facultyId?.department || "",
      "Leave Type": leave.leaveTypeId?.leaveName || "",
      "From": new Date(leave.fromDate).toLocaleDateString(),
      "To": new Date(leave.toDate).toLocaleDateString(),
      "Duration": `${leave.totalDays} Days`,
      "Current Level": leave.currentApprovalLevel,
      "Status": leave.approvalStatus?.hrStatus || leave.status || "Pending",
    }));
    exportToExcel(rows, "Admin-Leave-Requests.xlsx");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--theme-bg-main)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        
        <div className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-[var(--theme-bg-body)] pb-2 px-4 mt-2">
          <div>
            <h1 className="text-xl font-medium leading-tight text-[var(--theme-text-main)]">
              Leave Requests <span className="text-[#3984ff]">({filteredLeaves.length})</span>
            </h1>
            <p className="mt-1 text-[16px] text-[var(--theme-text-muted)]">
              Monitor and track all leave applications across the institution.
            </p>
          </div>
        </div>

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[var(--theme-bg-body)] px-4 py-4 text-[var(--theme-text-main)] table-custom-scrollbar">
          
          {/* Filter Bar */}
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] p-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)]" size={16} />
              <input
                type="text"
                placeholder="Search by name or emp ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[38px] w-full rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] pl-10 pr-4 text-[14px] text-[var(--theme-text-main)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[#3984ff]"
              />
            </div>
            
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="h-[38px] rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-3 text-[14px] text-[var(--theme-text-muted)] outline-none [color-scheme:dark]"
            />
            <span className="text-[var(--theme-text-muted)]">to</span>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="h-[38px] rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-3 text-[14px] text-[var(--theme-text-muted)] outline-none [color-scheme:dark]"
            />
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="h-[38px] rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-3 text-[14px] text-[var(--theme-text-main)] outline-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterLeaveType}
              onChange={(e) => setFilterLeaveType(e.target.value)}
              className="h-[38px] rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-3 text-[14px] text-[var(--theme-text-main)] outline-none"
            >
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-[38px] rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-3 text-[14px] text-[var(--theme-text-main)] outline-none"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterApprovalLevel}
              onChange={(e) => setFilterApprovalLevel(e.target.value)}
              className="h-[38px] rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-3 text-[14px] text-[var(--theme-text-main)] outline-none"
            >
              <option disabled>Current Level</option>
              {approvalLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <button
              onClick={handleExportClick}
              disabled={filteredLeaves.length === 0}
              className="inline-flex h-[38px] items-center gap-2 rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-4 text-[14px] font-medium text-[var(--theme-text-main)] transition hover:border-[#3984ff] hover:bg-[var(--theme-bg-hover)] disabled:opacity-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>

          <section className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]">
            <div className="relative z-0 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-[var(--theme-bg-table-header)] text-[12px] uppercase tracking-wide text-[var(--theme-text-table-header)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Employee</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Leave Type</th>
                    <th className="px-4 py-3 font-semibold">From</th>
                    <th className="px-4 py-3 font-semibold">To</th>
                    <th className="px-4 py-3 font-semibold">Total Days</th>
                    <th className="px-4 py-3 font-semibold">Doc</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Current Level</th>
                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] text-[var(--theme-text-table-body)]">
                  {isLoading ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">Loading...</td>
                    </tr>
                  ) : filteredLeaves.length > 0 ? (
                    filteredLeaves.map((leave, index) => {
                      const requiresFile = isFileUploadRequired(leave?.leaveTypeId?.leaveName);
                      const doc = getLeaveSupportingDocument(leave);
                      const status = leave.approvalStatus?.hrStatus || leave.status || "Pending";
                      return (
                        <tr key={index} className="border-b border-[var(--theme-border)] last:border-0 hover:bg-[var(--theme-border)]/50">
                          <td className="px-4 py-3 font-semibold text-[var(--theme-text-main)]">
                            <div>
                              <p className="truncate">{leave.facultyId?.salutation} {leave.facultyId?.firstName} {leave.facultyId?.lastName}</p>
                              <p className="text-[11px] font-normal text-[#3984ff]">{leave.facultyId?.empId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">{leave.facultyId?.department}</td>
                          <td className="px-4 py-3">{leave.leaveTypeId?.leaveName}</td>
                          <td className="px-4 py-3">{new Date(leave.fromDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3">{new Date(leave.toDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-semibold text-[#18d3bf]">{leave.totalDays} Days</td>
                          <td className="px-4 py-3">
                            {requiresFile && doc ? (
                              <a href={doc.url} target="_blank" rel="noreferrer" className="text-[#3984ff]">
                                <FileText className="h-4 w-4" />
                              </a>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[status] || statusStyles.Pending}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {leave.currentApprovalLevel}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedLeave(leave)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] hover:bg-[var(--theme-border)] hover:text-[var(--theme-text-main)]"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">No requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <LeaveDetailsPopup leave={selectedLeave} onClose={() => setSelectedLeave(null)} />
      <ExportPasswordModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        onConfirm={(pwd) => handleConfirmExport(pwd, exportCurrentFilteredRows)}
        loading={exportLoading}
        error={exportError}
      />
    </div>
  );
};

export default AdminLeaveRequestsPage;


