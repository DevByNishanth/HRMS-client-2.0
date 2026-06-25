import React, { useState } from "react";
import OverrideTable from "./OverrideTable";
import EmployeeWiseAttendanceUpdate from "./EmployeeWiseAttendanceUpdate";
import DateWiseAttendanceUpdate from "./DateWiseAttendanceUpdate";
import { ChevronRight,User,CalendarDays } from "lucide-react";

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
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                {activeView === "history" ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                Attendance Override
                            </h1>

                            <p className="text-[#9eb0cc] mt-1">
                                Manage Attendance efficiently and effectively.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveView("employee")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer flex flex-row items-center gap-2"
                            >
                                <span><User className="w-4"/></span>
                                Employee Wise
                            </button>

                            <button
                                onClick={() => setActiveView("date")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer flex flex-row items-center gap-2"
                            >
                                <span><CalendarDays className="w-4"/></span>
                                Date Wise
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-[18px]">
                        <button
                            onClick={() => setActiveView("history")}
                            className="text-[#4A90E2] hover:text-[#69a7ff] cursor-pointer"
                        >
                            Override History
                        </button>

                        <ChevronRight
                            size={18}
                            className="text-[#ffffff]"
                        />

                        <span className="text-white font-medium ">
                            {activeView === "employee"
                                ? "Employee Wise"
                                : "Date Wise"}
                        </span>
                    </div>
                )}
            </div>
            <div className="rounded-xl border border-[#183052] bg-[#0a1a2d]">
                {renderContent()}
            </div>
        </div>
    );
}