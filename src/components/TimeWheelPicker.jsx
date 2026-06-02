import React, { useEffect, useState } from "react";

export default function TimeWheelPicker({
    value,
    onApply,
    }) {
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");
    const [minuteOpen, setMinuteOpen] = useState(false);

    useEffect(() => {
        if (!value) {
        setHour("09");
        setMinute("00");
        setPeriod("AM");
        return;
        }

        const [h, m] = value.split(":");

        let hr = parseInt(h, 10);

        const p = hr >= 12 ? "PM" : "AM";

        hr = hr % 12 || 12;

        setHour(String(hr).padStart(2, "0"));
        setMinute(m);
        setPeriod(p);
    }, [value]);

    const handleApply = () => {
        let hr24 = parseInt(hour, 10);

        if (period === "AM") {
        if (hr24 === 12) hr24 = 0;
        } else {
        if (hr24 !== 12) hr24 += 12;
        }

        const formattedTime =
        `${String(hr24).padStart(2, "0")}:${minute}`;

        onApply(formattedTime);
    };

    const hours = Array.from(
        { length: 12 },
        (_, i) => String(i + 1).padStart(2, "0")
    );

    const minutes = Array.from(
        { length: 60 },
        (_, i) => String(i).padStart(2, "0")
    );

    return (
        <div
        className="
            bg-[#0A1A2D]
            border
            border-blue-900
            rounded-xl
            p-4
            shadow-xl
            min-w-[220px]
        "
        >
        <div className="flex items-center gap-3">
            {/* Hour */}
            <select
            value={hour}
            onChange={(e) =>
                setHour(e.target.value)
            }
            className="
                flex-1
                bg-[#132A47]
                text-white
                rounded-lg
                p-2
                outline-none
            "
            >
            {hours.map((h) => (
                <option key={h} value={h}>
                {h}
                </option>
            ))}
            </select>

            {/* Minute */}
            <div className="relative flex-1">
                <button
                    type="button"
                    onClick={() => setMinuteOpen(!minuteOpen)}
                    className="
                    w-full
                    bg-[#132A47]
                    text-white
                    rounded-lg
                    p-2
                    text-left
                    "
                >
                    {minute}
                </button>

                {minuteOpen && (
                    <div
                    className="
                        absolute
                        top-full
                        left-0
                        mt-1
                        w-full
                        bg-[#132A47]
                        border border-blue-900
                        rounded-lg
                        max-h-40
                        overflow-y-auto
                        z-50
                        custom-scrollbar
                    "
                    >
                    {minutes.map((m) => (
                        <div
                        key={m}
                        onClick={() => {
                            setMinute(m);
                            setMinuteOpen(false);
                        }}
                        className="
                            px-3
                            py-2
                            text-white
                            cursor-pointer
                            hover:bg-blue-600
                        "
                        >
                        {m}
                        </div>
                    ))}
                    </div>
                )}
                </div>

            {/* AM PM */}
            <select
            value={period}
            onChange={(e) =>
                setPeriod(e.target.value)
            }
            className="
                flex-1
                bg-[#132A47]
                text-white
                rounded-lg
                p-2
                outline-none
            "
            >
            <option value="AM">
                AM
            </option>

            <option value="PM">
                PM
            </option>
            </select>
        </div>

        <button
            type="button"
            onClick={handleApply}
            className="
            w-full
            mt-4
            py-2
            rounded-lg
            bg-blue-600
            hover:bg-blue-700
            text-white
            "
        >
            Apply
        </button>
        </div>
    );
}