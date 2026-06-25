import { ChevronDown, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PrincipalChartTooltip from "./PrincipalChartTooltip";
import PrincipalDashboardCard from "./PrincipalDashboardCard";
import { chartText } from "./principalDashboardData";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const departments = [
  "CSE",
  "ECE",
  "EEE",
  "AI&DS",
  "AIML",
  "CCE",
  "IT",
  "Mech",
  "S&H",
  "CFRD",
];

const StaffDistributionChart = ({ className = "" }) => {
  const [data, setData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("CSE");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchFacultyCount();
  }, [selectedDepartment]);

  const fetchFacultyCount = async () => {
    setLoading(true);
    try {
      const token = getTokenFromLocalStorage();
      if (!token) return;
      const response = await axios.get(
        `${API_BASE_URL.replace(/\/$/, "")}/api/principal/faculty-count?department=${selectedDepartment}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const designations = response.data?.designations || [];
      setData(
        designations.map((d) => ({ role: d.designation, count: d.count })),
      );
    } catch (error) {
      console.error("Error fetching faculty count:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrincipalDashboardCard
      title="Staff Distribution"
      subtitle="Role-wise faculty and staff strength"
      icon={GraduationCap}
      className={className}
    >
      <div className="main-dept-container relative ">
        <div className="dropdown absolute -top-[50px] right-0">
          <div className="relative w-[140px]">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[13px] text-white outline-none transition hover:border-[#3984ff]"
            >
              <span>{selectedDepartment}</span>
              <ChevronDown
                size={14}
                className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-lg h-[200px] table-custom-scrollbar overflow-auto ">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-[12px] transition ${
                      selectedDepartment === dept
                        ? "bg-[#2563EB] text-white"
                        : "text-[#cad7eb] hover:bg-[#132b49]"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-[200px]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3984ff] border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[13px] text-[#8ca1bd]">
            No data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 12, right: 0, left: -18, bottom: 0 }}
            >
              <XAxis
                dataKey="role"
                stroke={chartText}
                tickLine={false}
                axisLine={false}
                fontSize={11}
                interval={0}
              />
              <YAxis
                stroke={chartText}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                content={<PrincipalChartTooltip />}
                cursor={{ fill: "rgba(37,99,235,0.08)" }}
              />
              <Bar
                dataKey="count"
                name="Staff"
                radius={[8, 8, 3, 3]}
                fill="#3984ff"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </PrincipalDashboardCard>
  );
};

export default StaffDistributionChart;
