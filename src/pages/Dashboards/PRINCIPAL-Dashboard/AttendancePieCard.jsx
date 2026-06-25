import { CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PrincipalChartTooltip from "./PrincipalChartTooltip";
import PrincipalDashboardCard from "./PrincipalDashboardCard";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const COLORS = {
  "Punched In": "#1666ba",
  "Not Punched In": "#368ce7",
};

const AttendancePieCard = ({ className = "" }) => {
  const [data, setData] = useState([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = getTokenFromLocalStorage();
      if (!token) return;
      const response = await axios.get(
        `${API_BASE_URL.replace(/\/$/, "")}/api/principal/today-punch-summary`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const res = response.data;
      setTotalStaff(res.totalStaff || 0);
      setData([
        { name: "Punched In", value: res.punchedIn || 0 },
        { name: "Not Punched In", value: res.notPunchedIn || 0 },
      ]);
    } catch (error) {
      console.error("Error fetching today's punch summary:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrincipalDashboardCard
      title="Today Attendance"
      subtitle={`${totalStaff} faculty counted`}
      icon={CheckCircle2}
      className={className}
    >
      <div className="flex h-[245px] items-center justify-center">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3984ff] border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-[13px] text-[#8ca1bd]">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius="98%"
                paddingAngle={4}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<PrincipalChartTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => <span className="text-[12px] text-[#9eb0cc]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </PrincipalDashboardCard>
  );
};

export default AttendancePieCard;
