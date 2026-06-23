import React, { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Loader2,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const steps = [
  {
    title: "Personal Identity",
    description: "Update your core identity and contact information.",
    icon: UserRound,
  },
  {
    title: "Professional Info",
    description: "Manage your employment and designation details.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Educational Qualification",
    description: "Add or update your academic qualifications.",
    icon: GraduationCap,
  },
  {
    title: "Document & Bank Details",
    description: "Manage your identity documents and salary account details.",
    icon: Landmark,
  },
  {
    title: "Additional Details",
    description: "Update your reporting manager and additional information.",
    icon: Building2,
  },
];

const genders = ["Male", "Female", "Other"];

const emptyQualification = {
  degree: "",
  specialization: "",
  institutionName: "",
  institutionLocation: "",
  yearOfPassing: "",
  percentage: "",
  cgpa: "",
};

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-[11px] text-[#f16868]">{message}</p> : null;

const Field = ({ label, name, value, onChange, error, required, className = "", type = "text", placeholder }) => (
  <label className={className}>
    <span className="mb-2 block text-[13px] font-semibold text-white">
      {label} {required && <span className="text-[#3984ff]">*</span>}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      placeholder={placeholder}
      className={`h-11 w-full rounded-lg border bg-[#0d2138] px-3 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-[#244061]"
        }`}
    />
    <FieldError message={error} />
  </label>
);

const TextareaField = ({ label, name, value, onChange, error, required, className = "", placeholder }) => (
  <label className={className}>
    <span className="mb-2 block text-[13px] font-semibold text-white">
      {label} {required && <span className="text-[#3984ff]">*</span>}
    </span>
    <textarea
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      placeholder={placeholder}
      rows={3}
      className={`h-auto w-full rounded-lg border bg-[#0d2138] px-3 py-2.5 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] resize-none ${error ? "border-[#f16868]" : "border-[#244061]"
        }`}
    />
    <FieldError message={error} />
  </label>
);

const DropdownField = ({ label, value, onChange, options, placeholder, required, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <span className="mb-2 block text-[13px] font-semibold text-white">
        {label} {required && <span className="text-[#3984ff]">*</span>}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-[#244061]"
          }`}
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder || `Select ${label.toLowerCase()}`}
        </span>
        <svg
          className={`h-4 w-4 text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <FieldError message={error} />

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close dropdown"
          />
          <div className="absolute left-0 right-0 z-40 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)] top-[calc(100%+8px)]">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-3 text-left text-[13px] transition ${value === option
                  ? "bg-[#132b49] text-white"
                  : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const getFullName = (f) => [f?.firstName, f?.lastName].filter(Boolean).join(" ") || "";

const getAddressText = (address) => {
  if (!address || typeof address !== "object") return "";
  return [address.doorNo, address.street, address.city, address.district, address.state, address.pincode, address.country]
    .filter(Boolean).join(", ");
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const buildInitialPersonal = (f) => ({
  fullName: getFullName(f),
  dateOfBirth: formatDateForInput(f?.dob),
  gender: f?.gender || "",
  phone: f?.phone || "",
  email: f?.email || "",
  permanentAddress: getAddressText(f?.address),
});

const buildInitialProfessional = (f) => ({
  employeeId: f?.empId || "",
  dateOfJoining: formatDateForInput(f?.doj),
  designation: f?.designation || "",
  department: f?.department || "",
  totalExperience: "",
  specialization: f?.specialization || "",
});

const buildInitialQualifications = (f) => {
  const quals = f?.qualifications || [];
  return quals.length > 0
    ? quals.map((q) => ({
      degree: q.degree || "",
      specialization: q.specialization || "",
      institutionName: q.institutionName || q.college || "",
      institutionLocation: q.institutionLocation || "",
      yearOfPassing: q.yearOfPassing?.toString() || "",
      percentage: q.percentage?.toString() || "",
      cgpa: q.cgpa?.toString() || "",
    }))
    : [{ ...emptyQualification }];
};

const buildInitialDocuments = (f) => ({
  aadhaarNumber: f?.identityDetails?.aadharNumber || f?.aadharNumber || "",
  panNumber: f?.identityDetails?.panNumber || f?.panNumber || "",
  bankName: f?.bankDetails?.bankName || f?.bankName || "",
  accountNumber: f?.bankDetails?.accountNumber || f?.accountNumber || "",
  ifscCode: f?.bankDetails?.ifscCode || f?.ifscCode || "",
  branch: f?.bankDetails?.branchLocation || f?.branch || "",
});

const buildInitialAdditional = (f) => ({
  organizationEmail: f?.organizationEmail || "",
  workType: f?.workType || "",
  timeType: f?.timeType || "",
  employeeCategory: f?.employeeCategory || "",
  reportingManagerName: f?.reportingTo?.name || [f?.reportingTo?.firstName, f?.reportingTo?.lastName].filter(Boolean).join(" ") || "",
  reportingManagerDesignation: f?.reportingTo?.designation || "",
  reportingManagerDepartment: f?.reportingTo?.department || "",
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const ProfileEditDrawer = ({ onClose, initialStep = 0, mode = "full", faculty, onSaved }) => {
  const [activeStep, setActiveStep] = useState(initialStep);

  // Step 1 – Personal Identity
  const [personal, setPersonal] = useState(() => buildInitialPersonal(faculty));

  // Step 2 – Professional Info
  const [professional, setProfessional] = useState(() => buildInitialProfessional(faculty));

  // Step 3 – Educational Qualification
  const [qualifications, setQualifications] = useState(() => buildInitialQualifications(faculty));

  // Step 4 – Document & Bank Details
  const [documents, setDocuments] = useState(() => buildInitialDocuments(faculty));

  // Step 5 – Additional Details
  const [additional, setAdditional] = useState(() => buildInitialAdditional(faculty));

  const updatePersonal = (key, value) =>
    setPersonal((prev) => ({ ...prev, [key]: value }));

  const updateProfessional = (key, value) =>
    setProfessional((prev) => ({ ...prev, [key]: value }));

  const updateQualification = (index, key, value) =>
    setQualifications((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );

  const updateDocuments = (key, value) =>
    setDocuments((prev) => ({ ...prev, [key]: value }));

  const updateAdditional = (key, value) =>
    setAdditional((prev) => ({ ...prev, [key]: value }));

  const addQualification = () =>
    setQualifications((prev) => [...prev, { ...emptyQualification }]);

  const removeQualification = (index) =>
    setQualifications((prev) => prev.filter((_, i) => i !== index));

  const Icon = steps[activeStep].icon;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const isSingleMode = mode === "single";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleNext = () => {
    if (!isLastStep) setActiveStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (!isFirstStep) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("hrms_token");
      if (!token) throw new Error("Authentication token not found");

      const facultyId = faculty?._id || faculty?.id;
      if (!facultyId) throw new Error("Faculty ID not found");

      const nameParts = (personal.fullName || "").trim().split(" ");
      const firstName = nameParts[0] || faculty?.firstName || "";
      const lastName = nameParts.slice(1).join(" ") || faculty?.lastName || "";

      // Build complete payload by merging original faculty data with edited form values
      const payload = {
        ...faculty,
        firstName,
        lastName,
        gender: personal.gender,
        phone: personal.phone,
        email: personal.email,
        dob: personal.dateOfBirth || faculty?.dob,
        empId: professional.employeeId || faculty?.empId,
        doj: professional.dateOfJoining || faculty?.doj,
        designation: professional.designation || faculty?.designation,
        department: professional.department || faculty?.department,
        specialization: professional.specialization || faculty?.specialization,
        qualifications: qualifications,
        identityDetails: {
          ...(faculty?.identityDetails || {}),
          aadharNumber: documents.aadhaarNumber,
          panNumber: documents.panNumber,
        },
        bankDetails: {
          ...(faculty?.bankDetails || {}),
          bankName: documents.bankName,
          accountNumber: documents.accountNumber,
          ifscCode: documents.ifscCode,
          branchLocation: documents.branch,
        },
        address: {
          ...(faculty?.address || {}),
          permanentAddress: personal.permanentAddress,
        },
        organizationEmail: additional.organizationEmail || faculty?.organizationEmail,
        workType: additional.workType || faculty?.workType,
        timeType: additional.timeType || faculty?.timeType,
        employeeCategory: additional.employeeCategory || faculty?.employeeCategory,
        reportingTo: {
          ...(faculty?.reportingTo || {}),
          name: additional.reportingManagerName,
          designation: additional.reportingManagerDesignation,
          department: additional.reportingManagerDepartment,
        },
      };

      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${facultyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update profile: ${response.status}`);
      }

      const result = await response.json();
      const updatedFaculty = result?.data || result;

      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        if (typeof onSaved === "function") onSaved(updatedFaculty);
        onClose();
      }, 1200);
    } catch (err) {
      setSubmitError(err.message || "An error occurred while updating the profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)] sm:w-[90%] md:w-[60%] lg:w-[50%] xl:w-[42%]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="shrink-0 border-b border-[#173150] bg-[#08182a] px-5 py-4">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a9c7ff]">
                Step {activeStep + 1} of {steps.length}
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-tight text-[#e4e9ff]">
                {steps[activeStep].title}
              </h3>
            </div>

            <div className="flex shrink-0 items-start gap-3">
              {/* Segmented progress bars */}
              <div className="mt-5 flex w-[155px] items-center gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (!isSingleMode) setActiveStep(index);
                    }}
                    className={`h-1.5 flex-1 rounded-full transition ${index <= activeStep
                      ? "bg-[#3984ff]"
                      : "bg-[#354158]"
                      } ${isSingleMode ? "cursor-default" : "hover:bg-[#596782]"
                      }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                aria-label="Close profile edit drawer"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Step description */}
          <p className="mt-3 flex items-center gap-2 text-[12px] leading-5 text-[#8ca1bd]">
            <Icon size={14} className="shrink-0 text-[#3984ff]" />
            {steps[activeStep].description}
          </p>
        </div>

        {/* ── Body ── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-4 table-custom-scrollbar">
          {/* Step 1 – Personal Identity */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={personal.fullName}
                  onChange={updatePersonal}
                  placeholder="Dr. Samuel Miller"
                  className="col-span-2"
                />
                <Field
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={personal.dateOfBirth}
                  onChange={updatePersonal}
                  placeholder="14 May 1978"
                />
                <DropdownField
                  label="Gender"
                  value={personal.gender}
                  onChange={(value) => updatePersonal("gender", value)}
                  options={genders}
                  placeholder="Select gender"
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={personal.phone}
                  onChange={updatePersonal}
                  placeholder="9876543210"
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={personal.email}
                  onChange={updatePersonal}
                  placeholder="samuel@sece.ac.in"
                />
                <TextareaField
                  label="Permanent Address"
                  name="permanentAddress"
                  value={personal.permanentAddress}
                  onChange={updatePersonal}
                  placeholder="42, Green Valley Enclave, Pollachi Main Road, Coimbatore - 641032"
                  className="col-span-2"
                />
              </div>
            </div>
          )}

          {/* Step 2 – Professional Info */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Employee ID"
                  name="employeeId"
                  value={professional.employeeId}
                  onChange={updateProfessional}
                  placeholder="SECE-HOD-CS-012"
                />
                <Field
                  label="Date of Joining"
                  name="dateOfJoining"
                  value={professional.dateOfJoining}
                  onChange={updateProfessional}
                  placeholder="12 June 2015"
                />
                <Field
                  label="Designation"
                  name="designation"
                  value={professional.designation}
                  onChange={updateProfessional}
                  placeholder="Assistant Professor"
                />
                <Field
                  label="Department"
                  name="department"
                  value={professional.department}
                  onChange={updateProfessional}
                  placeholder="Computer Science"
                />
                <Field
                  label="Total Experience"
                  name="totalExperience"
                  value={professional.totalExperience}
                  onChange={updateProfessional}
                  placeholder="22 Years"
                />
                <Field
                  label="Specialization"
                  name="specialization"
                  value={professional.specialization}
                  onChange={updateProfessional}
                  placeholder="Machine Learning"
                />
              </div>
            </div>
          )}

          {/* Step 3 – Educational Qualification */}
          {activeStep === 2 && (
            <div>
              <div className="mb-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={addQualification}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[12px] font-semibold text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white"
                >
                  <Plus size={14} />
                  Add Qualification
                </button>
              </div>

              <div className="space-y-4">
                {qualifications.map((qualification, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-[13px] font-semibold text-white">
                        <GraduationCap size={14} className="text-[#3984ff]" />
                        Qualification {index + 1}
                      </h4>
                      {qualifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQualification(index)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824]"
                          aria-label={`Remove qualification ${index + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Degree"
                        name="degree"
                        value={qualification.degree}
                        onChange={(_, value) => updateQualification(index, "degree", value)}
                        placeholder="Ph.D / M.E"
                      />
                      <Field
                        label="Specialization"
                        name="specialization"
                        value={qualification.specialization}
                        onChange={(_, value) => updateQualification(index, "specialization", value)}
                        placeholder="Computer Science"
                      />
                      <Field
                        label="Institution Name"
                        name="institutionName"
                        value={qualification.institutionName}
                        onChange={(_, value) => updateQualification(index, "institutionName", value)}
                        placeholder="Indian Institute of Technology"
                      />
                      <Field
                        label="Institution Location"
                        name="institutionLocation"
                        value={qualification.institutionLocation}
                        onChange={(_, value) => updateQualification(index, "institutionLocation", value)}
                        placeholder="Madras, Chennai"
                      />
                      <Field
                        label="Year of Passing"
                        name="yearOfPassing"
                        type="number"
                        value={qualification.yearOfPassing}
                        onChange={(_, value) => updateQualification(index, "yearOfPassing", value)}
                        placeholder="2014"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="Percentage"
                          name="percentage"
                          type="number"
                          value={qualification.percentage}
                          onChange={(_, value) => updateQualification(index, "percentage", value)}
                          placeholder="85"
                        />
                        <Field
                          label="CGPA"
                          name="cgpa"
                          type="number"
                          value={qualification.cgpa}
                          onChange={(_, value) => updateQualification(index, "cgpa", value)}
                          placeholder="8.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 – Document & Bank Details */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4">
                <h4 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-white">
                  <UserRound size={14} className="text-[#3984ff]" />
                  Government Identity
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Aadhaar Number"
                    name="aadhaarNumber"
                    value={documents.aadhaarNumber}
                    onChange={updateDocuments}
                    placeholder="4321 5678 8824"
                  />
                  <Field
                    label="PAN Number"
                    name="panNumber"
                    value={documents.panNumber}
                    onChange={updateDocuments}
                    placeholder="BYPMPH4321L"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4">
                <h4 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-white">
                  <Landmark size={14} className="text-[#3984ff]" />
                  Bank Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Bank Name"
                    name="bankName"
                    value={documents.bankName}
                    onChange={updateDocuments}
                    placeholder="Indian Bank"
                  />
                  <Field
                    label="Account Number"
                    name="accountNumber"
                    value={documents.accountNumber}
                    onChange={updateDocuments}
                    placeholder="123456789012"
                  />
                  <Field
                    label="IFSC Code"
                    name="ifscCode"
                    value={documents.ifscCode}
                    onChange={updateDocuments}
                    placeholder="IDIB000S123"
                  />
                  <Field
                    label="Branch"
                    name="branch"
                    value={documents.branch}
                    onChange={updateDocuments}
                    placeholder="Coimbatore"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5 – Additional Details */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4">
                <h4 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-white">
                  <Building2 size={14} className="text-[#3984ff]" />
                  Employment Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Organization Email"
                    name="organizationEmail"
                    value={additional.organizationEmail}
                    onChange={updateAdditional}
                    placeholder="nishanth.a@sece.ac.in"
                    className="col-span-2"
                  />
                  <DropdownField
                    label="Work Type"
                    value={additional.workType}
                    onChange={(value) => updateAdditional("workType", value)}
                    options={["Permanent", "Temporary", "Contract"]}
                    placeholder="Select work type"
                  />
                  <DropdownField
                    label="Time Type"
                    value={additional.timeType}
                    onChange={(value) => updateAdditional("timeType", value)}
                    options={["Full-Time", "Part-Time", "Contract"]}
                    placeholder="Select time type"
                  />
                  <DropdownField
                    label="Employee Category"
                    value={additional.employeeCategory}
                    onChange={(value) => updateAdditional("employeeCategory", value)}
                    options={["Teaching", "Non-Teaching", "Sub-Staff"]}
                    placeholder="Select category"
                    className="col-span-2"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4">
                <h4 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-white">
                  <UserRound size={14} className="text-[#3984ff]" />
                  Reporting Manager
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Manager Name"
                    name="reportingManagerName"
                    value={additional.reportingManagerName}
                    onChange={updateAdditional}
                    placeholder="Manager name"
                  />
                  <Field
                    label="Manager Designation"
                    name="reportingManagerDesignation"
                    value={additional.reportingManagerDesignation}
                    onChange={updateAdditional}
                    placeholder="HOD / Dean"
                  />
                  <Field
                    label="Manager Department"
                    name="reportingManagerDepartment"
                    value={additional.reportingManagerDepartment}
                    onChange={updateAdditional}
                    placeholder="Computer Science"
                    className="col-span-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          {/* Error / Success messages */}
          <div className="flex-1">
            {submitError && (
              <div className="flex items-center gap-2 rounded-md border border-[#f16868]/40 bg-[#631a1a] px-3 py-2 text-[12px] text-[#fca5a5]">
                <AlertCircle size={13} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 rounded-md border border-[#26d39a]/40 bg-[#0f7e59]/25 px-3 py-2 text-[12px] text-[#26d39a]">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {isSingleMode ? (
            /* Single section mode: Submit button only */
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-6 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          ) : (
            /* Full mode: Previous / Next or Save on last step */
            <>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isFirstStep || isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#244061] bg-[#0d2138] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4]"
                >
                  Next
                  <ArrowRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileEditDrawer;
