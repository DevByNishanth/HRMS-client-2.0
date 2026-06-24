import { useMemo, useState } from "react";
import { ChevronDown, Eye, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userImg from "../../../assets/userImg.svg";
import { teamMembers } from "./myTeamData";

const presenceStyles = {
  Present: "text-[#18d3bf] bg-[#18d3bf1f]",
  Absent: "text-[#f16868] bg-[#f168681f]",
  "On Leave": "text-[#f0a15f] bg-[#f0a15f1f]",
};

const presenceOptions = ["All", "Present", "Absent", "On Leave"];

// Custom Dropdown Component
const CustomDropdown = ({ placeholder = "Select", value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full min-w-[140px] items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <div className="max-h-[200px] overflow-y-auto table-custom-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[12px] transition ${value === option
                  ? "bg-[#2563EB] text-white"
                  : "text-[#cad7eb] hover:bg-[#132b49]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MyTeamTable = () => {
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPresence, setFilterPresence] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Get unique options from data
  const roleOptions = ["All", ...new Set(teamMembers.map((m) => m.role))];
  const typeOptions = ["All", ...new Set(teamMembers.map((m) => m.type))];

  // Filtered members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      // Search filter
      const searchMatch =
        !searchQuery.trim() ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.empid.toLowerCase().includes(searchQuery.toLowerCase());

      // Presence filter
      const presenceMatch = filterPresence === "All" || member.presence === filterPresence;

      // Role filter
      const roleMatch = filterRole === "All" || member.role === filterRole;

      // Type filter
      const typeMatch = filterType === "All" || member.type === filterType;

      return searchMatch && presenceMatch && roleMatch && typeMatch;
    });
  }, [searchQuery, filterPresence, filterRole, filterType]);

  const hasActiveFilters =
    searchQuery.trim() ||
    filterPresence !== "All" ||
    filterRole !== "All" ||
    filterType !== "All";

  const resetFilters = () => {
    setSearchQuery("");
    setFilterPresence("All");
    setFilterRole("All");
    setFilterType("All");
  };

  const handleViewProfile = (member) => {
    navigate(`/profile/${member.empid}`, {
      state: { userId: member.empid },
    });
  };

  return (
    <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-[18px] font-semibold text-white">
          My Team <span>({filteredMembers.length})</span>
        </h2>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-3 px-4 pb-3">
        {/* Search Bar */}
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] pl-9 pr-3 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f839f] hover:text-white transition"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Presence Filter */}
        <div className="flex-shrink-0">
          <CustomDropdown
            placeholder="Presence"
            value={filterPresence}
            onChange={setFilterPresence}
            options={presenceOptions}
          />
        </div>

        {/* Role Filter */}
        <div className="flex-shrink-0">
          <CustomDropdown
            placeholder="Role"
            value={filterRole}
            onChange={setFilterRole}
            options={roleOptions}
          />
        </div>

        {/* Type Filter */}
        <div className="flex-shrink-0">
          <CustomDropdown
            placeholder="Type"
            value={filterType}
            onChange={setFilterType}
            options={typeOptions}
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex-shrink-0 h-11 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[12px] font-semibold text-[#8ca1bd] transition hover:bg-[#132b49] hover:text-white hover:border-[#3984ff]"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="relative z-0 max-h-[calc(100vh-400px)] overflow-auto table-custom-scrollbar">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Presence</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[#cad7eb]">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr
                  key={member.empid}
                  className="border-b border-[#132944] last:border-0"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={userImg}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate">{member.name}</p>
                        <p className="mt-0.5 text-[12px] font-normal text-[#8ca1bd]">
                          {member.empid}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{member.role}</td>
                  <td className="px-4 py-3">{member.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${presenceStyles[member.presence]}`}
                    >
                      <span className="h-[4px] w-[4px] rounded-full bg-current" />
                      {member.presence}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleViewProfile(member)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                        aria-label={`View profile for ${member.name}`}
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-[#8ca1bd]">
                  No team members found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyTeamTable;
