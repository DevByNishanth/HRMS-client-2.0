import React from "react";
import DocumentsCard from "./DocumentsCard";
import EducationQualifications from "./EducationQualifications";
import PersonalDetails from "./PersonalDetails";
import ProfessionalInfo from "./ProfessionalInfo";
import ProfileHero from "./ProfileHero";

const ProfileBody = () => {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#071425] px-6 py-6 text-white">
      <div className="mx-auto max-w-[1160px]">
        <ProfileHero />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
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
