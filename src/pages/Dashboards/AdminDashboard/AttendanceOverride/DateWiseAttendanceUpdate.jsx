import React, { useState,useEffect } from "react";
import dayjs from "dayjs";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import { getAttendanceByDate } from "../../../../services/attendanceOverride/getAttendanceByDate";
import { updateAttendanceOverrideSingle } from "../../../../services/attendanceOverride/updateAttendanceOverrideSingle";
import { updateAttendanceOverrideBulk } from "../../../../services/attendanceOverride/updateAttendanceOverrideBulk";
import AttendanceOverrideModal from "./AttendanceOverrideModal";
import { X,Search } from "lucide-react";
import CustomDropdown from "../../../../components/CustomDropdown";
import AttendanceDropdown from "../../../../components/AttendanceDropdown";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";
import { getLeaveBalance } from "../../../../services/AttendanceOverride/GetLeaveBalance";
import { getCurrentAcademicYear } from "../../../../utils/getCurrentAcademicYear";
import { leaveCodeMap } from "../../../../utils/leaveCodeMap";

export default function DateWiseAttendanceUpdate() {

    const [attendanceDate, setAttendanceDate] =useState(dayjs().subtract(1, "day").toDate());
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedRows, setEditedRows] = useState({});
    const [overrideModal, setOverrideModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [facultyLeaveOptions, setFacultyLeaveOptions] = useState({});
    const [loadingFacultyBalances, setLoadingFacultyBalances] = useState({});

    const {
        isExportModalOpen,
        exportLoading,
        exportError,
        handleExportClick,
        closeExportModal,
        handleConfirmExport,
    } = usePasswordProtectedExport();

    const departmentOptions = [
        "AIDS","AIML","CYS","CSBS","VLSI","CCE","CSE","ECE","EEE","MECH","IT","ADMIN","QPT",
    ];

    const categoryOptions = [
        "Teaching",
        "Non Teaching",
        "Drivers",
        "House Keeping",
        "Security",
    ];

    const hasFilters =
        // attendanceDate ||
        searchTerm ||
        departmentFilter ||
        categoryFilter;

    const normalizedLeaveCodeMap = Object.fromEntries(
        Object.entries({
            ...leaveCodeMap,
            "on duty - official": "OD-O",
            "on duty - exam": "OD-E",
            "on duty - research": "OD-R",
            "od-o": "OD-O",
            "od-e": "OD-E",
            "od-r": "OD-R",
            "od-exam": "OD-E",
            "od-off": "OD-O",
            "lop": "LOP",
            "casual leave recovery": "CL-R",
            "cl-r": "CL-R",
            "cl recovery": "CL-R",
        }).map(([key, value]) => [key.trim().toLowerCase(), value])
    );

    const buildAttendanceOptions = (balances = []) => {
        return (balances || [])
            .map((item) => {
                const leaveTypeObj =
                    item.leaveTypeId && typeof item.leaveTypeId === "object"
                        ? item.leaveTypeId
                        : null;

                const rawLeaveName =
                    leaveTypeObj?.leaveName ||
                    item.leaveName ||
                    item.leaveType ||
                    item.name;

                const normalizedName = rawLeaveName?.trim()?.toLowerCase();
                const code = normalizedLeaveCodeMap[normalizedName];

                if (!code) return null;

                return {
                    value: code,
                    label: `${code} (${item.remainingDays ?? item.balance ?? 0})`,
                    leaveTypeId: leaveTypeObj?._id || item.leaveTypeId,
                    leaveName: rawLeaveName,
                    academicYear: item.academicYear || getCurrentAcademicYear(),
                    remainingDays: item.remainingDays ?? item.balance ?? 0,
                };
            })
            .filter(Boolean);
    };

    const normalizeSessionValue = (value) => {
        if (typeof value === "object" && value !== null) {
            return {
                value: value.value || "P",
                leaveTypeId: value.leaveTypeId ?? null,
                leaveName: value.leaveName || "Present",
                academicYear: value.academicYear || getCurrentAcademicYear(),
                remainingDays: value.remainingDays ?? null,
            };
        }

        return {
            value: value || "P",
            leaveTypeId: null,
            leaveName: value === "P" ? "Present" : "Absent",
            academicYear: getCurrentAcademicYear(),
            remainingDays: null,
        };
    };

    const calculateLeaveDays = (session1, session2) => {
        const firstHalf = session1?.value === "P";
        const secondHalf = session2?.value === "P";

        if (firstHalf && secondHalf) {
            return 0;
        }

        if (firstHalf || secondHalf) {
            return 0.5;
        }

        return 1;
    };

    const getPayloadLeaveDetails = (session1, session2) => {
        const selectedSession =
            session1?.value && session1.value !== "P"
                ? session1
                : session2;

        const leaveName = selectedSession?.leaveName ?? "Present";

        return {
            leaveTypeId: selectedSession?.leaveTypeId ?? null,
            leaveName,
            leaveType: leaveName,
            academicYear:
                selectedSession?.academicYear ?? getCurrentAcademicYear(),
        };
    };

    const getSessionLeaveFields = (session, index) => ({
        [`session${index}LeaveTypeId`]: session?.leaveTypeId ?? null,
        [`session${index}LeaveName`]:
            session?.leaveName ??
            (session?.value === "P" ? "Present" : session?.value),
    });

    useEffect(() => {
        if (!attendanceDate) return;

        fetchAttendance();
    }, [attendanceDate]);

    const loadFacultyLeaveBalances = async (facultyId, forceReload = false) => {
        if (!facultyId) return;
        if (!forceReload && facultyLeaveOptions[facultyId]) return;
        if (loadingFacultyBalances[facultyId]) return;

        setLoadingFacultyBalances((prev) => ({ ...prev, [facultyId]: true }));

        try {
            if (forceReload) {
                setFacultyLeaveOptions((prev) => {
                    const next = { ...prev };
                    delete next[facultyId];
                    return next;
                });
            }
            const response = await getLeaveBalance(facultyId);
            if (response?.success) {
                const currentAcademicYear = getCurrentAcademicYear();
                const allBalances = response.balances || [];
                const filteredBalances = allBalances.filter(
                    (item) => item.academicYear === currentAcademicYear
                );
                const selectedBalances =
                    filteredBalances.length > 0
                        ? filteredBalances
                        : allBalances;

                setFacultyLeaveOptions((prev) => ({
                    ...prev,
                    [facultyId]: buildAttendanceOptions(selectedBalances),
                }));
            } else {
                setFacultyLeaveOptions((prev) => ({ ...prev, [facultyId]: [] }));
            }
        } catch (error) {
            console.error(error);
            setFacultyLeaveOptions((prev) => ({ ...prev, [facultyId]: [] }));
        } finally {
            setLoadingFacultyBalances((prev) => ({ ...prev, [facultyId]: false }));
        }
    };

    const fetchAttendance = async () => {
        try {
            setSelectedRows([]);
            setEditedRows({});
            const formattedDate = dayjs(attendanceDate).format("YYYY-MM-DD");
            const response = await getAttendanceByDate(formattedDate);

            const normalizedRows = (response.data || []).map((row) => ({
                ...row,
                session1: normalizeSessionValue(row.session1),
                session2: normalizeSessionValue(row.session2),
            }));

            setAttendanceData(normalizedRows);
        } catch (error) {
            console.error(error);
        }
    };
    // console.log("fetchAttendance",fetchAttendance);
    

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
    // console.log("Attendance Data:", attendanceData);
    // console.log("Filtered Data:", filteredData);

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

    const getFacultyOptions = (facultyId) => {
        const allOptions = facultyLeaveOptions[facultyId] || [];
        return {
            leaveOptions: allOptions.filter((option) =>
                ["CL", "ML", "LOP"].includes(option.value)
            ),
            odOptions: allOptions.filter((option) =>
                ["OD-R", "OD-E", "OD-O", "CL-R"].includes(option.value)
            ),
        };
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
        // setAttendanceDate(null);
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

            const session1 = editedRows[employeeId]?.session1 ?? row.session1;
            const session2 = editedRows[employeeId]?.session2 ?? row.session2;
            const leaveDetails = getPayloadLeaveDetails(session1, session2);

            const payload = {
                firstIn: row.firstIn,
                lastOut: row.lastOut,
                session1: session1?.value ?? "P",
                session2: session2?.value ?? "P",
                ...getSessionLeaveFields(session1, 1),
                ...getSessionLeaveFields(session2, 2),
                remarks,
                facultyId: row.facultyId,
                ...leaveDetails,
                leaveBalance: session1?.remainingDays ?? session2?.remainingDays ?? null,
                totalNumberOfDays: calculateLeaveDays(session1, session2),
            };

            await updateAttendanceOverrideSingle(
                employeeId,
                dayjs(attendanceDate).format("YYYY-MM-DD"),
                payload
            );

            await loadFacultyLeaveBalances(row.facultyId, true);

            toast.success("Attendance updated successfully!");

            setOverrideModal(false);
            setEditedRows({});
            fetchAttendance();
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                "Failed to update attendance"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBulkEditedOverride = async ({ remarks }) => {
        try {
            setLoading(true);
            const formattedDate = dayjs(attendanceDate).format("YYYY-MM-DD");
            const updates = Object.keys(editedRows).map((employeeId) => {
                const row = attendanceData.find(
                    (r) => r.facultyId === employeeId
                );
                const session1 = editedRows[employeeId]?.session1 ?? row?.session1;
                const session2 = editedRows[employeeId]?.session2 ?? row?.session2;
                const leaveDetails = getPayloadLeaveDetails(session1, session2);

                return {
                    employeeId,
                    facultyId: row?.facultyId,
                    date: formattedDate,
                    firstIn: row?.firstIn,
                    lastOut: row?.lastOut,
                    session1: session1?.value ?? "P",
                    session2: session2?.value ?? "P",
                    ...getSessionLeaveFields(session1, 1),
                    ...getSessionLeaveFields(session2, 2),
                    remarks,
                    ...leaveDetails,
                    leaveBalance: session1?.remainingDays ?? session2?.remainingDays ?? null,
                    totalNumberOfDays: calculateLeaveDays(session1, session2),
                };
            });

            const payload = {
                fromDate: formattedDate,
                toDate: formattedDate,
                remarks,
                updates,
            };

            await updateAttendanceOverrideBulk(payload);
            toast.success("Attendance updated successfully!");
            setOverrideModal(false);
            setSelectedRows([]);
            setEditedRows({});
            fetchAttendance();

        } catch (error) {
            console.error(
                error.response?.data || error
            );
            toast.error(
                error?.response?.data?.message ||
                "Failed to update attendance"
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
            const formattedDate = dayjs(attendanceDate).format("YYYY-MM-DD");
            const updates = selectedRows.map((employeeId) => {
                const row = attendanceData.find((r) => r.facultyId === employeeId);

                return {
                    employeeId,
                    facultyId: row?.facultyId,
                    date: formattedDate,
                    firstIn: row?.firstIn,
                    lastOut: row?.lastOut,
                    session1: session1?.value ?? "P",
                    session2: session2?.value ?? "P",
                    remarks,
                    leaveTypeId: session1?.leaveTypeId ?? session2?.leaveTypeId ?? null,
                    leaveName: session1?.leaveName ?? session2?.leaveName ?? "Present",
                    academicYear: session1?.academicYear ?? session2?.academicYear ?? getCurrentAcademicYear(),
                    leaveBalance: session1?.remainingDays ?? session2?.remainingDays ?? null,
                    totalNoOfDays: calculateLeaveDays(session1, session2),
                };
            });

            const payload = {
                fromDate: formattedDate,
                toDate: formattedDate,
                remarks,
                updates,
            };

            await updateAttendanceOverrideBulk(payload);
            toast.success("Attendance updated successfully!");
            setOverrideModal(false);
            setSelectedRows([]);
            setEditedRows({});
            fetchAttendance();

        } catch (error) {
            console.error(
                "Bulk Selected Error:",
                error.response?.data || error
            );
            toast.error(
                error?.response?.data?.message ||
                "Failed to update attendance"
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

    const getBulkModalOptions = () => {
        const selectedFacultyIds = selectedRows.map((facultyId) => facultyId);
        const optionMap = new Map();

        selectedFacultyIds.forEach((facultyId) => {
            const { leaveOptions, odOptions } = getFacultyOptions(facultyId);
            leaveOptions.forEach((option) => optionMap.set(option.value, option));
            odOptions.forEach((option) => optionMap.set(option.value, option));
        });

        return {
            leaveOptions: Array.from(optionMap.values()).filter((option) =>
                ["CL", "ML", "LOP"].includes(option.value)
            ),
            odOptions: Array.from(optionMap.values()).filter((option) =>
                ["OD-R", "OD-E", "OD-O", "CL-R"].includes(option.value)
            ),
        };
    };

    const exportToExcel = () => {
        const exportData = filteredData.map((row) => ({
            Employee: row.employeeName,
            Department: row.department,
            Category: row.employeeCategory,
            ShiftCode: row.shiftCode,
            FirstIn: row.firstIn
                ? dayjs(row.firstIn).format("hh:mm A")
                : "-",
            LastOut: row.lastOut
                ? dayjs(row.lastOut).format("hh:mm A")
                : "-",
            Session1:
                editedRows[row.facultyId]?.session1 ??
                row.session1,
            Session2:
                editedRows[row.facultyId]?.session2 ??
                row.session2,
        }));

        const worksheet =
            XLSX.utils.json_to_sheet(exportData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Attendance Override"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const dateText = attendanceDate
            ? dayjs(attendanceDate).format("DD-MM-YYYY")
            : "All";

        saveAs(
            fileData,
            `DateWise_Attendance_Override_${dateText}.xlsx`
        );
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

                    <div className="relative">
                        <Search
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-[#6f839f]
                            "
                        />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Employee"
                            className="
                                h-11
                                pl-11
                                w-[250px]
                                rounded-lg
                                bg-[#13263d]
                                border
                                border-[#23476f]
                                px-4
                                text-white
                            "
                        />
                    </div>

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
                    <button
                        onClick={handleExportClick}
                        disabled={filteredData.length === 0}
                        className="
                            h-11
                            px-5
                            rounded-lg
                            border
                            border-[#3984ff]
                            text-[#3984ff]
                            font-medium
                            transition
                            hover:bg-[#3984ff]
                            hover:text-white
                            cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        Export Excel
                    </button>
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
                                cursor-pointer
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
                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-[#0a1a2d] scrollbar-thumb-[#244061]">
                    <table className="w-full table-auto border-collapse text-left">
                        <thead className="sticky top-0 z-10 bg-[#172c46] text-[14px] text-[#9aacc7]">
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
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">First In</th>
                                <th className="px-5 py-4">Last Out</th>
                                <th className="px-5 py-4">Session 1</th>
                                <th className="px-5 py-4">Session 2</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#cad7eb] text-[14px]">
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
                                            {row.status || "-"}
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
                                            {isBulkSelectionMode ? (
                                                <div className="rounded border border-[#23476f] bg-[#13263d] px-3 py-2 text-white">
                                                    P
                                                </div>
                                            ) : (
                                                <div>
                                                    <AttendanceDropdown
                                                        value={
                                                            editedRows[row.facultyId]?.session1?.value ??
                                                            row.session1?.value ??
                                                            "P"
                                                        }
                                                        leaveOptions={getFacultyOptions(row.facultyId).leaveOptions}
                                                        odOptions={getFacultyOptions(row.facultyId).odOptions}
                                                        onOptionSelect={(option) =>
                                                            handleSessionChange(
                                                                row.facultyId,
                                                                "session1",
                                                                option
                                                            )
                                                        }
                                                        onSubmenuOpen={(menu) => {
                                                            if (menu === "A" || menu === "OD") {
                                                                loadFacultyLeaveBalances(row.facultyId);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            {isBulkSelectionMode ? (
                                                <div className="rounded border border-[#23476f] bg-[#13263d] px-3 py-2 text-white">
                                                    P
                                                </div>
                                            ) : (
                                                <div>
                                                    <AttendanceDropdown
                                                        value={
                                                            editedRows[row.facultyId]?.session2?.value ??
                                                            row.session2?.value ??
                                                            "P"
                                                        }
                                                        leaveOptions={getFacultyOptions(row.facultyId).leaveOptions}
                                                        odOptions={getFacultyOptions(row.facultyId).odOptions}
                                                        onOptionSelect={(option) =>
                                                            handleSessionChange(
                                                                row.facultyId,
                                                                "session2",
                                                                option
                                                            )
                                                        }
                                                        onSubmenuOpen={(menu) => {
                                                            if (menu === "A" || menu === "OD") {
                                                                loadFacultyLeaveBalances(row.facultyId);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
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
                leaveOptions={getBulkModalOptions().leaveOptions}
                odOptions={getBulkModalOptions().odOptions}
                bulkSimpleOnly={getModalMode() === 'bulk-selected'}
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
            <ExportPasswordModal
                isOpen={isExportModalOpen}
                onClose={closeExportModal}
                onConfirm={(password) => handleConfirmExport(password, exportToExcel)}
                loading={exportLoading}
                error={exportError}
            />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    );
}