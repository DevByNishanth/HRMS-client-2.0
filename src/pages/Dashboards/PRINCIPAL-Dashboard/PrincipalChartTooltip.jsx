const PrincipalChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#223b5e] bg-[#08182a] px-3 py-2 shadow-xl">
      {label && <p className="mb-1 text-[12px] font-semibold text-white">{label}</p>}
      <div className="space-y-1">
        {payload.map((item) => (
          <p key={`${item.name}-${item.value}`} className="text-[12px] text-[#9eb0cc]">
            <span style={{ color: item.color }}>{item.name}</span>:{" "}
            <span className="font-semibold text-white">{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default PrincipalChartTooltip;
