import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createHoliday } from "../../../../services/holiday/addHolidayService";
import { updateHoliday } from "../../../../services/holiday/updateHolidayService";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import CustomDropdown from "../../../../components/CustomDropdown";
import CustomMultiSelectDropdown from "../../../../components/CustomMultiSelectDropdown";

const ErrorMsg = ({ msg }) =>
    msg ? <p className="text-red-400 text-sm mt-1">{msg}</p> : null;

export default function AddHoliday({
    onClose,
    holidayData,
    refreshHolidays,
    }) {
    const isEdit = !!holidayData;

    const [formData, setFormData] = useState({
        holidayName: "",
        holidayDate: "",
        applicableEmployeeCategories: [],
        holidayType: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (holidayData) {
        setFormData({
            holidayName: holidayData.holidayName || "",
            holidayDate: holidayData.holidayDate
            ? holidayData.holidayDate.split("T")[0]
            : "",
            applicableEmployeeCategories:
            holidayData.applicableEmployeeCategories || [],
            holidayType: holidayData.holidayType || "",
            description: holidayData.description || "",
        });
        }
    }, [holidayData]);

    const employeeCategories = [
        "Teaching",
        "Non-Teaching",
        "Housekeeping",
        "Driver",
    ];

    const holidayTypes = [
        "Local",
        "Government",
        "College",
    ];

    const parseLocalDate = (dateString) => {
        if (!dateString) return null;

        const [year, month, day] = dateString.split("-").map(Number);

        return new Date(year, month - 1, day);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));

        setErrors((prev) => ({
        ...prev,
        [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.holidayName.trim())
        newErrors.holidayName = "Holiday Name is required";

        if (!formData.holidayDate)
        newErrors.holidayDate = "Holiday Date is required";

        if (
            !formData.applicableEmployeeCategories ||
            formData.applicableEmployeeCategories.length === 0
        )
        newErrors.applicableEmployeeCategories =
            "Employee Category is required";

        if (!formData.holidayType)
        newErrors.holidayType = "Holiday Type is required";

        // if (!formData.description.trim())
        // newErrors.description = "Description is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const payload = {
            holidayName: formData.holidayName,
            holidayDate: formData.holidayDate,
            applicableEmployeeCategories:
                formData.applicableEmployeeCategories,
            holidayType: formData.holidayType,
            description: formData.description,
        };

        try {
            setLoading(true);

            if (isEdit) {
                await updateHoliday(holidayData._id, payload);
            } else {
                await createHoliday(payload);
            }

            refreshHolidays?.();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-[4px]">

        <div
            className="absolute inset-0"
            onClick={onClose}
        />

        <div className="absolute right-0 top-0 h-full w-[500px] bg-[#020817] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-blue-900 px-6 py-5">
            <div>
                <p className="text-blue-400 text-xs uppercase tracking-widest">
                Holiday Management
                </p>

                <h2 className="text-white text-xl font-semibold">
                {isEdit ? "Edit Holiday" : "Create Holiday"}
                </h2>
            </div>

            <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0f2749] text-white"
            >
                <X size={20} />
            </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Holiday Name */}
            <div>
                <label className="block text-white mb-2">
                Holiday Name
                </label>

                <input
                type="text"
                name="holidayName"
                value={formData.holidayName}
                onChange={handleChange}
                placeholder="Enter Holiday Name"
                className="w-full rounded-lg p-3 text-white bg-[#0D2138] border border-blue-900 outline-none"
                />

                <ErrorMsg msg={errors.holidayName} />
            </div>

            {/* Holiday Date */}
            <div>
                <CustomDatePicker
                    id="holidayDate"
                    label="Holiday Date"
                    value={
                        formData.holidayDate
                            ? parseLocalDate(formData.holidayDate)
                            : null
                    }
                    onChange={(date) => {
                        const formattedDate = `${date.getFullYear()}-${String(
                            date.getMonth() + 1
                        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                        setFormData((prev) => ({
                            ...prev,
                            holidayDate: formattedDate,
                        }));

                        setErrors((prev) => ({
                            ...prev,
                            holidayDate: "",
                        }));
                    }}
                    placeholder="Select Holiday Date"
                />

                <ErrorMsg msg={errors.holidayDate} />
                </div>

            {/* Employee Category */}
            <div>
                <CustomMultiSelectDropdown
                    id="employeeCategory"
                    label="Applicable Employee Category"
                    options={employeeCategories}
                    selectedValues={
                        formData.applicableEmployeeCategories
                    }
                    placeholder="Select Categories"
                    error={errors.applicableEmployeeCategories}
                    onChange={(values) => {
                        setFormData((prev) => ({
                        ...prev,
                        applicableEmployeeCategories: values,
                        }));

                        setErrors((prev) => ({
                        ...prev,
                        applicableEmployeeCategories: "",
                        }));
                    }}
                />

                <ErrorMsg msg={errors.applicableEmployeeCategories}/>
            </div>

            {/* Holiday Type */}
            <div>

                <CustomDropdown
                    id="holidayType"
                    label="Holiday Type"
                    value={formData.holidayType}
                    options={holidayTypes}
                    placeholder="Select Type"
                    error={errors.holidayType}
                    onChange={(value) => {
                        setFormData((prev) => ({
                        ...prev,
                        holidayType: value,
                        }));

                        setErrors((prev) => ({
                        ...prev,
                        holidayType: "",
                        }));
                    }}
                    />

                <ErrorMsg msg={errors.holidayType} />
            </div>

            {/* Description */}
            <div>
                <label className="block text-white mb-2">
                Description
                </label>

                <textarea
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                className="w-full rounded-lg p-3 text-white bg-[#0D2138] border border-blue-900 outline-none resize-none"
                />

                <ErrorMsg msg={errors.description} />
            </div>
            </div>

            {/* Footer */}
            <div className="border-t border-blue-900 bg-[#071a35] p-5 flex justify-between">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg border border-gray-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 rounded-md bg-[#2563EB] text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>

                            {isEdit ? "Updating..." : "Creating..."}
                        </>
                    ) : (
                        isEdit ? "Update Holiday" : "Create Holiday"
                    )}
                </button>
            </div>
        </div>
        </div>
    );
}