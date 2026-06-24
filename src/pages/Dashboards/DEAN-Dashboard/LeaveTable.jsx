import { Eye, RotateCcw, ChevronDown, CalendarDays, ChevronLeft, ChevronRight, Apple } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRoleFromToken, getTokenFromLocalStorage, decodeToken } from "../../../utils/tokenUtils";
import LeaveDetailsPopup from "./LeaveDetailsPopup";
import WithdrawLeavePopup from "./WithdrawLeavePopup";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import HodLeaveRequestTable from "./HodLeaveRequestTable";
import axios from "axios";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const leaves = [
  {
    type: "Casual Leave",
    from: "Oct 24, 2023",
    to: "Oct 24, 2023",
    duration: "1 Day",
    status: "Approved",
    notes: "Personal work planned in advance.",
  },
  {
    type: "Medical Leave",
    from: "Oct 18, 2023",
    to: "Oct 19, 2023",
    duration: "2 Days",
    status: "Pending",
    notes: "Health consultation and recovery time.",
  },
  {
    type: "Vacation Leave",
    from: "Sep 28, 2023",
    to: "Oct 02, 2023",
    duration: "5 Days",
    status: "Rejected",
    notes: "Family trip request.",
  },
  {
    type: "On-Duty",
    from: "Sep 12, 2023",
    to: "Sep 12, 2023",
    duration: "1 Day",
    status: "Approved",
    notes: "External academic review meeting.",
  },
  {
    type: "Vacation Leave",
    from: "Sep 28, 2023",
    to: "Oct 02, 2023",
    duration: "5 Days",
    status: "Rejected",
    notes: "Family trip request.",
  },
  {
    type: "On-Duty",
    from: "Sep 12, 2023",
    to: "Sep 12, 2023",
    duration: "1 Day",
    status: "Approved",
    notes: "External academic review meeting.",
  },
  {
    type: "Vacation Leave",
    from: "Sep 28, 2023",
    to: "Oct 02, 2023",
    duration: "5 Days",
    status: "Rejected",
    notes: "Family trip request.",
  },
  {
    type: "On-Duty",
    from: "Sep 12, 2023",
    to: "Sep 12, 2023",
    duration: "1 Day",
    status: "Approved",
    notes: "External academic review meeting.",
  },
  {
    type: "Compensation Leave",
    from: "Aug 30, 2023",
    to: "Aug 30, 2023",
    duration: "1 Day",
    status: "Pending",
    notes: "Compensation for weekend duty.",
  },
  {
    type: "Compensation Leave",
    from: "May 29, 2026",
    to: "May 30, 2026",
    duration: "1 Day",
    status: "Pending",
    notes: "Compensation for weekend duty.",
  },
];

// Custom Dropdown Component
const CustomDropdown = ({ placeholder = "Select", value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-full min-w-[140px] items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <div className="max-h-[200px] overflow-y-auto table-custom-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[12px] transition ${value === option
                  ? "bg-[#2563EB] text-white"
                  : "text-[#cad7eb] hover:bg-[#132b49]"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Date Picker Component (Separate for LeaveTable)
const FilterDatePicker = ({
  id,
  value,
  onChange,
  placeholder = "Select date",
  popupAlign = "left",
  isOpen,
  onOpen,
  onClose,
}) => {
  const [viewDate, setViewDate] = useState(value || new Date());
  const [showAbove, setShowAbove] = useState(true);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];

    for (let index = 0; index < firstDay.getDay(); index += 1) {
      dates.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  }, [viewDate]);

  const moveMonth = (direction) => {
    setViewDate((currentDate) => (
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    ));
  };

  const isSelectedDate = (date) => (
    value
    && date
    && value.getFullYear() === date.getFullYear()
    && value.getMonth() === date.getMonth()
    && value.getDate() === date.getDate()
  );

  const handleSelectDate = (date) => {
    onChange(date);
    onClose();
  };

  const handleToggle = (e) => {
    if (!isOpen) {
      const buttonElement = e.currentTarget;
      const rect = buttonElement.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      setShowAbove(spaceAbove > 320 || spaceBelow < 320);
      onOpen();
      return;
    }

    onClose();
  };

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        className="flex h-8 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarDays size={16} className="text-[#3984ff]" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${showAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"} z-[9999] w-[280px] rounded-lg border border-[#244061] bg-[#0a1a2d] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${popupAlign === "right" ? "right-0" : "left-0"
            }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-[13px] font-semibold text-white">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day) => (
              <span key={day} className="py-1 text-[10px] font-semibold text-[#8ca1bd]">
                {day}
              </span>
            ))}

            {calendarDays.map((date, index) => (
              <button
                key={date ? date.toISOString() : `empty-${index}`}
                type="button"
                disabled={!date}
                onClick={() => handleSelectDate(date)}
                className={`h-8 rounded-md text-[12px] font-semibold transition ${isSelectedDate(date)
                  ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                  : "text-[#cad7eb] hover:bg-[#132b49] hover:text-white"
                  } disabled:pointer-events-none disabled:opacity-0`}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LeaveTable = () => {
  // params and url 
  const location = useLocation();

  // getting role from token 
  const role = getRoleFromToken()?.toLowerCase();

  // states 
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [withdrawLeave, setWithdrawLeave] = useState(null);
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [openDateFilter, setOpenDateFilter] = useState(null);
  const [isLeaveApplyForm, setIsLeaveApplyForm] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [teamLeavesCount, setTeamLeavesCount] = useState(0);

  // tab data's
  const isDeanOrIqac = role === "dean" || role === "iqac";
  const deanTabs = ["My Leaves", "Leave Requests"];
  
  const activeTabs = isDeanOrIqac ? deanTabs : ["My Leaves"];
  const initialTabKey = isDeanOrIqac ? "deanSelectedTab" : "hodSelectedTab";
  const initialTabs = isDeanOrIqac ? deanTabs : ["My Leaves"];
  
  const initialSelectedTab = initialTabs.includes(location.state?.[initialTabKey])
    ? location.state[initialTabKey]
    : "My Leaves";

  const [selectedTab, setSelectedTab] = useState(initialSelectedTab);

  // Get unique leave types
  const leaveTypes = [
    "All",
    "Casual Leave",
    "On-Duty",
    "Marriage Leave",
    "Compensation Leave",
    "Medical Leave",
    "Vacation Leave",
    "Paternity Leave",
    "Maternity Leave",
  ];
  const statuses = ["All", "Approved", "Rejected", "Pending"];

  // Filter leaves based on selected filters
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const leaveTypeMatch = filterLeaveType === "All" || leave?.leaveTypeId?.leaveName === filterLeaveType;
      const statusMatch = filterStatus === "All" || leave.status === filterStatus;

      // Normalize dates to midnight UTC for fair comparison
      const normalizeDate = (dateString) => {
        const date = new Date(dateString);
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
      };

      const leaveFromDate = normalizeDate(leave.fromDate);
      const leaveToDate = normalizeDate(leave.toDate);
      
      // Create normalized filter dates
      const filterFromNormalized = filterFromDate
        ? new Date(Date.UTC(filterFromDate.getFullYear(), filterFromDate.getMonth(), filterFromDate.getDate()))
        : null;
      const filterToNormalized = filterToDate
        ? new Date(Date.UTC(filterToDate.getFullYear(), filterToDate.getMonth(), filterToDate.getDate()))
        : null;

      // Check if leave falls within filter date range
      const filterFromDateCheck = !filterFromNormalized || leaveFromDate >= filterFromNormalized;
      const filterToDateCheck = !filterToNormalized || leaveToDate <= filterToNormalized;

      return leaveTypeMatch && statusMatch && filterFromDateCheck && filterToDateCheck;
    });
  }, [filterLeaveType, filterStatus, filterFromDate, filterToDate, leaves]);

  const resetFilters = () => {
    setFilterLeaveType("All");
    setFilterStatus("All");
    setFilterFromDate(null);
    setFilterToDate(null);
    setOpenDateFilter(null);
  };

  const hasActiveFilters =
    (filterLeaveType !== "All") || (filterStatus !== "All") || filterFromDate || filterToDate;

  // functions =========================================  

  // format date 
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }


  function daysLable(totalDays) {
    if (totalDays == 1) return "Day"
    return "Days"
  }


  // ============================== API calls ===========================================  

  // api calling functions 
  async function fetchLeaves() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/leave-application/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hrms_token")}`,
        }
      });
      setLeaves(response.data.leaveApplications);
      console.log("Leaves fetched successfully:", response.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  }

  // Fetch team leaves count on mount so the badge shows immediately
  async function fetchTeamLeavesCount() {
    try {
      const token = getTokenFromLocalStorage();
      const decodedData = decodeToken(token);
      const dept = decodedData?.department;
      const userRole = decodedData?.role;
      
      let endpoint;
      if ((role === "dean" || role === "iqac") && userRole) {
        endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/leave-application/?currentApprovalLevel=${userRole}`;
      } else if (dept) {
        endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/leave-application/?department=${dept}`;
      } else {
        return;
      }
      
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const applications = response.data?.leaveApplications || [];
      setTeamLeavesCount(applications.length);
    } catch (err) {
      console.error("Error fetching team leaves count:", err);
    }
  }

  useEffect(() => {
    fetchLeaves()
    if (isDeanOrIqac) {
      fetchTeamLeavesCount();
    }
  }, [])
  return (
    <>

      {/* tab section for dean / iqac */}
      {isDeanOrIqac && <div className="tab-container bg-[#0d2138] w-full py-2 mt-4 px-4 rounded-lg border border-[#213857] ">
        <div className="flex items-center gap-2 ">
          {activeTabs.map((tab) => (
            <button
              onClick={() => setSelectedTab(tab)}
              key={tab}
              className={`px-6 py-2 text-sm font-medium transition ${tab === selectedTab
                ? "bg-[#2563EB] text-white rounded-md"
                : "hover:bg-slate-600/20 rounded-md"
                }`}
            >
              {tab}

              {tab === "Team Leaves" && (
                <span
                  className={`${tab === selectedTab
                    ? "bg-white text-blue-700 font-semibold"
                    : "bg-slate-700 text-white"
                    } rounded ml-1 px-2 py-[2px] text-xs`}
                >
                  {teamLeavesCount}
                </span>
              )}

              {tab === "Leave Requests" && (
                <span
                  className={`${tab === selectedTab
                    ? "bg-white text-blue-700 font-semibold"
                    : "bg-slate-700 text-white"
                    } rounded ml-1 px-2 py-[2px] text-xs`}
                >
                  {teamLeavesCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      }

      {/* my leave list table */}
      {selectedTab === "My Leaves" ? <section className="rounded-xl border border-[#183052] bg-[#0a1a2d] mt-4">
        <div className="relative z-20 space-y-3 px-4 py-3 flex items-start justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-white">
              My leave list <span>({filteredLeaves.length})</span>
            </h2>
          </div>

          <div className="filter-container ">
            <div className="flex flex-wrap items-center gap-3">
              {/* Leave Type Filter */}
              <div className="flex-shrink-0">
                <CustomDropdown
                  placeholder="Leave Type"
                  value={filterLeaveType}
                  onChange={setFilterLeaveType}
                  options={leaveTypes}
                />
              </div>

              {/* Status Filter */}
              <div className="flex-shrink-0">
                <CustomDropdown
                  placeholder="Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={statuses}
                />
              </div>

              {/* From Date Filter */}
              <div className="flex-shrink-0 min-w-[160px]">
                <FilterDatePicker
                  id="filter-from-date"
                  value={filterFromDate}
                  onChange={setFilterFromDate}
                  placeholder="From Date"
                  isOpen={openDateFilter === "from"}
                  onOpen={() => setOpenDateFilter("from")}
                  onClose={() => setOpenDateFilter(null)}
                />
              </div>

              {/* To Date Filter */}
              <div className="flex-shrink-0 min-w-[160px]">
                <FilterDatePicker
                  id="filter-to-date"
                  value={filterToDate}
                  onChange={setFilterToDate}
                  placeholder="To Date"
                  popupAlign="right"
                  isOpen={openDateFilter === "to"}
                  onOpen={() => setOpenDateFilter("to")}
                  onClose={() => setOpenDateFilter(null)}
                />
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex-shrink-0 h-11 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[12px] font-semibold text-[#8ca1bd] transition hover:bg-[#132b49] hover:text-white hover:border-[#3984ff]"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="relative z-0 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
              <tr>
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
                filteredLeaves.map((leave, index) => {
                  const leaveWithColor = {
                    ...leave,
                    statusColor: statusStyles[leave.status],
                  };

                  return (
                    <tr
                      key={`${leave.type}-${leave.from}-${index}`}
                      className="border-b border-[#132944] last:border-0"
                    >
                      <td className="px-4 py-2 font-semibold text-white">{leave?.leaveTypeId?.leaveName}</td>
                      <td className="px-4 py-2">{formatDate(leave.fromDate)}</td>
                      <td className="px-4 py-2">{formatDate(leave.toDate)}</td>
                      <td className="px-4 py-2 font-semibold text-[#18d3bf]">{leave.totalDays} {daysLable(leave.totalDays)}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[leave.status]}`}
                        >
                          <span className="h-[4px] w-[4px] rounded-full bg-current" />
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                          <button
                            type="button"
                            onClick={() => setSelectedLeave(leaveWithColor)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                            aria-label={`View details for ${leave.type}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {leave.status === "Pending" && leave.currentApprovalLevel == "hod" && (
                            <button
                              type="button"
                              onClick={() => setWithdrawLeave(leaveWithColor)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a15f12] text-[#f0a15f] transition hover:bg-[#f0a15f24] hover:text-white"
                              aria-label={`Withdraw ${leave.type}`}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#8ca1bd]">
                    No leave requests found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <LeaveDetailsPopup leave={selectedLeave} onClose={() => setSelectedLeave(null)} />
        <WithdrawLeavePopup leave={withdrawLeave} onClose={() => setWithdrawLeave(null)} fetchLeaves={fetchLeaves} />
      </section> : (
        <HodLeaveRequestTable onCountChange={setTeamLeavesCount} fetchByApprovalLevel={true} />
      )
      }
      {/* Dean / IQAC leave requests table */}


    </>

  );
};

export default LeaveTable;
