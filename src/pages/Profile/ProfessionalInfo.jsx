import React from "react";
import { BriefcaseBusiness } from "lucide-react";
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

const SkillBadge = ({ children }) => (
  <span className="rounded-full border border-[#465a7a] bg-[#263654] px-3 py-1 text-[10px] font-semibold text-[#c8d7f4]">
    {children}
  </span>
);

const ProfessionalInfo = ({ canEdit, onEdit, faculty }) => {
  const empId = faculty?.empId || "N/A";
  const doj = formatDate(faculty?.doj);
  const designation = faculty?.designation || "N/A";
  const department = faculty?.department || "N/A";
  const workType = faculty?.workType || "";
  const employmentStatus = faculty?.employmentStatus;
  const isActive = employmentStatus === true;

  // Gather skills/specializations from various possible fields
  const specializations = [];
  if (faculty?.specialization) specializations.push(faculty.specialization);
  if (faculty?.skills && Array.isArray(faculty.skills)) {
    specializations.push(...faculty.skills);
  }

  // Calculate total experience from experiences array if available
  let totalExperienceStr = "N/A";
  if (faculty?.experiences && Array.isArray(faculty.experiences) && faculty.experiences.length > 0) {
    const totalYears = faculty.experiences.reduce((sum, exp) => {
      return sum + (Number(exp.yearsOfExperience) || 0);
    }, 0);
    if (totalYears > 0) totalExperienceStr = `${totalYears} Years`;
  }

  return (
    <ProfileCard title="Professional Info" icon={BriefcaseBusiness} canEdit={canEdit} onEdit={onEdit}>
      <div className="space-y-4">
        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Employee ID</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-[14px] font-medium text-white">{empId}</p>
            {isActive && (
              <span className="rounded bg-[#0f7e59]/25 px-2 py-1 text-[10px] font-bold uppercase text-[#26d39a]">
                Active
              </span>
            )}
          </div>
        </div>

        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Designation</p>
          <p className="mt-1 text-[14px] font-medium text-white">{designation}</p>
        </div>

        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Department</p>
          <p className="mt-1 text-[14px] font-medium text-white">{department}</p>
        </div>

        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Date of Joining</p>
          <p className="mt-1 text-[14px] font-medium text-white">{doj}</p>
        </div>

        {workType && (
          <div className="border-b border-[#26344f] pb-3">
            <p className="text-[12px] font-medium text-[#8a9ab7]">Work Type</p>
            <p className="mt-1 text-[14px] font-medium text-white">{workType}</p>
          </div>
        )}

        <div className="border-b border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-[#8a9ab7]">Total Experience</p>
          <p className="mt-1 text-[14px] font-medium text-white">{totalExperienceStr}</p>
        </div>

        {specializations.length > 0 && (
          <div>
            <p className="text-[12px] font-medium text-[#8a9ab7]">Specialization</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {specializations.map((spec, idx) => (
                <SkillBadge key={idx}>{spec}</SkillBadge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProfileCard>
  );
};

export default ProfessionalInfo;
