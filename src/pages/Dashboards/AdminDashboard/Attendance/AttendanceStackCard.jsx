const AttendanceStatCard = ({
    icon: Icon,
    title,
    count,
    color,
}) => {
    return (
        <div className="relative rounded-lg border border-[#183052] bg-[#0a1a2d] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">

            {/* TODAY BADGE */}
            <span className="absolute right-2 top-2 rounded-full bg-[#1f3b5c] px-2 py-[2px] text-[10px] text-[#9ecbff]">
                Today
            </span>

            {/* ICON */}
            <div
                className="mb-2 flex h-8 w-8 items-center justify-center rounded-md"
                style={{
                    backgroundColor: `${color}22`,
                    color,
                }}
            >
                <Icon size={15} />
            </div>

            {/* TITLE */}
            <h3 className="text-[12px] uppercase tracking-wide text-white">
                {title}
            </h3>

            {/* COUNT */}
            <p className="mt-1 text-[16px] font-semibold text-white">
                {count}
            </p>
        </div>
    );
};

export default AttendanceStatCard;