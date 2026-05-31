import { ChevronDown } from "lucide-react";

const GlassAttendanceGauge = () => {
  return (
    <section
      className="
    relative
    w-100
    p-5
    border border-white/20 bg-[#98989800] backdrop-blur-2xl rounded-2xl
  "
    >
        
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">
          Overall Attendance
        </h2>
        <button className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[14px] text-[#a9bddb] shadow-inner shadow-black/10 backdrop-blur-md transition hover:bg-white/15">
          All
          <ChevronDown size={12} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-[95px] w-[178px] overflow-hidden rounded-full bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
          <div className="absolute left-0 top-0 h-[178px] w-[178px] rounded-full border-[15px] border-[#18314e]/70" />
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
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">
            Working
          </p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#19cfba]">175</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">
            Present
          </p>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#e0474f]">03</p>
          <p className="mt-1 text-[12px] font-medium uppercase text-[#8ca1bd]">
            Absent
          </p>
        </div>
      </div>
    </section>
  );
};

export default GlassAttendanceGauge;
