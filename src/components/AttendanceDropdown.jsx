import React, { useEffect, useRef, useState } from "react";

export default function AttendanceDropdown({
  value = "P",
  leaveOptions = [],
  odOptions = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
        setHoverMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
    setHoverMenu(null);
  };

  const getDisplayText = () => {
    if (value === "P") return "P";

    const leave = leaveOptions.find(
      (item) => item.value === value
    );

    if (leave) return leave.value;

    const od = odOptions.find(
      (item) => item.value === value
    );

    if (od) return od.value;

    return value;
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block w-[140px]"
    >
      {/* Selected Value */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full
          h-10
          px-3
          rounded-lg
          border
          border-[#244061]
          bg-[#172c46]
          text-white
          flex
          justify-between
          items-center
          cursor-pointer
        "
      >
        <span>{getDisplayText()}</span>

        <svg
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Main Dropdown */}
      {open && (
        <div
          className="
            absolute
            top-full
            left-0
            mt-1
            w-full
            rounded-lg
            border
            border-[#244061]
            bg-[#172c46]
            shadow-xl
            z-50
            overflow-visible
          "
        >
          {/* Present */}
          <div
            onClick={() => handleSelect({ value: "P" })}
            className="
              px-4
              py-2
              hover:bg-[#3984ff]
              cursor-pointer
              text-white
            "
          >
            P
          </div>

          {/* Absent */}
          <div
            className="
              relative
              px-4
              py-2
              hover:bg-[#1f3a5c]
              cursor-pointer
              flex
              justify-between
              items-center
              text-white
            "
            onMouseEnter={() => setHoverMenu("A")}
          >
            <span>A</span>
            <span>▶</span>

            {hoverMenu === "A" && (
              <div
                className="
                  absolute
                  left-full
                  top-0
                  ml-1
                  min-w-[170px]
                  rounded-lg
                  border
                  border-[#244061]
                  bg-[#172c46]
                  shadow-xl
                  z-[999]
                "
                onMouseLeave={() => setHoverMenu(null)}
              >
                {leaveOptions.map((item) => (
                  <div
                    key={item.leaveTypeId}
                    onClick={() => handleSelect(item)}
                    className="
                      px-4
                      py-2
                      hover:bg-[#3984ff]
                      cursor-pointer
                      text-white
                    "
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OD */}
          <div
            className="
              relative
              px-4
              py-2
              hover:bg-[#1f3a5c]
              cursor-pointer
              flex
              justify-between
              items-center
              text-white
            "
            onMouseEnter={() => setHoverMenu("OD")}
          >
            <span>OD</span>
            <span>▶</span>

            {hoverMenu === "OD" && (
              <div
                className="
                  absolute
                  left-full
                  top-0
                  ml-1
                  min-w-[170px]
                  rounded-lg
                  border
                  border-[#244061]
                  bg-[#172c46]
                  shadow-xl
                  z-[999]
                "
                onMouseLeave={() => setHoverMenu(null)}
              >
                {odOptions.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    className="
                      px-4
                      py-2
                      hover:bg-[#3984ff]
                      cursor-pointer
                      text-white
                    "
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}