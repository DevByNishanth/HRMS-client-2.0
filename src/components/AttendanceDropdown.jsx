import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function AttendanceDropdown({
  value = "P",
  leaveOptions = [],
  odOptions = [],
  onChange,
  onOptionSelect,
  onSubmenuOpen,
  hideAbsent = false,
}) {
  const [open, setOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const [subMenuPos, setSubMenuPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
        setHoverMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on scroll/resize so the flyout doesn't stay stuck in the wrong spot
  useEffect(() => {
    if (!open) return;

    const close = () => {
      setOpen(false);
      setHoverMenu(null);
    };

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const toggleOpen = () => {
    const nextOpen = !open;

    if (nextOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = rect.width;
      const availableWidth = window.innerWidth - 10;
      let left = rect.left;

      if (left + menuWidth > availableWidth) {
        left = Math.max(10, availableWidth - menuWidth);
      }

      setMenuPos({
        top: rect.bottom + 4,
        left,
        width: menuWidth,
      });
    }

    setOpen(nextOpen);
    if (!nextOpen) {
      setHoverMenu(null);
    }
  };

  const openSubMenu = (menu, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const submenuWidth = 170;
    const availableWidth = window.innerWidth - 10;
    let left = rect.right + 4;

    if (left + submenuWidth > availableWidth) {
      left = Math.max(10, rect.left - submenuWidth - 4);
    }

    const availableHeight = window.innerHeight - 10;
    let top = rect.top;
    if (top + 200 > availableHeight) {
      top = Math.max(10, availableHeight - 200);
    }

    setSubMenuPos({
      top,
      left,
    });
    setHoverMenu(menu);
    if (typeof onSubmenuOpen === "function") {
      onSubmenuOpen(menu);
    }
  };

  const handleSelect = (option) => {
      // For EmployeeWiseAttendanceUpdate
      if (typeof onChange === "function") {
          onChange(option.value);
      }

      // For AttendanceOverrideModal
      if (typeof onOptionSelect === "function") {
          onOptionSelect(option);
      }

      setOpen(false);
      setHoverMenu(null);
  };

  const getDisplayText = () => {
    if (!value || value === "P") {
      return "P";
    }

    const option = [...leaveOptions, ...odOptions].find(
      (item) => String(item.value) === String(value)
    );

    return option ? option.value : value;
  };

  return (
    <div className="relative inline-block w-full max-w-[180px]">
      {/* Selected Value */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
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
        <span className="truncate">{getDisplayText()}</span>

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

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              minWidth: menuPos.width,
              zIndex: 9999,
            }}
            className="rounded-lg border border-[#244061] bg-[#172c46] shadow-xl overflow-visible"
          >
            {/* Present */}
            <div
              onClick={() => handleSelect({ value: "P" })}
              className="px-4 py-2 hover:bg-[#3984ff] cursor-pointer text-white"
            >
              P
            </div>

            {/* Absent */}
            {!hideAbsent && (
              <div
                onMouseEnter={(e) => openSubMenu("A", e)}
                className="px-4 py-2 hover:bg-[#1f3a5c] cursor-pointer flex justify-between items-center text-white"
              >
                <span>A</span>
                <span>▶</span>
              </div>
            )}

            {/* OD */}
            <div
              onMouseEnter={(e) => openSubMenu("OD", e)}
              // onMouseLeave={() => setTimeout(() => setHoverMenu(null), 150)}
              className="px-4 py-2 hover:bg-[#1f3a5c] cursor-pointer flex justify-between items-center text-white"
            >
              <span>OD</span>
              <span>▶</span>
            </div>
          </div>,
          document.body
        )}

      {open &&
        hoverMenu === "A" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: subMenuPos.top,
              left: subMenuPos.left,
              minWidth: 170,
              maxHeight: "min(360px, calc(100vh - 20px))",
              overflowY: "auto",
              zIndex: 10000,
            }}
            className="rounded-lg border border-[#244061] bg-[#172c46] shadow-xl"
            onMouseEnter={() => setHoverMenu("A")}
          >
            {leaveOptions.length > 0 ? (
              leaveOptions.map((item) => (
                <div
                  key={item.leaveTypeId || item.value}
                  onMouseDown={() => {
                    console.log("MouseDown:", item);
                    handleSelect(item);
                  }}
                  className="px-4 py-2 hover:bg-[#3984ff] cursor-pointer text-white"
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-[#8ca1bd]">
                No leave balance available
              </div>
            )}
          </div>,
          document.body
        )}

      {open &&
        hoverMenu === "OD" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: subMenuPos.top,
              left: subMenuPos.left,
              minWidth: 170,
              maxHeight: "min(360px, calc(100vh - 20px))",
              overflowY: "auto",
              zIndex: 10000,
            }}
            className="rounded-lg border border-[#244061] bg-[#172c46] shadow-xl"
            onMouseEnter={() => setHoverMenu("OD")}
          >
            {odOptions.length > 0 ? (
              odOptions.map((item) => (
                <div
                  key={item.leaveTypeId || item.value}
                  onMouseDown={() => {
                    console.log("MouseDown:", item);
                    handleSelect(item);
                  }}
                  className="px-4 py-2 hover:bg-[#3984ff] cursor-pointer text-white"
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-[#8ca1bd]">
                No OD options available
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}