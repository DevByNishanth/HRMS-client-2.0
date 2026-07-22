import React from "react";
import { UserRound } from "lucide-react";
import ProfileCard from "./ProfileCard";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getAddressText = (address) => {
  if (!address || typeof address !== "object") return address || "N/A";
  const parts = [address.doorNo, address.street, address.city, address.district, address.state, address.pincode, address.country]
    .filter(Boolean);
  return parts.length ? parts.join(", ") : "N/A";
};

const PersonalDetails = ({ canEdit, onEdit, faculty }) => {
  // console.log("faculty : ", faculty)
  const fullName = [faculty?.firstName, faculty?.lastName].filter(Boolean).join(" ") || "N/A";
  const dob = formatDate(faculty?.dob);
  const gender = faculty?.gender || "N/A";
  const email = faculty?.email || "N/A";
  const phone = faculty?.phone || "N/A";
  const address = getAddressText(faculty?.address);

  const details = [
    { label: "Full Name", value: fullName },
    { label: "Date of Birth", value: dob },
    { label: "Gender", value: gender },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Permanent Address", value: address },
  ];

  return (
    <ProfileCard title="Personal Details" icon={UserRound} canEdit={canEdit} onEdit={onEdit}>
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
