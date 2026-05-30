import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import ProfileCard from "./ProfileCard";

const SkillBadge = ({ children }) => (
  <span className="rounded-full border border-[#465a7a] bg-[#263654] px-3 py-1 text-[10px] font-semibold text-[#c8d7f4]">
    {children}
  </span>
);

const ProfessionalInfo = () => {
  return (
    <ProfileCard title="Professional Info" icon={BriefcaseBusiness}>
      <div className="space-y-4">
        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Employee ID</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-[14px] font-medium text-white">SECE-HOD-CS-012</p>
            <span className="rounded bg-[#0f7e59]/25 px-2 py-1 text-[10px] font-bold uppercase text-[#26d39a]">
              Active
            </span>
          </div>
        </div>

        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Date of Joining</p>
          <p className="mt-1 text-[14px] font-medium text-white">12 June 2015</p>
        </div>

        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Total Experience</p>
          <p className="mt-1 text-[14px] font-medium text-white">22 Years (14 Academic, 8 Industry)</p>
        </div>

        <div>
          <p className="text-[12px] font-medium text-[#8a9ab7]">Specialization</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <SkillBadge>Machine Learning</SkillBadge>
            <SkillBadge>Cloud Architecture</SkillBadge>
            <SkillBadge>Cyber Security</SkillBadge>
          </div>
        </div>
      </div>
    </ProfileCard>
  );
};

export default ProfessionalInfo;
