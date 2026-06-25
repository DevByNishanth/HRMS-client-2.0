import { useState } from "react";
import { Search, X, UserRound } from "lucide-react";

const facultyData = [
  { empid: "EMP001", name: "Surya Chandran", role: "Assistant Professor", type: "Teaching" },
  { empid: "EMP002", name: "Nivetha Kumar", role: "Associate Professor", type: "Teaching" },
  { empid: "EMP003", name: "Arjun Prakash", role: "Lab Instructor", type: "Non Teaching" },
  { empid: "EMP004", name: "Maya Srinivasan", role: "Professor", type: "Teaching" },
  { empid: "EMP005", name: "Karthik Raman", role: "Assistant Professor", type: "Teaching" },
  { empid: "EMP006", name: "Priya Menon", role: "Office Assistant", type: "Non Teaching" },
  { empid: "EMP007", name: "Vikram Raj", role: "Assistant Professor", type: "Teaching" },
  { empid: "EMP008", name: "Ananya Ravi", role: "Associate Professor", type: "Teaching" },
  { empid: "EMP009", name: "Deepak Kumar", role: "Lab Instructor", type: "Non Teaching" },
];

const FacultySearchPopup = ({ onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaculty = facultyData.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.empid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className="flex h-[520px] w-[440px] flex-col rounded-xl border border-[#1e3450] bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Apply for Others
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Select Faculty
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close faculty search"
          >
            <X size={17} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, emp ID, or role..."
              className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] pl-9 pr-4 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
              autoFocus
            />
          </div>
        </div>

        {/* Faculty List */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 table-custom-scrollbar">
          {filteredFaculty.length > 0 ? (
            <div className="space-y-2">
              {filteredFaculty.map((faculty) => (
                <button
                  key={faculty.empid}
                  type="button"
                  onClick={() => onSelect(faculty)}
                  className="flex w-full items-center gap-3 rounded-lg border border-[#1e3450] bg-[#0a1a2d] px-3 py-3 text-left transition hover:border-[#3984ff] hover:bg-[#102640]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[16px] font-semibold text-white">
                    {faculty.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-white">
                      {faculty.name}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-[#8ca1bd]">
                      {faculty.role}
                    </p>
                    <p className="text-[11px] text-[#3984ff]">{faculty.empid}</p>
                  </div>
                  <UserRound size={16} className="shrink-0 text-[#3984ff]" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-[14px] text-[#8ca1bd]">
                No faculty found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FacultySearchPopup;
