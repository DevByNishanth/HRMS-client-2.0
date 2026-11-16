import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import FacultyDashboardBody from "./FacultyDashboardBody";
import DoumentUploadFormModal from "../../../components/DoumentUploadFormModal";
import ProfileUpdatePromptModal from "../../../components/ProfileUpdatePromptModal";
import { jwtDecode } from "jwt-decode";

const FacultyDashboard = () => {
  const [openDocumentUploadModal, setOpenDocumentUploadModal] = useState(false);
  const [openProfileUpdateModal, setOpenProfileUpdateModal] = useState(false);
  const token = localStorage.getItem("hrms_token");

  useEffect(() => {
    if (token) {
      try {
        let decoded = jwtDecode(token);
        if (decoded.isFirstTimeLogin) {
          setOpenDocumentUploadModal(true);
        } else {
          // Check if already shown in this login session
          const hasSeenThisSession = sessionStorage.getItem("has_seen_profile_update_prompt");
          if (!hasSeenThisSession) {
            setOpenProfileUpdateModal(true);
            sessionStorage.setItem("has_seen_profile_update_prompt", "true");
          }
        }
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, [token]);

  return (
    <>
      {openDocumentUploadModal && (
        <DoumentUploadFormModal
          onClose={() => {
            setOpenDocumentUploadModal(false);
            // After first time document upload is done, show the profile update prompt
            setOpenProfileUpdateModal(true);
          }}
        />
      )}

      {openProfileUpdateModal && !openDocumentUploadModal && (
        <ProfileUpdatePromptModal
          isOpen={openProfileUpdateModal}
          onClose={() => setOpenProfileUpdateModal(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#051424] transition-colors duration-200">
        <Sidebar />
        {/* right container  */}
        <div className="flex min-w-0 flex-1 flex-col">
          <CommonHeader />
          <FacultyDashboardBody />
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
