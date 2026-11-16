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
  <span className="rounded-full border border-slate-300 dark:border-[#465a7a] bg-slate-100 dark:bg-[#263654] px-3 py-1 text-[10px] font-semibold text-slate-700 dark:text-[#c8d7f4]">
    {children}
  </span>
);

const ProfessionalInfo = ({ canEdit, onEdit, faculty }) => {
  const empId = faculty?.empId || "N/A";
  const punchId = faculty?.punchId || "";
  const doj = formatDate(faculty?.doj);
  const resignationDate = formatDate(faculty?.resignationDate);
  const resignationReason = faculty?.resignationReason || "";
  const designation = faculty?.designation || "N/A";
  const jobTitle = faculty?.jobTitle || "";
  const department = faculty?.department || "N/A";
  const originalDepartment = faculty?.originalDepartment || "";
  const employeeCategory = faculty?.employeeCategory || "";
  const workType = faculty?.workType || "";
  const timeType = faculty?.timeType || "";
  const employmentStatus = faculty?.isActive ?? faculty?.employmentStatus;
  const isActive = employmentStatus === true;

  // Shift details
  let shiftInfo = "";
  if (faculty?.shiftId) {
    if (typeof faculty.shiftId === "object") {
      const { shiftName, startTime, endTime, graceTime } = faculty.shiftId;
      const timingPart = startTime && endTime ? `${startTime} - ${endTime}` : "";
      const gracePart = graceTime ? `Grace: ${graceTime}m` : "";
      const extra = [timingPart, gracePart].filter(Boolean).join(", ");
      shiftInfo = shiftName
        ? extra
          ? `${shiftName} (${extra})`
          : shiftName
        : timingPart || "N/A";
    } else {
      shiftInfo = String(faculty.shiftId);
    }
  }

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

  const employmentTypeStr = [workType, timeType].filter(Boolean).join(" • ");

  return (
    <ProfileCard title="Professional Info" icon={BriefcaseBusiness} canEdit={canEdit} onEdit={onEdit}>
      <div className="space-y-4">
        {/* Employee ID */}
        <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Employee ID</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-[14px] font-medium text-gray-900 dark:text-white">{empId}</p>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                isActive
                  ? "bg-[#0f7e59]/25 text-[#26d39a]"
                  : "bg-[#f168681f] text-[#f16868]"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Biometric / Punch ID */}
        {punchId && (
          <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
            <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Punch ID</p>
            <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{punchId}</p>
          </div>
        )}

        {/* Designation */}
        <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Designation</p>
          <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{designation}</p>
        </div>

        {/* Job Title if present */}
        {jobTitle && jobTitle !== designation && (
          <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
            <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Job Title</p>
            <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{jobTitle}</p>
          </div>
        )}

        {/* Department */}
        <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Department</p>
          <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{department}</p>
        </div>

        {/* Original Department */}
        {originalDepartment && originalDepartment !== department && (
          <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
            <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Original Department</p>
            <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{originalDepartment}</p>
          </div>
        )}

        {/* Employee Category */}
        {employeeCategory && (
          <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
            <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Employee Category</p>
            <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{employeeCategory}</p>
          </div>
        )}

        {/* Employment Type (Work Type & Time Type) */}
        {employmentTypeStr && (
          <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
            <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Employment Type</p>
            <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{employmentTypeStr}</p>
          </div>
        )}

        {/* Shift */}
        {shiftInfo && (
          <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
            <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Shift Schedule</p>
            <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{shiftInfo}</p>
          </div>
        )}

        {/* Date of Joining */}
        <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
          <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Date of Joining</p>
          <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{doj}</p>
        </div>

        {/* Resignation details if inactive */}
        {!isActive && (
          <>
            <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
              <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Resignation Date</p>
              <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{resignationDate}</p>
            </div>
            {resignationReason && (
              <div className="border-b border-slate-200 dark:border-[#26344f] pb-3">
                <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Resignation Reason</p>
                <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{resignationReason}</p>
              </div>
            )}
          </>
        )}

        {/* Total Experience */}
        <div className="border-b border-slate-200 dark:border-[#26344f] pb-3 last:border-0 last:pb-0">
          <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Total Experience</p>
          <p className="mt-1 text-[14px] font-medium text-gray-900 dark:text-white">{totalExperienceStr}</p>
        </div>

        {/* Specializations / Skills */}
        {specializations.length > 0 && (
          <div>
            <p className="text-[12px] font-medium text-slate-600 dark:text-[#8a9ab7]">Specialization</p>
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
