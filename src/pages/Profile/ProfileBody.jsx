import React from "react";
import DocumentsCard from "./DocumentsCard";
import EducationQualifications from "./EducationQualifications";
import PersonalDetails from "./PersonalDetails";
import ProfessionalInfo from "./ProfessionalInfo";
import ProfileHero from "./ProfileHero";

const ProfileBody = () => {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto table-custom-scrollbar bg-[#071425] text-white">
      <div className="">
        <ProfileHero />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 px-6">
          <PersonalDetails />
          <ProfessionalInfo />
          <DocumentsCard />
          <EducationQualifications />
        </div>
      </div>
    </main>
  );
};

export default ProfileBody;
