import React from "react";
import { BadgeIndianRupee, CreditCard, Download, Eye, EyeOff, Files } from "lucide-react";
import ProfileCard from "./ProfileCard";

const docs = [
  {
    label: "Aadhaar Number",
    maskedValue: "**** **** 8824",
    value: "4321 5678 8824",
    icon: BadgeIndianRupee,
    canReveal: true,
  },
  {
    label: "PAN Card",
    value: "BYPMPH4321L",
    icon: CreditCard,
  },
];

const DocumentsCard = () => {
  const [showAadhaar, setShowAadhaar] = React.useState(false);

  return (
    <ProfileCard title="Document & bank details" icon={Files}>
      <div className="space-y-3">
        {docs.map((doc) => {
          const Icon = doc.icon;
          const displayValue = doc.canReveal && !showAadhaar ? doc.maskedValue : doc.value;
          const RevealIcon = showAadhaar ? EyeOff : Eye;

          return (
            <div
              key={doc.label}
              className="flex items-center gap-3 rounded-lg bg-[#1a263c] px-4 py-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#65718d]/30 text-[#d2def6]">
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-[#8a9ab7]">{doc.label}</p>
                <p className="truncate text-[14px] font-medium text-white">{displayValue}</p>
              </div>
              {doc.canReveal && (
                <button
                  type="button"
                  onClick={() => setShowAadhaar((current) => !current)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8394b2] transition hover:bg-[#263654] hover:text-white"
                  aria-label={showAadhaar ? "Hide Aadhaar number" : "Show Aadhaar number"}
                >
                  <RevealIcon size={14} />
                </button>
              )}
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8394b2] transition hover:bg-[#263654] hover:text-white">
                <Download size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ProfileCard>
  );
};

export default DocumentsCard;
