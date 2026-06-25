import { ArrowUpRight, Users } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import PrincipalDashboardCard from "./PrincipalDashboardCard";
import { getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const DESIGNATION_COLORS = [
  { bg: "bg-[#18d3bf1f]", text: "text-[#18d3bf]" },
  { bg: "bg-[#3984ff1f]", text: "text-[#3984ff]" },
  { bg: "bg-[#f0a15f1f]", text: "text-[#f0a15f]" },
  { bg: "bg-[#f168681f]", text: "text-[#f16868]" },
  { bg: "bg-[#a78bfa1f]", text: "text-[#a78bfa]" },
  { bg: "bg-[#22c7a91f]", text: "text-[#22c7a9]" },
  { bg: "bg-[#f973161f]", text: "text-[#f97316]" },
  { bg: "bg-[#06b6d41f]", text: "text-[#06b6d4]" },
  { bg: "bg-[#e879f91f]", text: "text-[#e879f9]" },
  { bg: "bg-[#14b8a61f]", text: "text-[#14b8a6]" },
];

const getDesignationColor = (() => {
  const cache = new Map();
  let idx = 0;
  return (designation) => {
    if (!cache.has(designation)) {
      cache.set(
        designation,
        DESIGNATION_COLORS[idx % DESIGNATION_COLORS.length],
      );
      idx++;
    }
    return cache.get(designation);
  };
})();

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

const RecentFacultyListTable = ({ className = "" }) => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentFaculty();
  }, []);

  const fetchRecentFaculty = async () => {
    setLoading(true);
    try {
      const token = getTokenFromLocalStorage();
      if (!token) return;
      const response = await axios.get(
        `${API_BASE_URL.replace(/\/$/, "")}/api/principal/recentfaculty`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFaculties(response.data?.faculties || []);
    } catch (error) {
      console.error("Error fetching recent faculty:", error);
      setFaculties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrincipalDashboardCard
      title="Recently Added Faculty"
      subtitle="Latest faculty and staff arrivals"
      icon={Users}
      className={className}
    >
      {/* view list button  */}
      <div className="button-container  relative">
        <Link
          to="/dashboard-principal/faculty-list"
          className="text-md flex items-center gap-2 absolute -top-[50px] right-0"
        >
          View all{" "}
          <span>
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3984ff] border-t-transparent" />
        </div>
      ) : faculties.length === 0 ? (
        <div className="flex h-full items-center justify-center text-[13px] text-[#8ca1bd]">
          No data
        </div>
      ) : (
        <div className="max-h-[240px] overflow-auto table-custom-scrollbar">
          <table className="w-full min-w-[500px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172c46] text-[11px] uppercase tracking-wide text-[#9aacc7]">
              <tr>
                <th className="px-3 py-3 font-semibold">Emp ID</th>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Designation</th>
                <th className="px-3 py-2 font-semibold">Department</th>
                <th className="px-3 py-2 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#cad7eb]">
              {faculties.map((faculty) => {
                const color = getDesignationColor(faculty.designation);
                return (
                  <tr
                    key={faculty._id}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-[#8ca1bd]">
                      {faculty.empId}
                    </td>
                    <td className="px-3 py-3 font-medium text-white">
                      {faculty.salutation && `${faculty.salutation}. `}
                      {faculty.firstName} {faculty.lastName}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-2 text-[11px] font-semibold ${color.bg} ${color.text}`}
                      >
                        <span className="h-[4px] w-[4px] rounded-full bg-current" />
                        {faculty.designation}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#8ca1bd]">
                      {faculty.department}
                    </td>
                    <td className="px-3 py-3 text-[#8ca1bd]">
                      {formatDate(faculty.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PrincipalDashboardCard>
  );
};

export default RecentFacultyListTable;
