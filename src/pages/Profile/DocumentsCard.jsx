import React, { useState, useMemo } from "react";
import {
  BadgeIndianRupee,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Files,
  Landmark,
  Lock,
  ShieldCheck,
  FileText,
  ExternalLink,
  Hash,
  Building,
} from "lucide-react";
import ProfileCard from "./ProfileCard";

const maskValue = (value) => {
  if (!value) return "N/A";
  const str = String(value);
  if (str.length <= 4) return str;
  return `**** **** ${str.slice(-4)}`;
};

const formatDocTitle = (key) => {
  switch (key) {
    case "aadharCard":
      return "Aadhaar Card";
    case "panCard":
      return "PAN Card";
    case "resume":
      return "Resume / CV";
    case "ugDegreeCertificate":
    case "ugDegree":
      return "UG Degree Certificate";
    case "pgDegreeCertificate":
    case "pgDegree":
      return "PG Degree Certificate";
    case "phdDegreeCertificate":
    case "phdDegree":
      return "PhD Degree Certificate";
    case "experienceCertificates":
      return "Experience Certificate";
    case "relievingLetters":
    case "relievingLetter":
      return "Relieving Letter";
    case "otherDocuments":
      return "Other Document";
    default:
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
  }
};

const extractDocumentsList = (documentsObj) => {
  if (!documentsObj || typeof documentsObj !== "object") return [];
  const list = [];

  Object.entries(documentsObj).forEach(([key, val]) => {
    if (!val) return;
    if (typeof val === "string") {
      list.push({
        id: key,
        name: formatDocTitle(key),
        url: val,
        fileName: `${key}.pdf`,
      });
    } else if (Array.isArray(val)) {
      val.forEach((item, idx) => {
        const itemUrl = item?.url || (typeof item === "string" ? item : "");
        if (itemUrl) {
          list.push({
            id: `${key}-${idx}`,
            name: `${formatDocTitle(key)} #${idx + 1}`,
            url: itemUrl,
            fileName: item?.fileName || `${key}-${idx + 1}.pdf`,
          });
        }
      });
    } else if (typeof val === "object" && val.url) {
      list.push({
        id: key,
        name: formatDocTitle(key),
        url: val.url,
        fileName: val.fileName || `${key}.pdf`,
      });
    }
  });

  return list;
};

const DocumentsCard = ({
  canEdit,
  onEdit,
  faculty,
  isUnlocked = false,
  onUnlockClick,
  isAdminView = false,
}) => {
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  // 1. Identity Details
  const aadharNumber =
    faculty?.identityDetails?.aadharNumber || faculty?.aadharNumber || "";
  const panNumber =
    faculty?.identityDetails?.panNumber || faculty?.panNumber || "";
  const pfNumber =
    faculty?.identityDetails?.pfNumber || faculty?.pfNumber || "";

  // 2. Bank Details
  const bankName =
    faculty?.bankDetails?.bankName || faculty?.bankName || "";
  const accountNumber =
    faculty?.bankDetails?.accountNumber || faculty?.accountNumber || "";
  const ifscCode =
    faculty?.bankDetails?.ifscCode || faculty?.ifscCode || "";
  const branchLocation =
    faculty?.bankDetails?.branchLocation ||
    faculty?.bankDetails?.branch ||
    faculty?.branch ||
    "";

  // 3. Documents
  const documentsList = useMemo(
    () => extractDocumentsList(faculty?.documents),
    [faculty?.documents]
  );

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
      window.open(url, "_blank");
    }
  };

  const shouldBlur = !isAdminView && !isUnlocked;

  const identityItems = [
    {
      label: "Aadhaar Number",
      value: aadharNumber || "N/A",
      displayValue: showAadhaar ? (aadharNumber || "N/A") : maskValue(aadharNumber),
      icon: BadgeIndianRupee,
      canReveal: Boolean(aadharNumber),
      documentUrl: faculty?.documents?.aadharCard?.url || (typeof faculty?.documents?.aadharCard === "string" ? faculty?.documents?.aadharCard : ""),
      downloadFileName: `aadhar-card-${aadharNumber.slice(-4) || "doc"}.png`,
    },
    {
      label: "PAN Card",
      value: panNumber || "N/A",
      displayValue: panNumber || "N/A",
      icon: CreditCard,
      canReveal: false,
      documentUrl: faculty?.documents?.panCard?.url || (typeof faculty?.documents?.panCard === "string" ? faculty?.documents?.panCard : ""),
      downloadFileName: `pan-card-${panNumber.slice(-4) || "doc"}.png`,
    },
    {
      label: "PF Number",
      value: pfNumber || "N/A",
      displayValue: pfNumber || "N/A",
      icon: Hash,
      canReveal: false,
    },
  ];

  const bankItems = [
    {
      label: "Bank Name",
      value: bankName || "N/A",
      icon: Landmark,
    },
    {
      label: "Account Number",
      value: accountNumber || "N/A",
      icon: CreditCard,
    },
    {
      label: "IFSC Code",
      value: ifscCode || "N/A",
      icon: BadgeIndianRupee,
    },
    {
      label: "Branch Location",
      value: branchLocation || "N/A",
      icon: Building,
    },
  ];

  return (
    <ProfileCard
      title="Document & bank details"
      icon={Files}
      canEdit={canEdit && !shouldBlur}
      onEdit={onEdit}
    >
      <div className="relative min-h-[260px]">
        {/* Sub-tabs for quick filtering */}
        <div className="mb-3.5 flex items-center gap-1.5 border-b border-slate-100 dark:border-[#1d2d46] pb-2 text-[12px]">
          {["All", "Identity", "Bank", "Documents"].map((tab) => (
            <button
              key={tab}
              type="button"
              disabled={shouldBlur}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-2.5 py-1 font-medium transition cursor-pointer ${
                activeTab === tab
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-[#8ca1bd] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132b49]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content list (blurred if locked on user side) */}
        <div
          className={`space-y-4 transition-all duration-300 ${
            shouldBlur ? "filter blur-[7px] select-none pointer-events-none opacity-30" : ""
          }`}
        >
          {/* 1. Identity Details Section */}
          {(activeTab === "All" || activeTab === "Identity") && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#2563EB] dark:text-[#3984ff]" />
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#9bb1d3]">
                  Identity Details
                </h4>
              </div>
              <div className="space-y-2">
                {identityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-3.5 py-2.5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-[#8a9ab7]">
                          {item.label}
                        </p>
                        <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                          {item.displayValue}
                        </p>
                      </div>
                      {item.canReveal && (
                        <button
                          type="button"
                          onClick={() => setShowAadhaar((current) => !current)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 dark:text-[#8394b2] transition hover:bg-slate-200 dark:hover:bg-[#263654] hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          aria-label={showAadhaar ? "Hide number" : "Show number"}
                        >
                          {showAadhaar ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                      {item.documentUrl && (
                        <button
                          type="button"
                          onClick={() => handleDownload(item.documentUrl, item.downloadFileName)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 dark:text-[#8394b2] transition hover:bg-slate-200 dark:hover:bg-[#263654] hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          title={`Download ${item.label}`}
                        >
                          <Download size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Bank Details Section */}
          {(activeTab === "All" || activeTab === "Bank") && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Landmark size={14} className="text-[#2563EB] dark:text-[#3984ff]" />
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#9bb1d3]">
                  Bank Details
                </h4>
              </div>
              <div className="space-y-2">
                {bankItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-3.5 py-2.5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#65718d]/30 text-slate-600 dark:text-[#d2def6]">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-[#8a9ab7]">
                          {item.label}
                        </p>
                        <p className="truncate text-[13px] font-medium text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Documents Section */}
          {(activeTab === "All" || activeTab === "Documents") && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#2563EB] dark:text-[#3984ff]" />
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#9bb1d3]">
                  Uploaded Documents
                </h4>
              </div>

              {documentsList.length > 0 ? (
                <div className="space-y-2">
                  {documentsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-[#1a263c] px-3.5 py-2.5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-[#3984ff]">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-[#8ca1bd] truncate">
                          Verified Upload
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 dark:text-[#8394b2] transition hover:bg-slate-200 dark:hover:bg-[#263654] hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          title="Open document"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDownload(doc.url, doc.fileName)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 dark:text-[#8394b2] transition hover:bg-slate-200 dark:hover:bg-[#263654] hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          title="Download document"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 dark:border-[#223b5d] p-4 text-center text-[12px] text-slate-500 dark:text-[#8ca1bd]">
                  No documents uploaded yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lock Overlay for User Side when locked */}
        {shouldBlur && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-white/60 dark:bg-[#071425]/75 backdrop-blur-[3px] p-5 text-center">
            <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB]/10 dark:bg-[#3984ff]/20 text-[#2563EB] dark:text-[#3984ff] shadow-sm">
              <Lock size={20} />
            </div>
            <h4 className="text-[14px] font-semibold text-gray-900 dark:text-white">
              Secured Information
            </h4>
            <p className="mt-1 max-w-[270px] text-[12px] leading-relaxed text-slate-500 dark:text-[#8ca1bd]">
              Identity details, bank records, and documents are protected. Complete OTP verification to view.
            </p>
            <button
              type="button"
              onClick={onUnlockClick}
              className="mt-3.5 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#1d4ed8] cursor-pointer"
            >
              <Lock size={14} />
              View Secured Details
            </button>
          </div>
        )}
      </div>
    </ProfileCard>
  );
};

export default DocumentsCard;
