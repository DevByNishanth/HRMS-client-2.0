import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'


// Constants
const TARGET_HOURS = 9;
const TOTAL_MINUTES = TARGET_HOURS * 60; // 540
const SVG_SIZE = 175;
const STROKE_WIDTH = 8;
const RADIUS = (SVG_SIZE - 12 - STROKE_WIDTH) / 2; // 77.5
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SVG_SIZE / 2;


const TimeTracker = () => {

  // Auth 

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // decoding token 

  const token = localStorage.getItem("hrms_token");
  const decodedToken = jwtDecode(token);


  // states 
  const [trackerData, setTrackerData] = useState(null);
  const [workingTime, setWorkingTime] = useState("00:00");

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Get today's day
  const getTodayDay = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    // Convert JS day index (0=Sun, 1=Mon) to our array (0=Mon, 1=Tue)
    return daysOfWeek[(dayIndex + 6) % 7];
  };

  const [selectedDay, setSelectedDay] = useState(getTodayDay());
  const [isOpen, setIsOpen] = useState(false);


  // ? ====================  api call's ====================


  async function fetchTimeTrackerData() {
    try {
      const res = await axios.get(
        `${apiUrl}/api/attendance/week-summary/?facultyId=${decodedToken?.facultyId}&dayName=${selectedDay}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dayData = res.data?.days?.[0];

      setTrackerData(dayData);

      console.log("Time Tracker Data :", dayData);
    } catch (err) {
      console.error(
        "Error occured while fetching time tracker data : ",
        err.message
      );
    }
  }


  useEffect(() => {
    if (token && decodedToken?.facultyId) {
      fetchTimeTrackerData()
    }
  }, [selectedDay])



  // functions 
  const calculateWorkingTime = (inTime, outTime) => {
    if (!inTime || !outTime) return "00:00";

    const start = new Date(inTime);
    const end =
      start.getTime() === new Date(outTime).getTime()
        ? new Date()
        : new Date(outTime);

    const diff = end.getTime() - start.getTime();

    if (diff <= 0) return "00:00";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(
      (diff % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    if (!trackerData?.inTime) {
      setWorkingTime("00:00");
      return;
    }

    const updateTime = () => {
      setWorkingTime(
        calculateWorkingTime(
          trackerData.inTime,
          trackerData.outTime
        )
      );
    };

    updateTime();

    const isLive =
      new Date(trackerData.inTime).getTime() ===
      new Date(trackerData.outTime).getTime();

    let interval;

    if (isLive) {
      interval = setInterval(updateTime, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trackerData]);


  // Derive progress (0–1) from workingTime relative to 9-hour target
  const progress = useMemo(() => {
    const [h, m] = workingTime.split(':').map(Number);
    const workedMinutes = h * 60 + m;
    return Math.min(workedMinutes / TOTAL_MINUTES, 1);
  }, [workingTime]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Decide ring color: green-ish when >= 100%, blue while in progress
  const ringColor =
    progress >= 1 ? "#10b981"
      : progress > 0.9 ? "#3f7dff"
        : "#3f7dff";

  // jsx 
  return (
    <section className="flex h-full flex-col rounded-xl border border-[#183052] bg-[#0a1a2d] p-5">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">Time Tracker</h2>

        {/* Day Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 rounded-full bg-[#102640] px-3 py-1 text-[14px] text-[#a9bddb] outline-none transition hover:bg-[#183052]"
          >
            {selectedDay}
            <ChevronDown size={12} className={`transition ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-[140px] rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-[13px] transition ${selectedDay === day
                    ? "bg-[#2563EB] text-white font-semibold"
                    : "text-[#cad7eb] hover:bg-[#132b49]"
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative mx-auto flex h-[175px] w-[175px] items-center justify-center">
          {/* Static decorative rings */}
          <div className="absolute inset-0 rounded-full border-[8px] border-dotted border-[#1d314c]" />
          <div className="absolute inset-[6px] rounded-full border-[8px] border-[#1c3049]" />

          {/* Live progress ring (SVG) */}
          <svg
            className="absolute inset-[6px] -rotate-90"
            width={SVG_SIZE - 12}
            height={SVG_SIZE - 12}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            fill="none"
          >
            {/* Background track */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke="#1c3049"
              strokeWidth={STROKE_WIDTH}
            />
            {/* Foreground progress arc */}
            {progress > 0 && (
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke={ringColor}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
                style={{ filter: `drop-shadow(0 0 6px ${ringColor}40)` }}
              />
            )}
          </svg>

          {/* Center text */}
          <div className="relative text-center">
            <p className="text-[27px] font-bold leading-none text-white">{workingTime}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#8ca1bd]">
              Working Time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeTracker;
