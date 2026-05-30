const weeklyWorkHours = [
  { day: "Mon", date: "May 25", hours: 8.5 },
  { day: "Tue", date: "May 26", hours: 7.25 },
  { day: "Wed", date: "May 27", hours: 8 },
  { day: "Thu", date: "May 28", hours: 6.75 },
  { day: "Fri", date: "May 29", hours: 8.75 },
  { day: "Sat", date: "May 30", hours: 4 },
  { day: "Sun", date: "May 31", hours: 0 },
];

const WeeklyWorkBarChart = () => {
  const maxHours = 9;

  return (
    <section className="rounded-xl border border-[#183052] bg-[#0a1a2d] p-4">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-medium text-white">Weekly Working Hours</h2>
          <p className="text-[12px] text-[#8ca1bd]">Last 7 days attendance duration</p>
        </div>
        <div className="rounded-full bg-[#102640] px-3 py-1 text-[12px] font-medium text-[#a9bddb]">
          This Week
        </div>
      </div>

      <div className="flex h-[220px] items-end gap-4 border-b border-l border-[#1b3554] px-4 pb-3">
        {weeklyWorkHours.map((item) => {
          const barHeight = `${Math.max((item.hours / maxHours) * 100, item.hours ? 8 : 2)}%`;
          const isLowHours = item.hours < 7;

          return (
            <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="flex h-full w-full items-end justify-center">
                <div
                  className={`group relative w-full max-w-[42px] rounded-t-lg transition hover:brightness-110 ${
                    isLowHours ? "bg-[#e0474f]" : "bg-[#3984ff]"
                  }`}
                  style={{ height: barHeight }}
                >
                  <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-[#071425] px-2 py-1 text-[10px] font-semibold text-white shadow-lg group-hover:block">
                    {item.hours}h
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[12px] font-semibold text-white">{item.day}</p>
                {/* <p className="mt-0.5 text-[10px] text-[#8ca1bd]">{item.date}</p> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="mt-4 flex items-center justify-between text-[12px]">
        <span className="font-medium text-[#8ca1bd]">Total</span>
        <span className="font-semibold text-[#18d3bf]">
          {weeklyWorkHours.reduce((total, item) => total + item.hours, 0)} hours
        </span>
      </div> */}
    </section>
  );
};

export default WeeklyWorkBarChart;
