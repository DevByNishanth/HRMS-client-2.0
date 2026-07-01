import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
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
import userImg from "../../../../assets/userImg.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const steps = [
  {
    title: "Personal Identity",
    shortTitle: "Personal",
    description: "Capture the faculty member's core identity and contact information.",
    icon: UserRound,
  },
  {
    title: "Employment Details",
    shortTitle: "Employment",
    description: "Set job classification, department, reporting manager, and shift details.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Educational Details",
    shortTitle: "Education",
    description: "Add qualifications listed in the faculty profile.",
    icon: GraduationCap,
  },
  {
    title: "Experience Details",
    shortTitle: "Experience",
    description: "Add previous organization and designation history.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Additional Details",
    shortTitle: "Additional",
    description: "Complete address, emergency contact, identity, and bank details.",
    icon: IdCard,
  },
];

const salutations = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
const genders = ["Male", "Female", "Other"];
const workTypes = ["Permanent", "Temporary"];
const timeTypes = ["Full-Time", "Part-Time", "Contract"];
const employeeCategories = [
  { label: "Teaching", value: "Teaching" },
  { label: "Non-Teaching", value: "Non-Teaching" },
  {
    label: "Sub-Staff",
    value: "Sub-Staff",
    submenu: [
      { label: "Driver", value: "Driver" },
      { label: "Housekeeping", value: "Housekeeping" },
    ],
  },
];
const departments = [
  "English",
  "Chemistry",
  "Mech",
  "IR",
  "IT",
  "AI & DS",
  "PHYSICS",
  "MATHS",
  "EEE",
  "ECE",
  "CYS",
  "CSE",
  "CSBS",
  "CCE",
  "AIML",
  "S&H",
  "CFRD",
  "QPT",
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
  originalDepartment: "",
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

const toDateValue = (value) => (value ? new Date(value) : null);
const toInputValue = (value) =>
  value === null || value === undefined ? "" : String(value);

const mapFacultyToForm = (faculty = {}) => ({
  empId: faculty.empId || "",
  salutation: faculty.salutation || "",
  firstName: faculty.firstName || "",
  lastName: faculty.lastName || "",
  gender: faculty.gender || "",
  dob: toDateValue(faculty.dob),
  email: faculty.email || "",
  organizationEmail: faculty.organizationEmail || "",
  phone: faculty.phone || "",
  workType: faculty.workType || "",
  timeType: faculty.timeType || "",
  employeeCategory: faculty.employeeCategory || "",
  doj: toDateValue(faculty.doj),
  probationPeriod: faculty.probationPeriod || "",
  noticePeriod: faculty.noticePeriod || "",
  designation: faculty.designation || "",
  jobTitle: faculty.jobTitle || "",
  department: faculty.department || "",
  originalDepartment: faculty.originalDepartment || "",
  punchId: faculty.punchId || "",
  shiftId:
    typeof faculty.shiftId === "object"
      ? faculty.shiftId?._id || ""
      : faculty.shiftId || "",
  reportingManager: faculty.reportingTo?.facultyId
    ? {
      _id: faculty.reportingTo.facultyId,
      empId: faculty.reportingTo.empId,
      firstName: faculty.reportingTo.name || "",
      lastName: "",
    }
    : null,
  doorNo: faculty.address?.doorNo || "",
  street: faculty.address?.street || "",
  city: faculty.address?.city || "",
  district: faculty.address?.district || "",
  state: faculty.address?.state || "",
  pincode: faculty.address?.pincode || "",
  country: faculty.address?.country || "India",
  emergencyName: faculty.emergencyContact?.name || "",
  emergencyRelationship: faculty.emergencyContact?.relationship || "",
  emergencyPhone: faculty.emergencyContact?.phone || "",
  aadharNumber: faculty.identityDetails?.aadharNumber || "",
  panNumber: faculty.identityDetails?.panNumber || "",
  pfNumber: faculty.identityDetails?.pfNumber || "",
  accountNumber: faculty.bankDetails?.accountNumber || "",
  bankName: faculty.bankDetails?.bankName || "",
  ifscCode: faculty.bankDetails?.ifscCode || "",
  branchLocation: faculty.bankDetails?.branchLocation || "",
});

const mapQualifications = (qualifications = []) =>
  qualifications.length
    ? qualifications.map((qualification) => ({
      degree: qualification.degree || "",
      specialization: qualification.specialization || "",
      institutionName: qualification.institutionName || "",
      institutionLocation: qualification.institutionLocation || "",
      yearOfPassing: toInputValue(qualification.yearOfPassing),
      percentage: toInputValue(qualification.percentage),
      cgpa: toInputValue(qualification.cgpa),
    }))
    : [{ ...emptyQualification }];

const mapExperiences = (experiences = []) =>
  experiences.length
    ? experiences.map((experience) => ({
      organization: experience.organization || "",
      designation: experience.designation || "",
      fromDate: toDateValue(experience.fromDate),
      toDate: toDateValue(experience.toDate),
      yearsOfExperience: toInputValue(experience.yearsOfExperience),
    }))
    : [{ ...emptyExperience }];

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
    ["department", "Department"],
    ["originalDepartment", "Original Department"],
    // ["punchId", "Punch ID"],
    ["shiftId", "Shift"],
  ],
};

const toIsoDate = (date) => (date ? date.toISOString() : undefined);
const toNumber = (value) => (value === "" || value === null ? undefined : Number(value));
const isFilled = (value) => value !== "" && value !== null && value !== undefined;
const getFacultyList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.faculties)) return payload.faculties;
  if (Array.isArray(payload?.data?.faculties)) return payload.data.faculties;
  if (Array.isArray(payload?.facultyDetails)) return payload.facultyDetails;
  if (Array.isArray(payload?.data?.facultyDetails)) return payload.data.facultyDetails;
  if (Array.isArray(payload?.employees)) return payload.employees;
  if (Array.isArray(payload?.data?.employees)) return payload.data.employees;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.data?.docs)) return payload.data.docs;
  return [];
};

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
  onOpenChange = () => { },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [positionAbove, setPositionAbove] = useState(false);
  const [expandedOption, setExpandedOption] = useState(null);
  const [submenuPosition, setSubmenuPosition] = useState(null);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const updateOpenState = (nextState) => {
    setIsOpen(nextState);
    if (!nextState) {
      setExpandedOption(null);
      setSubmenuPosition(null);
    }
    onOpenChange(nextState);
  };

  // Get display value
  const getDisplayValue = () => {
    if (typeof value === "string") {
      // Check if it's a nested value
      for (let option of options) {
        if (option.submenu) {
          const found = option.submenu.find((sub) => sub.value === value);
          if (found) return found.label;
        }
        if (option.value === value) return option.label;
      }
      return value;
    }
    return value;
  };

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const viewport = window.innerHeight;
    const spaceBelow = viewport - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = Math.min(options.length * 44 + 8, 220);

    // Position above if not enough space below
    setPositionAbove(
      spaceBelow < dropdownHeight + 16 && spaceAbove > dropdownHeight + 16,
    );
  }, [isOpen, options.length]);

  const expandedOptionData = options.find((o) => (o.value || o) === expandedOption);

  return (
    <div className="relative" ref={wrapperRef}>
      <span className="mb-2 block text-[13px] font-semibold text-white ">
        {label} {required && <span className="text-[#3984ff]">*</span>}
      </span>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => updateOpenState(!isOpen)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-[#244061]"
          }`}
      >
        <span className={getDisplayValue() ? "text-white" : "text-[#6f839f]"}>
          {getDisplayValue() || placeholder || `Select ${label.toLowerCase()}`}
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
            onClick={() => updateOpenState(false)}
            aria-label="Close dropdown"
          />

          <div
            className={`absolute left-0 right-0 z-40 max-h-[220px]  overflow-y-auto rounded-lg border border-[#244061] bg-[#0a1a2d] py-1 shadow-[0_18px_45px_rgba(0,0,0,0.35)] table-custom-scrollbar ${positionAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
              }`}
          >
            {options.map((option) => {
              const displayLabel = option.label || option;
              const displayValue = option.value || option;
              const hasSubmenu = option.submenu && option.submenu.length > 0;
              const isExpanded = expandedOption === displayValue;
              const isNestedSelected =
                hasSubmenu &&
                option.submenu.some((subOption) => subOption.value === value);

              return (
                <div key={displayValue}>
                  <button
                    type="button"
                    onClick={(e) => {
                      if (hasSubmenu) {
                        setExpandedOption((current) => (
                          current === displayValue ? null : displayValue
                        ));

                        if (expandedOption !== displayValue) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setSubmenuPosition({
                            top: rect.top,
                            left: rect.right,
                            width: Math.max(220, rect.width),
                          });
                        } else {
                          setSubmenuPosition(null);
                        }
                        return;
                      }

                      onChange(displayValue);
                      updateOpenState(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3 text-left text-[13px] transition ${value === displayValue || isNestedSelected
                      ? "bg-[#132b49] text-white"
                      : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                      } ${hasSubmenu ? "cursor-pointer" : ""}`}
                    aria-expanded={hasSubmenu ? isExpanded : undefined}
                  >
                    <span>{displayLabel}</span>
                    {hasSubmenu && (
                      <ChevronDown
                        size={14}
                        className={`transition ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {expandedOptionData?.submenu?.length > 0 && expandedOption && submenuPosition && (
            <div
              style={{
                position: "fixed",
                top: submenuPosition.top,
                left: submenuPosition.left,
                width: submenuPosition.width,
              }}
              className="z-[60] rounded-lg border border-[#244061] bg-[#071425] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
            >
              {expandedOptionData.submenu.map((subOption) => (
                <button
                  key={subOption.value}
                  type="button"
                  onClick={() => {
                    onChange(subOption.value);
                    updateOpenState(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-[13px] transition ${value === subOption.value
                    ? "bg-[#132b49] text-white"
                    : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                    }`}
                >
                  {subOption.label}
                </button>
              ))}
            </div>
          )}
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
  onOpenChange = () => { },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [positionAbove, setPositionAbove] = useState(false);
  const buttonRef = useRef(null);
  const selectedOption = options.find((option) => getOptionValue(option) === value);

  const updateOpenState = (nextState) => {
    setIsOpen(nextState);
    onOpenChange(nextState);
  };

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const viewport = window.innerHeight;
    const spaceBelow = viewport - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = Math.min(options.length * 44 + 8, 248);

    // Position above if not enough space below
    setPositionAbove(spaceBelow < dropdownHeight + 16 && spaceAbove > dropdownHeight + 16);
  }, [isOpen, options.length]);

  return (
    <div className="relative">
      <span className="mb-2 block text-[13px] font-semibold text-white">
        {label} {required && <span className="text-[#3984ff]">*</span>}
      </span>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => updateOpenState(!isOpen)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-[#0d2138] px-3 text-left text-[13px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33] ${error ? "border-[#f16868]" : "border-[#244061]"
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
            onClick={() => updateOpenState(false)}
            aria-label="Close dropdown"
          />
          <div className={`absolute left-0 right-0 z-40 max-h-[220px] overflow-y-auto rounded-lg border border-[#244061] bg-[#0a1a2d] py-1 shadow-[0_18px_45px_rgba(0,0,0,0.35)] table-custom-scrollbar ${positionAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
            }`}>
            {options.length > 0 ? (
              options.map((option) => {
                const optionValue = getOptionValue(option);
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      updateOpenState(false);
                    }}
                    className={`block w-full px-4 py-3 text-left text-[13px] transition ${value === optionValue
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
  popupAlign = "down",
  onOpenChange = () => { },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [positionAbove, setPositionAbove] = useState(false);
  const buttonRef = useRef(null);

  const facultyOptions = Array.isArray(options) ? options : [];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = facultyOptions.filter((faculty) => {
    const name = `${faculty.firstName || ""} ${faculty.lastName || ""}`.trim();
    const searchable = `${name} ${faculty.empId || ""} ${faculty.designation || ""}`.toLowerCase();
    return searchable.includes(normalizedQuery);
  });
  const filteredOptionCount = filteredOptions.length;

  const updateOpenState = (nextState) => {
    setIsOpen(nextState);
    onOpenChange(nextState && popupAlign !== "up");
  };

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const viewport = window.innerHeight;
    const spaceBelow = viewport - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = Math.min(filteredOptionCount * 60 + 52, 300);

    // Position above if not enough space below
    setPositionAbove(spaceBelow < dropdownHeight + 16 && spaceAbove > dropdownHeight + 16);
  }, [isOpen, filteredOptionCount]);

  const selectedName = value
    ? `${value.firstName || ""} ${value.lastName || ""}`.trim()
    : "";

  return (
    <div className="relative col-span-2 mb-2">
      <span className="mb-2 block text-[13px] font-semibold text-white">
        Reporting Manager
      </span>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => updateOpenState(!isOpen)}
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
            onClick={() => updateOpenState(false)}
            aria-label="Close reporting manager dropdown"
          />
          <div
            className={`absolute left-0 right-0 z-40 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${positionAbove
              ? "bottom-[calc(100%+8px)]"
              : "top-[calc(100%+8px)]"
              }`}
          >
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
            <div className="max-h-60 overflow-y-auto py-1 table-custom-scrollbar ">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((faculty) => {
                  const name = `${faculty.firstName || ""} ${faculty.lastName || ""}`.trim();
                  return (
                    <button
                      key={faculty._id}
                      type="button"
                      onClick={() => {
                        onChange(faculty);
                        updateOpenState(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${value?._id === faculty._id
                        ? "bg-[#132b49] text-white"
                        : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
                        }`}
                    >
                      <img
                        src={userImg}
                        alt={name}
                        className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">
                          {name || faculty.empId}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-[#8ca1bd]">
                          {faculty.empId} {faculty.designation ? `- ${faculty.designation}` : ""}
                        </span>
                      </div>
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

const AddFacultyForm = ({
  onClose,
  onCreated = () => { },
  onSaved,
  initialFaculty = null,
  mode = "create",
}) => {
  const isEditMode = mode === "edit";
  const facultyId = initialFaculty?._id;
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(() =>
    initialFaculty ? mapFacultyToForm(initialFaculty) : initialForm,
  );
  const [qualifications, setQualifications] = useState(() =>
    mapQualifications(initialFaculty?.qualifications),
  );
  const [experiences, setExperiences] = useState(() =>
    mapExperiences(initialFaculty?.experiences),
  );
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);

  useEffect(() => {
    if (!initialFaculty) return;

    const timerId = window.setTimeout(() => {
      setForm(mapFacultyToForm(initialFaculty));
      setQualifications(mapQualifications(initialFaculty.qualifications));
      setExperiences(mapExperiences(initialFaculty.experiences));
      setActiveStep(0);
      setErrors({});
      setSubmitError("");
      setSuccessMessage("");
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [initialFaculty]);

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
        const facultyList = getFacultyList(facultyData);

        if (!shiftResponse.ok) {
          throw new Error(shiftData?.message || "Unable to load shifts.");
        }
        if (!facultyResponse.ok) {
          throw new Error(facultyData?.message || "Unable to load faculties.");
        }

        setShifts(Array.isArray(shiftData?.data) ? shiftData.data : []);
        setFaculties(facultyList);
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
    originalDepartment: form.originalDepartment,
    punchId: form.punchId.trim() || undefined,
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
    event?.preventDefault();
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
      if (isEditMode && !facultyId) {
        throw new Error("Faculty ID is missing. Please reopen this form and try again.");
      }

      const endpoint = isEditMode
        ? `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/${facultyId}`
        : `${API_BASE_URL.replace(/\/$/, "")}/api/faculties/`;
      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildPayload()),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          `Unable to ${isEditMode ? "update" : "create"} faculty.`,
        );
      }

      setSuccessMessage(`Faculty ${isEditMode ? "updated" : "created"} successfully.`);
      const savedFaculty = data?.data || data;
      if (isEditMode) {
        onSaved?.(savedFaculty);
      } else {
        onCreated(savedFaculty);
      }
      setTimeout(onClose, 700);
    } catch (error) {
      setSubmitError(
        error.message ||
        `Something went wrong while ${isEditMode ? "updating" : "creating"} faculty.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <form
        className="flex h-full w-[60%] xl:w-[42%] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="border-b border-[#173150] bg-[#08182a] px-5 py-4">
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
              <div className="mt-5 flex w-[155px] items-center gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step.shortTitle}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`h-1.5 flex-1 rounded-full transition ${index <= activeStep
                      ? "bg-[#3984ff]"
                      : "bg-[#354158] hover:bg-[#596782]"
                      }`}
                    aria-label={`Go to ${step.title}`}
                    title={step.title}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                aria-label={`Close ${isEditMode ? "edit" : "add"} faculty form`}
              >
                <X size={17} />
              </button>
            </div>
          </div>
        </div>

        {(submitError || successMessage) && (
          <div className=" px-4 py-3">
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

        <div
          className={`min-h-0 flex-1 overflow-y-auto px-5 pt-4 table-custom-scrollbar ${activeStep === 1 ? "pb-24" : "pb-4"
            }`}
        >
          {activeStep === 0 && (
            <>
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
              <FacultySearchDropdown
                value={form.reportingManager}
                onChange={(faculty) => updateForm("reportingManager", faculty)}
                options={faculties}
                isLoading={isLoadingLookups}
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
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
                {/* <Field
                  label="Job Title"
                  name="jobTitle"
                  required
                  value={form.jobTitle}
                  onChange={updateForm}
                  error={errors.jobTitle}
                  placeholder="Faculty"
                /> */}

                <DropdownField
                  label="Department"
                  required
                  value={form.department}
                  onChange={(value) => updateForm("department", value)}
                  options={departments}
                  error={errors.department}
                />
                <DropdownField
                  label="Original Department"
                  // required
                  value={form.originalDepartment}
                  onChange={(value) => updateForm("originalDepartment", value)}
                  options={departments}
                  error={errors.originalDepartment}
                />
                {/* <DropdownField
                  label="Punch ID"
                  required
                  value={form.punchId}
                  onChange={(value) => updateForm("punchId", value)}
                  // options={departments}
                  error={errors.punchId}
                /> */}
                <Field
                  label="Punch ID"
                  name="punchId"
                  // required
                  value={form.punchId}
                  onChange={updateForm}
                  error={errors.punchId}
                  placeholder="2020"
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
              </div>
            </>
          )}

          {activeStep === 2 && (
            <div>
              <div>
                <div className="mb-4 flex items-center justify-end">
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
                        {/* <Field
                          label="Institution Location"
                          name="institutionLocation"
                          value={qualification.institutionLocation}
                          onChange={(_, value) =>
                            updateQualification(index, "institutionLocation", value)
                          }
                          placeholder="City"
                        /> */}
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
                          {/* <Field
                            label="CGPA"
                            name="cgpa"
                            type="number"
                            value={qualification.cgpa}
                            onChange={(_, value) => updateQualification(index, "cgpa", value)}
                            placeholder="8.5"
                          /> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <div>
                <div className="mb-4 flex items-center justify-end">
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
                          label="Organization / Institution"
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

          {activeStep === 4 && (
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
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Faculty"
                  : "Create Faculty"}
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
