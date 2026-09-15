import { Download, Eye, FileText, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import CommonHeader from "../../../../components/CommonHeader";
import Sidebar from "../../../../components/Siedbar";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { exportToExcel } from "../../../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";
import { getTokenFromLocalStorage } from "../../../../utils/tokenUtils";
import CompOffDetailsPopup from "../../FacultyDashboard/CompOffDetailsPopup";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
  Revoked: "text-[var(--theme-text-muted)] bg-[var(--theme-text-muted)1f]",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const mapApiRequest = (req) => {
  const doc = req.supportingDocuments?.[0];
  return {
    _id: req._id,
    facultyId: req.facultyId || {},
    fromDate: req.workedFromDate,
    toDate: req.workedToDate,
    noOfDays: req.compOffDays,
    reason: req.reason,
    status: req.status || "Pending",
    documentUrl: doc?.url || "",
    currentApprovalLevel: req.currentApprovalLevel,
    approvalHistory: req.approvalHistory || [],
  };
};

const AdminCompOffRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterApprovalLevel, setFilterApprovalLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  useEffect(() => {
    fetchCompOffRequests();
  }, [page, limit]);

  async function fetchCompOffRequests() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/comp-off/?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` }
        }
      );
      const resData = response.data || {};
      let dataList = resData.requests || resData.formattedRequests || resData.data?.requests || resData.data?.formattedRequests || [];

      if (page === 1) {
        setRequests(dataList.map(mapApiRequest));
      } else {
        setRequests(prev => [...prev, ...dataList.map(mapApiRequest)]);
      }
      setTotalCount(resData.total || resData.data?.total || 0);
    } catch (error) {
      console.error("Error fetching admin comp off requests:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (bottom && !isLoading && requests.length < totalCount) {
      setPage(prev => prev + 1);
    }
  };

  // Derive filter options
  const departments = ["All", ...new Set(requests.map(req => req.facultyId?.department).filter(Boolean))];
  const statuses = ["All", "Approved", "Rejected", "Pending", "Revoked"];
  const approvalLevels = ["All", ...new Set(requests.map(req => req.currentApprovalLevel).filter(Boolean))];

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const deptMatch = filterDepartment === "All" || req.facultyId?.department === filterDepartment;
      
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
        
      return deptMatch && statusMatch && levelMatch && dateMatch && searchMatch;
    });
  }, [requests, filterDepartment, filterStatus, filterApprovalLevel, filterStartDate, filterEndDate, searchQuery]);

  const exportCurrentFilteredRows = () => {
    const rows = filteredRequests.map((req) => {
      return {
        "Employee": `${req.facultyId?.firstName || ""} ${req.facultyId?.lastName || ""}`,
        "Emp ID": req.facultyId?.facultyId || "",
        "Department": req.facultyId?.department || "",
        "Worked From": formatDate(req.fromDate),
        "Worked To": formatDate(req.toDate),
        "No of Days": req.noOfDays || 0,
        "Status": req.status || "Pending",
      };
    });
    exportToExcel(rows, "Admin-CompOff-Requests.xlsx");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--theme-bg-main)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        
        <div className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-[var(--theme-bg-body)] pb-2 px-4 mt-2">
          <div>
            <h1 className="text-xl font-medium leading-tight text-[var(--theme-text-main)]">
              Comp Off Requests <span className="text-[#3984ff]">({filteredRequests.length})</span>
            </h1>
            <p className="mt-1 text-[16px] text-[var(--theme-text-muted)]">
              Monitor and track all compensation leave requests.
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
              <option disabled>Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-[38px] rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-3 text-[14px] text-[var(--theme-text-main)] outline-none"
            >
              <option disabled>Status</option>
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
              disabled={filteredRequests.length === 0}
              className="inline-flex h-[38px] items-center gap-2 rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] px-4 text-[14px] font-medium text-[var(--theme-text-main)] transition hover:border-[#3984ff] hover:bg-[var(--theme-bg-hover)] disabled:opacity-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>

          <section className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)]">
            <div 
              className="relative z-0 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar"
              onScroll={handleScroll}
            >
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-[var(--theme-bg-table-header)] text-[12px] uppercase tracking-wide text-[var(--theme-text-table-header)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Employee</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Worked From</th>
                    <th className="px-4 py-3 font-semibold">Worked To</th>
                    <th className="px-4 py-3 font-semibold">No of Days</th>
                    <th className="px-4 py-3 font-semibold">Doc</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Current Level</th>
                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] text-[var(--theme-text-table-body)]">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req, index) => {
                      const status = req.status || "Pending";

                      return (
                        <tr key={index} className="border-b border-[var(--theme-border)] last:border-0 hover:bg-[var(--theme-border)]/50">
                          <td className="px-4 py-3 font-semibold text-[var(--theme-text-main)]">
                            <div>
                              <p className="truncate">{req.facultyId?.salutation} {req.facultyId?.firstName} {req.facultyId?.lastName}</p>
                              <p className="text-[11px] font-normal text-[#3984ff]">{req.facultyId?.empId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">{req.facultyId?.department}</td>
                          <td className="px-4 py-3">{formatDate(req.fromDate)}</td>
                          <td className="px-4 py-3">{formatDate(req.toDate)}</td>
                          <td className="px-4 py-3 font-semibold text-[#18d3bf]">{req.noOfDays} {req.noOfDays === 1 ? "Day" : "Days"}</td>
                          <td className="px-4 py-3">
                            {req.documentUrl ? (
                              <a href={req.documentUrl} target="_blank" rel="noreferrer" className="text-[#3984ff] hover:text-[#6ea1ff]">
                                <FileText className="h-4 w-4" />
                              </a>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[status] || statusStyles.Pending}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold`}>
                              {req.currentApprovalLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] hover:bg-[var(--theme-border)] hover:text-[var(--theme-text-main)]"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : !isLoading ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">No requests found.</td>
                    </tr>
                  ) : null}
                  {isLoading && (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <CompOffDetailsPopup request={selectedRequest} onClose={() => setSelectedRequest(null)} />
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

export default AdminCompOffRequestsPage;


