import React from "react";
import { Briefcase } from "lucide-react";
import ProfileCard from "./ProfileCard";

const formatDate = (dateStr) => {
  if (!dateStr) return "Present";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const ExperienceCard = ({ canEdit, onEdit, faculty, className = "" }) => {
  const experiences = faculty?.experiences || [];

  if (experiences.length === 0) {
    return (
      <ProfileCard
        title="Work Experience"
        icon={Briefcase}
        className={className}
        canEdit={canEdit}
        onEdit={onEdit}
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Briefcase size={32} className="text-slate-400 dark:text-[#354158] mb-2" />
          <p className="text-[13px] text-slate-500 dark:text-[#8ca1bd]">
            No work experience added yet
          </p>
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard
      title="Work Experience"
      icon={Briefcase}
      className={className}
      canEdit={canEdit}
      onEdit={onEdit}
    >
      <div className="relative space-y-6 pl-7">
        <div className="absolute left-[5px] top-2 h-[calc(100%-18px)] w-px bg-slate-300 dark:bg-[#31415d]" />
        {experiences.map((item, index) => {
          const from = formatDate(item.fromDate);
          const to = formatDate(item.toDate);
          const duration = item.yearsOfExperience
            ? `${item.yearsOfExperience} ${Number(item.yearsOfExperience) === 1 ? "Year" : "Years"}`
            : null;

          return (
            <div key={index} className="relative">
              <span className="absolute -left-[27px] top-1 h-2 w-2 rounded-full bg-[#3984ff] ring-4 ring-white dark:ring-[#111a2d]" />
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[13px] font-bold text-gray-900 dark:text-white">
                    {item.designation || "Role / Designation"}
                  </h3>
                  <p className="mt-0.5 text-[12px] font-medium text-slate-600 dark:text-[#9babca]">
                    {item.organization || "Company / Organization"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-[#7a8aaa]">
                    {from} – {to}
                  </p>
                </div>
                {duration && (
                  <span className="w-fit rounded-full bg-slate-100 dark:bg-[#263654] px-3 py-1 text-[10px] font-bold text-slate-700 dark:text-[#c8d7f4]">
                    {duration}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ProfileCard>
  );
};

export default ExperienceCard;
