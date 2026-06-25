import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomMultiSelectDropdown({
  id,
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select Options",
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
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

  const handleSelect = (option) => {
    const isSelected = selectedValues.includes(option);

    if (isSelected) {
      onChange(
        selectedValues.filter(
          (item) => item !== option
        )
      );
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-white mb-2">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-3 rounded-lg border bg-[#0D2138] flex items-center justify-between cursor-pointer
          ${
            error
              ? "border-red-500"
              : "border-blue-900"
          }`}
      >
        <span
          className={
            selectedValues.length
              ? "text-white truncate"
              : "text-[#6f839f]"
          }
        >
          {selectedValues.length
            ? selectedValues.join(", ")
            : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-[#3984ff] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[9999] mt-2 w-full rounded-lg border border-[#244061] bg-[#0A1A2D] overflow-hidden shadow-lg">
          {options.map((option) => {
            const selected =
              selectedValues.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  handleSelect(option)
                }
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition cursor-pointer
                  ${
                    selected
                      ? "bg-[#2563EB]/20 text-white"
                      : "text-[#cad7eb] hover:bg-[#132b49]"
                  }`}
              >
                <span>{option}</span>

                {selected && (
                  <Check
                    size={18}
                    className="text-[#60A5FA]"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}