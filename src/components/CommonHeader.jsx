import { Search, Bell, Settings, UserRound, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
const CommonHeader = () => {

  return (
    <>
      {/* <div className="w-full py-2.5 bg-[#001d3b] flex items-center justify-between px-4"> */}
      <div className="w-full py-2.5 bg-[#0d2643] flex items-center justify-between px-4">
        {/* Search Bar */}
        <div className="relative ml-auto mr-4">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ffffff]"
          />

          <input
            type="text"
            placeholder="Search records..."
            className="w-[300px] h-[33px] rounded-full bg-[#ffffff13] border border-gray-800 pl-8 pr-3  text-[14px] text-white placeholder:text-[#6d84b5] outline-none"
          />

        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
        <button className="text-[#d7e3ff] hover:text-white transition">
            <Calendar size={14} />
          </button>
          <button className="text-[#d7e3ff] hover:text-white transition">
            <Bell size={14} />
          </button>

          <button className="text-[#d7e3ff] hover:text-white transition">
            <Settings size={14} />
          </button>
          <Link
            to="/profile/EMP001"
            className="text-[#d7e3ff] hover:text-white transition"
          >
            <UserRound
              size={14}
              className="text-[#d7e3ff] hover:text-white transition"
            />
          </Link>
        </div>

        {/* Profile */}


      </div>

    </>
  );
};

export default CommonHeader;
