import React, { useEffect, useState } from "react";

export default function TimeWheelPicker({
    value,
    onApply,
    }) {
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");
    const [hourOpen, setHourOpen] = useState(false);
    const [minuteOpen, setMinuteOpen] = useState(false);
    const [periodOpen, setPeriodOpen] = useState(false);

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

    // const handleApply = () => {
    //     let hr24 = parseInt(hour, 10);

    //     if (period === "AM") {
    //     if (hr24 === 12) hr24 = 0;
    //     } else {
    //     if (hr24 !== 12) hr24 += 12;
    //     }

    //     const formattedTime =
    //     `${String(hr24).padStart(2, "0")}:${minute}`;

    //     onApply(formattedTime);
    // };

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
            <div className="relative flex-1">
                <button
                    type="button"
                    onClick={() => {
                    setHourOpen(!hourOpen);
                    setMinuteOpen(false);
                    setPeriodOpen(false);
                    }}
                    className="
                    w-full
                    bg-[#132A47]
                    text-white
                    rounded-lg
                    p-2
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    "
                >
                    {hour}
                </button>

                {hourOpen && (
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
                        scrollbar-hide
                        z-50
                    "
                    >
                    {hours.map((h) => (
                        <div
                        key={h}
                        onClick={() => {
                            setHour(h);
                            setHourOpen(false);
                        }}
                        className={`
                            px-3
                            py-2
                            text-white
                            cursor-pointer
                            hover:bg-blue-600
                            ${hour === h ? "bg-blue-600" : ""}
                        `}
                        >
                        {h}
                        </div>
                    ))}
                    </div>
                )}
                </div>

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
                    cursor-pointer
                    p-2
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
                        scrollbar-hide
                        z-50
                    "
                    >
                    {minutes.map((m) => (
                        <div
                        key={m}
                        onClick={() => {
                            setMinute(m);
                            setMinuteOpen(false);
                        }}
                        className={`
                            px-3
                            py-2
                            text-white
                            cursor-pointer
                            hover:bg-blue-600
                            ${minute === m ? "bg-blue-600" : ""}
                        `}
                        >
                        {m}
                        </div>
                    ))}
                    </div>
                )}
                </div>

            {/* AM PM */}
            <div className="relative flex-1">
                <button
                    type="button"
                    onClick={() => {
                    setPeriodOpen(!periodOpen);
                    setHourOpen(false);
                    setMinuteOpen(false);
                    }}
                    className="
                    w-full
                    bg-[#132A47]
                    text-white
                    rounded-lg
                    p-2
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    "
                >
                    {period}
                </button>

                {periodOpen && (
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
                        overflow-hidden
                        z-50
                    "
                    >
                    {["AM", "PM"].map((p) => (
                        <div
                        key={p}
                        onClick={() => {
                            setPeriod(p);
                            setPeriodOpen(false);

                            let hr24 = parseInt(hour, 10);

                            if (p === "AM") {
                                if (hr24 === 12) hr24 = 0;
                            } else {
                                if (hr24 !== 12) hr24 += 12;
                            }

                            const formattedTime =
                                `${String(hr24).padStart(2, "0")}:${minute}`;

                            onApply(formattedTime);
                        }}
                        className="
                            px-3
                            py-2
                            text-white
                            cursor-pointer
                            hover:bg-blue-600
                        "
                        >
                        {p}
                        </div>
                    ))}
                    </div>
                )}
                </div>
        </div>

        {/* <button
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
        </button> */}
        </div>
    );
}