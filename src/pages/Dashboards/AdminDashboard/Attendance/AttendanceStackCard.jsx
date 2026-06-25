const AttendanceStatCard = ({
    icon: Icon,
    title,
    count,
    color,
}) => {
    return (
        <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-between gap-3">
                <div
                    className="mb-2 flex h-8 w-8 items-center justify-center rounded-md"
                    style={{
                        backgroundColor: `${color}22`,
                        color,
                    }}
                >
                    <Icon size={15} />
                </div>

                <p className="bg-white/6 py-1 px-2 rounded-full w-fit text-[11px] text-white/40">
                    Today
                </p>
            </div>

            <h3 className="text-[12px] uppercase tracking-wide text-white">
                {title}
            </h3>

            <p className="mt-1 text-[12px] font-semibold text-white">
                {count}
            </p>
        </div>
    );
};

export default AttendanceStatCard;