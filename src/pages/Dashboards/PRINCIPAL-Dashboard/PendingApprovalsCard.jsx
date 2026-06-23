import { Clock3 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import PrincipalChartTooltip from "./PrincipalChartTooltip";
import PrincipalDashboardCard from "./PrincipalDashboardCard";

const PendingApprovalsCard = ({ pendingRequests = [], className = "" }) => {
  const totalPending = pendingRequests.reduce((sum, item) => sum + item.value, 0);

  return (
    <PrincipalDashboardCard
      title="Pending Approvals"
      subtitle="Request category split"
      icon={Clock3}
      className={className}
    >
      <div className="grid h-[245px] grid-cols-1 items-center gap-3 md:grid-cols-[1fr_170px] relative">
        {/* Center label showing total */}
        <div className="absolute left-[43%] top-[38%] z-10 flex flex-col items-center pointer-events-none">
          <span className="text-[28px] font-bold text-white leading-none">{totalPending}</span>
          <span className="text-[11px] text-[#8ca1bd] mt-1">Total</span>
        </div>

        <ResponsiveContainer width="120%" height="100%" className="absolute top-2 left-[50%] translate-x-[-50%]">
          <PieChart>
            <Pie
              data={pendingRequests}
              dataKey="value"
              nameKey="name"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={7}
              stroke="#ffffff/20"
              strokeWidth={2}
            >
              {pendingRequests.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PrincipalChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => <span className="text-[12px] text-[#ffffff]">{value}</span>}
              className=""
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </PrincipalDashboardCard>
  );
};

export default PendingApprovalsCard;
