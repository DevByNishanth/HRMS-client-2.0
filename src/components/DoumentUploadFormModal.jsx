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

const uploadSteps = [
    {
        id: "profile",
        title: "Profile Image",
        eyebrow: "Personal Identity",
        description: "Upload a clear profile photo for your employee record.",
        icon: FileImage,
        fields: [
            { id: "profileImage", label: "Profile Image", hint: "JPG, PNG, or WEBP", required: true },
        ],
    },
    {
        id: "marksheets",
        title: "Marksheets",
        eyebrow: "Academic Records",
        description: "Upload your school and college marksheets. PG and PhD are optional.",
        icon: GraduationCap,
        fields: [
            { id: "sslcMarksheet", label: "SSLC Marksheet", hint: "Class 10 marksheet", required: true },
            { id: "hscMarksheet", label: "HSC Marksheet", hint: "Class 12 marksheet", required: true },
            // { id: "ugMarksheet", label: "UG Marksheet", hint: "Undergraduate marksheet", required: true },
            // { id: "pgMarksheet", label: "PG Marksheet", hint: "Optional", required: false },
            // { id: "phdMarksheet", label: "PhD Marksheet", hint: "Optional", required: false },
        ],
    },
    {
        id: "degree",
        title: "Degree Certificates",
        eyebrow: "Qualification Proof",
        description: "Upload degree certificates for your completed qualifications.",
        icon: FileBadge,
        fields: [
            { id: "ugDegree", label: "UG Degree Certificate", hint: "Undergraduate degree", required: true },
            { id: "pgDegree", label: "PG Degree Certificate", hint: "Postgraduate degree", required: true },
            { id: "phdDegree", label: "PhD Degree Certificate", hint: "Optional", required: false },
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
            { id: "relievingLetter", label: "Relieving Letter", hint: "Optional", required: false },
        ],
    },
    {
        id: "identity",
        title: "Other Documents",
        eyebrow: "Government Identity",
        description: "Upload Aadhaar and PAN documents. PAN is optional.",
        icon: IdCard,
        fields: [
            { id: "aadhaarDocument", label: "Aadhaar Document", hint: "Aadhaar card copy", required: true },
            { id: "panDocument", label: "PAN Document", hint: "Optional", required: false },
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
                className={`h-1.5 flex-1 rounded-full transition ${index <= activeStep ? "bg-[#3984ff]" : "bg-[#2a354b]"
                    }`}
            />
        ))}
    </div>
);

const UploadTile = ({ field, files, onChange }) => {
    const Icon = field.required ? BadgeCheck : FileText;

    return (
        <label className="group relative block cursor-pointer rounded-xl border border-[#20385a] bg-[#0b1c31] p-4 transition hover:border-[#3984ff] hover:bg-[#102640]">
            <input
                type="file"
                multiple={field.multiple}
                onChange={(event) => onChange(field.id, Array.from(event.target.files || []))}
                className="absolute inset-0 cursor-pointer opacity-0"
            />

            <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#28466f] bg-[#071425] text-[#5d9bff] transition group-hover:border-[#3984ff] group-hover:text-white">
                    <UploadCloud size={21} />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[14px] font-semibold text-white">{field.label}</p>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold ${field.required
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
                        <p className={`truncate text-[12px] ${files?.length ? "text-[#d7e3f5]" : "text-[#6f839f]"}`}>
                            {getFileLabel(files, field.multiple)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#5f748f]">PDF, JPG, PNG, DOC, or DOCX</p>
                    </div>
                </div>
            </div>
        </label>
    );
};

const DocumentUploadFormModal = ({ onClose }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const currentStep = uploadSteps[activeStep];
    const StepIcon = currentStep.icon;
    const isFirstStep = activeStep === 0;
    const isLastStep = activeStep === uploadSteps.length - 1;

    const selectedFileCount = useMemo(
        () => Object.values(uploadedFiles).reduce((count, files) => count + (files?.length || 0), 0),
        [uploadedFiles]
    );

    const handleFileChange = (fieldId, files) => {
        setUploadedFiles((currentFiles) => ({
            ...currentFiles,
            [fieldId]: files,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
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
                                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${activeStep === index
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
                        type={isLastStep ? "submit" : "button"}
                        onClick={() => {
                            if (!isLastStep) setActiveStep((step) => Math.min(step + 1, uploadSteps.length - 1));
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
