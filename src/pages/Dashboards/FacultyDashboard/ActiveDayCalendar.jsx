import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { getTokenFromLocalStorage, getFacultyIdFromToken } from "../../../utils/tokenUtils";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const statusColors = {
  P: "bg-teal-500 text-white",
  A: "bg-[#e0474f] text-white",
  OFF: "bg-[#1d74d8] text-white",
  "-": "bg-[#173252] text-[#8ca1bd]",
};

const LegendItem = ({ color, label }) => (
  <span className="flex items-center gap-1 text-[12px] uppercase text-[#8ca1bd]">
    <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: color }} />
    {label}
  </span>
);

const ActiveDayCalendar = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [attendanceData, setAttendanceData] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [holidayCount, setHolidayCount] = useState(0);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMonthDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch attendance data
  useEffect(() => {
    const fetchMuster = async () => {
      try {
        const token = getTokenFromLocalStorage();
        if (!token) return;
        const facultyId = getFacultyIdFromToken();
        if (!facultyId) return;

        const currentYear = now.getFullYear();

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";
        const res = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/attendance/muster?month=${selectedMonth + 1}&year=${currentYear}&facultyId=${facultyId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        if (res.ok && data?.success && data?.employees?.length > 0) {
          const attendance = data.employees[0].attendance;
          setAttendanceData(attendance);
          setDaysInMonth(data.daysInMonth);

          // Count legend stats
          let pCount = 0;
          let aCount = 0;
          let hCount = 0;
          Object.values(attendance || {}).forEach((code) => {
            if (code === "P") pCount++;
            else if (code === "A") aCount++;
            else if (code === "OFF") hCount++;
            else if (code === "P:A") {
              pCount++;
              aCount++;
            }
          });
          setPresentCount(pCount);
          setAbsentCount(aCount);
          setHolidayCount(hCount);
        }
      } catch (err) {
        console.error("Error fetching muster:", err);
      }
    };

    fetchMuster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  // Build calendar grid
  const firstDayOfMonth = new Date(now.getFullYear(), selectedMonth, 1).getDay();
  const calendarDays = [];

  // Leading muted cells (days from previous month)
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, type: "muted" });
  }

  // Actual month days
  for (let day = 1; day <= daysInMonth; day++) {
    const code = attendanceData?.[String(day)] || "-";
    calendarDays.push({ day, code });
  }

  // Trailing muted cells to fill the last row
  const trailingCount = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 0; i < trailingCount; i++) {
    calendarDays.push({ day: null, type: "muted" });
  }

  return (
    <section className="flex h-full flex-col rounded-xl border border-[#183052] bg-[#0a1a2d] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">Your Active Day</h2>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            className="flex items-center gap-1 rounded-full bg-[#102640] px-3 py-1 text-[14px] text-[#a9bddb] transition hover:bg-[#1a3556]"
          >
            {MONTHS[selectedMonth]} {now.getFullYear()}
            <ChevronDown size={12} className={`transition-transform ${monthDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {monthDropdownOpen && (
            <div className="absolute right-0  top-full z-50 mt-1 w-40  h-[260px] overflow-auto table-custom-scrollbar rounded-lg border border-[#244061] bg-[#0A1A2D] shadow-lg">
              {MONTHS.map((month, idx) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(idx);
                    setMonthDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-[13px] transition ${idx === selectedMonth
                    ? "bg-[#2563EB] text-white"
                    : "text-[#cad7eb] hover:bg-[#132b49]"
                    }`}
                >
                  {month} {now.getFullYear()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-7 content-center gap-2 p-2 text-center">
        {weekDays.map((day) => (
          <span key={day} className="text-[9px] font-semibold text-[#7186a5]">
            {day}
          </span>
        ))}

        {calendarDays.map((item, index) => {
          if (item.day === null) {
            return <span key={`empty-${index}`} />;
          }

          if (item.code === "P:A") {
            return (
              <div
                key={`${item.day}-${index}`}
                className="relative flex aspect-square items-center justify-center rounded-full overflow-hidden"
                style={{
                  background: "linear-gradient(to left, #14b8a6 50%, #f87171 50%)"
                }}
              >
                <span className="relative z-10 text-[12px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {item.day}
                </span>
              </div>
            );
          }

          if (item.code === "A:P") {
            return (
              <div
                key={`${item.day}-${index}`}
                className="relative flex aspect-square items-center justify-center rounded-full overflow-hidden bg-linear-to-r from-red-400 to-teal-500 "
                style={{
                  background: "linear-gradient(to left, #14b8a6 50%, #f87171 50%)"
                }}
              >
                <span className="relative z-10 text-[12px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {item.day}
                </span>
              </div>
            );
          }

          return (
            <span
              key={`${item.day}-${index}`}
              className={`flex aspect-square items-center justify-center rounded-full text-[12px] font-bold ${statusColors[item.code] || statusColors["-"]}`}
            >
              {item.day}
            </span>
          );
        })}
      </div>

      <div className="mt-auto flex flex-wrap justify-center gap-3">
        <LegendItem color="#19cfba" label={`Present (${presentCount})`} />
        <LegendItem color="#e0474f" label={`Absent (${absentCount})`} />
        <LegendItem color="#1d74d8" label={`Holiday (${holidayCount})`} />
      </div>
    </section>
  );
};

export default ActiveDayCalendar;
