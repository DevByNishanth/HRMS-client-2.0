import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalDashboardCard from "./PrincipalDashboardCard";

const RecentRequestsCard = ({ className = "" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("leave");

  const handleViewAll = () => {
    switch (activeTab) {
      case "leave":
        navigate("/dashboard-principal/leaves");
        break;
      case "permission":
        navigate("/dashboard-principal/permissions");
        break;
      case "regularization":
        navigate("/dashboard-principal/regularizationList");
        break;
      default:
        navigate("/dashboard-principal/leaves");
    }
  };

  const requestsData = {
    leave: [
      { name: "Surya Chandran", type: "Casual Leave", duration: "2 Days", initials: "SC" },
      { name: "Nivetha Kumar", type: "Medical Leave", duration: "1 Day", initials: "NK" },
      { name: "Arjun Prakash", type: "On-Duty", duration: "3 Days", initials: "AP" },
      { name: "Nivetha Kumar", type: "Medical Leave", duration: "1 Day", initials: "NK" },
      { name: "Arjun Prakash", type: "On-Duty", duration: "2 Days", initials: "AP" },
    ],
    permission: [
      { name: "Dr. Meena Ravi", type: "Permission", duration: "2 hrs", initials: "MR" },
      { name: "Arun Prakash", type: "Permission", duration: "1 hr", initials: "AP" },
    ],
    regularization: [
      { name: "Kavya Menon", type: "Regularization", duration: "Full Day", initials: "KM" },
      { name: "Sathish Kumar", type: "Regularization", duration: "Half Day", initials: "SK" },
    ],
  };

  const tabs = [
    { id: "leave", label: "Leave" },
    { id: "permission", label: "Permission" },
    { id: "regularization", label: "Regularization" },
  ];

  const currentRequests = requestsData[activeTab];

  return (
    <PrincipalDashboardCard
      title="Leave Requests"
      icon={CalendarClock}
      action="View All"
      onAction={handleViewAll}
      className={className}
    >
      <div className="flex flex-col gap-2 ">
        {/* Tabs */}
        <div className="flex gap-2  -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition ${activeTab === tab.id
                ? "border-[#2563eb] bg-[#2563eb] text-white"
                : "border-transparent text-[#8ca1bd] hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-1.5 max-h-[220px] pr-2 overflow-y-auto table-custom-scrollbar ">
          {currentRequests.map((request, index) => (
            <div
              key={`${request.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#1c3658] bg-[#071425] px-3 py-2 hover:border-[#2563eb] transition"
            >
              {/* Avatar and Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb24] text-[10px] font-semibold text-[#5d9bff]">
                  {request.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-white">{request.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[#60a5fa]">{request.type}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="shrink-0">
                <span className="inline-flex items-center rounded-md bg-[#18d3bf1f] px-2.5 py-0.5 text-[11px] font-semibold text-[#18d3bf]">
                  {request.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PrincipalDashboardCard>
  );
};

export default RecentRequestsCard;
