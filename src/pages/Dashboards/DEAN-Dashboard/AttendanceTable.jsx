import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import CustomDatePicker from "../../../components/CustomDatePicker";
import ReqularizationCanvas from "./ReqularizationCanvas";
import { getTokenFromLocalStorage, getFacultyIdFromToken } from "../../../utils/tokenUtils";

const statusStyles = {
  Present: "text-[#18d3bf] bg-[#18d3bf1f]",
  "Partially Present": "text-[#f0a15f] bg-[#f0a15f1f]",
  "Second Half Leave": "text-[#f0a15f] bg-[#f0a15f1f]",
  Absent: "text-[#f16868] bg-[#f168681f]",
  "On Leave": "text-[#f16868] bg-[#f168681f]",
  Holiday: "text-[#3984ff] bg-[#3984ff1f]",
  "On Duty": "text-[#3984ff] bg-[#3984ff1f]",
};

const statuses = Object.keys(statusStyles);

const formatMinutesToHours = (minutes) => {
  if (minutes == null) return "--";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
};

const formatTime = (dateStr) => {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDateFromISO = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const StatusFilter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-[170px]">
      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || "Status"}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)] h-[200px] overflow-auto table-custom-scrollbar">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                onChange(status);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-[13px] transition ${value === status
                ? "bg-[#132b49] text-white"
                : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AttendanceTable = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const token = getTokenFromLocalStorage();
        if (!token) return;
        const facultyId = getFacultyIdFromToken();
        if (!facultyId) return;

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";
        const res = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/attendance/faculty-attendance?facultyId=${facultyId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        if (res.ok && data?.success) {
          setRecords(data.records);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredLogs = useMemo(() => {
    return records.filter((record) => {
      const logDate = new Date(record.checkIn);
      logDate.setHours(0, 0, 0, 0);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (from) from.setHours(0, 0, 0, 0);
      if (to) to.setHours(0, 0, 0, 0);

      const fromMatch = !from || logDate >= from;
      const toMatch = !to || logDate <= to;
      const statusMatch = !status || record.status === status;

      return fromMatch && toMatch && statusMatch;
    });
  }, [records, fromDate, toDate, status]);

  const hasFilters = fromDate || toDate || status;

  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
    setStatus("");
  };

  return (
    <section className="rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="relative z-20 flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-white">Attendance Logs</h2>
          <p className="mt-1 text-[12px] text-[#8ca1bd]">Filter and review daily attendance records.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[170px]">
            <CustomDatePicker
              id="attendance-from-date"
              value={fromDate}
              onChange={setFromDate}
              placeholder="From Date"
            />
          </div>
          <div className="min-w-[170px]">
            <CustomDatePicker
              id="attendance-to-date"
              value={toDate}
              onChange={setToDate}
              placeholder="To Date"
              popupAlign="right"
            />
          </div>
          <StatusFilter value={status} onChange={setStatus} />
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-lg border border-[#244061] bg-[#0d2138] px-4 text-[12px] font-semibold text-[#8ca1bd] transition hover:border-[#3984ff] hover:bg-[#132b49] hover:text-white"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="relative z-0 max-h-[38vh] min-h-[240px] overflow-auto table-custom-scrollbar">
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <p className="text-[14px] text-[#8ca1bd]">Loading attendance records...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Check-In</th>
                <th className="px-4 py-3 font-semibold">Check-Out</th>
                <th className="px-4 py-3 font-semibold">Working Hours</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#cad7eb]">
              {filteredLogs.map((record) => (
                <tr key={record.attendanceId || record.checkIn} className="border-b border-[#132944] last:border-0">
                  <td className="px-4 py-4">{formatDateFromISO(record.date)}</td>
                  <td className="px-4 py-4">{formatTime(record.checkIn)}</td>
                  <td className="px-4 py-4">{record.checkIn === record.checkOut ? "--" : formatTime(record.checkOut)}</td>
                  <td
                    className={`px-4 py-4 font-semibold ${record.workingHours == null ? "text-[#f16868]" : "text-[#f59d62]"
                      }`}
                  >
                    {formatMinutesToHours(record.workingHours)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[record.status] || "text-[#f0a15f] bg-[#f0a15f1f]"}`}
                    >
                      <span className="h-[4px] w-[4px] rounded-full bg-current" />
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(record)}
                      disabled={record.status?.toLowerCase() !== "present"}
                      className={`flex items-center gap-1 rounded-md px-3 py-2 text-[10px] transition
                        ${record.status?.toLowerCase() === "present"
                          ? "bg-[#102640] text-[#a9bddb] hover:bg-[#183052] hover:text-white"
                          : "bg-[#102640]/30 text-[#6f839f] cursor-not-allowed"
                        }`}
                      aria-label={`Open regularization form for ${formatDateFromISO(record.checkIn)}`}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex min-h-[240px] items-center justify-center">
            <p className="text-[14px] text-[#8ca1bd]">
              {records.length === 0
                ? "No attendance records found."
                : "No attendance logs found for the selected filters."}
            </p>
          </div>
        )}
      </div>

      <ReqularizationCanvas log={selectedLog} onClose={() => setSelectedLog(null)} />
    </section>
  );
};

export default AttendanceTable;
