import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({
  id,
  label,
  value,
  options = [],
  placeholder = "Select Option",
  onChange,
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[var(--theme-text-main)] mb-2"
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-3 rounded-lg border bg-[var(--theme-bg-input)] flex items-center justify-between text-left cursor-pointer
          ${
            error
              ? "border-red-500"
              : "border-[var(--theme-border-input)]"
          }`}
      >
        <span
          className={
            value ? "text-[var(--theme-text-main)]" : "text-[var(--theme-text-muted)]"
          }
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-[#3984ff] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[9999] mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-card)] shadow-lg table-custom-scrollbar">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left transition
                ${
                  value === option
                    ? "bg-[#2563EB] text-white"
                    : "text-[var(--theme-text-main)] hover:bg-[var(--theme-bg-hover)]"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomDropdown;