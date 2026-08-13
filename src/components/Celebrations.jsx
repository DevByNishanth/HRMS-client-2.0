import { useState, useRef, useEffect, useCallback } from "react";
import { Cake, Briefcase, ChevronDown, Loader2 } from "lucide-react";
import { getTokenFromLocalStorage } from "../utils/tokenUtils";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://sece_hrms_server.onrender.com";

const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];

const formatCelebrationDate = (dateString) => {
    if (!dateString) return { month: "", day: "" };
    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return { month: "", day: "" };
    return { month: MONTHS[month - 1] || "", day: String(day) };
};

const getInitials = (name) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

const Celebrations = () => {
    const [filter, setFilter] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [celebrations, setCelebrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
    }, []);

    const fetchCelebrations = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const token = getTokenFromLocalStorage();
            const response = await fetch(
                `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/upcoming-celebrations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to load celebrations."
                );
            }
            setCelebrations(
                Array.isArray(data?.data) ? data.data : []
            );
        } catch (err) {
            setError(
                err.message || "Failed to load celebrations."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCelebrations();
    }, [fetchCelebrations]);

    const filterOptions = ["All", "Birthday", "Work Anniversary"];

    const filteredCelebrations =
        filter === "All"
            ? celebrations
            : celebrations.filter(
                  (celebration) =>
                      celebration.type === filter
              );

    return (
        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#183052] bg-[#0a1a2d]">

            {/* Header */}
            <header className="flex shrink-0 items-center justify-between px-5 py-4">
                <h1 className="text-[18px] font-semibold text-white">
                    Celebrations
                </h1>

                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        className="flex items-center gap-3 rounded-lg border border-[#183052] px-4 py-1.5 text-sm transition hover:border-[#244061]"
                    >
                        <span className="text-gray-100">{filter}</span>
                        <ChevronDown
                            size={17}
                            className={`text-gray-500 transition-transform ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                            {filterOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        setFilter(option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-[13px] transition ${
                                        filter === option
                                            ? "bg-[#2563EB] text-white"
                                            : "text-[#cad7eb] hover:bg-[#132b49]"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Scrollable Data */}
            <div className="h-[calc(100vh-340px)] table-custom-scrollbar overflow-y-auto px-5 pb-5">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2
                            size={20}
                            className="animate-spin text-[#3984ff]"
                        />
                    </div>
                ) : error ? (
                    <p className="mt-8 text-center text-[12px] text-[#f16868]">
                        {error}
                    </p>
                ) : filteredCelebrations.length === 0 ? (
                    <p className="mt-8 text-center text-[12px] text-[#8ca1bd]">
                        No celebrations found.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {filteredCelebrations.map(
                            (celebration, index) => {
                                const Icon =
                                    celebration.type === "Birthday"
                                        ? Cake
                                        : Briefcase;

                                const name = [
                                    celebration.firstName,
                                    celebration.lastName,
                                ]
                                    .filter(Boolean)
                                    .join(" ");

                                const { month, day } =
                                    formatCelebrationDate(
                                        celebration.date
                                    );

                                const departmentLabel =
                                    celebration.department
                                        ? ` \u00b7 ${celebration.department}`
                                        : "";

                                return (
                                    <div
                                        key={`${celebration.date}-${celebration.firstName}-${celebration.lastName}-${index}`}
                                        className="flex items-center bg-[#12263d]  justify-between rounded-2xl  px-3 py-2"
                                    >
                                        {/* Left Content */}
                                        <div className="flex min-w-0 items-center gap-2">
                                            {celebration.profileImage ? (
                                                <img
                                                    src={
                                                        celebration.profileImage
                                                    }
                                                    alt={name}
                                                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[13px] font-semibold text-white">
                                                    {getInitials(name) ||
                                                        "?"}
                                                </span>
                                            )}

                                            <div className="flex min-w-0 flex-col gap-1">
                                                <div className="truncate text-[14px] font-medium  text-gray-200">
                                                    {name}
                                                </div>

                                                <div className="flex items-center gap-2 text-[15px] text-gray-700">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#043770]  text-white">
                                                        <Icon size={16} />
                                                    </div>

                                                    <span className="truncate text-white/60 text-[12px]">
                                                        {celebration.type}
                                                        {departmentLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="ml-3 flex shrink-0 flex-col items-center text-[12px] font-medium  text-[#3e84d4]">
                                            <span>{month}</span>
                                            <span>{day}</span>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Celebrations;
