import { GraduationCap } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PrincipalChartTooltip from "./PrincipalChartTooltip";
import PrincipalDashboardCard from "./PrincipalDashboardCard";
import { chartText, staffDistribution } from "./principalDashboardData";

const StaffDistributionChart = ({ className = "" }) => (
  <PrincipalDashboardCard
    title="Staff Distribution"
    subtitle="Role-wise faculty and staff strength"
    icon={GraduationCap}
    className={className}
  >
    <div className="h-[235px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={staffDistribution} margin={{ top: 12, right: 0, left: -18, bottom: 0 }}>
          <XAxis
            dataKey="role"
            stroke={chartText}
            tickLine={false}
            axisLine={false}
            fontSize={11}
            interval={0}
          />
          <YAxis stroke={chartText} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip content={<PrincipalChartTooltip />} cursor={{ fill: "rgba(37,99,235,0.08)" }} />
          <Bar dataKey="count" name="Staff" radius={[8, 8, 3, 3]} fill="#3984ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </PrincipalDashboardCard>
);

export default StaffDistributionChart;
