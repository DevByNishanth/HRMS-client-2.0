const PrincipalStatTile = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-[#183052] bg-[#0a1a2d] px-3 py-3">
    <div className="flex items-center justify-between gap-2 text-[#8ca1bd]">
      <span className="truncate text-[11px] font-medium">{label}</span>
      <Icon size={14} className="shrink-0 text-[#5d9bff]" />
    </div>
    <p className="mt-2 text-[22px] font-bold leading-none text-white">{value}</p>
  </div>
);

export default PrincipalStatTile;
