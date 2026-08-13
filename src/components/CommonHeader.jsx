import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { UserRound, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import SearchBar from "./SearchBar";

const CommonHeader = () => {
  const token = localStorage.getItem("hrms_token");
  let decoded = jwtDecode(token);
  // console.log(decoded);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const isAdmin = decoded.role === "admin" || decoded.role === "hr";

  return (
    <>
      {/* <div className="w-full py-2.5 bg-[#001d3b] flex items-center justify-between px-4"> */}
      <div className="w-full py-3 bg-[#0d2643] flex items-center justify-end px-4">
        {/* Search Bar */}
        {/* <div className="relative ml-auto mr-4">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ffffff]"
          />

          <input
            type="text"
            placeholder="Search records..."
            className="w-[300px] h-[33px] rounded-full bg-[#ffffff13] border border-gray-800 pl-8 pr-3  text-[14px] text-white placeholder:text-[#6d84b5] outline-none"
          />
        </div> */}

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          {/* <button className="text-[#d7e3ff] hover:text-white transition">
            <Calendar size={14} />
          </button>
          <button className="text-[#d7e3ff] hover:text-white transition">
            <Bell size={14} />
          </button>

          <button className="text-[#d7e3ff] hover:text-white transition">
            <Settings size={14} />
          </button> */}
          {decoded.role == "admin" || decoded.role == "principal" ? (
            ""
          ) : (
            <div className="flex items-center gap-6">
              <div className="">
                <SearchBar />
              </div>
              <Link
                to={`/profile/${decoded?.facultyId}`}
                className="text-[#d7e3ff] hover:text-white transition"
              >
                <UserRound
                  size={14}
                  className="text-[#d7e3ff] hover:text-white transition"
                />
              </Link>
            </div>

          )}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#d7e3ff] transition hover:bg-[#ffffff13] hover:text-white"
              title="Change password"
              aria-label="Change password"
            >
              <KeyRound
                size={16}
                className="text-[#d7e3ff] hover:text-white transition"
              />
            </button>
          )}
        </div>

        {/* Profile */}
      </div>

      {isChangePasswordOpen && (
        <ChangePasswordModal
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </>
  );
};

export default CommonHeader;
