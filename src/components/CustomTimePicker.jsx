import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import TimeWheelPicker from "./TimeWheelPicker";

export default function CustomTimePicker({
    value,
    onChange,
    error,
    }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const formatDisplay = (time) => {
        if (!time) return "Select Time";

        const [h, m] = time.split(":");

        let hour = parseInt(h, 10);

        const period = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12;

        return `${String(hour).padStart(2, "0")}:${m} ${period}`;
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target)
        ) {
            setOpen(false);
        }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () =>
        document.removeEventListener(
            "mousedown",
            handleOutsideClick
        );
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
        <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`
            w-full
            flex
            justify-between
            items-center
            p-3
            rounded-lg
            bg-[#0f2749]
            text-white
            border
            ${
                error
                ? "border-red-500"
                : "border-blue-900"
            }
            `}
        >
            <span>{formatDisplay(value)}</span>

            <ChevronDown
            size={18}
            className={`transition-transform ${
                open ? "rotate-180" : ""
            }`}
            />
        </button>

        {open && (
            <div className="absolute left-0 top-full mt-2 right-0 w-full z-50">
            <TimeWheelPicker
                value={value}
                onApply={(selectedTime) => {
                onChange(selectedTime);
                setOpen(false);
                }}
            />
            </div>
        )}
        </div>
    );
}