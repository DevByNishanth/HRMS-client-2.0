import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AddFacultyForm from "./AddFacultyForm";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const getFacultyRecord = (payload) => {
  if (!payload) return null;
  if (payload._id) return payload;
  if (payload.data?._id) return payload.data;
  if (payload.faculty?._id) return payload.faculty;
  if (payload.data?.faculty?._id) return payload.data.faculty;
  if (payload.facultyDetails?._id) return payload.facultyDetails;
  if (payload.data?.facultyDetails?._id) return payload.data.facultyDetails;
  return null;
};

const EditFacultyCanvas = ({ faculty, onClose, onSaved }) => {
  const facultyId = faculty?._id;
  const [facultyDetails, setFacultyDetails] = useState(faculty || null);
  const [isLoading, setIsLoading] = useState(Boolean(facultyId));
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      if (!facultyId) {
        setError("Faculty ID is missing. Please select a faculty again.");
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("hrms_token");
      if (!token) {
        setError("Login token is missing. Please sign in again.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${facultyId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || data?.error || "Unable to load faculty details.");
        }

        setFacultyDetails(getFacultyRecord(data) || faculty);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load faculty details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacultyDetails();
  }, [faculty, facultyId]);

  if (!isLoading && facultyDetails) {
    return (
      <AddFacultyForm
        mode="edit"
        initialFaculty={facultyDetails}
        onClose={onClose}
        onSaved={onSaved}
      />
    );
  }

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/60 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-[42%] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Faculty Setup
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Edit Faculty
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close edit faculty form"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 text-center">
          <div>
            <p className={`text-[14px] font-semibold ${error ? "text-[#f16868]" : "text-white"}`}>
              {error || "Loading faculty details..."}
            </p>
            {error && (
              <button
                type="button"
                onClick={onClose}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-[13px] font-semibold text-white transition hover:bg-blue-500"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditFacultyCanvas;
