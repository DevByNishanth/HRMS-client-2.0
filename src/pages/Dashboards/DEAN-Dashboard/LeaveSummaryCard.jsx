import React from "react";

const LeaveSummaryCard = ({ icon: Icon, title, code, used, total, color }) => {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <div className="rounded-lg border border-gray-800 bg-[#0A1929] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
      <div
        className="mb-5 flex h-8 w-8  items-center justify-center rounded-md"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <Icon size={15} />
      </div>

      <h3 className="text-[12px] -mt-2.5 font-semibold uppercase tracking-wide text-white">
        {title} ({code})
      </h3>

      <div className="mt-1 flex items-center justify-between text-[12px] font-semibold">
        <span className="text-white">{used} / {total} Days</span>
      </div>

      <div className="mt-2 h-[4px] overflow-hidden rounded-full bg-[#1c2d45]">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default LeaveSummaryCard;
