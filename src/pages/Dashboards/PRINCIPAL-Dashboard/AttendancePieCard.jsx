import { CheckCircle2 } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PrincipalChartTooltip from "./PrincipalChartTooltip";
import PrincipalDashboardCard from "./PrincipalDashboardCard";
import { attendanceSummary } from "./principalDashboardData";

const AttendancePieCard = ({ totalAttendance, className = "" }) => (
  <PrincipalDashboardCard
    title="Today Attendance"
    subtitle={`${totalAttendance} faculty counted`}
    icon={CheckCircle2}
    className={className}
  >
    <div className="flex h-[245px] items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={attendanceSummary}
            dataKey="value"
            nameKey="name"
            outerRadius="98%"
            paddingAngle={4}
            stroke="none"
          >
            {attendanceSummary.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<PrincipalChartTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span className="text-[12px] text-[#9eb0cc]">{value}</span>}
            className=""
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </PrincipalDashboardCard>
);

export default AttendancePieCard;
