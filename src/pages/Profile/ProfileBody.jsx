import React, { useState, useCallback, useEffect } from "react";
import { Loader2, User, CalendarCheck, CalendarDays } from "lucide-react";
import DocumentsCard from "./DocumentsCard";
import EducationQualifications from "./EducationQualifications";
import PersonalDetails from "./PersonalDetails";
import ProfessionalInfo from "./ProfessionalInfo";
import ProfileHero from "./ProfileHero";
import ProfileEditDrawer from "./ProfileEditDrawer";
import ReportingManagerCard from "./ReportingManagerCard";
import SecureDataAuthModal from "../../components/SecureDataAuthModal";
import AttendanceTable from "../Dashboards/FacultyDashboard/AttendanceTable";
import LeaveTable from "../Dashboards/FacultyDashboard/LeaveTable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";
// ? tab data ================== 
const tabData = [
  { label: "Personal details", icon: User },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Leaves", icon: CalendarDays },
]


const ProfileBody = ({ userId, canEditOwnProfile, isAdminView = false }) => {
  // ? tab states ===================
  const [selectedTab, setSelectedTab] = useState("Personal details");

  // ! states ===================
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [initialEditStep, setInitialEditStep] = useState(0);
  const [editMode, setEditMode] = useState("full");
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSecuredUnlocked, setIsSecuredUnlocked] = useState(isAdminView);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const closeEditDrawer = useCallback(() => {
    setIsEditOpen(false);
  }, []);

  const openFullEdit = useCallback(() => {
    setInitialEditStep(0);
    setEditMode("full");
    setIsEditOpen(true);
  }, []);

  const openSectionEdit = useCallback((stepIndex) => {
    setInitialEditStep(stepIndex);
    setEditMode("single");
    setIsEditOpen(true);
  }, []);

  const handleSaved = useCallback((updatedFaculty) => {
    setFaculty(updatedFaculty);
  }, []);

  const handleSecureDataUnlocked = useCallback((securedData) => {
    setFaculty((prev) => {
      if (!prev) return securedData;
      return {
        ...prev,
        ...securedData,
        identityDetails: {
          ...(prev.identityDetails || {}),
          ...(securedData.identityDetails || {}),
          aadharNumber:
            securedData.identityDetails?.aadharNumber ||
            securedData.aadharNumber ||
            prev.identityDetails?.aadharNumber,
          panNumber:
            securedData.identityDetails?.panNumber ||
            securedData.panNumber ||
            prev.identityDetails?.panNumber,
          pfNumber:
            securedData.identityDetails?.pfNumber ||
            securedData.pfNumber ||
            prev.identityDetails?.pfNumber,
        },
        bankDetails: {
          ...(prev.bankDetails || {}),
          ...(securedData.bankDetails || {}),
          bankName:
            securedData.bankDetails?.bankName ||
            securedData.bankName ||
            prev.bankDetails?.bankName,
          accountNumber:
            securedData.bankDetails?.accountNumber ||
            securedData.accountNumber ||
            prev.bankDetails?.accountNumber,
          ifscCode:
            securedData.bankDetails?.ifscCode ||
            securedData.ifscCode ||
            prev.bankDetails?.ifscCode,
          branchLocation:
            securedData.bankDetails?.branchLocation ||
            securedData.branch ||
            prev.bankDetails?.branchLocation,
        },
        documents: {
          ...(prev.documents || {}),
          ...(securedData.documents || {}),
          aadharCard: securedData.documents?.aadharCard || prev.documents?.aadharCard,
          panCard: securedData.documents?.panCard || prev.documents?.panCard,
        },
      };
    });
    setIsSecuredUnlocked(true);
  }, []);

  // Fetch faculty data from the API
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("No user ID provided");
      return;
    }

    const fetchFaculty = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("hrms_token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const endpoint = isAdminView
          ? `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${userId}/admin-view`
          : `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${userId}`;

        let response;
        try {
          response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (response.status === 404 && isAdminView) {
            throw new Error("404");
          }
        } catch (err) {
          if (err.message === "404" && isAdminView) {
            response = await fetch(
              `${API_BASE_URL.replace(/\/$/, "")}/api/faculty/${userId}/admin-view`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
          } else {
            throw err;
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const result = await response.json();
        // The API may return data nested under result.data or directly as result
        const facultyData = result?.data || result;
        setFaculty(facultyData);
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [userId, isAdminView]);

  if (loading) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 dark:bg-[#071425] text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#3984ff]" />
          <p className="text-[13px] text-slate-500 dark:text-[#8ca1bd]">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center bg-slate-50 dark:bg-[#071425] text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <p className="text-[14px] text-[#f16868]">{error}</p>
        </div>
      </main>
    );
  }





  return (
    <main className="min-h-0 flex-1 overflow-y-auto  max-h-[calc(100vh-70px)] table-custom-scrollbar bg-slate-50 dark:bg-[#071425] text-slate-900 dark:text-white">
      <div className="">
        <ProfileHero canEdit={canEditOwnProfile} onEdit={openFullEdit} faculty={faculty} />

        <div className="tab-container flex items-center gap-4 border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111a2d] rounded-lg py-3 px-3 mx-6 mb-4">

          {tabData.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setSelectedTab(tab.label)}
                className={`inline-flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTab === tab.label
                  ? "bg-[#2163cc] text-white shadow-sm"
                  : "text-slate-500 dark:text-[#8ca1bd] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2942]"
                  }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}

        </div>

        {selectedTab === "Attendance" ? (
          <div className="px-6">
            <AttendanceTable />
          </div>
        ) : selectedTab === "Leaves" ? (
          <div className="px-6">
            <LeaveTable employeeId={userId} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 px-6">
            <PersonalDetails canEdit={canEditOwnProfile} onEdit={() => openSectionEdit(0)} faculty={faculty} />
            <ProfessionalInfo canEdit={canEditOwnProfile} onEdit={() => openSectionEdit(1)} faculty={faculty} />
            <ReportingManagerCard canEdit={canEditOwnProfile} onEdit={() => openSectionEdit(4)} faculty={faculty} />
            <DocumentsCard
              canEdit={canEditOwnProfile}
              onEdit={() => openSectionEdit(3)}
              faculty={faculty}
              isUnlocked={isSecuredUnlocked || isAdminView}
              onUnlockClick={() => setIsAuthModalOpen(true)}
              isAdminView={isAdminView}
            />
            <EducationQualifications canEdit={canEditOwnProfile} onEdit={() => openSectionEdit(2)} faculty={faculty} />
          </div>
        )}
      </div>

      {isEditOpen && (
        <ProfileEditDrawer
          onClose={closeEditDrawer}
          initialStep={initialEditStep}
          mode={editMode}
          faculty={faculty}
          onSaved={handleSaved}
        />
      )}

      {isAuthModalOpen && (
        <SecureDataAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          facultyId={userId || faculty?._id}
          onSuccess={handleSecureDataUnlocked}
        />
      )}
    </main>
  );
};

export default ProfileBody;
