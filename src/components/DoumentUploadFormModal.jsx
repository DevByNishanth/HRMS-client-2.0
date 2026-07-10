import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  FileArchive,
  FileBadge,
  FileCheck2,
  FileImage,
  FileText,
  GraduationCap,
  IdCard,
  UploadCloud,
  X,
} from "lucide-react";
import { uploadProfileImage } from "../services/DocumentUploadFormModel/uploadProfileImageService.js";
import { deleteProfileImage } from "../services/DocumentUploadFormModel/deleteProfileImageService.js";
import { uploadFacultyDocument } from "../services/DocumentUploadFormModel/uploadFacultyDocumentService.js";
import { deleteFacultyDocument } from "../services/DocumentUploadFormModel/deleteFacultyDocumentService.js";
import { firstLoginComplete } from "../services/DocumentUploadFormModel/firstLoginCompleteService.js";
import { useNavigate } from "react-router-dom";
import { getRoleBasedRoute } from "../utils/tokenUtils";
// import { getUserIdFromToken } from "../utils/tokenUtils";
import { jwtDecode } from "jwt-decode";

const uploadSteps = [
  {
    id: "profile",
    title: "Profile Image",
    eyebrow: "Personal Identity",
    description: "Upload a clear profile photo for your employee record.",
    icon: FileImage,
    fields: [
      {
        id: "profileImage",
        label: "Profile Image",
        hint: "JPG, PNG, or WEBP",
        required: true,
      },
    ],
  },
  {
    id: "marksheets",
    title: "Marksheets",
    eyebrow: "Academic Records",
    description:
      "Upload your school and college marksheets. PG and PhD are optional.",
    icon: GraduationCap,
    fields: [
      {
        id: "sslcMarksheet",
        label: "SSLC Marksheet",
        hint: "Class 10 marksheet",
        required: true,
      },
      {
        id: "hscMarksheet",
        label: "HSC Marksheet",
        hint: "Class 12 marksheet",
        required: true,
      },
      // { id: "ugMarksheet", label: "UG Marksheet", hint: "Undergraduate marksheet", required: true },
      // { id: "pgMarksheet", label: "PG Marksheet", hint: "Optional", required: false },
      // { id: "phdMarksheet", label: "PhD Marksheet", hint: "Optional", required: false },
    ],
  },
  {
    id: "degree",
    title: "Degree Certificates",
    eyebrow: "Qualification Proof",
    description:
      "Upload degree certificates for your completed qualifications.",
    icon: FileBadge,
    fields: [
      {
        id: "ugDegree",
        label: "UG Degree Certificate",
        hint: "Undergraduate degree",
        required: true,
      },
      {
        id: "pgDegree",
        label: "PG Degree Certificate",
        hint: "Postgraduate degree",
        required: true,
      },
      {
        id: "phdDegree",
        label: "PhD Degree Certificate",
        hint: "Optional",
        required: false,
      },
    ],
  },
  {
    id: "experience",
    title: "Experience Certificates",
    eyebrow: "Previous Employment",
    description: "Upload one or more certificates from previous organizations.",
    icon: BriefcaseBusiness,
    fields: [
      {
        id: "experienceCertificates",
        label: "Previous Experience Certificates",
        hint: "Multiple files allowed",
        required: true,
        multiple: true,
      },
    ],
  },
  {
    id: "relieving",
    title: "Relieving Letter",
    eyebrow: "Exit Document",
    description: "Upload your relieving letter if available.",
    icon: FileCheck2,
    fields: [
      {
        id: "relievingLetter",
        label: "Relieving Letter",
        hint: "Optional",
        required: false,
      },
    ],
  },
  {
    id: "identity",
    title: "Other Documents",
    eyebrow: "Government Identity",
    description: "Upload Aadhaar and PAN card copies — both are mandatory.",
    icon: IdCard,
    fields: [
      {
        id: "aadhaarDocument",
        label: "Aadhaar Document",
        hint: "Aadhaar card copy",
        required: true,
      },
      {
        id: "panDocument",
        label: "PAN Document",
        hint: "PAN card copy",
        required: true,
      },
    ],
  },
];

const getFileLabel = (files, multiple) => {
  if (!files?.length) return "Click to upload document";
  if (multiple && files.length > 1) return `${files.length} files selected`;
  return files[0].name;
};

const StepProgress = ({ activeStep }) => (
  <div className="flex w-full max-w-[260px] items-center gap-2">
    {uploadSteps.map((step, index) => (
      <span
        key={step.id}
        className={`h-1.5 flex-1 rounded-full transition ${
          index <= activeStep ? "bg-[#3984ff]" : "bg-[#2a354b]"
        }`}
      />
    ))}
  </div>
);

const UploadTile = ({
  field,
  files,
  onChange,
  profileImageData,
  uploadedDocumentMeta,
  handleDeleteProfileImage,
  handleDeleteDocument,
  uploading,
}) => {
  const Icon = field.required ? BadgeCheck : FileText;
  const fieldDocs = uploadedDocumentMeta[field.id];
  const isFieldDocsArray = Array.isArray(fieldDocs);

  return (
    <div className="group relative rounded-xl border border-[#20385a] bg-[#0b1c31] p-4">
      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#294565] p-3">
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.pdf"
          multiple={field.multiple}
          disabled={uploading}
          onChange={(event) =>
            onChange(field.id, Array.from(event.target.files || []))
          }
          className="hidden"
        />

        <UploadCloud size={18} className="text-white" />
        <span className="ml-2 text-sm text-white">Choose File</span>
      </label>

      <div className="flex items-start gap-3 mt-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#28466f] bg-[#071425] text-[#5d9bff] transition group-hover:border-[#3984ff] group-hover:text-white">
          <UploadCloud size={21} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-[14px] font-semibold text-white">
              {field.label}
            </p>

            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold ${
                field.required
                  ? "bg-[#3984ff24] text-[#74aaff]"
                  : "bg-[#8ca1bd1f] text-[#9eb0cc]"
              }`}
            >
              <Icon size={12} />
              {field.required ? "Required" : "Optional"}
            </span>
          </div>

          <p className="mt-1 text-[12px] text-[#8ca1bd]">{field.hint}</p>

          <div className="mt-3 rounded-lg border border-dashed border-[#294565] bg-[#071425] px-3 py-2">
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#3984ff] border-t-transparent"></div>
                <span className="text-xs text-[#74aaff]">
                  Uploading document...
                </span>
              </div>
            ) : (
              <>
                <p
                  className={`truncate text-[12px] ${
                    files?.length ? "text-[#d7e3f5]" : "text-[#6f839f]"
                  }`}
                >
                  {getFileLabel(files, field.multiple)}
                </p>

                <p className="mt-0.5 text-[10px] text-[#5f748f]">
                  PDF, JPG, JPEG, PNG or WEBP
                </p>
              </>
            )}
          </div>

          {field.id === "profileImage" && profileImageData?.url && (
            <div className="mt-3 rounded-lg border border-[#294565] pl-3 pb-4">
              {/* <img
                src={profileImageData.url}
                alt="Profile"
                className="h-40 w-40 rounded-lg border border-[#294565] object-cover"
              /> */}
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={profileImageData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#74aaff] text-xs underline"
                >
                  Preview Image
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfileImage();
                  }}
                  className="rounded-md bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {isFieldDocsArray
            ? fieldDocs.map((doc, index) => (
                <div
                  key={doc.publicId}
                  className="mt-3 rounded-lg border border-[#294565] p-3"
                >
                  <p className="mb-2 text-xs text-white">Document {index + 1}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#74aaff] text-xs underline"
                  >
                    Preview Document
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(field.id, doc.publicId);
                    }}
                    className="ml-3 rounded-md bg-red-500 px-3 py-1 text-xs text-white"
                  >
                    Delete
                  </button>
                </div>
              ))
            : fieldDocs?.url && (
                <div className="mt-3 rounded-lg border border-[#294565] p-3">
                  <a
                    href={fieldDocs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#74aaff] text-xs underline"
                  >
                    Preview Document
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(field.id);
                    }}
                    className="ml-3 rounded-md bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

const DocumentUploadFormModal = ({ onClose }) => {
// auth 
const token = localStorage.getItem("hrms_token")
    let decoded = jwtDecode(token);


  // const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const currentStep = uploadSteps[activeStep];
  const StepIcon = currentStep.icon;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === uploadSteps.length - 1;
//   const facultyId = getUserIdFromToken();
  const facultyId = decoded?.facultyId
  const [uploadedDocumentMeta, setUploadedDocumentMeta] = useState({});
  const [profileImageData, setProfileImageData] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);
  // console.log('docs',uploadedDocumentMeta);
  

  // const selectedFileCount = useMemo(
  //     () => Object.values(uploadedFiles).reduce((count, files) => count + (files?.length || 0), 0),
  //     [uploadedFiles]
  // );

  const handleFileChange = async (fieldId, files) => {
    if (!files?.length) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ];

    const invalidFile = files.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      alert(
        "Only PNG, JPG, JPEG, WEBP and PDF files are allowed."
      );
      return;
    }

    const multiFileFields = [
      "experienceCertificates",
      "relievingLetter",
      "otherDocuments",
    ];

    setUploadedFiles((prev) => ({
      ...prev,
      [fieldId]: multiFileFields.includes(fieldId)
        ? [...(prev[fieldId] || []), ...files]
        : files,
    }));

    try {
      setUploadingField(fieldId);

      // const file = files[0];

      if (fieldId === "profileImage") {
        const response = await uploadProfileImage(facultyId, files[0]);

        setProfileImageData(response.data);

        return;
      }

      const backendField = documentTypeMap[fieldId];
      // console.log("API Response:", response.documents[backendField]);

      let uploadedDocs = [];

      for (const file of files) {
        const response = await uploadFacultyDocument(
          facultyId,
          backendField,
          file,
        );
        // console.log("API Response:", response);
        const uploadedDoc = response.documents[backendField];

        if (Array.isArray(uploadedDoc)) {
          uploadedDocs = [...uploadedDocs, ...uploadedDoc];
        } else {
          uploadedDocs.push(uploadedDoc);
        }
      }

      const isMultiFileField = [
        "experienceCertificates",
        "relievingLetter",
        "otherDocuments",
      ].includes(fieldId);

      setUploadedDocumentMeta((prev) => {
        const existingDocs = Array.isArray(prev[fieldId])
          ? prev[fieldId]
          : prev[fieldId]
            ? [prev[fieldId]]
            : [];

        return {
          ...prev,
          [fieldId]: isMultiFileField
            ? uploadedDocs
            : uploadedDocs[0],
        };
      });
      // console.log("fieldId =", fieldId);
      //   console.log("uploadedDocs =", uploadedDocs);
      //   console.log("previous =", uploadedDocumentMeta[fieldId]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const documentTypeMap = {
    sslcMarksheet: "sslcMarkSheet",
    hscMarksheet: "hscMarkSheet",

    ugDegree: "ugDegreeCertificate",
    pgDegree: "pgDegreeCertificate",
    phdDegree: "phdDegreeCertificate",

    experienceCertificates: "experienceCertificates",

    relievingLetter: "relievingLetters",
    otherDocuments: "otherDocuments",

    aadhaarDocument: "aadharCard",

    panDocument: "panCard",
  };

  const handleDeleteProfileImage = async () => {
    try {
      await deleteProfileImage(facultyId);

      setProfileImageData(null);

      setUploadedFiles((prev) => ({
        ...prev,
        profileImage: [],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDocument = async (fieldId, publicId = null) => {
    try {
      const backendField = documentTypeMap[fieldId];

      if (
        backendField === "experienceCertificates" ||
        backendField === "relievingLetters" ||
        backendField === "otherDocuments"
      ) {
        await deleteFacultyDocument(
          facultyId,
          backendField,
          publicId
        );

        setUploadedDocumentMeta((prev) => ({
          ...prev,
          [fieldId]: (prev[fieldId] || []).filter(
            (doc) => doc.publicId !== publicId
          ),
        }));

        return;
      }

      const document = uploadedDocumentMeta[fieldId];
console.log("")
      await deleteFacultyDocument(
        facultyId,
        backendField,
        document.publicId
      );

      setUploadedDocumentMeta((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });

    } catch (error) {
      console.error(error);
    }
  };

  const handleFinishUpload = async () => {
    try {
      const response = await firstLoginComplete();
      // console.log("API Response:", response);

      // Save the NEW token returned from backend
      if (response.token) {
        localStorage.setItem("hrms_token", response.token);
        const decoded = jwtDecode(response.token);
        // console.log("Decoded New Token:", decoded);
      }

      alert(
      "Documents uploaded successfully. Please login again."
    );

    // Same logic as Sidebar logout
    localStorage.removeItem("hrms_token");

    window.location.href = "/";
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to complete first login"
      );
    }
  };

  const validateCurrentStep = () => {
    const requiredFields = currentStep.fields.filter((field) => field.required);

    return requiredFields.every(
      (field) => uploadedFiles[field.id] && uploadedFiles[field.id].length > 0,
    );
  };

  return (
    <section className="fixed inset-0 z-50 bg-[#020817]/50 backdrop-blur-[12px]">
      <form
        onSubmit={handleSubmit}
        className="fixed left-1/2 top-1/2 flex h-[89vh] w-[80%] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-gray-600/60 bg-gray-700/15 backdrop-blur-xl shadow-[0_26px_80px_rgba(0,0,0,0.48)]"
      >
        <div className="shrink-0 border-b border-[#173150] bg-[#0a1a2d]/10 px-6 py-4">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#74aaff]">
                Step {activeStep + 1} of {uploadSteps.length}
              </p>
              <h2 className="mt-1 text-[22px] font-semibold leading-tight text-[#d8e3f7]">
                {currentStep.eyebrow}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <StepProgress activeStep={activeStep} />
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                  aria-label="Close document upload form"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_1fr]">
          <aside className="hidden border-r border-[#173150] bg-[#061120] p-4 lg:block">
            <div className="rounded-xl border border-[#1b3352] bg-[#0a1a2d] p-2">
              <div className="flex items-start gap-2">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#2563eb24] text-[#74aaff]">
                  <FileArchive size={22} />
                </div>
                <p className="mt-1 text-[14px] leading-5 text-[#8ca1bd]">
                  Upload your documents
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {uploadSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                      activeStep === index
                        ? "border-[#3984ff] bg-[#132b49] text-white"
                        : "border-transparent text-[#8ca1bd] hover:border-[#20385a] hover:bg-[#0b1c31] hover:text-white"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium">
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-h-0 overflow-y-auto p-5 table-custom-scrollbar">
            <div className="mb-5 rounded-xl border border-[#1b3352] bg-[#0a1a2d] p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2563eb24] text-[#74aaff]">
                  <StepIcon size={22} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[20px] font-semibold leading-tight text-white">
                    {currentStep.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-5 text-[#9eb0cc]">
                    {currentStep.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {currentStep.fields.map((field) => (
                <UploadTile
                  key={field.id}
                  field={field}
                  files={uploadedFiles[field.id]}
                  onChange={handleFileChange}
                  profileImageData={profileImageData}
                  uploadedDocumentMeta={uploadedDocumentMeta}
                  handleDeleteProfileImage={handleDeleteProfileImage}
                  handleDeleteDocument={handleDeleteDocument}
                  uploading={uploadingField === field.id}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={() => setActiveStep((step) => Math.max(step - 1, 0))}
            disabled={isFirstStep}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#244061] bg-[#0d2138] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <button
            type="button"
            onClick={async () => {
              if (!validateCurrentStep()) {
                alert(
                  "Please upload all required documents before proceeding.",
                );
                return;
              }

              if (isLastStep) {
                await handleFinishUpload();
              } else {
                setActiveStep((step) =>
                  Math.min(step + 1, uploadSteps.length - 1),
                );
              }
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4]"
          >
            {isLastStep ? "Finish Upload" : "Next Step"}
            <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </section>
  );
};

export default DocumentUploadFormModal;
