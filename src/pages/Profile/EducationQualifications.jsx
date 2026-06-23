import React from "react";
import { GraduationCap } from "lucide-react";
import ProfileCard from "./ProfileCard";

const EducationQualifications = ({ canEdit, onEdit, faculty }) => {
  const qualifications = faculty?.qualifications || [];

  // If no qualifications, show an empty state
  if (qualifications.length === 0) {
    return (
      <ProfileCard title="Educational Qualifications" icon={GraduationCap} className="lg:col-span-2" canEdit={canEdit} onEdit={onEdit}>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <GraduationCap size={32} className="text-[#354158] mb-2" />
          <p className="text-[13px] text-[#8ca1bd]">No qualifications added yet</p>
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard title="Educational Qualifications" icon={GraduationCap} className="lg:col-span-2" canEdit={canEdit} onEdit={onEdit}>
      <div className="relative space-y-8 pl-7">
        <div className="absolute left-[5px] top-2 h-[calc(100%-18px)] w-px bg-[#31415d]" />
        {qualifications.map((item, index) => (
          <div key={index} className="relative">
            <span className="absolute -left-[27px] top-1 h-2 w-2 rounded-full bg-[#91b6ff] ring-4 ring-[#111a2d]" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-white">
                  {item.degree || "Qualification"}
                </h3>
                <p className="mt-1 text-[11px] text-[#9babca]">
                  {[item.institutionName, item.institutionLocation].filter(Boolean).join(", ") || item.college || ""}
                </p>
                {item.specialization && (
                  <p className="mt-0.5 text-[11px] text-[#7a8aaa]">{item.specialization}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {item.yearOfPassing && (
                  <span className="w-fit rounded-full bg-[#263654] px-3 py-1 text-[10px] font-bold text-[#c8d7f4]">
                    {item.yearOfPassing}
                  </span>
                )}
                {(item.percentage || item.cgpa) && (
                  <span className="w-fit rounded-full bg-[#0f7e59]/20 px-3 py-1 text-[10px] font-bold text-[#26d39a]">
                    {item.percentage ? `${item.percentage}%` : ""}
                    {item.percentage && item.cgpa ? " / " : ""}
                    {item.cgpa ? `CGPA: ${item.cgpa}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
};

export default EducationQualifications;
