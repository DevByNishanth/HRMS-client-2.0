import { ChevronDown } from "lucide-react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const days = [
  { day: 28, type: "muted" },
  { day: 29, type: "present" },
  { day: 10, type: "present" },
  { day: 11, type: "present" },
  { day: 12, type: "present" },
  { day: 13, type: "present" },
  { day: 14, type: "leave" },
  { day: 15, type: "present" },
  { day: 16, type: "absent" },
  { day: 17, type: "absent" },
  { day: 18, type: "present" },
  { day: 19, type: "absent" },
  { day: 20, type: "absent" },
  { day: 21, type: "leave" },
  { day: 22, type: "leave" },
  { day: 23, type: "muted" },
  { day: 24, type: "muted" },
  { day: 25, type: "muted" },
  { day: 26, type: "absent" },
  { day: 27, type: "muted" },
  { day: 28, type: "muted" },
];

const colorByType = {
  present: "bg-[#19cfba] text-[#06172b]",
  absent: "bg-[#e0474f] text-white",
  leave: "bg-[#1d74d8] text-white",
  muted: "bg-[#173252] text-[#8ca1bd]",
};

const LegendItem = ({ color, label }) => (
  <span className="flex items-center gap-1 text-[12px] uppercase text-[#8ca1bd]">
    <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: color }} />
    {label}
  </span>
);

const ActiveDayCalendar = () => {
  return (
    <section className="flex h-full flex-col rounded-xl border border-[#183052] bg-[#0a1a2d] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">Your Active Day</h2>
        <button className="flex items-center gap-1 rounded-full bg-[#102640] px-3 py-1 text-[14px] text-[#a9bddb]">
          October
          <ChevronDown size={12} />
        </button>
      </div>

      <div className="grid flex-1 grid-cols-7 content-center gap-2 p-2 text-center">
        {weekDays.map((day) => (
          <span key={day} className="text-[9px] font-semibold text-[#7186a5]">
            {day}
          </span>
        ))}

        {days.map((item, index) => (
          <span
            key={`${item.day}-${index}`}
            className={`flex aspect-square items-center justify-center rounded-full text-[12px] font-bold ${colorByType[item.type]}`}
          >
            {item.day}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap justify-center gap-3">
        <LegendItem color="#19cfba" label="Present (40)" />
        <LegendItem color="#e0474f" label="Absent (10)" />
        <LegendItem color="#1d74d8" label="Holiday (5)" />
      </div>
    </section>
  );
};

export default ActiveDayCalendar;
