import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  GraduationCap,
  IdCard,
  Plus,
  Search,
  Send,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import CustomDatePicker from "../../../../components/CustomDatePicker";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const steps = [
  { title: "Personal", icon: UserRound },
  { title: "Employment", icon: BriefcaseBusiness },
  { title: "Education", icon: GraduationCap },
  { title: "Additional", icon: IdCard },
];

const salutations = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
const genders = ["Male", "Female", "Other"];
const workTypes = ["Permanent", "Temporary"];
const timeTypes = ["Full-Time", "Part-Time", "Contract"];
const employeeCategories = ["Teaching", "Non-Teaching", "Driver", "Housekeeping"];
const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Administration",
];

const emptyQualification = {
  degree: "",
  specialization: "",
  institutionName: "",
  institutionLocation: "",
  yearOfPassing: "",
  percentage: "",
  cgpa: "",
};

const emptyExperience = {
  organization: "",
  designation: "",
  fromDate: null,
  toDate: null,
  yearsOfExperience: "",
};

const initialForm = {
  empId: "",
  salutation: "",
  firstName: "",
  lastName: "",
  gender: "",
  dob: null,
  email: "",
  organizationEmail: "",
  phone: "",
  workType: "",
  timeType: "",
  employeeCategory: "",
  doj: null,
  probationPeriod: "",
  noticePeriod: "",
  designation: "",
  jobTitle: "",
  department: "",
  shiftId: "",
  reportingManager: null,
  doorNo: "",
  street: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  aadharNumber: "",
  panNumber: "",
  pfNumber: "",
  accountNumber: "",
  bankName: "",
  ifscCode: "",
  branchLocation: "",
};

const requiredByStep = {
  0: [
    ["empId", "Employee ID"],
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["gender", "Gender"],
    ["dob", "Date of Birth"],
    ["email", "Personal Email"],
    ["organizationEmail", "Organization Email"],
    ["phone", "Phone"],
  ],
  1: [
    ["workType", "Work Type"],
    ["timeType", "Time Type"],
    ["employeeCategory", "Employee Category"],
    ["doj", "Date of Joining"],
    ["designation", "Designation"],
    ["jobTitle", "Job Title"],
    ["department", "Department"],
    ["shiftId", "Shift"],
  ],
};

const toIsoDate = (date) => (date ? date.toISOString() : undefined);
const toNumber = (value) => (value === "" || value === null ? undefined : Number(value));
const isFilled = (value) => value !== "" && value !== null && value !== undefined;

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-[11px] text-[#f16868]">{message}</p> : null;

const Field = ({ label, name, value, onChange, error, required, className = "", ...props }) => (
  <label className={className}>
    <span className="mb-2 block text-[13px] font-semibold text-white">
      {label} {required && <span className="text-[#3984ff]">*</span>}
    </span>
    <input
      {...props}
      name={name}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      className={`h-11 w-full rounded-lg border bg-[#0d2138] px-3 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-[#244061]"
        }`}
    />
    <FieldError message={error} />
  </label>
);

const DropdownField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <span className="mb-2 block text-[13px] font-semibold text-white">
        {label} {required && <span className="text-[#3984ff]">*</span>}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-[#244061]"
          }`}
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder || `Select ${label.toLowerCase()}`}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
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
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[220px] overflow-y-auto rounded-lg border border-[#244061] bg-[#0a1a2d] py-1 shadow-[0_18px_45px_rgba(0,0,0,0.35)] table-custom-scrollbar">
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

const ObjectDropdownField = ({
  label,
  value,
  onChange,
  options,
  getOptionLabel,
  getOptionValue,
  placeholder,
  required,
  error,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => getOptionValue(option) === value);

  return (
    <div className="relative">
      <span className="mb-2 block text-[13px] font-semibold text-white">
        {label} {required && <span className="text-[#3984ff]">*</span>}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${
          error ? "border-[#f16868]" : "border-[#244061]"
        }`}
      >
        <span className={selectedOption ? "text-white" : "text-[#6f839f]"}>
          {isLoading
            ? "Loading..."
            : selectedOption
              ? getOptionLabel(selectedOption)
              : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
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
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[220px] overflow-y-auto rounded-lg border border-[#244061] bg-[#0a1a2d] py-1 shadow-[0_18px_45px_rgba(0,0,0,0.35)] table-custom-scrollbar">
            {options.length > 0 ? (
              options.map((option) => {
                const optionValue = getOptionValue(option);
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`block w-full px-4 py-3 text-left text-[13px] transition ${
                      value === optionValue
                        ? "bg-[#132b49] text-white"
                        : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                    }`}
                  >
                    {getOptionLabel(option)}
                  </button>
                );
              })
            ) : (
              <p className="px-4 py-3 text-[13px] text-[#8ca1bd]">
                {isLoading ? "Loading..." : "No options found."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FacultySearchDropdown = ({
  value,
  onChange,
  options,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((faculty) => {
    const name = `${faculty.firstName || ""} ${faculty.lastName || ""}`.trim();
    const searchable = `${name} ${faculty.empId || ""} ${faculty.designation || ""}`.toLowerCase();
    return searchable.includes(query.trim().toLowerCase());
  });
  const selectedName = value
    ? `${value.firstName || ""} ${value.lastName || ""}`.trim()
    : "";

  return (
    <div className="relative col-span-2">
      <span className="mb-2 block text-[13px] font-semibold text-white">
        Reporting Manager
      </span>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {isLoading
            ? "Loading employees..."
            : value
              ? `${selectedName} (${value.empId})`
              : "Search and select reporting manager"}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close reporting manager dropdown"
          />
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
            <div className="relative border-b border-[#183052] p-2">
              <Search
                size={15}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6f839f]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search employee..."
                className="h-10 w-full rounded-lg border border-[#244061] bg-[#0d2138] pl-9 pr-3 text-[13px] text-white outline-none placeholder:text-[#6f839f] focus:border-[#3984ff]"
              />
            </div>
            <div className="max-h-[240px] overflow-y-auto py-1 table-custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((faculty) => {
                  const name = `${faculty.firstName || ""} ${faculty.lastName || ""}`.trim();
                  return (
                    <button
                      key={faculty._id}
                      type="button"
                      onClick={() => {
                        onChange(faculty);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className={`block w-full px-4 py-3 text-left transition ${
                        value?._id === faculty._id
                          ? "bg-[#132b49] text-white"
                          : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                      }`}
                    >
                      <span className="block text-[13px] font-semibold">
                        {name || faculty.empId}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[#8ca1bd]">
                        {faculty.empId} {faculty.designation ? `- ${faculty.designation}` : ""}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="px-4 py-3 text-[13px] text-[#8ca1bd]">
                  {isLoading ? "Loading employees..." : "No employees found."}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DateField = ({ id, label, required, value, onChange, placeholder, popupAlign, error }) => (
  <div>
    <div className="mb-2 block text-[13px] font-semibold text-white">
      {label} {required && <span className="text-[#3984ff]">*</span>}
    </div>
    <div className={error ? "rounded-lg border border-[#f16868]" : ""}>
      <CustomDatePicker
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        popupAlign={popupAlign}
      />
    </div>
    <FieldError message={error} />
  </div>
);

const SectionTitle = ({ title, description }) => (
  <div className="mb-4">
    <h3 className="text-[15px] font-semibold text-white">{title}</h3>
    <p className="mt-1 text-[12px] leading-5 text-[#8ca1bd]">{description}</p>
  </div>
);

const AddFacultyForm = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [qualifications, setQualifications] = useState([{ ...emptyQualification }]);
  const [experiences, setExperiences] = useState([{ ...emptyExperience }]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);

  useEffect(() => {
    const fetchLookups = async () => {
      const token = localStorage.getItem("hrms_token");
      if (!token) {
        setSubmitError("Login token is missing. Please sign in again.");
        return;
      }

      setIsLoadingLookups(true);

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [shiftResponse, facultyResponse] = await Promise.all([
          fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/shifts`, { headers }),
          fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/faculties`, { headers }),
        ]);

        const shiftData = await shiftResponse.json().catch(() => null);
        const facultyData = await facultyResponse.json().catch(() => null);

        if (!shiftResponse.ok) {
          throw new Error(shiftData?.message || "Unable to load shifts.");
        }
        if (!facultyResponse.ok) {
          throw new Error(facultyData?.message || "Unable to load faculties.");
        }

        setShifts(Array.isArray(shiftData?.data) ? shiftData.data : []);
        setFaculties(Array.isArray(facultyData?.data) ? facultyData.data : []);
      } catch (error) {
        setSubmitError(error.message || "Unable to load form dropdown data.");
      } finally {
        setIsLoadingLookups(false);
      }
    };

    fetchLookups();
  }, []);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const updateQualification = (index, key, value) => {
    setQualifications((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
    setErrors((current) => ({ ...current, [`qualification-${index}-${key}`]: "" }));
  };

  const updateExperience = (index, key, value) => {
    setExperiences((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const validateStep = (step) => {
    const nextErrors = {};

    (requiredByStep[step] || []).forEach(([key, label]) => {
      if (!isFilled(form[key])) nextErrors[key] = `${label} is required.`;
    });

    if (step === 0) {
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        nextErrors.email = "Enter a valid personal email.";
      }
      if (
        form.organizationEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.organizationEmail)
      ) {
        nextErrors.organizationEmail = "Enter a valid organization email.";
      }
      if (form.phone && !/^\d{10}$/.test(form.phone)) {
        nextErrors.phone = "Enter a valid 10 digit phone number.";
      }
    }

    if (step === 2) {
      qualifications.forEach((qualification, index) => {
        const hasAnyValue = Object.values(qualification).some(isFilled);
        if (hasAnyValue && !qualification.degree) {
          nextErrors[`qualification-${index}-degree`] = "Degree is required.";
        }
        if (hasAnyValue && !qualification.institutionName) {
          nextErrors[`qualification-${index}-institutionName`] =
            "Institution name is required.";
        }
      });
    }

    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateAll = () => {
    const allErrors = {};

    [0, 1].forEach((step) => {
      (requiredByStep[step] || []).forEach(([key, label]) => {
        if (!isFilled(form[key])) allErrors[key] = `${label} is required.`;
      });
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      allErrors.email = "Enter a valid personal email.";
    }
    if (
      form.organizationEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.organizationEmail)
    ) {
      allErrors.organizationEmail = "Enter a valid organization email.";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      allErrors.phone = "Enter a valid 10 digit phone number.";
    }

    qualifications.forEach((qualification, index) => {
      const hasAnyValue = Object.values(qualification).some(isFilled);
      if (hasAnyValue && !qualification.degree) {
        allErrors[`qualification-${index}-degree`] = "Degree is required.";
      }
      if (hasAnyValue && !qualification.institutionName) {
        allErrors[`qualification-${index}-institutionName`] =
          "Institution name is required.";
      }
    });

    setErrors(allErrors);

    const firstErrorKey = Object.keys(allErrors)[0];
    if (firstErrorKey) {
      if (requiredByStep[0].some(([key]) => key === firstErrorKey)) setActiveStep(0);
      else if (requiredByStep[1].some(([key]) => key === firstErrorKey)) setActiveStep(1);
      else if (firstErrorKey.startsWith("qualification")) setActiveStep(2);
    }

    return Object.keys(allErrors).length === 0;
  };

  const buildPayload = () => ({
    empId: form.empId.trim(),
    salutation: form.salutation || undefined,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    gender: form.gender,
    dob: toIsoDate(form.dob),
    email: form.email.trim().toLowerCase(),
    organizationEmail: form.organizationEmail.trim().toLowerCase(),
    phone: form.phone.trim(),
    qualifications: qualifications
      .filter((qualification) => Object.values(qualification).some(isFilled))
      .map((qualification) => ({
        degree: qualification.degree.trim(),
        specialization: qualification.specialization.trim() || undefined,
        institutionName: qualification.institutionName.trim(),
        institutionLocation: qualification.institutionLocation.trim() || undefined,
        yearOfPassing: toNumber(qualification.yearOfPassing),
        percentage: toNumber(qualification.percentage),
        cgpa: toNumber(qualification.cgpa),
      })),
    experiences: experiences
      .filter((experience) => Object.values(experience).some(isFilled))
      .map((experience) => ({
        organization: experience.organization.trim() || undefined,
        designation: experience.designation.trim() || undefined,
        fromDate: toIsoDate(experience.fromDate),
        toDate: toIsoDate(experience.toDate),
        yearsOfExperience: toNumber(experience.yearsOfExperience),
      })),
    workType: form.workType,
    timeType: form.timeType,
    employeeCategory: form.employeeCategory,
    doj: toIsoDate(form.doj),
    probationPeriod: form.probationPeriod.trim() || undefined,
    noticePeriod: form.noticePeriod.trim() || undefined,
    designation: form.designation.trim(),
    jobTitle: form.jobTitle.trim(),
    department: form.department,
    reportingTo:
      form.reportingManager
        ? {
          facultyId: form.reportingManager._id,
          empId: form.reportingManager.empId,
          name: `${form.reportingManager.firstName || ""} ${form.reportingManager.lastName || ""}`.trim(),
        }
        : undefined,
    address: {
      doorNo: form.doorNo.trim() || undefined,
      street: form.street.trim() || undefined,
      city: form.city.trim() || undefined,
      district: form.district.trim() || undefined,
      state: form.state.trim() || undefined,
      pincode: form.pincode.trim() || undefined,
      country: form.country.trim() || "India",
    },
    emergencyContact:
      form.emergencyName || form.emergencyRelationship || form.emergencyPhone
        ? {
          name: form.emergencyName.trim() || undefined,
          relationship: form.emergencyRelationship.trim() || undefined,
          phone: form.emergencyPhone.trim() || undefined,
        }
        : undefined,
    identityDetails: {
      aadharNumber: form.aadharNumber.trim() || undefined,
      panNumber: form.panNumber.trim() || undefined,
      pfNumber: form.pfNumber.trim() || undefined,
    },
    bankDetails: {
      accountNumber: form.accountNumber.trim() || undefined,
      bankName: form.bankName.trim() || undefined,
      ifscCode: form.ifscCode.trim() || undefined,
      branchLocation: form.branchLocation.trim() || undefined,
    },
    shiftId: form.shiftId.trim(),
  });

  const handleNext = () => {
    setSubmitError("");
    if (validateStep(activeStep)) {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!validateAll()) {
      setSubmitError("Please fix the highlighted fields before submitting.");
      return;
    }

    const token = localStorage.getItem("hrms_token");
    if (!token) {
      setSubmitError("Login token is missing. Please sign in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/faculties/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildPayload()),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to create faculty.");
      }

      setSuccessMessage("Faculty created successfully.");
      setTimeout(onClose, 700);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong while creating faculty.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/60 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <form
        className="flex h-full w-[32%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Faculty Setup
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Add Faculty
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close add faculty form"
          >
            <X size={17} />
          </button>
        </div>

        <div className="border-b border-[#173150] bg-[#08182a] px-5 py-2">
          <div className="flex items-start">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isCompleted = activeStep > index;

              return (
                <div key={step.title} className="flex flex-1 items-start">
                  <button
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className="group flex min-w-[86px] flex-col items-center text-center"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${isCompleted
                        ? "border-[#24c784] bg-[#24c784] text-white"
                        : isActive
                          ? "border-[#4f63ff] bg-[#1d2b6d] text-white shadow-[0_0_0_4px_rgba(79,99,255,0.16)]"
                          : "border-[#627089] bg-[#0d2138] text-[#9eb0cc] group-hover:border-[#3984ff]"
                        }`}
                    >
                      {isCompleted ? <Check size={15} /> : <Icon size={14} />}
                    </span>
                    <span
                      className={`mt-1 text-[11px] font-semibold ${isActive ? "text-white" : "text-[#9eb0cc]"
                        }`}
                    >
                      {step.title}
                    </span>
                  </button>

                  {index < steps.length - 1 && (
                    <span
                      className={`mt-4 h-[2px] flex-1 rounded-full ${activeStep > index
                        ? "bg-[#24c784]"
                        : activeStep === index
                          ? "bg-[#4f63ff]"
                          : "bg-[#2b3b55]"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {(submitError || successMessage) && (
          <div className="border-b border-[#173150] bg-[#08182a] px-5 py-3">
            <p
              className={`rounded-lg px-3 py-2 text-[12px] font-semibold ${successMessage
                ? "bg-[#18d3bf1f] text-[#18d3bf]"
                : "bg-[#f168681f] text-[#f16868]"
                }`}
            >
              {successMessage || submitError}
            </p>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 table-custom-scrollbar">
          {activeStep === 0 && (
            <>
              <SectionTitle
                title="Personal Details"
                description="Capture the faculty member's core identity and contact information."
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Employee ID"
                  name="empId"
                  required
                  value={form.empId}
                  onChange={updateForm}
                  error={errors.empId}
                  placeholder="EMP001"
                />
                <DropdownField
                  label="Salutation"
                  value={form.salutation}
                  onChange={(value) => updateForm("salutation", value)}
                  options={salutations}
                />
                <Field
                  label="First Name"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={updateForm}
                  error={errors.firstName}
                  placeholder="First name"
                />
                <Field
                  label="Last Name"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={updateForm}
                  error={errors.lastName}
                  placeholder="Last name"
                />
                <DropdownField
                  label="Gender"
                  required
                  value={form.gender}
                  onChange={(value) => updateForm("gender", value)}
                  options={genders}
                  error={errors.gender}
                />
                <DateField
                  id="faculty-dob"
                  label="Date of Birth"
                  required
                  value={form.dob}
                  onChange={(date) => updateForm("dob", date)}
                  error={errors.dob}
                  placeholder="Select date of birth"
                  popupAlign="right"
                />
                <Field
                  label="Personal Email"
                  name="email"
                  required
                  type="email"
                  value={form.email}
                  onChange={updateForm}
                  error={errors.email}
                  placeholder="name@example.com"
                />
                <Field
                  label="Organization Email"
                  name="organizationEmail"
                  required
                  type="email"
                  value={form.organizationEmail}
                  onChange={updateForm}
                  error={errors.organizationEmail}
                  placeholder="name@sece.ac.in"
                />
                <Field
                  label="Phone"
                  name="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={updateForm}
                  error={errors.phone}
                  placeholder="9876543210"
                  className="col-span-2"
                />
              </div>
            </>
          )}

          {activeStep === 1 && (
            <>
              <SectionTitle
                title="Employment Details"
                description="Set job classification, department, reporting manager, and shift details."
              />
              <div className="grid grid-cols-2 gap-4">
                <DropdownField
                  label="Work Type"
                  required
                  value={form.workType}
                  onChange={(value) => updateForm("workType", value)}
                  options={workTypes}
                  error={errors.workType}
                />
                <DropdownField
                  label="Time Type"
                  required
                  value={form.timeType}
                  onChange={(value) => updateForm("timeType", value)}
                  options={timeTypes}
                  error={errors.timeType}
                />
                <DropdownField
                  label="Employee Category"
                  required
                  value={form.employeeCategory}
                  onChange={(value) => updateForm("employeeCategory", value)}
                  options={employeeCategories}
                  error={errors.employeeCategory}
                />
                <DateField
                  id="faculty-doj"
                  label="Date of Joining"
                  required
                  value={form.doj}
                  onChange={(date) => updateForm("doj", date)}
                  error={errors.doj}
                  placeholder="Select joining date"
                  popupAlign="right"
                />
                <Field
                  label="Probation Period"
                  name="probationPeriod"
                  value={form.probationPeriod}
                  onChange={updateForm}
                  placeholder="6 months"
                />
                <Field
                  label="Notice Period"
                  name="noticePeriod"
                  value={form.noticePeriod}
                  onChange={updateForm}
                  placeholder="30 days"
                />
                <Field
                  label="Designation"
                  name="designation"
                  required
                  value={form.designation}
                  onChange={updateForm}
                  error={errors.designation}
                  placeholder="Assistant Professor"
                />
                <Field
                  label="Job Title"
                  name="jobTitle"
                  required
                  value={form.jobTitle}
                  onChange={updateForm}
                  error={errors.jobTitle}
                  placeholder="Faculty"
                />
                <DropdownField
                  label="Department"
                  required
                  value={form.department}
                  onChange={(value) => updateForm("department", value)}
                  options={departments}
                  error={errors.department}
                />
                <ObjectDropdownField
                  label="Shift"
                  required
                  value={form.shiftId}
                  onChange={(shift) => updateForm("shiftId", shift._id)}
                  options={shifts}
                  getOptionLabel={(shift) =>
                    `${shift.shiftName} (${shift.startTime} - ${shift.endTime})`
                  }
                  getOptionValue={(shift) => shift._id}
                  placeholder="Select shift"
                  error={errors.shiftId}
                  isLoading={isLoadingLookups}
                />
                <FacultySearchDropdown
                  value={form.reportingManager}
                  onChange={(faculty) => updateForm("reportingManager", faculty)}
                  options={faculties}
                  isLoading={isLoadingLookups}
                />
              </div>
            </>
          )}

          {activeStep === 2 && (
            <div className="space-y-5">
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <SectionTitle
                    title="Educational Details"
                    description="Add qualifications listed in the faculty profile."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQualifications((current) => [...current, { ...emptyQualification }])
                    }
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[12px] font-semibold text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {qualifications.map((qualification, index) => (
                    <div
                      key={`qualification-${index + 1}`}
                      className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-[13px] font-semibold text-white">
                          Qualification {index + 1}
                        </h4>
                        {qualifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setQualifications((current) =>
                                current.filter((_, itemIndex) => itemIndex !== index),
                              )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
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
                          required
                          value={qualification.degree}
                          onChange={(_, value) => updateQualification(index, "degree", value)}
                          error={errors[`qualification-${index}-degree`]}
                          placeholder="M.E / Ph.D"
                        />
                        <Field
                          label="Specialization"
                          name="specialization"
                          value={qualification.specialization}
                          onChange={(_, value) =>
                            updateQualification(index, "specialization", value)
                          }
                          placeholder="Computer Science"
                        />
                        <Field
                          label="Institution Name"
                          name="institutionName"
                          required
                          value={qualification.institutionName}
                          onChange={(_, value) =>
                            updateQualification(index, "institutionName", value)
                          }
                          error={errors[`qualification-${index}-institutionName`]}
                          placeholder="Institution name"
                        />
                        <Field
                          label="Institution Location"
                          name="institutionLocation"
                          value={qualification.institutionLocation}
                          onChange={(_, value) =>
                            updateQualification(index, "institutionLocation", value)
                          }
                          placeholder="City"
                        />
                        <Field
                          label="Year of Passing"
                          name="yearOfPassing"
                          type="number"
                          value={qualification.yearOfPassing}
                          onChange={(_, value) =>
                            updateQualification(index, "yearOfPassing", value)
                          }
                          placeholder="2024"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Percentage"
                            name="percentage"
                            type="number"
                            value={qualification.percentage}
                            onChange={(_, value) =>
                              updateQualification(index, "percentage", value)
                            }
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

              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <SectionTitle
                    title="Experience Details"
                    description="Add previous organization and designation history."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExperiences((current) => [...current, { ...emptyExperience }])
                    }
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[12px] font-semibold text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {experiences.map((experience, index) => (
                    <div
                      key={`experience-${index + 1}`}
                      className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-[13px] font-semibold text-white">
                          Experience {index + 1}
                        </h4>
                        {experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExperiences((current) =>
                                current.filter((_, itemIndex) => itemIndex !== index),
                              )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                            aria-label={`Remove experience ${index + 1}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field
                          label="Organization"
                          name="organization"
                          value={experience.organization}
                          onChange={(_, value) =>
                            updateExperience(index, "organization", value)
                          }
                          placeholder="Organization name"
                        />
                        <Field
                          label="Designation"
                          name="designation"
                          value={experience.designation}
                          onChange={(_, value) =>
                            updateExperience(index, "designation", value)
                          }
                          placeholder="Previous designation"
                        />
                        <DateField
                          id={`experience-from-date-${index}`}
                          label="From Date"
                          value={experience.fromDate}
                          onChange={(date) => updateExperience(index, "fromDate", date)}
                          placeholder="From date"
                        />
                        <DateField
                          id={`experience-to-date-${index}`}
                          label="To Date"
                          value={experience.toDate}
                          onChange={(date) => updateExperience(index, "toDate", date)}
                          placeholder="To date"
                          popupAlign="right"
                        />
                        <Field
                          label="Years of Experience"
                          name="yearsOfExperience"
                          type="number"
                          value={experience.yearsOfExperience}
                          onChange={(_, value) =>
                            updateExperience(index, "yearsOfExperience", value)
                          }
                          placeholder="3"
                          className="col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-5">
              <div>
                <SectionTitle
                  title="Address"
                  description="Permanent or current address details."
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Door No" name="doorNo" value={form.doorNo} onChange={updateForm} placeholder="12A" />
                  <Field label="Street" name="street" value={form.street} onChange={updateForm} placeholder="Main Road" />
                  <Field label="City" name="city" value={form.city} onChange={updateForm} placeholder="Coimbatore" />
                  <Field label="District" name="district" value={form.district} onChange={updateForm} placeholder="Coimbatore" />
                  <Field label="State" name="state" value={form.state} onChange={updateForm} placeholder="Tamil Nadu" />
                  <Field label="Pincode" name="pincode" value={form.pincode} onChange={updateForm} placeholder="641001" />
                  <Field label="Country" name="country" value={form.country} onChange={updateForm} placeholder="India" className="col-span-2" />
                </div>
              </div>

              <div>
                <SectionTitle
                  title="Emergency Contact"
                  description="Contact person for urgent communication."
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Contact Name" name="emergencyName" value={form.emergencyName} onChange={updateForm} placeholder="Name" />
                  <Field label="Relationship" name="emergencyRelationship" value={form.emergencyRelationship} onChange={updateForm} placeholder="Father / Spouse" />
                  <Field label="Emergency Phone" name="emergencyPhone" value={form.emergencyPhone} onChange={updateForm} placeholder="9876543210" className="col-span-2" />
                </div>
              </div>

              <div>
                <SectionTitle
                  title="Identity Details"
                  description="Government and employment identity references."
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Aadhar Number" name="aadharNumber" value={form.aadharNumber} onChange={updateForm} placeholder="0000 0000 0000" />
                  <Field label="PAN Number" name="panNumber" value={form.panNumber} onChange={updateForm} placeholder="ABCDE1234F" />
                  <Field label="PF Number" name="pfNumber" value={form.pfNumber} onChange={updateForm} placeholder="PF number" className="col-span-2" />
                </div>
              </div>

              <div>
                <SectionTitle
                  title="Bank Details"
                  description="Salary account information."
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Account Number" name="accountNumber" value={form.accountNumber} onChange={updateForm} placeholder="Account number" />
                  <Field label="Bank Name" name="bankName" value={form.bankName} onChange={updateForm} placeholder="Bank name" />
                  <Field label="IFSC Code" name="ifscCode" value={form.ifscCode} onChange={updateForm} placeholder="IFSC0001234" />
                  <Field label="Branch Location" name="branchLocation" value={form.branchLocation} onChange={updateForm} placeholder="Branch location" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={() => setActiveStep((current) => Math.max(current - 1, 0))}
            disabled={activeStep === 0 || isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#244061] bg-[#0d2138] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowLeft size={14} />
            Previous
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Faculty"}
              <Send size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AddFacultyForm;
