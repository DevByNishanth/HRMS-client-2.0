import { useMemo, useState } from "react";
import { ArrowUp, ArrowUpRight, ChevronDown } from "lucide-react";
import CustomDatePicker from "../../../components/CustomDatePicker";
import ReqularizationCanvas from "./ReqularizationCanvas";

const attendanceLogs = [
  {
    date: "May 30, 2026",
    checkIn: "08:45 AM",
    checkOut: "01:00 PM",
    hours: "04h 15m",
    status: "Partially Present",
  },
  {
    date: "May 29, 2026",
    checkIn: "08:50 AM",
    checkOut: "05:35 PM",
    hours: "08h 45m",
    status: "Present",
  },
  {
    date: "May 28, 2026",
    checkIn: "09:10 AM",
    checkOut: "04:00 PM",
    hours: "06h 50m",
    status: "Partially Present",
  },
  {
    date: "May 27, 2026",
    checkIn: "08:55 AM",
    checkOut: "05:00 PM",
    hours: "08h 05m",
    status: "Present",
  },
  {
    date: "May 26, 2026",
    checkIn: "--",
    checkOut: "--",
    hours: "--",
    status: "On Leave",
  },
  {
    date: "May 25, 2026",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    hours: "08h 30m",
    status: "Present",
  },
];

const statusStyles = {
  Present: "text-[#18d3bf] bg-[#18d3bf1f]",
  "Partially Present": "text-[#f0a15f] bg-[#f0a15f1f]",
  "On Leave": "text-[#f16868] bg-[#f168681f]",
};

const statuses = ["Present", "Partially Present", "On Leave"];

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
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
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
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter((log) => {
      const logDate = new Date(log.date);
      const fromMatch = !fromDate || logDate >= fromDate;
      const toMatch = !toDate || logDate <= toDate;
      const statusMatch = !status || log.status === status;

      return fromMatch && toMatch && statusMatch;
    });
  }, [fromDate, toDate, status]);

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
          <tbody className="text-[16px] text-[#cad7eb]">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={`${log.date}-${log.status}`} className="border-b border-[#132944] last:border-0">
                  <td className="px-4 py-4">{log.date}</td>
                  <td className="px-4 py-4">{log.checkIn}</td>
                  <td className="px-4 py-4">{log.checkOut}</td>
                  <td
                    className={`px-4 py-4 font-semibold ${log.hours === "--" ? "text-[#f16868]" : "text-[#18d3bf]"
                      }`}
                  >
                    {log.hours}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[log.status]}`}
                    >
                      <span className="h-[4px] w-[4px] rounded-full bg-current" />
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedLog({ ...log, statusColor: statusStyles[log.status] })}
                      className="flex items-center gap-1 rounded-md bg-[#102640] px-3 py-2 text-[10px] text-[#a9bddb] transition hover:bg-[#183052] hover:text-white"
                      aria-label={`Open regularization form for ${log.date}`}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-[#8ca1bd]">
                  No attendance logs found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ReqularizationCanvas log={selectedLog} onClose={() => setSelectedLog(null)} />
    </section>
  );
};

export default AttendanceTable;
