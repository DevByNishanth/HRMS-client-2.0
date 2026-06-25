import React, { useState, useEffect } from "react";
import { X, UploadCloud, File, Paperclip } from "lucide-react";
import { createHoliday } from "../../../../services/holiday/addHolidayService";
import { updateHoliday } from "../../../../services/holiday/updateHolidayService";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import CustomDropdown from "../../../../components/CustomDropdown";
import CustomMultiSelectDropdown from "../../../../components/CustomMultiSelectDropdown";
import { createBulkUploadHoliday } from "../../../../services/holiday/addBulkUploadHolidayService";

const ErrorMsg = ({ msg }) =>
    msg ? <p className="text-red-400 text-sm mt-1">{msg}</p> : null;

export default function AddHoliday({
    onClose,
    holidayData,
    refreshHolidays,
    holidays = [],
    }) {
    const isEdit = !!holidayData;

    const [formData, setFormData] = useState({
        holidayName: "",
        holidayDate: "",
        applicableEmployeeCategories: [],
        holidayType: "",
        // description: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("form");
    const [attachments, setAttachments] = useState([]);
    const [bulkLoading, setBulkLoading] = useState(false);

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
            // description: holidayData.description || "",
        });
        }
    }, [holidayData]);

    const employeeCategories = [
        "All",
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

        // Duplicate date check
        const duplicateHoliday = holidays.find((holiday) => {
            const existingDate = holiday.holidayDate.split("T")[0];

            return (
                existingDate === formData.holidayDate &&
                (!isEdit || holiday._id !== holidayData?._id)
            );
        });

        if (duplicateHoliday) {
            newErrors.holidayDate =
                "A holiday already exists for this date";
        }
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
            // description: formData.description,
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

    const handleBulkUpload = async () => {
        if (attachments.length === 0) {
            alert("Please select a file");
            return;
        }

        try {
            setBulkLoading(true);

            const formData = new FormData();

            formData.append(
                "holidays",
                attachments[0].file
            );

            const response = await createBulkUploadHoliday(formData);

            console.log("Bulk Upload Response:", response);

            refreshHolidays?.();

            setAttachments([]);

            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setBulkLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleFilesChange = (event) => {
        const files = Array.from(event.target.files || []);

        const uploadedFiles = files.map((file) => ({
            id: `${file.name}-${Date.now()}`,
            file,
            preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : null,
        }));

        setAttachments((prev) => [
            ...prev,
            ...uploadedFiles,
        ]);
    };

    const removeAttachment = (id) => {
        setAttachments((prev) =>
            prev.filter((file) => file.id !== id)
        );
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
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0f2749] text-white cursor-pointer"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="px-6 py-4  border-[#183052]">
                <div className="flex w-full rounded-xl border border-[#183052] bg-[#071a2f] p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("form")}
                        className={`flex-1 h-11 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === "form"
                                ? "bg-[#2563EB] text-white"
                                : "text-[#9eb0cc]"
                        }`}
                    >
                        Form
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("bulk")}
                        className={`flex-1 h-11 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === "bulk"
                                ? "bg-[#2563EB] text-white"
                                : "text-[#9eb0cc]"
                        }`}
                    >
                        Bulk Upload
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "form" && (
                    <div className="space-y-5">
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
                                const actualCategories = [
                                    "Teaching",
                                    "Non-Teaching",
                                    "Housekeeping",
                                    "Driver",
                                ];

                                setFormData((prev) => ({
                                    ...prev,
                                    applicableEmployeeCategories: values.includes("All")
                                        ? actualCategories
                                        : values,
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
                                // error={errors.holidayType}
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
                    </div>
                )}
                {activeTab === "bulk" && (
                    <div>
                        <div className="mt-3">
                            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                                <Paperclip
                                    size={15}
                                    className="text-[#3984ff]"
                                />
                                Upload Holiday File
                            </p>

                            <label
                                htmlFor="holiday-upload"
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#345276] bg-[#0d2138] px-4 py-8 text-center transition hover:border-[#3984ff] hover:bg-[#102640]"
                            >
                                <UploadCloud
                                    size={26}
                                    className="text-[#6ea1ff]"
                                />

                                <span className="mt-2 text-[13px] font-semibold text-white">
                                    Click to upload holiday file
                                </span>

                                <span className="mt-1 text-[11px] text-[#8ca1bd]">
                                    Excel (.xlsx/.xls) supported
                                </span>

                                <input
                                    id="holiday-upload"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                    onChange={handleFilesChange}
                                />
                            </label>

                            {attachments.length > 0 && (
                                <div className="mt-3 grid gap-2">
                                    {attachments.map(
                                        (attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center gap-3 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-2"
                                            >
                                                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#132b49] text-[#6ea1ff]">
                                                    <File size={18} />
                                                </div>

                                                <div className="flex-1">
                                                    <p className="truncate text-[12px] font-semibold text-white">
                                                        {
                                                            attachment.file
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-[11px] text-[#8ca1bd]">
                                                        {formatFileSize(
                                                            attachment
                                                                .file
                                                                .size
                                                        )}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAttachment(
                                                            attachment.id
                                                        )
                                                    }
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#8ca1bd] hover:bg-[#183052] hover:text-white"
                                                >
                                                    <X size={15} />
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-blue-900 bg-[#071a35] p-5 flex justify-between">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg border border-gray-500 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    onClick={
                        activeTab === "form"
                            ? handleSubmit
                            : handleBulkUpload
                    }
                    disabled={
                        activeTab === "form"
                            ? loading
                            : bulkLoading
                    }
                    className="px-5 py-2 rounded-md bg-[#2563EB] text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                >
                    {activeTab === "form"
                        ? loading
                            ? isEdit
                                ? "Updating..."
                                : "Creating..."
                            : isEdit
                            ? "Update Holiday"
                            : "Create Holiday"
                        : bulkLoading
                        ? "Uploading..."
                        : "Upload File"}
                </button>
            </div>
        </div>
        </div>
    );
}