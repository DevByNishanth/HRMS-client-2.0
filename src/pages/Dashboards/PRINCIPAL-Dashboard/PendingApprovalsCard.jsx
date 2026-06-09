import { Clock3 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import PrincipalChartTooltip from "./PrincipalChartTooltip";
import PrincipalDashboardCard from "./PrincipalDashboardCard";
import { gridColor, pendingRequests } from "./principalDashboardData";

const PendingApprovalsCard = ({ totalPending, className = "" }) => (
  <PrincipalDashboardCard
    title="Pending Approvals"
    subtitle="Request category split"
    icon={Clock3}
    className={className}
  >

    <div className="grid h-[245px] grid-cols-1 items-center gap-3 md:grid-cols-[1fr_170px] relative">
      <ResponsiveContainer width="120%" height="100%" className="absolute top-2  left-[50%] translate-x-[-50%]">
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

export default PendingApprovalsCard;
