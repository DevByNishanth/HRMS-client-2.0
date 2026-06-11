import { useState, useEffect } from "react";
import { ArrowRight, MoveUpRight } from "lucide-react";
import { getTokenFromLocalStorage, getFacultyIdFromToken } from "../../../utils/tokenUtils";
import ReqularizationCanvas from "./ReqularizationCanvas";

const statusStyles = {
  Present: "text-[#18d3bf] bg-[#18d3bf1f]",
  "Partially Present": "text-[#f0a15f] bg-[#f0a15f1f]",
  "Second Half Leave": "text-[#f0a15f] bg-[#f0a15f1f]",
  Absent: "text-[#f16868] bg-[#f168681f]",
  "On Leave": "text-[#f16868] bg-[#f168681f]",
  Holiday: "text-[#3984ff] bg-[#3984ff1f]",
  "On Duty": "text-[#3984ff] bg-[#3984ff1f]",
};

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

const RecentLogs = () => {
  const [records, setRecords] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
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
      }
    };

    fetchAttendance();
  }, []);

  return (
    <section className="rounded-xl border border-[#183052] bg-[#0a1a2d] ">
      <div className="mb-4 flex items-center justify-between px-4 py-3">
        <h2 className="text-[18px] font-semibold text-white">Recent Logs</h2>
        <button className="flex items-center gap-1 text-[16px] font-medium text-[#3984ff]">
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-hidden ">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead className="bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Check-In</th>
              <th className="px-4 py-3 font-semibold">Check-Out</th>
              <th className="px-4 py-3 font-semibold">Working Hours</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Regularization</th>
            </tr>
          </thead>
          <tbody className="text-[12px] text-[#cad7eb]">
            {records.map((record) => (
              <tr key={record.attendanceId} className="border-b border-[#132944] last:border-0">
                <td className="px-4 py-4">{formatDateFromISO(record.checkIn)}</td>
                <td className="px-4 py-4">{formatTime(record.checkIn)}</td>
                <td className="px-4 py-4">{formatTime(record.checkOut)}</td>
                <td className={`px-4 py-4 font-semibold ${record.workingHours == null ? "text-[#f16868]" : "text-[#18d3bf]"}`}>
                  {formatMinutesToHours(record.workingHours)}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[record.status] || "text-[#f0a15f] bg-[#f0a15f1f]"}`}>
                    <span className="h-[4px] w-[4px] rounded-full bg-current" />
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center text-[#8ca1bd]">
                  <button
                    type="button"
                    onClick={() => setSelectedLog(record)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white ml-8"
                    aria-label={`Open regularization form for ${formatDateFromISO(record.checkIn)}`}
                  >
                    <MoveUpRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReqularizationCanvas log={selectedLog} onClose={() => setSelectedLog(null)} />
    </section>
  );
};

export default RecentLogs;
