import { Download, Eye, Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import CommonHeader from "../../../../components/CommonHeader";
import Sidebar from "../../../../components/Siedbar";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { exportToExcel } from "../../../../utils/exportToExcel";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";
import { getTokenFromLocalStorage } from "../../../../utils/tokenUtils";
import RegularizationDetailsPopup from "../../FacultyDashboard/RegularizationDetailsPopup";
import userImg from "../../../../assets/userImg.svg";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
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

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const calculateWorkingHours = (inTime, outTime) => {
  if (!inTime || !outTime) return null;
  const start = new Date(inTime);
  const end = new Date(outTime);
  const diffMs = end - start;
  if (diffMs < 0) return null;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
};

const getRegularizationList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.regularizationRequests)) return data.regularizationRequests;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const AdminRegularizationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
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
    fetchRegularizationRequests();
  }, []);

  async function fetchRegularizationRequests() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/regularization/overall`,
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` }
        }
      );
      
      const resData = response.data || {};
      let rawList = resData.requests || resData.formattedRequests || resData.regularizationRequests || resData.data?.requests || resData.data?.formattedRequests;
      if (!rawList && Array.isArray(resData.data)) {
        rawList = resData.data;
      }
      let dataList = getRegularizationList(rawList || []);

      setRequests(dataList);
      setTotalCount(resData.total || resData.data?.total || dataList.length || 0);
    } catch (error) {
      console.error("Error fetching admin regularization requests:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (bottom && visibleCount < filteredRequests.length) {
      setVisibleCount(prev => prev + 20);
    }
  };

  // Derive filter options
  const departments = ["All", ...new Set(requests.map(req => req.facultyId?.department).filter(Boolean))];
  const statuses = ["All", "Approved", "Rejected", "Pending"];
  const approvalLevels = ["All", ...new Set(requests.map(req => req.currentApprovalLevel).filter(Boolean))];

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const deptMatch = filterDepartment === "All" || req.facultyId?.department === filterDepartment;
      
      const reqStatus = req.approvalStatus?.hrStatus || req.status || "Pending";
      const statusMatch = filterStatus === "All" || reqStatus === filterStatus;
      
      const levelMatch = filterApprovalLevel === "All" || req.currentApprovalLevel === filterApprovalLevel;
      
      let dateMatch = true;
      if (filterStartDate && filterEndDate) {
        const reqDate = new Date(req.date || req.attendanceDate);
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
        "Emp ID": req.facultyId?.empId || req.facultyId?.facultyId || "",
        "Department": req.facultyId?.department || "",
        "Date": formatDate(req.date || req.attendanceDate),
        "In Time": formatTime(req.requestedInTime),
        "Out Time": formatTime(req.requestedOutTime),
        "Status": req.approvalStatus?.hrStatus || req.status || "Pending",
        "Current Level": req.currentApprovalLevel || "",
      };
    });
    exportToExcel(rows, "Admin-Regularization-Requests.xlsx");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--theme-bg-main)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        
        <div className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-[var(--theme-bg-body)] pb-2 px-4 mt-2">
          <div>
            <h1 className="text-xl font-medium leading-tight text-[var(--theme-text-main)]">
              Regularization Requests <span className="text-[#3984ff]">({filteredRequests.length})</span>
            </h1>
            <p className="mt-1 text-[16px] text-[var(--theme-text-muted)]">
              Monitor and track all regularization requests across the institution.
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
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">In Time</th>
                    <th className="px-4 py-3 font-semibold">Out Time</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Current Level</th>
                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] text-[var(--theme-text-table-body)]">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.slice(0, visibleCount).map((req, index) => {
                      const status = req.status || "Pending";

                      return (
                        <tr key={index} className="border-b border-[var(--theme-border)] last:border-0 hover:bg-[var(--theme-border)]/50">
                          <td className="px-4 py-3 font-semibold text-[var(--theme-text-main)]">
                            <div className="flex items-center gap-2">
                              {/* <img src={userImg} alt="" className="h-8 w-8 rounded-full" /> */}
                              <div>
                                <p className="truncate">{req.facultyId?.firstName} {req.facultyId?.lastName}</p>
                                <p className="text-[11px] font-normal text-[#3984ff]">{req.facultyId?.empId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{req.facultyId?.department}</td>
                          <td className="px-4 py-3">{formatDate(req.attendanceDate)}</td>
                          <td className="px-4 py-3">{formatTime(req.requestedInTime)}</td>
                          <td className="px-4 py-3">{formatTime(req.requestedOutTime)}</td>
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
                      <td colSpan="7" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">No requests found.</td>
                    </tr>
                  ) : null}
                  {isLoading && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">Loading...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <RegularizationDetailsPopup request={selectedRequest} onClose={() => setSelectedRequest(null)} />
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

export default AdminRegularizationRequestsPage;


