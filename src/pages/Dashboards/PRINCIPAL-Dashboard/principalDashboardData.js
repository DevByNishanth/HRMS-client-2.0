export const availabilityTrend = [
  { day: "Mon", present: 214, permission: 13, onDuty: 8 },
  { day: "Tue", present: 221, permission: 9, onDuty: 11 },
  { day: "Wed", present: 218, permission: 15, onDuty: 7 },
  { day: "Thu", present: 226, permission: 10, onDuty: 9 },
  { day: "Fri", present: 219, permission: 12, onDuty: 13 },
  { day: "Sat", present: 188, permission: 7, onDuty: 6 },
];

export const staffDistribution = [
  { role: "Professor", count: 28 },
  { role: "Associate", count: 46 },
  { role: "Assistant", count: 132 },
  { role: "Non-Teaching", count: 58 },
  { role: "HOD", count: 12 },
  { role: "Dean", count: 5 },
];

export const attendanceSummary = [
  { name: "Present", value: 219, color: "#1666ba" },
  { name: "Absent", value: 18, color: "#368ce7" },
  { name: "Permission", value: 12, color: "#7ab3ef" },
  { name: "On-Duty", value: 13, color: "#bedaf7" },
];

export const pendingRequests = [
  { name: "Leave", value: 24, color: "#1666ba" },
  { name: "Permission", value: 16, color: "#368ce7" },
  { name: "Regularize", value: 9, color: "#7ab3ef" },
];

export const recentRequests = [
  {
    name: "Dr. Meena Ravi",
    meta: "Computer Science",
    type: "Leave",
    status: "Pending",
    time: "10 min ago",
  },
  {
    name: "Arun Prakash",
    meta: "Mechanical",
    type: "Permission",
    status: "Pending",
    time: "28 min ago",
  },
  {
    name: "Kavya Menon",
    meta: "Electronics",
    type: "Regularize",
    status: "Approved",
    time: "1 hr ago",
  },
  {
    name: "Sathish Kumar",
    meta: "Civil",
    type: "Leave",
    status: "Pending",
    time: "2 hrs ago",
  },
];

export const principalStats = {
  totalStaff: { label: "Total Staff", value: 281 },
  present: { label: "Present", value: 219 },
  pending: { label: "Pending", value: 0 },
};

export const statusClass = {
  Pending: "bg-[#f0a15f1f] text-[#f0a15f]",
  Approved: "bg-[#18d3bf1f] text-[#18d3bf]",
};

export const chartText = "#8ca1bd";
export const gridColor = "#1c3658";
