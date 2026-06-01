import { useState } from "react";
import { ChevronDown, Plus, User, Users } from "lucide-react";

const ApplyDropdown = ({ label = "Apply", onForMe, onForOthers }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
      >
        <Plus size={14} />
        {label}
        <ChevronDown size={14} className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[200px] overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={() => { setIsOpen(false); onForMe(); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-[13px] text-[#cad7eb] transition hover:bg-[#102640] hover:text-white"
            >
              <User size={15} className="text-[#3984ff]" />
              For Me
            </button>
            <button
              type="button"
              onClick={() => { setIsOpen(false); onForOthers(); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-[13px] text-[#cad7eb] transition hover:bg-[#102640] hover:text-white"
            >
              <Users size={15} className="text-[#18d3bf]" />
              For Others
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplyDropdown;
