import React, { useState } from "react";
import OverrideTable from "./OverrideTable";
import EmployeeWiseAttendanceUpdate from "./EmployeeWiseAttendanceUpdate";
import DateWiseAttendanceUpdate from "./DateWiseAttendanceUpdate";

export default function AttendanceOverrideBody() {
    const [activeView, setActiveView] = useState("history");

    const [overrideHistory, setOverrideHistory] = useState([]);

    const handleOverrideSave = (records) => {
        setOverrideHistory((prev) => [...records, ...prev]);

        setActiveView("history");
    };

    const renderContent = () => {
        switch (activeView) {
            case "employee":
                return (
                    <EmployeeWiseAttendanceUpdate
                        onOverride={handleOverrideSave}
                    />
                );

            case "date":
                return (
                    <DateWiseAttendanceUpdate
                        onOverride={handleOverrideSave}
                    />
                );

            default:
                return (
                    <OverrideTable
                        data={overrideHistory}
                    />
                );
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-medium text-white">
                            Attendance Override
                        </h1>

                        {activeView !== "history" && (
                            <>
                                <span className="text-[#6d87ad]">
                                    /
                                </span>

                                <button
                                    onClick={() =>
                                        setActiveView("history")
                                    }
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Override History
                                </button>

                                <span className="text-[#6d87ad]">
                                    /
                                </span>

                                <span className="text-white">
                                    {activeView === "employee"
                                        ? "Employee Wise"
                                        : "Date Wise"}
                                </span>
                            </>
                        )}
                    </div>

                    <p className="text-[16px] text-[#9eb0cc]">
                        Manage Attendance efficiently and effectively.
                    </p>
                </div>

                {activeView === "history" && (
                    <div className="flex gap-4">
                        <button
                            onClick={() =>
                                setActiveView("employee")
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Employee Wise
                        </button>

                        <button
                            onClick={() =>
                                setActiveView("date")
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Date Wise
                        </button>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-[#183052] bg-[#0a1a2d]">
                {renderContent()}
            </div>
        </div>
    );
}