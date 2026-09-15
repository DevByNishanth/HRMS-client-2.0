import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AttendanceDropdown from "../../../../components/AttendanceDropdown";
import { getCurrentAcademicYear } from "../../../../utils/getCurrentAcademicYear";

const getDefaultSession = () => ({
    value: "P",
    leaveTypeId: null,
    leaveName: "Present",
    academicYear: getCurrentAcademicYear(),
});

export default function AttendanceOverrideModal({
    isOpen,
    onClose,
    onSubmit,
    mode = "single",
    loading = false,
    leaveOptions = [],
    odOptions = [],
    bulkSession1,
    bulkSession2,
    bulkSimpleOnly = false,
}) {
    const [session1, setSession1] = useState(getDefaultSession());
    const [session2, setSession2] = useState(getDefaultSession());
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setSession1(bulkSession1 || getDefaultSession());
        setSession2(bulkSession2 || getDefaultSession());
        setRemarks("");
    }, [isOpen, bulkSession1, bulkSession2]);

    const handleSubmit = () => {
        if (loading) return;
        if (!remarks.trim()) {
            toast.warning(
                "Please enter remarks"
            );
            return;
        }

        onSubmit({
            session1,
            session2,
            remarks,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
            <div className="w-full max-w-lg rounded-xl border border-[var(--theme-border-input)] bg-[var(--theme-bg-input)] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--theme-border-input)] px-6 py-4">
                    <h2 className="text-lg font-semibold text-[var(--theme-text-main)]">
                        {mode === "single"
                            ? "Attendance Override"
                            : "Bulk Attendance Override"}
                    </h2>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`
                            text-xl
                            text-[var(--theme-text-muted)]
                            hover:text-[var(--theme-text-main)]
                            cursor-pointer
                            ${loading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5 p-6">

                    {mode === "bulk-selected" && (
                        <>
                            <div>
                                <label className="mb-2 block text-sm text-[var(--theme-text-muted)]">
                                    Session 1
                                </label>

                                {bulkSimpleOnly ? (
                                    <select
                                        value={session1.value}
                                        onChange={(e) =>
                                            setSession1({
                                                value: e.target.value,
                                                leaveTypeId: null,
                                                leaveName: e.target.value === "P" ? "Present" : "",
                                                academicYear: getCurrentAcademicYear(),
                                                remainingDays: null,
                                            })
                                        }
                                        className="w-full h-10 px-3 rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-table-header)] text-[var(--theme-text-main)]"
                                    >
                                        <option value="P">P</option>
                                    </select>
                                ) : (
                                    <AttendanceDropdown
                                        value={session1.value}
                                        leaveOptions={leaveOptions}
                                        odOptions={odOptions}
                                        onOptionSelect={(option) => {
                                            setSession1(option);
                                        }}
                                    />
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-[var(--theme-text-muted)]">
                                    Session 2
                                </label>

                                {bulkSimpleOnly ? (
                                    <select
                                        value={session2.value}
                                        onChange={(e) =>
                                            setSession2({
                                                value: e.target.value,
                                                leaveTypeId: null,
                                                leaveName: e.target.value === "P" ? "Present" : "",
                                                academicYear: getCurrentAcademicYear(),
                                                remainingDays: null,
                                            })
                                        }
                                        className="w-full h-10 px-3 rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-table-header)] text-[var(--theme-text-main)]"
                                    >
                                        <option value="P">P</option>
                                    </select>
                                ) : (
                                    <AttendanceDropdown
                                        value={session2.value}
                                        leaveOptions={leaveOptions}
                                        odOptions={odOptions}
                                        onOptionSelect={(option) => {
                                            setSession2(option);
                                        }}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    <div>
                        <label className="mb-2 block text-sm text-[var(--theme-text-muted)]">
                            Remarks
                        </label>

                        <textarea
                            rows={4}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter remarks"
                            className="w-full rounded-lg border border-[var(--theme-border-input)] bg-[var(--theme-bg-table-header)] p-3 text-[var(--theme-text-main)]"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-[var(--theme-border-input)] p-5">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`
                            rounded-lg
                            bg-[#223d5f]
                            px-6
                            py-2
                            text-[var(--theme-text-main)]
                            cursor-pointer
                            ${loading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-[#3984ff]
                            px-6
                            py-2
                            text-[var(--theme-text-main)]
                            cursor-pointer
                            ${loading ? "opacity-70 cursor-not-allowed" : ""}
                        `}
                    >
                        {loading && (
                            <div
                                className="
                                    h-4
                                    w-4
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-white
                                    border-t-transparent
                                "
                            />
                        )}

                        {loading ? "Updating..." : "Update"}
                    </button>

                </div>

            </div>
        </div>
    );
}

