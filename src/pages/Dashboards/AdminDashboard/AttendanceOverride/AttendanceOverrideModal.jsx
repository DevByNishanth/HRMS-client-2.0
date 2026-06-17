import React, { useEffect, useState } from "react";

export default function AttendanceOverrideModal({
    isOpen,
    onClose,
    onSubmit,
    mode = "single",
    loading = false,
}) {
    const [session1, setSession1] = useState("P");
    const [session2, setSession2] = useState("P");
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setSession1("P");
        setSession2("P");
        setRemarks("");
    }, [isOpen]);

    const handleSubmit = () => {
        if (!remarks.trim()) {
            alert("Please enter remarks");
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
            <div className="w-full max-w-lg rounded-xl border border-[#244061] bg-[#0d2138] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#244061] px-6 py-4">
                    <h2 className="text-lg font-semibold text-white">
                        {mode === "single"
                            ? "Attendance Override"
                            : "Bulk Attendance Override"}
                    </h2>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`
                            text-xl
                            text-[#8ca1bd]
                            hover:text-white
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
                                <label className="mb-2 block text-sm text-[#8ca1bd]">
                                    Session 1
                                </label>

                                <select
                                    value={session1}
                                    onChange={(e) =>
                                        setSession1(e.target.value)
                                    }
                                    className="h-11 w-full rounded-lg border border-[#244061] bg-[#172c46] px-3 text-white"
                                >
                                    <option value="P">Present (P)</option>
                                    <option value="A">Absent (A)</option>
                                    <option value="OD">OD</option>
                                    <option value="L">Leave</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-[#8ca1bd]">
                                    Session 2
                                </label>

                                <select
                                    value={session2}
                                    onChange={(e) =>
                                        setSession2(e.target.value)
                                    }
                                    className="h-11 w-full rounded-lg border border-[#244061] bg-[#172c46] px-3 text-white"
                                >
                                    <option value="P">Present (P)</option>
                                    <option value="A">Absent (A)</option>
                                    <option value="OD">OD</option>
                                    <option value="L">Leave</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="mb-2 block text-sm text-[#8ca1bd]">
                            Remarks
                        </label>

                        <textarea
                            rows={4}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter remarks"
                            className="w-full rounded-lg border border-[#244061] bg-[#172c46] p-3 text-white"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-[#244061] p-5">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`
                            rounded-lg
                            bg-[#223d5f]
                            px-6
                            py-2
                            text-white
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
                            text-white
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