import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Generate year range from 1950 to 2050
const YEAR_RANGE = Array.from({ length: 101 }, (_, i) => 1950 + i);

const formatDisplayDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const isSameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBeforeMinDate = (date, minDate) => {
  if (!date || !minDate) return false;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const m = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  return d < m;
};

const FacultyDatePicker = ({
  id,
  value,
  onChange,
  placeholder = "Select date",
  popupAlign = "left",
  minDate = null,
}) => {
  const pickerRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      dates.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  }, [viewDate]);

  const moveMonth = useCallback((direction) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  }, []);

  const handleSelectDate = useCallback((date) => {
    if (isBeforeMinDate(date, minDate)) return;
    onChange(date);
    setIsOpen(false);
  }, [onChange, minDate]);

  const handleSelectMonth = useCallback((monthIndex) => {
    setViewDate((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
  }, []);

  const handleSelectYear = useCallback((year) => {
    setViewDate((prev) => {
      const currentMonth = prev.getMonth();
      // Keep the same month, just change year
      return new Date(year, currentMonth, 1);
    });
    setShowYearPicker(false);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync viewDate with value when value changes externally
  useEffect(() => {
    if (value) {
      setViewDate(new Date(value.getFullYear(), value.getMonth(), 1));
    }
  }, [value]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  return (
    <div className="relative" ref={pickerRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] cursor-pointer"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <CalendarDays size={16} className="text-[#3984ff] shrink-0" />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full z-[9999] w-[300px] rounded-lg border border-[#244061] bg-[#0a1a2d] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${
            popupAlign === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Header with month/year selectors */}
          <div className="mb-3 flex items-center justify-between gap-1">
            {/* Previous month arrow */}
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Month dropdown */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  setShowYearPicker(false);
                  setShowMonthPicker((prev) => !prev);
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#183052] cursor-pointer"
              >
                {MONTH_LABELS[currentMonth]}
                <ChevronDown
                  size={14}
                  className={`text-[#6f839f] transition ${showMonthPicker ? "rotate-180" : ""}`}
                />
              </button>

              {showMonthPicker && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowMonthPicker(false)}
                    aria-label="Close month picker"
                  />
                  <div
                    ref={monthDropdownRef}
                    className="absolute left-1/2 z-50 mt-1 w-40 -translate-x-1/2 rounded-lg border border-[#244061] bg-[#071425] py-1 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                  >
                    <div className="grid grid-cols-2 gap-0.5 p-1.5">
                      {MONTH_SHORT.map((label, idx) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleSelectMonth(idx)}
                          className={`rounded-md px-2 py-2 text-[12px] font-medium transition ${
                            idx === currentMonth
                              ? "bg-[#2563EB] text-white"
                              : "text-[#cad7eb] hover:bg-[#183052] hover:text-white"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Year dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowMonthPicker(false);
                  setShowYearPicker((prev) => !prev);
                }}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#183052] cursor-pointer"
              >
                {currentYear}
                <ChevronDown
                  size={14}
                  className={`text-[#6f839f] transition ${showYearPicker ? "rotate-180" : ""}`}
                />
              </button>

              {showYearPicker && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowYearPicker(false)}
                    aria-label="Close year picker"
                  />                    <div
                      ref={yearDropdownRef}
                      className="absolute right-0 z-50 mt-1 w-[130px] rounded-lg border border-[#244061] bg-[#071425] shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                    >
                      <div className="max-h-[220px] overflow-y-auto py-1 table-custom-scrollbar">
                      {YEAR_RANGE.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleSelectYear(year)}
                          className={`w-full px-3 py-2 text-left text-[12px] font-medium transition ${
                            year === currentYear
                              ? "bg-[#2563EB] text-white"
                              : "text-[#cad7eb] hover:bg-[#183052] hover:text-white"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Next month arrow */}
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day labels */}
          <div className="mb-1 grid grid-cols-7 gap-0.5 text-center">
            {DAY_LABELS.map((day) => (
              <span
                key={day}
                className="py-1 text-[10px] font-semibold text-[#8ca1bd]"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {calendarDays.map((date, index) => {
              const isDisabled = !date || isBeforeMinDate(date, minDate);
              const isSelected = isSameDay(date, value);
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={date ? date.toISOString() : `empty-${index}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDate(date)}
                  className={`relative h-9 rounded-md text-[12px] font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                      : isToday
                        ? "text-white ring-1 ring-[#3984ff] hover:bg-[#132b49]"
                        : "text-[#cad7eb] hover:bg-[#132b49] hover:text-white"
                  } ${
                    isDisabled
                      ? "cursor-not-allowed text-[#4f5f7f] opacity-40"
                      : ""
                  } disabled:pointer-events-none ${
                    !date ? "invisible" : ""
                  }`}
                >
                  {date?.getDate()}
                </button>
              );
            })}
          </div>

          {/* Today quick-select */}
          <div className="mt-3 border-t border-[#183052] pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onChange(today);
                setIsOpen(false);
              }}
              className="rounded-md px-3 py-1.5 text-[11px] font-semibold text-[#3984ff] transition hover:bg-[#183052] cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDatePicker;
