import React, { useState,useEffect } from "react";
import { X } from "lucide-react";
import {createShifts} from '../../../../services/shift/shiftService';
import {updateShift} from '../../../../services/shift/updateShiftService'
import CustomTimePicker from "../../../../components/CustomTimePicker";
    const DEFAULT_GRACE_TIME = 10;
    const ErrorMsg = ({ msg }) =>
    msg ? (
        <p className="text-red-400 text-sm mt-1">
        {msg}
        </p>
    ) : null;

export default function AddShiftForm({ onClose,shiftData,refreshShifts }) {
    const [formData, setFormData] = useState({
        shiftName: "",
        startTime: "",
        endTime: "",
        graceTime: "",
        workingMinutes: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isEdit = !!shiftData;

    useEffect(() => {
        if (shiftData) {
            setFormData({
                shiftName: shiftData.shiftName || "",
                startTime: shiftData.startTime || "",
                endTime: shiftData.endTime || "",
                graceTime: shiftData.graceTime || "",
                workingMinutes: shiftData.workingMinutes
                    ? (shiftData.workingMinutes / 60).toFixed(2)
                    : "",
            });
        }
    }, [shiftData]);

    const validationRules = {
        shiftName: "Shift Name",
        startTime: "Start Time",
        endTime: "End Time",
        graceTime: "Grace Time",
        workingMinutes: "Working Hours",
    };

    const validate = () => {
        const newErrors = {};

        Object.entries(validationRules).forEach(
            ([field, label]) => {
            const value = formData[field];

            if (!value?.toString().trim()) {
                newErrors[field] = `${label} is required`;
            }
        }
    );

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
    };

    // const calculateWorkingHours = (startTime, endTime) => {
    //     if (!startTime || !endTime) return "";

    //     const start = new Date(`1970-01-01T${startTime}:00`);
    //     let end = new Date(`1970-01-01T${endTime}:00`);

    //     if (end < start) {
    //         end.setDate(end.getDate() + 1);
    //     }

    //     const diffMs = end - start;
    //     const diffMinutes = Math.floor(diffMs / (1000 * 60));

    //     // Return hours for display
    //     return (diffMinutes / 60).toFixed(2);
    // };
    const calculateWorkingHours = (startTime, endTime) => {
        if (!startTime || !endTime) return "";

        let start = new Date(`1970-01-01T${startTime}:00`);
        let end = new Date(`1970-01-01T${endTime}:00`);

        // Add 10 minutes grace time to the start time
        start = new Date(
            start.getTime() + DEFAULT_GRACE_TIME * 60 * 1000
        );

        // Handle overnight shifts
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const diffMinutes = Math.floor((end - start) / (1000 * 60));

        // Display hours (e.g. 8.00)
        return (diffMinutes / 60).toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [name]: value,
            };

            // Auto-calculate working hours
            if (
                name === "startTime" ||
                name === "endTime"
            ) {
                updatedData.workingMinutes = calculateWorkingHours(
                    updatedData.startTime,
                    updatedData.endTime
                );
            }

            return updatedData;
        });

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const payload = {
                shiftName: formData.shiftName,
                startTime: formData.startTime,
                endTime: formData.endTime,
                graceTime: Number(formData.graceTime),
                workingMinutes: Math.round(
                    Number(formData.workingMinutes) * 60
                ),
                isActive: true,
            };

            if (isEdit) {
                await updateShift(shiftData._id, payload);
                console.log("Shift updated successfully");
            } else {
                await createShifts(payload);
                console.log("Shift created successfully");
            }

            refreshShifts?.();
            onClose();
        } catch (error) {
            console.error(error);

            setErrors((prev) => ({
                ...prev,
                shiftName:
                    error?.response?.data?.message ||
                    `Failed to ${isEdit ? "update" : "create"} shift`,
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-[4px]">

        {/* Backdrop */}
            <div className="absolute inset-0 " onClick={onClose} />

            {/* Offcanvas */}
            <div
                className="
                absolute
                right-0
                top-0
                h-full
                w-[500px]
                bg-[#020817]
                backdrop-blur-[4px]
                shadow-2xl
                flex
                flex-col
                animate-[slideIn_.3s_ease-out]
                "
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-blue-900 px-6 py-5">
                    <div>
                        <p className="text-blue-400 text-xs uppercase tracking-widest">
                        Shift Management
                        </p>

                        <h2 className="text-white text-xl font-semibold">
                            {isEdit ? "Edit Shift" : "Create Shift"}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0f2749] text-white hover:bg-[#183a6b] cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 min-w-[380px]">
                    {/* Shift Name */}
                    <div>
                        <label className="block text-white mb-2">
                            Shift Name
                        </label>

                        <input
                            type="text"
                            name="shiftName"
                            value={formData.shiftName}
                            onChange={handleChange}
                            placeholder="Enter Shift Name"
                            className={`w-full rounded-lg p-3 text-white outline-none border bg-[#0D2138] cursor-pointer
                            ${
                                errors.shiftName
                                ? "border-red-500"
                                : "border-blue-900"
                            }`}
                        />

                        <ErrorMsg msg={errors.shiftName} />
                    </div>

                    {/* Start Time & End Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white mb-2">Start Time</label>

                            {/* <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className={`w-full bg-[#0f2749] border border-blue-900 rounded-lg p-3 text-white outline-none"
                                ${
                                    errors.startTime
                                    ? "border-red-500"
                                    : "border-blue-900"
                                }`}
                            /> */}
                            <CustomTimePicker
                                value={formData.startTime}
                                error={errors.startTime}
                                onChange={(value) =>
                                    handleChange({
                                    target: {
                                        name: "startTime",
                                        value,
                                    },
                                    })
                                }
                            />
                            <ErrorMsg msg={errors.startTime} />
                        </div>

                        <div>
                            <label className="block text-white mb-2">End Time</label>

                            {/* <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className={`w-full bg-[#0f2749] border border-blue-900 rounded-lg p-3 text-white outline-none
                                ${
                                    errors.endTime
                                    ? "border-red-500"
                                    : "border-blue-900"
                                }`}
                            /> */}
                            <CustomTimePicker
                                value={formData.endTime}
                                error={errors.endTime}
                                onChange={(value) =>
                                    handleChange({
                                    target: {
                                        name: "endTime",
                                        value,
                                    },
                                    })
                                }
                            />
                            <ErrorMsg msg={errors.endTime} />
                        </div>
                    </div>

                    {/* Grace Time & Working Hours */}
                    <div className="grid grid-cols-2 gap-4 min-w-[380px]">
                        <div>
                            <label className="block text-white mb-2">Grace Time (Min)</label>

                            <input
                                type="number"
                                name="graceTime"
                                value={formData.graceTime}
                                onChange={handleChange}
                                placeholder="Enter Minutes"
                                className={`w-full bg-[#0D2138] border border-blue-900 rounded-lg p-3 text-white outline-none
                                ${
                                    errors.graceTime
                                    ? "border-red-500"
                                    : "border-blue-900"
                                }`}
                            />
                            <ErrorMsg msg={errors.graceTime} />
                        </div>

                        <div>
                            <label className="block text-white mb-2">Working Hours</label>

                            <input
                                type="number"
                                name="workingMinutes"
                                value={formData.workingMinutes}
                                readOnly
                                placeholder="Enter Hours"
                                className={`w-full bg-[#0D2138] border border-blue-900 rounded-lg p-3 text-white outline-none
                                ${
                                    errors.workingMinutes
                                    ? "border-red-500"
                                    : "border-blue-900"
                                }`}
                            />
                            <ErrorMsg msg={errors.workingMinutes} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-blue-900 bg-[#071a35] p-5 flex justify-between gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg border border-gray-500 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 rounded-md bg-[#2563EB] text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="opacity-25"
                                    />
                                    <path
                                        fill="currentColor"
                                        className="opacity-75"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>

                                {isEdit ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            isEdit ? "Update Shift" : "Create Shift"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
