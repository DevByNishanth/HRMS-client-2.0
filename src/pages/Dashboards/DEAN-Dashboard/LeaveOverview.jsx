import React, { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarMinus, Plane, Stethoscope, FileText } from "lucide-react";
import LeaveSummaryCard from "./LeaveSummaryCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const leaveConfig = {
  "Casual Leave": {
    color: "#2f80ff",
    icon: BriefcaseBusiness,
    code: "CL",
  },
  "Medical Leave": {
    color: "#21d6c2",
    icon: Stethoscope,
    code: "ML",
  },
  "On Duty - Official": {
    color: "#f59d62",
    icon: Plane,
    code: "OD",
  },
  "LOP": {
    color: "#e9673e",
    icon: CalendarMinus,
    code: "LOP",
  },
};

const LeaveOverview = () => {
  // Auth 
  const token = localStorage.getItem("hrms_token");
  let decoded = token ? jwtDecode(token) : null;

  // api url 
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // states 
  const [leaveCounts, setLeaveCounts] = useState([]);

  // functions 
  async function fetchStatcardData() {
    try {
      const res = await axios.get(`${apiUrl}/api/leave-balance/dashboard/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("leave statcard res : ", res.data?.leaveBalances)
      setLeaveCounts(res?.data?.leaveBalances || [])
    } catch (err) {
      console.error(err.message)
    }
  }

  // useEffects 
  useEffect(() => {
    if (token) {
      fetchStatcardData()
    }
  }, [token])

  // Only show these four specific leave types
  const allowedLeaveTypes = ["Casual Leave", "Medical Leave", "On Duty - Official", "LOP"];

  // Filter and map data
  const filteredLeaveItems = leaveCounts
    .filter((item) => allowedLeaveTypes.includes(item.leaveType))
    .map((item) => {
      const config = leaveConfig[item.leaveType] || {
        color: "#94a3b8",
        icon: FileText,
        code: "LV",
      };
      
      return {
        title: item.leaveType,
        code: config.code,
        used: item.used || 0,
        total: (item.available || 0) + (item.used || 0),
        color: config.color,
        icon: config.icon,
      };
    });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {filteredLeaveItems.map((item) => (
        <LeaveSummaryCard key={`${item.title}-${item.code}`} {...item} />
      ))}
    </div>
  );
};

export default LeaveOverview;
