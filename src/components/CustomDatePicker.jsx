import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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

const formatDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const CustomDatePicker = ({
    id,
    label,
    value,
    onChange,
    placeholder = "Select date",
    popupAlign = "left",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value || new Date());

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dates = [];

        for (let index = 0; index < firstDay.getDay(); index += 1) {
            dates.push(null);
        }

        for (let day = 1; day <= lastDay.getDate(); day += 1) {
            dates.push(new Date(year, month, day));
        }

        return dates;
    }, [viewDate]);

    const moveMonth = (direction) => {
        setViewDate((currentDate) => (
            new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
        ));
    };

    const isSelectedDate = (date) => (
        value
        && date
        && value.getFullYear() === date.getFullYear()
        && value.getMonth() === date.getMonth()
        && value.getDate() === date.getDate()
    );

    const handleSelectDate = (date) => {
        onChange(date);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {label && (
                <label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-white">
                    {label}
                </label>
            )}
            <button
                id={id}
                type="button"
                onClick={() => setIsOpen((currentState) => !currentState)}
                className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
            >
                <span className={value ? "text-white" : "text-[#6f839f]"}>
                    {value ? formatDate(value) : placeholder}
                </span>
                <CalendarDays size={16} className="text-[#3984ff]" />
            </button>

            {isOpen && (
                <div
                    className={`absolute top-full z-[9999] w-[280px] rounded-lg border border-[#244061] bg-[#0a1a2d] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${popupAlign === "right" ? "right-0" : "left-0"
                        }`}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => moveMonth(-1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <p className="text-[13px] font-semibold text-white">
                            {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </p>
                        <button
                            type="button"
                            onClick={() => moveMonth(1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
                            aria-label="Next month"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {days.map((day) => (
                            <span key={day} className="py-1 text-[10px] font-semibold text-[#8ca1bd]">
                                {day}
                            </span>
                        ))}

                        {calendarDays.map((date, index) => (
                            <button
                                key={date ? date.toISOString() : `empty-${index}`}
                                type="button"
                                disabled={!date}
                                onClick={() => handleSelectDate(date)}
                                className={`h-8 rounded-md text-[12px] font-semibold transition ${isSelectedDate(date)
                                        ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                                        : "text-[#cad7eb] hover:bg-[#132b49] hover:text-white"
                                    } disabled:pointer-events-none disabled:opacity-0`}
                            >
                                {date?.getDate()}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
