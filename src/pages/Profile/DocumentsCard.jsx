import React from "react";
import { BadgeIndianRupee, CreditCard, Download, Eye, EyeOff, Files, Landmark } from "lucide-react";
import ProfileCard from "./ProfileCard";

const maskValue = (value) => {
  if (!value) return null;
  if (value.length <= 4) return `**** ${value.slice(-4)}`;
  return `**** ${value.slice(-4)}`;
};

const DocumentsCard = ({ canEdit, onEdit, faculty }) => {
  const [showAadhaar, setShowAadhaar] = React.useState(false);

  // Extract identity and bank details from faculty data
  const aadhaarNumber = faculty?.identityDetails?.aadharNumber || faculty?.aadharNumber || "";
  const panNumber = faculty?.identityDetails?.panNumber || faculty?.panNumber || "";
  const bankName = faculty?.bankDetails?.bankName || faculty?.bankName || "";
  const accountNumber = faculty?.bankDetails?.accountNumber || faculty?.accountNumber || "";
  const ifscCode = faculty?.bankDetails?.ifscCode || faculty?.ifscCode || "";
  const branch = faculty?.bankDetails?.branchLocation || faculty?.branch || "";

  // Extract uploaded document URLs from faculty.documents
  const aadharCardUrl = faculty?.documents?.aadharCard?.url || "";
  const panCardUrl = faculty?.documents?.panCard?.url || "";

  const handleDownload = async (url, fileName) => {
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const docs = [];

  if (aadhaarNumber) {
    docs.push({
      label: "Aadhaar Number",
      maskedValue: maskValue(aadhaarNumber),
      value: aadhaarNumber,
      icon: BadgeIndianRupee,
      canReveal: true,
      documentUrl: aadharCardUrl,
      downloadFileName: `aadhar-card-${aadhaarNumber.slice(-4)}.png`,
    });
  }

  if (panNumber) {
    docs.push({
      label: "PAN Card",
      value: panNumber,
      icon: CreditCard,
      canReveal: false,
      documentUrl: panCardUrl,
      downloadFileName: `pan-card-${panNumber.slice(-4)}.png`,
    });
  }

  if (bankName || accountNumber) {
    docs.push({
      label: "Bank Name",
      value: bankName || "N/A",
      icon: Landmark,
      canReveal: false,
    });
    docs.push({
      label: "Account Number",
      value: accountNumber || "N/A",
      icon: CreditCard,
      canReveal: false,
    });
  }

  if (ifscCode) {
    docs.push({
      label: "IFSC Code",
      value: ifscCode,
      icon: BadgeIndianRupee,
      canReveal: false,
    });
  }

  // Fallback: if no backend data, show placeholder
  if (docs.length === 0) {
    docs.push(
      {
        label: "Aadhaar Number",
        maskedValue: "--",
        value: "--",
        icon: BadgeIndianRupee,
        canReveal: true,
      },
      {
        label: "PAN Card",
        value: "--",
        icon: CreditCard,
        canReveal: false,
      }
    );
  }

  return (
    <ProfileCard title="Document & bank details" icon={Files} canEdit={canEdit} onEdit={onEdit}>
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
              {doc.documentUrl ? (
                <button
                  type="button"
                  onClick={() => handleDownload(doc.documentUrl, doc.downloadFileName)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8394b2] transition hover:bg-[#263654] hover:text-white"
                  title={`Download ${doc.label}`}
                  aria-label={`Download ${doc.label}`}
                >
                  <Download size={14} />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </ProfileCard>
  );
};

export default DocumentsCard;
