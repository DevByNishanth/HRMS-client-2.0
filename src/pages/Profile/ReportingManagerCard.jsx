import React from "react";
import { Building2, Mail, Phone, UserRound, Tag } from "lucide-react";
import ProfileCard from "./ProfileCard";

const ReportingManagerCard = ({ faculty, canEdit, onEdit }) => {
  const reportingTo = faculty?.reportingTo || null;

  if (!reportingTo) {
    return (
      <ProfileCard
        title="Reporting Manager"
        icon={Building2}
        canEdit={canEdit}
        onEdit={onEdit}
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Building2 size={32} className="text-slate-400 dark:text-[#354158] mb-2" />
          <p className="text-[13px] text-slate-500 dark:text-[#8ca1bd]">
            No reporting manager assigned
          </p>
        </div>
      </ProfileCard>
    );
  }

  // Handle both flat reportingTo and populated reportingTo.facultyId object
  const mgr =
    typeof reportingTo.facultyId === "object" && reportingTo.facultyId !== null
      ? reportingTo.facultyId
      : reportingTo;

  const name =
    mgr.name ||
    [mgr.salutation, mgr.firstName, mgr.lastName].filter(Boolean).join(" ") ||
    reportingTo.name ||
    "Not assigned";

  const empId = reportingTo.empId || mgr.empId || "";
  const designation = mgr.designation || reportingTo.designation || "";
  const department = mgr.department || reportingTo.department || "";
  const email =
    mgr.organizationEmail ||
    mgr.email ||
    reportingTo.organizationEmail ||
    reportingTo.email ||
    "";
  const phone = mgr.phone || reportingTo.phone || "";

  return (
    <ProfileCard
      title="Reporting Manager"
      icon={Building2}
      canEdit={canEdit}
      onEdit={onEdit}
    >
      <div className="space-y-3">
        {/* Name */}
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
            <UserRound size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-600 dark:text-[#8a9ab7]">Name</p>
            <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
              {name}
            </p>
          </div>
        </div>

        {/* Emp ID */}
        {empId && (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
              <Tag size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-600 dark:text-[#8a9ab7]">
                Emp ID
              </p>
              <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
                {empId}
              </p>
            </div>
          </div>
        )}

        {/* Designation */}
        {designation && (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
              <Building2 size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-600 dark:text-[#8a9ab7]">
                Designation
              </p>
              <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
                {designation}
              </p>
            </div>
          </div>
        )}

        {/* Department */}
        {department && (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
              <Building2 size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-600 dark:text-[#8a9ab7]">
                Department
              </p>
              <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
                {department}
              </p>
            </div>
          </div>
        )}

        {/* Organization Email */}
        {email && (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
              <Mail size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-600 dark:text-[#8a9ab7]">
                Organization Email
              </p>
              <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
                {email}
              </p>
            </div>
          </div>
        )}

        {/* Phone */}
        {phone && (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
              <Phone size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-600 dark:text-[#8a9ab7]">
                Phone
              </p>
              <p className="truncate text-[14px] font-medium text-gray-900 dark:text-white">
                {phone}
              </p>
            </div>
          </div>
        )}
      </div>
    </ProfileCard>
  );
};

export default ReportingManagerCard;
