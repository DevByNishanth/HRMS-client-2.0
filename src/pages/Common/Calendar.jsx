import CommonHeader from "../../components/CommonHeader";
import Sidebar from "../../components/Siedbar";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = [2024, 2025, 2026, 2027];

const DropdownFilter = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative min-w-[140px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0D2138] px-3 text-sm text-white"
      >
        <span>{value || placeholder}</span>

        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#244061] bg-[#0A1A2D] shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                value === option
                  ? "bg-[#132b49] text-white"
                  : "text-[#cad7eb] hover:bg-[#102640]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Calendar = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchCalendarData = async (selectedMonth, selectedYear) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("hrms_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/holidays?month=${selectedMonth + 1}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      // console.log("API Response:", data);

      const holidayData = Array.isArray(data) ? data : data.data || [];

      // console.log("Holiday Data:", holidayData);

      setHolidays(holidayData);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCalendarData(month, year);
  }, [month, year]);

  const currentMonth = new Date(year, month, 1);
  const yearOptions = years.map(String);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getHoliday = (date) => {
    const currentDate = format(date, "yyyy-MM-dd");
  
    // console.log(
    //   "Comparing:",
    //   currentDate,
    //   holidays.map((h) => h.holidayDate?.slice(0, 10))
    // );
  
    return holidays.find(
      (item) => item.holidayDate?.slice(0, 10) === currentDate
    );
  };
  // console.log("Holidays State:", holidays);
  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="flex-1 overflow-auto">
          <div className="rounded-xl  shadow">
            {/* Header */}
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-[#ffffff]">
                Holiday & Events Calendar
              </h2>

              <div className="flex gap-3">
                <DropdownFilter
                  value={months[month]}
                  options={months}
                  placeholder="Month"
                  onChange={(selectedMonth) =>
                    setMonth(months.indexOf(selectedMonth))
                  }
                />

                <DropdownFilter
                  value={String(year)}
                  options={yearOptions}
                  placeholder="Year"
                  onChange={(selectedYear) => setYear(Number(selectedYear))}
                />
              </div>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 bg-[#172C46]   mx-5 rounded-t-xl">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div
                  key={day}
                  className="py-4 px-4  font-medium text-[#9aacc7]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border border-[#183052] mx-5 rounded-b-xl">
              {loading ? (
                <div className="col-span-7 flex h-40 items-center justify-center text-[#9aacc7]">
                  Loading holidays...
                </div>
              ) : (
                days.map((date, index) => {
                  const currentDate = format(date, "yyyy-MM-dd");

                  const holiday = getHoliday(date);

                  // console.log("Calendar Date:", currentDate);
                  // console.log("Matched Holiday:", holiday);

                  return (
                    <div
                      key={index}
                      className={`
                      h-23 border-r border-t border-[#183052]  p-3 relative
                    
                      ${holiday ? "bg-[#254272]/20" : ""}
                    `}
                    >
                      <div className=" text-lg text-[#9aacc7]">
                        {format(date, "d")}
                      </div>

                      {holiday && (
                        <div
                          className={`
      mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold
      ${
        holiday.holidayName === "Sunday"
          ? "bg-[#ce6545]/10 text-[#ce6545]"
          : holiday.holidayName?.includes("Saturday")
            ? "bg-[#feb685]/10 text-[#feb685]"
            : "bg-[#4fdbc8]/10 text-[#4fdbc8]"
      }
    `}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              holiday.holidayName === "Sunday"
                                ? "bg-[#ce6545]"
                                : holiday.holidayName?.includes("Saturday")
                                  ? "bg-[#feb685]"
                                  : "bg-[#4fdbc8]"
                            }`}
                          />
                          <p
                            className="max-w-20 truncate "
                            title={holiday.holidayName}
                          >
                            {holiday.holidayName}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
