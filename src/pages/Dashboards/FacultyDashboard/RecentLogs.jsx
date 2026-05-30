import { useState } from "react";
import { ArrowRight, MoveUpRight } from "lucide-react";
import ReqularizationCanvas from "./ReqularizationCanvas";

const logs = [
  {
    date: "Oct 24, 2023",
    checkIn: "08:45 AM",
    checkOut: "05:15 PM",
    hours: "08h 30m",
    status: "Present",
    statusColor: "text-[#18d3bf] bg-[#18d3bf1f]",
  },
  {
    date: "Oct 23, 2023",
    checkIn: "09:02 AM",
    checkOut: "05:30 PM",
    hours: "06h 08m",
    status: "Partially Present",
    statusColor: "text-[#f0a15f] bg-[#f0a15f1f]",
  },
  {
    date: "Oct 22, 2023",
    checkIn: "--",
    checkOut: "--",
    hours: "--",
    status: "On Leave",
    statusColor: "text-[#f16868] bg-[#f168681f]",
  },
  {
    date: "Sunday",
    isDivider: true,
  },
  {
    date: "Oct 21, 2023",
    checkIn: "08:50 AM",
    checkOut: "05:00 PM",
    hours: "08h 10m",
    status: "Present",
    statusColor: "text-[#18d3bf] bg-[#18d3bf1f]",
  },
];

const RecentLogs = () => {
  const [selectedLog, setSelectedLog] = useState(null);

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
            {logs.map((log, index) => (
              log.isDivider ? (
                <tr key={`${log.date}-${index}`}>
                  <td colSpan="6" className="px-4 py-2">
                    <div className="rounded-md bg-[#172c46] py-2 text-center text-[11px] font-semibold text-[#3984ff]">
                      {log.date}
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={`${log.date}-${index}`} className="border-b border-[#132944] last:border-0">
                  <td className="px-4 py-4">{log.date}</td>
                  <td className="px-4 py-4">{log.checkIn}</td>
                  <td className="px-4 py-4">{log.checkOut}</td>
                  <td className={`px-4 py-4 font-semibold ${log.hours === "--" ? "text-[#f16868]" : "text-[#18d3bf]"}`}>
                    {log.hours}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${log.statusColor}`}>
                      <span className="h-[4px] w-[4px] rounded-full bg-current" />
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center  text-[#8ca1bd]">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white ml-8"
                      aria-label={`Open regularization form for ${log.date}`}
                    >
                      <MoveUpRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <ReqularizationCanvas log={selectedLog} onClose={() => setSelectedLog(null)} />
    </section>
  );
};

export default RecentLogs;
