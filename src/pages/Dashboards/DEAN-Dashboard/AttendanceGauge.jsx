import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AttendanceGauge = () => {
  const now = new Date();

  const [attendance, setAttendance] = useState({
    workingDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0,
  });

  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear] = useState(now.getFullYear());

  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMonthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAttendanceSummary = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("hrms_token");
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/attendance/my-summary?month=${selectedMonth + 1}&year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setAttendance({
          workingDays: data.workingDays || 0,
          presentDays: data.presentDays || 0,
          absentDays: data.absentDays || 0,
          attendancePercentage: Number(data.attendancePercentage) || 0,
        });
      }
    } catch (error) {
      console.error("Attendance Summary Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary();
  }, [selectedMonth]);

  const percentage = Number(attendance.attendancePercentage) || 0;

  let status = "Poor";
  if (percentage >= 90) {
    status = "Excellent";
  } else if (percentage >= 75) {
    status = "Good";
  } else if (percentage >= 50) {
    status = "Average";
  }

  const radius = 70;
  const circumference = Math.PI * radius; // semicircle
  const progress = (percentage / 100) * circumference;

  if (loading) {
    return (
      <section className="flex h-full items-center justify-center rounded-xl border border-[#183052] bg-[#0a1a2d] p-5">
        <p className="text-white">Loading...</p>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col rounded-xl border border-[#183052] bg-[#0a1a2d] p-5">
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">Overall Attendance</h2>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            className="flex items-center gap-1 rounded-full bg-[#102640] px-3 py-1 text-[14px] text-[#a9bddb] transition hover:bg-[#1a3556]"
          >
            {MONTHS[selectedMonth]} {selectedYear}
            <ChevronDown
              size={12}
              className={`transition-transform ${monthDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {monthDropdownOpen && (
            <div className="table-custom-scrollbar absolute right-0 top-full z-50 mt-1 h-[260px] w-40 overflow-auto rounded-lg border border-[#244061] bg-[#0A1A2D] shadow-lg">
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
                  {month} {selectedYear}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gauge */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative">
          <svg width="200" height="210" viewBox="0 0 200 110">
            {/* Background Arc */}
            <path
              d="M 30 90 A 70 70 0 0 1 170 90"
              fill="none"
              stroke="#18314e"
              strokeWidth="15"
              strokeLinecap="round"
            />

            {/* Progress Arc */}
            <path
              d="M 30 90 A 70 70 0 0 1 170 90"
              fill="none"
              stroke="#4585ff"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            <p className="text-[28px] font-bold text-white">{percentage.toFixed(1)}%</p>
            <p className="text-[10px] font-bold uppercase text-[#8ca1bd]">{status}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-auto grid grid-cols-3 text-center">
        <div>
          <p className="text-[13px] font-bold text-white">{attendance.workingDays}</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">Working</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#19cfba]">{attendance.presentDays}</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">Present</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#e0474f]">{attendance.absentDays}</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">Absent</p>
        </div>
      </div>
    </section>
  );
};

export default AttendanceGauge;
