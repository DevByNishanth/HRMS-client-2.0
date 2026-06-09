import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PrincipalChartTooltip from "./PrincipalChartTooltip";
import PrincipalDashboardCard from "./PrincipalDashboardCard";
import { availabilityTrend, chartText } from "./principalDashboardData";

const WeeklyAvailabilityChart = ({ className = "" }) => (
  <PrincipalDashboardCard
    title="Weekly Faculty Availability"
    subtitle="Present, permission, and on-duty trend"
    icon={TrendingUp}
    className={className}
  >
    <div className="h-[235px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={availabilityTrend} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3984ff" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#3984ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" stroke={chartText} tickLine={false} axisLine={false} fontSize={12} />
          <YAxis stroke={chartText} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip content={<PrincipalChartTooltip />} />
          <Area
            type="monotone"
            dataKey="present"
            name="Present"
            stroke="#3984ff"
            strokeWidth={3}
            fill="url(#presentGradient)"
          />
          <Area
            type="monotone"
            dataKey="permission"
            name="Permission"
            stroke="#f0a15f"
            strokeWidth={2}
            fill="transparent"
          />
          <Area
            type="monotone"
            dataKey="onDuty"
            name="On-Duty"
            stroke="#22c7a9"
            strokeWidth={2}
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </PrincipalDashboardCard>
);

export default WeeklyAvailabilityChart;
