import React, { useState,useEffect } from "react";
import dayjs from "dayjs";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import { getAttendanceByDate } from "../../../../services/attendanceOverride/getAttendanceByDate";
import { updateAttendanceOverrideSingle } from "../../../../services/attendanceOverride/updateAttendanceOverrideSingle";
import { updateAttendanceOverrideBulk } from "../../../../services/attendanceOverride/updateAttendanceOverrideBulk";
import AttendanceOverrideModal from "./AttendanceOverrideModal";

export default function DateWiseAttendanceUpdate() {

    const [attendanceDate, setAttendanceDate] =useState(null);
    // const [attendanceDate, setAttendanceDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedRows, setEditedRows] = useState({});
    const [overrideModal, setOverrideModal] = useState(false);

    const hasFilters =
        attendanceDate ||
        searchTerm ||
        departmentFilter ||
        categoryFilter;

    useEffect(() => {
        if (!attendanceDate) return;

        fetchAttendance();
    }, [attendanceDate]);

    const fetchAttendance = async () => {
        try {
            const formattedDate = dayjs(attendanceDate).format("YYYY-MM-DD");
            const response = await getAttendanceByDate(formattedDate);
            console.log("API Response:", response.data);
            setAttendanceData(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredData = attendanceData.filter((row) => {
        const matchesSearch =
            row.employeeName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesDepartment =
            !departmentFilter ||
            row.department === departmentFilter;

        const matchesCategory =
            !categoryFilter ||
            row.employeeCategory === categoryFilter;

        return (
            matchesSearch &&
            matchesDepartment &&
            matchesCategory
        );
    });
    console.log("Attendance Data:", attendanceData);
    console.log("Filtered Data:", filteredData);

    const handleSessionChange = (
        rowKey,
        field,
        value
    ) => {
        setEditedRows((prev) => ({
            ...prev,
            [rowKey]: {
                ...prev[rowKey],
                [field]: value,
            },
        }));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(
                filteredData.map((row) => row.facultyId)
            );
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelection = (facultyId) => {
        setSelectedRows((prev) =>
            prev.includes(facultyId)
                ? prev.filter((id) => id !== facultyId)
                : [...prev, facultyId]
        );
    };

    const resetFilters = () => {
        setAttendanceDate(null);
        setSearchTerm("");
        setDepartmentFilter("");
        setCategoryFilter("");

        setSelectedRows([]);
        setEditedRows({});
    };

    const handleSingleOverride = async ({ remarks }) => {
        try {
            const employeeId = Object.keys(editedRows)[0];
            if (!employeeId) {
                alert("Please modify attendance before updating");
                return;
            }
            const row = attendanceData.find(
                (r) => r.facultyId === employeeId
            );
            if (!row) {
                alert("Employee not found");
                return;
            }
            const payload = {
                firstIn: row.firstIn,
                lastOut: row.lastOut,
                session1:
                    editedRows[employeeId]?.session1 ??
                    row.session1,
                session2:
                    editedRows[employeeId]?.session2 ??
                    row.session2,
                remarks,
            };

            console.log("Single Payload:", payload);

            await updateAttendanceOverrideSingle(
                employeeId,
                dayjs(attendanceDate).format("YYYY-MM-DD"),
                payload
            );

            setOverrideModal(false);
            setEditedRows({});
            fetchAttendance();
        } catch (error) {
            console.error(error);
        }
    };

    const handleBulkEditedOverride = async ({ remarks }) => {
        try {
            const updates = Object.keys(editedRows).map(
                (employeeId) => {
                    const row = attendanceData.find(
                        (r) => r.facultyId === employeeId
                    );

                    return {
                        employeeId,
                        session1:
                            editedRows[employeeId]?.session1 ??
                            row.session1,
                        session2:
                            editedRows[employeeId]?.session2 ??
                            row.session2,
                    };
                }
            );

            const payload = {
                fromDate: dayjs(attendanceDate).format(
                    "YYYY-MM-DD"
                ),
                toDate: dayjs(attendanceDate).format(
                    "YYYY-MM-DD"
                ),
                remarks,
                updates,
            };

            console.log(
                "Bulk Edited Payload:",
                payload
            );

            await updateAttendanceOverrideBulk(
                payload
            );

            setOverrideModal(false);
            setEditedRows({});

            fetchAttendance();
        } catch (error) {
            console.error(
                "Bulk Update Error:",
                error.response?.data || error
            );
        }
    };

    return (
        <>
            {/* Filters */}
            <div className="mb-4 px-7 pt-7 pb-3">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="w-[180px]">
                        <CustomDatePicker
                            value={attendanceDate}
                            onChange={setAttendanceDate}
                            placeholder="Attendance Date"
                        />
                    </div>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Employee"
                        className="
                            h-11
                            w-[250px]
                            rounded-lg
                            bg-[#13263d]
                            border
                            border-[#23476f]
                            px-4
                            text-white
                        "
                    />

                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="
                            h-11
                            w-[180px]
                            rounded-lg
                            bg-[#13263d]
                            border
                            border-[#23476f]
                            px-3
                            text-white
                        "
                    >
                        <option value="">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="MECH">MECH</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="
                            h-11
                            w-[200px]
                            rounded-lg
                            bg-[#13263d]
                            border
                            border-[#23476f]
                            px-3
                            text-white
                        "
                    >
                        <option value="">All Categories</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Non Teaching">Non Teaching</option>
                        <option value="Drivers">Drivers</option>
                        <option value="House Keeping">House Keeping</option>
                        <option value="Security">Security</option>
                    </select>
                    <button
                        onClick={resetFilters}
                        disabled={!hasFilters}
                        className={`
                            h-11 px-4 rounded-lg
                            ${
                                hasFilters
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                            }
                        `}
                    >
                        Reset Filters
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
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredData.length > 0 &&
                                            selectedRows.length === filteredData.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-5 py-4">Employee</th>
                                <th className="px-5 py-4">Department</th>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Shift Code</th>
                                <th className="px-5 py-4">First In</th>
                                <th className="px-5 py-4">Last Out</th>
                                <th className="px-5 py-4">Session 1</th>
                                <th className="px-5 py-4">Session 2</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#cad7eb]">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-10"
                                    >
                                        No Attendance Records Found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row, index) => (
                                    <tr
                                        key={`${row.facultyId}-${index}`}
                                        className="border-b border-[#1d395d]"
                                    >
                                        <td className="px-5 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(
                                                    row.facultyId
                                                )}
                                                onChange={() =>
                                                    handleRowSelection(
                                                        row.facultyId
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-3">
                                            {row.employeeName}
                                        </td>
                                        <td className="px-5 py-3">
                                            {row.department}
                                        </td>
                                        <td className="px-5 py-3">
                                            {row.employeeCategory}
                                        </td>
                                        <td className="px-5 py-3">
                                            {row.shiftCode}
                                        </td>
                                        <td className="px-5 py-3">
                                            {row.firstIn || "-"}
                                        </td>
                                        <td className="px-5 py-3">
                                            {row.lastOut || "-"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <select
                                                value={
                                                    editedRows[row.facultyId]
                                                        ?.session1 ??
                                                    row.session1
                                                }
                                                onChange={(e) =>
                                                    handleSessionChange(
                                                        row.facultyId,
                                                        "session1",
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    bg-[#13263d]
                                                    border
                                                    border-[#23476f]
                                                    rounded
                                                    px-2
                                                    py-1
                                                "
                                            >
                                                <option value="P">P</option>
                                                <option value="A">A</option>
                                                <option value="OD">OD</option>
                                                <option value="CL">CL</option>
                                                <option value="EL">EL</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3">
                                            <select
                                                value={
                                                    editedRows[row.facultyId]
                                                        ?.session2 ??
                                                    row.session2
                                                }
                                                onChange={(e) =>
                                                    handleSessionChange(
                                                        row.facultyId,
                                                        "session2",
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    bg-[#13263d]
                                                    border
                                                    border-[#23476f]
                                                    rounded
                                                    px-2
                                                    py-1
                                                "
                                            >
                                                <option value="P">P</option>
                                                <option value="A">A</option>
                                                <option value="OD">OD</option>
                                                <option value="CL">CL</option>
                                                <option value="EL">EL</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div
                className="
                    sticky
                    bottom-0
                    bg-[#102038]
                    border-t
                    border-[#23476f]
                    p-5
                    flex
                    justify-end
                    z-50
                "
            >
                <button
                    onClick={() => {
                        if (
                            Object.keys(editedRows).length === 0 &&
                            selectedRows.length === 0
                        ) {
                            alert(
                                "Please modify attendance or select employees"
                            );
                            return;
                        }

                        setOverrideModal(true);
                    }}
                    className="
                        bg-[#3984ff]
                        hover:bg-[#2f72dd]
                        text-white
                        px-8
                        h-11
                        rounded-lg
                        font-medium
                    "
                >
                    Override
                </button>
            </div>
            <AttendanceOverrideModal
                isOpen={overrideModal}
                mode={
                    Object.keys(editedRows).length === 1
                        ? "single"
                        : "bulk"
                }
                onClose={() => setOverrideModal(false)}
                onSubmit={(data) => {
                    if (Object.keys(editedRows).length === 1) {
                        handleSingleOverride(data);
                    } else {
                        handleBulkEditedOverride(data);
                    }
                }}
            />
        </>
    );
}