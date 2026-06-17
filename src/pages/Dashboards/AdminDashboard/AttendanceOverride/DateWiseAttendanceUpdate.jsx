import React, { useState,useEffect } from "react";
import dayjs from "dayjs";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import { getAttendanceByDate } from "../../../../services/attendanceOverride/getAttendanceByDate";
import { updateAttendanceOverrideSingle } from "../../../../services/attendanceOverride/updateAttendanceOverrideSingle";
import { updateAttendanceOverrideBulk } from "../../../../services/attendanceOverride/updateAttendanceOverrideBulk";
import AttendanceOverrideModal from "./AttendanceOverrideModal";
import { X } from "lucide-react";
import CustomDropdown from "../../../../components/CustomDropdown";

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
    const [loading, setLoading] = useState(false);

    const departmentOptions = [
        "AIDS","AIML","CYS","CSBS","VLSI","CCE","CSE","ECE","EEE","MECH","IT","ADMIN",
    ];

    const categoryOptions = [
        "Teaching",
        "Non Teaching",
        "Drivers",
        "House Keeping",
        "Security",
    ];

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
            console.log("Fresh Attendance Response:");
            console.table(
                response.data.map((r) => ({
                    name: r.employeeName,
                    session1: r.session1,
                    session2: r.session2,
                    status: r.status,
                }))
        );
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
            setEditedRows({}); // clear row edits
            setSelectedRows(
                filteredData.map((row) => row.facultyId)
            );
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelection = (facultyId) => {
        setEditedRows({}); // clear row edits
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
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleBulkEditedOverride = async ({ remarks }) => {
        try {
            setLoading(true);
            const updates = Object.keys(
                editedRows
            ).map((employeeId) => {

                const row = attendanceData.find(
                    (r) => r.facultyId === employeeId
                );

                return {
                    employeeId,
                    session1:
                        editedRows[employeeId]
                            ?.session1 ??
                        row.session1,

                    session2:
                        editedRows[employeeId]
                            ?.session2 ??
                        row.session2,
                };
            });

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
            setSelectedRows([]);
            setEditedRows({});
            fetchAttendance();

        } catch (error) {
            console.error(
                error.response?.data || error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBulkSelectedOverride = async ({
        session1,
        session2,
        remarks,
    }) => {
        try {
            setLoading(true);   
            const updates = selectedRows.map((employeeId) => ({
                employeeId,
                session1,
                session2,
            }));

            const payload = {
                fromDate: dayjs(attendanceDate).format("YYYY-MM-DD"),
                toDate: dayjs(attendanceDate).format("YYYY-MM-DD"),
                remarks,
                updates,
            };

            console.log(
                "Bulk Selected Payload:",
                payload
            );

            console.log("Bulk Selected Payload:", payload);
            const response = await updateAttendanceOverrideBulk(
                payload
            );
            console.log("Bulk Response:", response);

            setOverrideModal(false);
            setSelectedRows([]);
            fetchAttendance();

        } catch (error) {
            console.error(
                "Bulk Selected Error:",
                error.response?.data || error
            );
        } finally {
            setLoading(false);
        }
    };

    const getModalMode = () => {
        if (selectedRows.length > 0)
            return "bulk-selected";
        if (
            Object.keys(editedRows).length === 1
        )
            return "single";
        return "bulk-edited";
    };

    const isBulkSelectionMode = selectedRows.length > 0;

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

                    <div className="w-[180px]">
                        <CustomDropdown
                            id="departmentFilter"
                            value={departmentFilter}
                            options={departmentOptions}
                            placeholder="All Departments"
                            onChange={setDepartmentFilter}
                        />
                    </div>

                    <div className="w-[200px]">
                        <CustomDropdown
                            id="categoryFilter"
                            value={categoryFilter}
                            options={categoryOptions}
                            placeholder="All Categories"
                            onChange={setCategoryFilter}
                        />
                    </div>
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            className="
                                flex
                                items-center
                                gap-2
                                h-11
                                px-4
                                rounded-lg
                                border
                                border-[#244061]
                                bg-[#0d2138]
                                text-[#8ca1bd]
                                hover:bg-[#13263d]
                            "
                        >
                            Reset Filters
                            <X size={18} />
                        </button>
                    )}
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
                                            {row.firstIn
                                                ? dayjs(row.firstIn).format("hh:mm A")
                                                : "-"}
                                        </td>

                                        <td className="px-5 py-3">
                                            {row.lastOut
                                                ? dayjs(row.lastOut).format("hh:mm A")
                                                : "-"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <select
                                                disabled={isBulkSelectionMode}
                                                value={
                                                    editedRows[row.facultyId]?.session1 ??
                                                    row.session1
                                                }
                                                onChange={(e) =>
                                                    handleSessionChange(
                                                        row.facultyId,
                                                        "session1",
                                                        e.target.value
                                                    )
                                                }
                                                className={`
                                                    bg-[#13263d]
                                                    border
                                                    border-[#23476f]
                                                    rounded
                                                    px-2
                                                    py-1
                                                    ${isBulkSelectionMode
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""}
                                                `}
                                            >
                                                <option value="P">P</option>
                                                <option value="A">A</option>
                                                <option value="OD">OD</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3">
                                            <select
                                                disabled={isBulkSelectionMode}
                                                value={
                                                    editedRows[row.facultyId]?.session2 ??
                                                    row.session2
                                                }
                                                onChange={(e) =>
                                                    handleSessionChange(
                                                        row.facultyId,
                                                        "session2",
                                                        e.target.value
                                                    )
                                                }
                                                className={`
                                                    bg-[#13263d]
                                                    border
                                                    border-[#23476f]
                                                    rounded
                                                    px-2
                                                    py-1
                                                    ${isBulkSelectionMode
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""}
                                                `}
                                            >
                                                <option value="P">P</option>
                                                <option value="A">A</option>
                                                <option value="OD">OD</option>
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
                            selectedRows.length > 0 &&
                            Object.keys(editedRows).length > 0
                        ) {
                            alert(
                                "Please use either checkbox bulk override or row edit override, not both."
                            );
                            return;
                        }
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
                loading={loading}
                mode={getModalMode()}
                onClose={() => setOverrideModal(false)}
                onSubmit={(data) => {
                    if (
                        selectedRows.length > 0
                    ) {
                        handleBulkSelectedOverride(data);
                        return;
                    }

                    if (
                        Object.keys(editedRows).length === 1
                    ) {
                        handleSingleOverride(data);
                        return;
                    }

                    handleBulkEditedOverride(data);
                }}
            />
        </>
    );
}