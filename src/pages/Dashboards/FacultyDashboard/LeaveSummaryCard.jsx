import React from "react";

const LeaveSummaryCard = ({ icon: Icon, title, code, used, total, color, bg, lightBg, lightIconBg }) => {
  console.log("bg : ", lightBg)
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <div style={{
      "--light-bg": lightBg,
    }} className={`rounded-lg border border-gray-800 dark:border-none  p-4 dark:shadow-none  shadow-[0_10px_30px_rgba(0,0,0,0.14)] bg-[#0A1929] dark:bg-[var(--light-bg)]/20  `}>
      <div
        className="mb-5 flex h-8 w-8 items-center justify-center rounded-md text-[var(--icon-color)] dark:text-[var(light-color)] bg-[var(--icon-bg)] dark:bg-[var(--icon-color)] dark:text-[var(--light-icon-color)] "
        style={{
          "--icon-bg": `${color}22`,
          "--icon-color": color,
          "--light-icon-color": "#ffffff",
          "light-color ": "#ffffff",
          "lightIconBg": lightIconBg
        }}
      >
        <Icon size={15} />
      </div>

      <h3 className="text-[12px] -mt-2.5 font-semibold uppercase tracking-wide dark:font-bold dark:text-black text-white">
        {title} ({code})
      </h3>

      <div className="mt-1 flex items-center justify-between text-[12px] font-semibold">
        <span className="text-white dark:text-black"> <span style={{ "ProgressColor": lightBg }} className="dark:font-bold">{used}</span> / {total} Days</span>
      </div>

      <div className="mt-2 h-[4px] overflow-hidden rounded-full bg-[#1c2d45] dark:bg-white">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default LeaveSummaryCard;
