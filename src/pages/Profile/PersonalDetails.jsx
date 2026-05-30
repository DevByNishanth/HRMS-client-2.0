import React from "react";
import { UserRound } from "lucide-react";
import ProfileCard from "./ProfileCard";

const details = [
  { label: "Full Name", value: "Rajesh Kumar Subramanian" },
  { label: "Date of Birth", value: "14 May 1978" },
  { label: "Gender", value: "Male" },
  {
    label: "Permanent Address",
    value: "42, Green Valley Enclave, Pollachi Main Road, Coimbatore - 641032",
  },
];

const PersonalDetails = () => {
  return (
    <ProfileCard title="Personal Details" icon={UserRound}>
      <div className="space-y-4">
        {details.map((item) => (
          <div key={item.label} className="border-b border-[#26344f] pb-3 last:border-0 last:pb-0">
            <p className="text-[12px] font-medium text-[#8a9ab7]">{item.label}</p>
            <p className="mt-1 text-[14px] font-medium leading-relaxed text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
};

export default PersonalDetails;
