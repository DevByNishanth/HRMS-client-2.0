import React from "react";
import { BriefcaseBusiness, CalendarMinus, Plane, Stethoscope } from "lucide-react";
import LeaveSummaryCard from "./LeaveSummaryCard";

const leaveItems = [
  {
    title: "Casual Leave",
    code: "LC",
    used: 12,
    total: 15,
    color: "#2f80ff",
    icon: BriefcaseBusiness,
  },
  {
    title: "Medical Leave",
    code: "ML",
    used: 12,
    total: 15,
    color: "#21d6c2",
    icon: Stethoscope,
  },
  {
    title: "Vacation Leave",
    code: "VL",
    used: 12,
    total: 15,
    color: "#f59d62",
    icon: Plane,
  },
  {
    title: "Casual Leave",
    code: "CL",
    used: 12,
    total: 15,
    color: "#e9673e",
    icon: CalendarMinus,
  },
];

const LeaveOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {leaveItems.map((item) => (
        <LeaveSummaryCard key={`${item.title}-${item.code}`} {...item} />
      ))}
    </div>
  );
};

export default LeaveOverview;
