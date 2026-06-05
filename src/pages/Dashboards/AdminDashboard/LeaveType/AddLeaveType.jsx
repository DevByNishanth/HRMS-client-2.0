import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createLeaveType } from "../../../../services/leaveType/addLeaveTypeService";
import { updateLeaveType } from "../../../../services/LeaveType/updateLeaveTypeService";
import CustomDropdown from "../../../../components/CustomDropdown";
import CustomMultiSelectDropdown from "../../../../components/CustomMultiSelectDropdown";

const ErrorMsg = ({ msg }) =>
    msg ? <p className="text-red-400 text-sm mt-1">{msg}</p> : null;

export default function AddLeaveType({
    onClose,
    leaveTypeData,
    refreshLeaveTypes,
}) {
    const isEdit = !!leaveTypeData;

    const [formData, setFormData] = useState({
        leaveName: "",
        leaveCategory: "",
        employeeCategories: [],
        resetFrequency: "",
        daysPerYear: "",
        // requiresApproval: true,
        // isPaidLeave: true,
        carryForwardAllowed: true,
        maxCarryForwardDays: "",
        allowHalfDay: true,
        sandwichRuleApplicable: true,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (leaveTypeData) {
            setFormData({
                leaveName: leaveTypeData.leaveName || "",
                leaveCategory: leaveTypeData.leaveCategory || "",
                employeeCategories:
                    leaveTypeData.employeeCategories || [],
                resetFrequency: leaveTypeData.resetFrequency || "",
                daysPerYear: leaveTypeData.daysPerYear || "",
                // requiresApproval:
                //     leaveTypeData.requiresApproval ?? true,
                // isPaidLeave:
                //     leaveTypeData.isPaidLeave ?? true,
                carryForwardAllowed:
                    leaveTypeData.carryForwardAllowed ?? true,
                maxCarryForwardDays:
                    leaveTypeData.maxCarryForwardDays || "",
                allowHalfDay:
                    leaveTypeData.allowHalfDay ?? true,
                sandwichRuleApplicable:
                    leaveTypeData.sandwichRuleApplicable ?? true,
            });
        }
    }, [leaveTypeData]);

    const employeeCategories = [
        "Teaching",
        "Non-Teaching",
        "Housekeeping",
        "Driver"
    ];

    const leaveNameOptions = [
        "Casual Leave",
        "On Duty - Official",
        "On Duty - Research",
        "On Duty - Exam",
        "Medical Leave",
        "Vacation Leave",
        "Marriage Leave",
        "Compensation Leave",
        "Paternity Leave",
        "Maternity Leave",
        "LOP",
    ];

    const leaveCategories = [
        "Regular",
        "On Duty",
    ];

    const resetFrequencyOptions = [
        "Academic Year",
        "Semester",
    ];

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

    const handleToggle = (field) => {
        setFormData((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.leaveName.trim()) {
            newErrors.leaveName = "Leave Name is required";
        }

        if (!formData.leaveCategory) {
            newErrors.leaveCategory = "Leave Category is required";
        }

        if (
            !formData.employeeCategories ||
            formData.employeeCategories.length === 0
        ) {
            newErrors.employeeCategories =
                "Employee Category is required";
        }

        if (!formData.resetFrequency) {
            newErrors.resetFrequency =
                "Reset Frequency is required";
        }

        if (
            formData.carryForwardAllowed &&
            (formData.maxCarryForwardDays === "" ||
                Number(
                    formData.maxCarryForwardDays
                ) < 0)
        ) {
            newErrors.maxCarryForwardDays =
                "Enter valid carry forward days";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const payload = {
            leaveName: formData.leaveName,
            leaveCategory: formData.leaveCategory,
            employeeCategories: formData.employeeCategories,
            resetFrequency: formData.resetFrequency,
            daysPerYear: Number(formData.daysPerYear),
            requiresApproval: true,
            isPaidLeave: true,
            carryForwardAllowed:
                formData.carryForwardAllowed,
            maxCarryForwardDays:
                Number(formData.maxCarryForwardDays) ||
                0,
            allowHalfDay: formData.allowHalfDay,
            sandwichRuleApplicable:
                formData.sandwichRuleApplicable,
        };
        console.log("Payload:", payload);

        try {
            setLoading(true);

            if (isEdit) {
                await updateLeaveType(
                    leaveTypeData._id,
                    payload
                );
            } else {
                await createLeaveType(payload);
            }

            refreshLeaveTypes?.();
            onClose();
        } catch (error) {
                setApiError(
                    error.response?.data?.message ||
                    "Failed to create leave name"
                );
                console.log("Error Status:", error.response?.status);
                console.log("Error Data:", error.response?.data);
                console.log("Full Error Response:", error.response);

                console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const booleanOptions = ["Yes", "No"];
    const BooleanField = ({ label, field }) => (
        <CustomDropdown
            id={field}
            label={label}
            value={formData[field] ? "Yes" : "No"}
            options={booleanOptions}
            placeholder={`Select ${label}`}
            onChange={(value) =>
                setFormData((prev) => ({
                    ...prev,
                    [field]: value === "Yes",
                }))
            }
        />
    );

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
                            Leave Management
                        </p>

                        <h2 className="text-white text-xl font-semibold">
                            {isEdit
                                ? "Edit Leave Type"
                                : "Create Leave Type"}
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

                    <div>
                        <CustomDropdown
                            id="leaveName"
                            label="Leave Name"
                            value={formData.leaveName}
                            options={leaveNameOptions}
                            placeholder="Select Leave Name"
                            error={errors.leaveName}
                            onChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    leaveName: value,
                                }))
                            }
                        />

                        <ErrorMsg msg={errors.leaveName} />
                    </div>

                    <CustomDropdown
                        id="leaveCategory"
                        label="Leave Category"
                        value={formData.leaveCategory}
                        options={leaveCategories}
                        placeholder="Select Category"
                        error={errors.leaveCategory}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                leaveCategory: value,
                            }))
                        }
                    />

                    <ErrorMsg msg={errors.leaveCategory} />

                    <CustomMultiSelectDropdown
                        id="employeeCategories"
                        label="Employee Categories"
                        options={employeeCategories}
                        selectedValues={
                            formData.employeeCategories
                        }
                        placeholder="Select Categories"
                        error={errors.employeeCategories}
                        onChange={(values) =>
                            setFormData((prev) => ({
                                ...prev,
                                employeeCategories: values,
                            }))
                        }
                    />

                    <ErrorMsg
                        msg={errors.employeeCategories}
                    />

                    <CustomDropdown
                        id="resetFrequency"
                        label="Reset Frequency"
                        value={formData.resetFrequency}
                        options={resetFrequencyOptions}
                        placeholder="Select Frequency"
                        error={errors.resetFrequency}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                resetFrequency: value,
                            }))
                        }
                    />

                    <ErrorMsg msg={errors.resetFrequency} />

                    <div>
                        <label className="block text-white mb-2">
                            Number of Days
                        </label>

                        <input
                            type="number"
                            min="0"
                            name="daysPerYear"
                            value={formData.daysPerYear}
                            onChange={handleChange}
                            placeholder="Enter Number of Days"
                            className="w-full rounded-lg p-3 text-white bg-[#0D2138] border border-blue-900 outline-none"
                        />

                        <ErrorMsg msg={errors.daysPerYear} />
                    </div>

                    {/* <ToggleField
                        label="Requires Approval"
                        field="requiresApproval"
                    /> */}
                    {/* <BooleanField
                        label="Requires Approval"
                        field="requiresApproval"
                    />
                    <BooleanField
                        label="Paid Leave"
                        field="isPaidLeave"
                    /> */}

                    <BooleanField
                        label="Carry Forward Allowed"
                        field="carryForwardAllowed"
                    />

                    {formData.carryForwardAllowed && (
                        <div>
                            <label className="block text-white mb-2">
                                Maximum Carry Forward Allowed
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="maxCarryForwardDays"
                                value={
                                    formData.maxCarryForwardDays
                                }
                                onChange={handleChange}
                                placeholder="Enter Days"
                                className="w-full rounded-lg p-3 text-white bg-[#0D2138] border border-blue-900 outline-none"
                            />

                            <ErrorMsg
                                msg={
                                    errors.maxCarryForwardDays
                                }
                            />
                        </div>
                    )}

                    <BooleanField
                        label="Allow Half Day"
                        field="allowHalfDay"
                    />

                    <BooleanField
                        label="Sandwich Rule Applicable"
                        field="sandwichRuleApplicable"
                    />
                </div>
                {apiError && (
                    <p className="text-red-400 text-sm px-6">
                        {apiError}
                    </p>
                )}

                {/* Footer */}
                <div className="border-t border-blue-900 bg-[#071a35] p-5 flex justify-between">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg border border-gray-500 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 rounded-md bg-[#2563EB] text-white hover:bg-[#1049c4] flex items-center gap-2"
                    >
                        {loading
                            ? isEdit
                                ? "Updating..."
                                : "Creating..."
                            : isEdit
                            ? "Update Leave Type"
                            : "Create Leave Type"}
                    </button>
                </div>
                
            </div>
            
        </div>
    );
}