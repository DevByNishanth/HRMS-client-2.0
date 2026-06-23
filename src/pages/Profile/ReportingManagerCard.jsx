import React from "react";
import { Building2, Mail, Phone, UserRound } from "lucide-react";
import ProfileCard from "./ProfileCard";

const ReportingManagerCard = ({ faculty, canEdit, onEdit }) => {
  const reportingTo = faculty?.reportingTo || null;

  if (!reportingTo) {
    return (
      <ProfileCard title="Reporting Manager" icon={Building2} canEdit={canEdit} onEdit={onEdit}>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Building2 size={32} className="text-[#354158] mb-2" />
          <p className="text-[13px] text-[#8ca1bd]">No reporting manager assigned</p>
        </div>
      </ProfileCard>
    );
  }

  const name = [reportingTo.name, reportingTo.firstName, reportingTo.lastName]
    .filter(Boolean)
    .join(" ") || "Not assigned";

  const email = faculty?.organizationEmail || "N/A";
  const phone = faculty?.phone || "N/A";

  return (
    <ProfileCard title="Reporting Manager" icon={Building2} canEdit={canEdit} onEdit={onEdit}>
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-[#1a263c] px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#65718d]/30 text-[#d2def6]">
            <UserRound size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#8a9ab7]">Name</p>
            <p className="truncate text-[14px] font-medium text-white">{name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-[#1a263c] px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#65718d]/30 text-[#d2def6]">
            <Mail size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#8a9ab7]">Organization Email</p>
            <p className="truncate text-[14px] font-medium text-white">{email}</p>
          </div>
        </div>

        {reportingTo.designation && (
          <div className="flex items-center gap-3 rounded-lg bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#65718d]/30 text-[#d2def6]">
              <Building2 size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[#8a9ab7]">Designation</p>
              <p className="truncate text-[14px] font-medium text-white">{reportingTo.designation}</p>
            </div>
          </div>
        )}

        {reportingTo.department && (
          <div className="flex items-center gap-3 rounded-lg bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#65718d]/30 text-[#d2def6]">
              <Building2 size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[#8a9ab7]">Department</p>
              <p className="truncate text-[14px] font-medium text-white">{reportingTo.department}</p>
            </div>
          </div>
        )}

        <div className="border-t border-[#26344f] pt-3">
          <div className="flex items-center gap-3 rounded-lg bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#65718d]/30 text-[#d2def6]">
              <Phone size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[#8a9ab7]">Phone</p>
              <p className="truncate text-[14px] font-medium text-white">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </ProfileCard>
  );
};

export default ReportingManagerCard;
