import React, { useState } from "react";
import CustomDatePicker from "../../../../components/CustomDatePicker";

export default function DateWiseAttendanceUpdate() {

    const [attendanceDate, setAttendanceDate] =
        useState(null);

    return (
        <>
            {/* Filters */}

            <div className="mb-4 pl-7 pr-7 pt-7 pb-3">

                <div className="flex flex-wrap items-center gap-4">

                    <div className="w-[180px]">
                        <CustomDatePicker
                            value={attendanceDate}
                            onChange={setAttendanceDate}
                            placeholder="Attendance Date"
                        />
                    </div>

                    <button className="h-11 px-8 rounded-lg bg-[#3984ff] text-white">
                        Show
                    </button>

                </div>
            </div>

            {/* Table */}

            <div className="overflow-hidden">

                <div className="max-h-[550px] overflow-y-auto">

                    <table className="w-full table-auto border-collapse text-left">

                        <thead className="sticky top-0 z-10 bg-[#172c46] text-[#9aacc7]">

                            <tr>
                                <th className="px-5 py-4">
                                    <input type="checkbox" />
                                </th>

                                <th className="px-5 py-4">
                                    Employee
                                </th>

                                <th className="px-5 py-4">
                                    Shift Code
                                </th>

                                <th className="px-5 py-4">
                                    Status
                                </th>

                                <th className="px-5 py-4">
                                    First In
                                </th>

                                <th className="px-5 py-4">
                                    Last Out
                                </th>

                                <th className="px-5 py-4">
                                    Session1
                                </th>

                                <th className="px-5 py-4">
                                    Session2
                                </th>
                            </tr>

                        </thead>

                        <tbody className="text-[#cad7eb]">

                            {/* rows */}

                        </tbody>

                    </table>

                </div>
            </div>

            <div className="border-t border-[#183052] p-5 flex justify-end">

                <button className="h-11 px-8 rounded-lg bg-[#3984ff] text-white">
                    Override
                </button>

            </div>
        </>
    );
}