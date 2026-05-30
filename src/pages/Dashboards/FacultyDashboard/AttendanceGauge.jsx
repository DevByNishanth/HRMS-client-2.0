import { ChevronDown } from "lucide-react";

const AttendanceGauge = () => {
  return (
    <section className="flex h-full flex-col rounded-xl border border-[#183052] bg-[#0a1a2d] p-5">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">Overall Attendance</h2>
        <button className="flex items-center gap-1 rounded-full bg-[#102640] px-3 py-1 text-[14px] text-[#a9bddb]">
          All
          <ChevronDown size={12} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-[95px] w-[178px] overflow-hidden">
          <div className="absolute left-0 top-0 h-[178px] w-[178px] rounded-full border-[15px] border-[#18314e]" />
          <div
            className="absolute left-0 top-0 h-[178px] w-[178px] rounded-full border-[15px] border-transparent border-l-[#4585ff] border-t-[#4585ff]"
            style={{ transform: "rotate(-45deg)" }}
          />
          <div className="absolute inset-x-0 top-[42px] text-center">
            <p className="text-[28px] font-bold leading-none text-white">94%</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#8ca1bd]">
              Excellent
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-3 text-center">
        <div>
          <p className="text-[13px] font-bold text-white">186</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">Working</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#19cfba]">175</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">Present</p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#e0474f]">03</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">Absent</p>
        </div>
      </div>
    </section>  
  );
};

export default AttendanceGauge;
