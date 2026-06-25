import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromLocalStorage } from "../utils/tokenUtils";
import { exportToExcel } from "../utils/exportToExcel";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

export const usePasswordProtectedExport = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  const handleExportClick = useCallback(() => {
    setExportError("");
    setIsExportModalOpen(true);
  }, []);

  const closeExportModal = useCallback(() => {
    setIsExportModalOpen(false);
    setExportError("");
    setExportLoading(false);
  }, []);

  const handleConfirmExport = useCallback(async (password, exportDataCallback) => {
    try {
      setExportLoading(true);
      setExportError("");

      await axios.post(
        `${API_BASE_URL.replace(/\/$/, "")}/api/auth/verify-password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        }
      );

      // Password verified — proceed with export
      exportDataCallback();
      setIsExportModalOpen(false);
    } catch (error) {
      setExportError(
        error?.response?.data?.message ||
          "Password verification failed. Please try again."
      );
    } finally {
      setExportLoading(false);
    }
  }, []);

  return {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  };
};
