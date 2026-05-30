import { useState } from "react";
import { ChevronDown } from "lucide-react";

const TimeTracker = () => {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const getTodayDay = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    return daysOfWeek[(dayIndex + 6) % 7];
  };

  const [selectedDay, setSelectedDay] = useState(getTodayDay());
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex h-full flex-col rounded-[32px] border border-white/20 bg-white/10 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">Time Tracker</h2>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[14px] text-[#a9bddb] outline-none transition hover:bg-white/15"
          >
            {selectedDay}
            <ChevronDown size={12} className={`transition ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-[140px] rounded-[20px] border border-white/20 bg-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-[13px] transition ${
                    selectedDay === day
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
        <div className="relative mx-auto flex h-[175px] w-[175px] items-center justify-center rounded-full bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
          <div className="absolute inset-0 rounded-full border-[8px] border-dotted border-[#1d314c]" />
          <div className="absolute inset-[6px] rounded-full border-[8px] border-[#1c3049]" />
          <div
            className="absolute inset-[6px] rounded-full border-[8px] border-transparent border-t-[#3f7dff] border-r-[#3f7dff]"
            style={{ transform: "rotate(20deg)" }}
          />
          <div className="relative text-center">
            <p className="text-[27px] font-bold leading-none text-white">08:30</p>
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
