import React from "react";
import { GraduationCap } from "lucide-react";
import ProfileCard from "./ProfileCard";

const education = [
  {
    degree: "Ph.D. in Computer Science & Engineering",
    college: "Indian Institute of Technology, Madras",
    period: "2010 - 2014",
  },
  {
    degree: "M.E. in Software Systems",
    college: "Anna University, Chennai",
    period: "2002 - 2004",
  },
  {
    degree: "B.E. in Computer Science",
    college: "PSG College of Technology, Coimbatore",
    period: "1995 - 1999",
  },
];

const EducationQualifications = () => {
  return (
    <ProfileCard title="Educational Qualifications" icon={GraduationCap} className="lg:col-span-2">
      <div className="relative space-y-8 pl-7">
        <div className="absolute left-[5px] top-2 h-[calc(100%-18px)] w-px bg-[#31415d]" />
        {education.map((item) => (
          <div key={item.degree} className="relative">
            <span className="absolute -left-[27px] top-1 h-2 w-2 rounded-full bg-[#91b6ff] ring-4 ring-[#111a2d]" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-white">{item.degree}</h3>
                <p className="mt-1 text-[11px] text-[#9babca]">{item.college}</p>
              </div>
              <span className="w-fit rounded-full bg-[#263654] px-3 py-1 text-[10px] font-bold text-[#c8d7f4]">
                {item.period}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
};

export default EducationQualifications;
