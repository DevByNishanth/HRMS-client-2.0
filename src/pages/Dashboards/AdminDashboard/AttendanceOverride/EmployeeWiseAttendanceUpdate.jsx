import React, { useEffect, useRef, useState } from "react";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import AttendanceOverrideModal from "./AttendanceOverrideModal";
import { X, Search } from "lucide-react";
import { getfacultiesName } from "../../../../services/LeaveBalance/getEmployeNameService";
import { getEmployeeAttendanceOverride  } from "../../../../services/attendanceOverride/GetAttendanceByEmployee";
import { updateAttendanceOverrideSingle } from "../../../../services/attendanceOverride/updateAttendanceOverrideSingle";
import { updateAttendanceOverrideEmployeeBulk } from "../../../../services/attendanceOverride/updateAttendanceOverrideEmployeeBulk";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExportPasswordModal from "../../../../components/ExportPasswordModal";
import { usePasswordProtectedExport } from "../../../../hooks/usePasswordProtectedExport";
import { leaveCodeMap } from "../../../../utils/leaveCodeMap";
import { getLeaveBalance } from "../../../../services/AttendanceOverride/GetLeaveBalance";
import { getCurrentAcademicYear } from "../../../../utils/getCurrentAcademicYear";
import AttendanceDropdown  from "../../../../components/AttendanceDropdown";

export default function EmployeeWiseAttendanceUpdate() {

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("single");
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [editedRows, setEditedRows] = useState([]);
    // const [isBulkOverride, setIsBulkOverride] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [openPicker, setOpenPicker] = useState(null);
    const [leaveBalances,setLeaveBalances]=useState([]);

    const {
        isExportModalOpen,
        exportLoading,
        exportError,
        handleExportClick,
        closeExportModal,
        handleConfirmExport,
    } = usePasswordProtectedExport();

    const dropdownRef = useRef();

    useEffect(() => {
        const closeDropdown = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", closeDropdown);

        return () => {
            document.removeEventListener(
                "mousedown",
                closeDropdown
            );
        };
    }, []);

    const searchEmployees = async (value) => {
        setEmployeeSearch(value);

        if (value.trim().length < 2) {
            setEmployeeSuggestions([]);
            return;
        }

        try {
            const response = await getfacultiesName(value);

            if (response?.success) {
                setEmployeeSuggestions(response.data || []);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectEmployee = async (employee) => {
        setSelectedEmployee(employee);
        // console.log("Selected Employee", employee);
        setEmployeeSearch(
            `${employee.name} (${employee.empId})`
        );

        setShowDropdown(false);

        await Promise.all([
            loadAttendance(employee.facultyId),
            loadLeaveBalance(employee.facultyId),
        ]);
    };

    const loadAttendance = async (employeeId) => {
        // console.log("Loading Attendance For", employeeId);

        try {
            setLoading(true);
            const response =
                await getEmployeeAttendanceOverride(employeeId);
            // console.log("Attendance Response", response);
            // console.log("Attendance Data", response?.data);
            if (response?.success) {
                const convertedData = (response.data || []).map((row) => ({
                    ...row,
                    session1: {
                        value: row.session1,
                        leaveTypeId: row.leaveTypeId ?? null,
                        leaveName: row.leaveName ?? "Present",
                        academicYear:
                            row.academicYear ??
                            getCurrentAcademicYear(),
                    },

                    session2: {
                        value: row.session2,
                        leaveTypeId: row.leaveTypeId ?? null,
                        leaveName: row.leaveName ?? "Present",
                        academicYear:
                            row.academicYear ??
                            getCurrentAcademicYear(),
                    },
                }));
                setAttendanceData(convertedData);
                setFilteredAttendance(convertedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadLeaveBalance = async (facultyId)=>{
        try{
            const response = await getLeaveBalance(facultyId);
            if(response.success){
                const currentAcademicYear =
                    getCurrentAcademicYear();
                const filtered =
                    response.data.filter(
                        item=>item.academicYear===currentAcademicYear
                    );
                setLeaveBalances(filtered);
            }
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        if (!fromDate || !toDate) {
            setFilteredAttendance(attendanceData);
            return;
        }

        const filtered = attendanceData.filter((item) => {
            const attendanceDate = new Date(item.date);

            return (
                attendanceDate >= new Date(fromDate) &&
                attendanceDate <= new Date(toDate)
            );
        });

        setFilteredAttendance(filtered);
    }, [fromDate, toDate, attendanceData]);

    const handleReset = () => {
        setFromDate(null);
        setToDate(null);
        setEmployeeSearch("");
        setEmployeeSuggestions([]);
        setShowDropdown(false);
        setSelectedEmployee(null);
        setAttendanceData([]);
        setFilteredAttendance([]);
        setSelectedRows([]);
        setEditedRows([]);
    };

    // const optionLookup = {
    //     P: {
    //         value: "P",
    //         leaveTypeId: null,
    //         leaveName: "Present",
    //         academicYear: getCurrentAcademicYear(),
    //     },

    //     ...Object.fromEntries(
    //         leaveOptions.map((item) => [
    //             item.value,
    //             {
    //                 value: item.value,
    //                 leaveTypeId: item.leaveTypeId,
    //                 leaveName: item.leaveName,
    //                 academicYear: item.academicYear,
    //                 balance: item.balance,
    //             },
    //         ])
    //     ),

    //     ...Object.fromEntries(
    //         odOptions.map((item) => [
    //             item.value,
    //             {
    //                 value: item.value,
    //                 leaveTypeId: item.leaveTypeId,
    //                 leaveName: item.leaveName,
    //                 academicYear: getCurrentAcademicYear(),
    //             },
    //         ])
    //     ),
    // };

    const handleSessionChange = (rowId, field, value) => {
        const selectedOption =
            [...leaveOptions, ...odOptions].find(
                option => option.value === value
            ) || {
                value: "P",
                label: "P",
                leaveTypeId: null,
                leaveName: "Present",
                academicYear: getCurrentAcademicYear(),
                balance: null,
            };
        const updated = filteredAttendance.map((row) =>
            row._id === rowId
                ? {
                    ...row,
                    [field]: selectedOption,
                }
                : row
        );
        setFilteredAttendance(updated);
        if (!editedRows.includes(rowId)) {
            setEditedRows((prev) => [...prev, rowId]);
        }
    };

    const handleRowSelection = (rowId) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(
                selectedRows.filter((id) => id !== rowId)
            );
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };

    const handleSelectAll = (checked) => {
        // setIsBulkOverride(checked);

        if (checked) {
            setSelectedRows(
                filteredAttendance.map((item) => item._id)
            );
        } else {
            setSelectedRows([]);
        }
    };

    const openOverrideModal = () => {
        // Bulk Selected (checkbox based)
        if (selectedRows.length > 0) {
            const isDateRangeSelection =
                fromDate &&
                toDate &&
                selectedRows.length ===
                filteredAttendance.length;
            setModalMode(
                isDateRangeSelection
                    ? "bulk-selected"
                    : "bulk-selected"
            );
            setShowModal(true);
            return;
        }
        // Single / Bulk Row Edit
        if (editedRows.length === 0) {
            toast.warning(
                "Please modify at least one attendance record"
            );
            return;
        }
        setModalMode(
            editedRows.length === 1
                ? "single"
                : "bulk-row"
        );
        setShowModal(true);
    };

    const formatOverrideDate = (record) => {
        if (record.overrideType === "BULK") {
            return (
                <>
                    <div>
                        {new Date(record.fromDate).toLocaleDateString("en-GB")}
                    </div>
                    <div>to</div>
                    <div>
                        {new Date(record.toDate).toLocaleDateString("en-GB")}
                    </div>
                </>
            );
        }

        return record.date
            ? new Date(record.date).toLocaleDateString("en-GB")
            : "-";
    };
    // console.log("formart override data", formatOverrideDate);

    const showResetButton =
        fromDate ||
        toDate ||
        employeeSearch.trim() !== "";

    const handleExportExcel = () => {
        const exportData = filteredAttendance.map((row) => ({
            Date:
                row.overrideType === "BULK"
                    ? `${new Date(row.fromDate).toLocaleDateString("en-GB")} - ${new Date(row.toDate).toLocaleDateString("en-GB")}`
                    : new Date(row.date).toLocaleDateString("en-GB"),
            "Employee Category": row.employeeCategory || "-",

            Shift: row.shiftCode || "-",
            Status: row.status || "-",

            "First In": row.firstIn
                ? new Date(row.firstIn).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "-",

            "Last Out": row.lastOut
                ? new Date(row.lastOut).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "-",

            Session1: row.session1?.value || "P",
            Session2: row.session2?.value || "P",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);

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

        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const employeeName =
            selectedEmployee?.name?.replace(/\s+/g, "_") ||
            "Employee";

        saveAs(
            file,
            `${employeeName}_Attendance_Override.xlsx`
        );
    };

    const formatDateForApi = (date) => {
        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
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

    const leaveOptions = leaveBalances.map((item) => ({
        value: leaveCodeMap[item.leaveName],   // CL
        label: `${leaveCodeMap[item.leaveName]} (${item.balance})`,
        leaveTypeId: item.leaveTypeId?._id,
        leaveName: item.leaveName,             // Casual Leave
        academicYear: item.academicYear,
        balance: item.balance,
    }));

    const odOptions = [
        {
            value: "OD-R",
            label: "OD-R (12)",
            leaveTypeId: 101,
            leaveName: "OD-R",
        },
        {
            value: "OD-EXAM",
            label: "OD-E (15)",
            leaveTypeId: 102,
            leaveName: "OD-EXAM",
        },
        {
            value: "OD-OFF",
            label: "OD-O (20)",
            leaveTypeId: 103,
            leaveName: "OD-OFF",
        },
    ];

    useEffect(() => {
        if (!attendanceData.length || !leaveOptions.length) return;

        const updated = attendanceData.map((row) => ({
            ...row,
            session1:
                [...leaveOptions, ...odOptions].find(
                    x => x.value === row.session1.value
                ) || row.session1,

            session2:
                [...leaveOptions, ...odOptions].find(
                    x => x.value === row.session2.value
                ) || row.session2,
        }));

        setFilteredAttendance(updated);
    }, [leaveBalances]);
    // const attendanceOptions = [
    //     {
    //         label: "Present",
    //         options: [
    //             {
    //                 value: "P",
    //                 label: "P",
    //             },
    //         ],
    //     },

    //     {
    //         label: "Absent",
    //         options: leaveOptions,
    //     },

    //     {
    //         label: "OD",
    //         options: odOptions,
    //     },
    // ];

    return (
        <>
            {/* FILTERS */}

            <div className="px-6 pt-4 pb-3">

                <div
                    className="flex flex-wrap gap-3 items-center"
                    ref={dropdownRef}
                >
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
                            value={employeeSearch}
                            onChange={(e) =>
                                searchEmployees(
                                    e.target.value
                                )
                            }
                            placeholder="Search Employee"
                            className="h-10 pl-11 w-[300px] rounded-lg border border-[#244061] bg-[#0d2138] text-white px-4"
                        />

                        {showDropdown &&
                            employeeSuggestions.length > 0 && (
                                <div className="absolute
                                    top-12
                                    z-50
                                    w-[300px]
                                    max-h-[300px]
                                    overflow-y-auto
                                    custom-scrollbar
                                    rounded-lg
                                    border
                                    border-[#244061]
                                    bg-[#172c46]
                                    shadow-xl"
                                >
                                    {employeeSuggestions.map(
                                        (employee) => (
                                            <div
                                                key={
                                                    employee.facultyId
                                                }
                                                onClick={() =>
                                                    selectEmployee(
                                                        employee
                                                    )
                                                }
                                                className="cursor-pointer border-b border-[#244061] p-3 hover:bg-[#1f3a5c]"
                                            >
                                                <div className="flex items-center gap-3">

                                                    <div className="h-10 w-10 rounded-full bg-[#3984ff] flex items-center justify-center text-white font-semibold">
                                                        {employee.name?.charAt(
                                                            0
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="text-white font-medium">
                                                            {
                                                                employee.name
                                                            }
                                                        </div>

                                                        <div className="text-xs text-[#9eb3cf]">
                                                            {
                                                                employee.empId
                                                            }
                                                        </div>

                                                        <div className="text-xs text-[#9eb3cf]">
                                                            {
                                                                employee.department
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                    </div>

                    <div className="w-[160px]">
                        <CustomDatePicker
                            value={fromDate}
                            onChange={setFromDate}
                            placeholder="Date From"
                            isOpen={openPicker === "from"}
                            setIsOpen={(open) =>
                                setOpenPicker(open ? "from" : null)
                            }
                        />
                    </div>

                    <span className="text-[#8ca1bd]">
                        to
                    </span>

                    <div className="w-[160px]">
                        <CustomDatePicker
                            value={toDate}
                            onChange={setToDate}
                            placeholder="Date To"
                            isOpen={openPicker === "to"}
                            setIsOpen={(open) =>
                                setOpenPicker(open ? "to" : null)
                            }
                        />
                    </div>

                    {filteredAttendance.length > 0 && (
                        <button
                            onClick={handleExportClick}
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
                    )}

                    {
                        showResetButton && (
                            <button
                                onClick={handleReset}
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
                        )
                    }
                </div>
            </div>

            {/* {selectedEmployee && (
                <div className="mx-7 mb-5 rounded-xl border border-[#244061] bg-[#172c46] p-5">

                    <div className="text-xl text-white font-semibold">
                        {selectedEmployee.name}
                    </div>

                    <div className="mt-2 text-[#9eb3cf]">
                        Employee ID :
                        {selectedEmployee.empId}
                    </div>

                    <div className="text-[#9eb3cf]">
                        Department :
                        {selectedEmployee.department}
                    </div>

                </div>
            )} */}

            <div className="overflow-hidden px-7 pb-24">

                <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-[#1d3657] scrollbar-thin scrollbar-track-[#0a1a2d] scrollbar-thumb-[#244061]">

                    <table className="w-full table-fixed border-collapse">

                        <thead className="sticky top-0 bg-[#172c46] text-[14px] text-[#9aacc7] z-10">

                            <tr>

                                <th className="px-3 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            handleSelectAll(
                                                e.target.checked
                                            )
                                        }
                                    />
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Category
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Date
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Shift
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Status
                                </th>

                                <th className="px-3 py-3 text-center">
                                    First In
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Last Out
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Session1
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Session2
                                </th>

                            </tr>

                        </thead>

                        <tbody className="text-[#cad7eb] text-[14px]">
                        {
                            loading ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="py-10 text-center text-[#9eb3cf]"
                                    >
                                        Loading attendance...
                                    </td>
                                </tr>
                            ) : filteredAttendance.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="py-10 text-center text-[#9eb3cf]"
                                    >
                                        {/* No Attendance Records Found */}
                                        Search Employe Name to display Attendance Records
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendance.map((row) => (
                                    <tr
                                        key={row._id}
                                        className="border-b border-[#1d3657]"
                                    >
                                        <td className="px-3 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(
                                                    row._id
                                                )}
                                                onChange={() =>
                                                    handleRowSelection(row._id)
                                                }
                                            />
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {row.employeeCategory || "-"}
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {formatOverrideDate(row)}
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {row.shiftCode}
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {row.status}
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {row.firstIn
                                                ? new Date(
                                                    row.firstIn
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "-"}
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {row.lastOut
                                                ? new Date(
                                                    row.lastOut
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "-"}
                                        </td>

                                        <td className="px-3 py-3 text-center cursor-pointer">
                                            <AttendanceDropdown
                                                value={row.session1?.value || "P"}
                                                leaveOptions={leaveOptions}
                                                odOptions={odOptions}
                                                onChange={(value) =>
                                                handleSessionChange(
                                                    row._id,
                                                    "session1",
                                                    value
                                                )
                                                }
                                            />
                                        </td>

                                        <td className="px-3 py-3 text-center cursor-pointer">
                                            <AttendanceDropdown
                                                value={row.session2?.value || "P"}
                                                leaveOptions={leaveOptions}
                                                odOptions={odOptions}
                                                onChange={(value) =>
                                                handleSessionChange(
                                                    row._id,
                                                    "session2",
                                                    value
                                                )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                        </tbody>
                    </table>
                </div>
                <div className="mt-5 flex justify-end">
                    <button
                        onClick={openOverrideModal}
                        className="rounded-lg bg-[#3984ff] px-8 py-3 text-white font-medium hover:bg-[#2d73e8] cursor-pointer"
                    >
                        Override
                    </button>
                </div>
            </div>

            <ExportPasswordModal
                isOpen={isExportModalOpen}
                onClose={closeExportModal}
                onConfirm={(password) => handleConfirmExport(password, handleExportExcel)}
                loading={exportLoading}
                error={exportError}
            />
            <AttendanceOverrideModal
                isOpen={showModal}
                mode={modalMode}
                loading={updateLoading}
                selectedRow={selectedRowData}
                onClose={() =>
                    setShowModal(false)
                }
                onSubmit={async (formData) => {
                    try {
                        setUpdateLoading(true);
                        if (modalMode === "single") {
                            const row =
                                filteredAttendance.find(
                                    item =>
                                        editedRows.includes(
                                            item._id
                                        )
                                );
                            const totalNoOfDays = calculateLeaveDays(
                                row.session1,
                                row.session2
                            );
                            await updateAttendanceOverrideSingle(
                                row.employeeId,
                                formatDateForApi(row.date),
                                {
                                    firstIn: row.firstIn,
                                    lastOut: row.lastOut,

                                    session1: row.session1.value,
                                    session2: row.session2.value,

                                    remarks: formData.remarks,

                                    facultyId: selectedEmployee.facultyId,

                                    leaveTypeId:
                                        row.session1.leaveTypeId ??
                                        row.session2.leaveTypeId,

                                    leaveName:
                                        row.session1.leaveName ??
                                        row.session2.leaveName,

                                    academicYear: getCurrentAcademicYear(),

                                    totalNoOfDays,
                                }
                            );
                            toast.success(
                                "Attendance Updated Successfully"
                            );
                        }
                        else if (modalMode === "bulk-row") {
                            const editedRecords = filteredAttendance.filter(
                                row => editedRows.includes(row._id)
                            );

                            const payload = {
                                remarks: formData.remarks,
                                updates: editedRecords.map((row) => ({
                                    date: formatDateForApi(row.date),

                                    session1: row.session1.value,
                                    session2: row.session2.value,

                                    leaveTypeId:
                                        row.session1.leaveTypeId ??
                                        row.session2.leaveTypeId,

                                    leaveName:
                                        row.session1.leaveName ??
                                        row.session2.leaveName,

                                    academicYear: getCurrentAcademicYear(),

                                    totalNoOfDays: calculateLeaveDays(
                                        row.session1,
                                        row.session2
                                    ),

                                }))
                            };

                            await updateAttendanceOverrideEmployeeBulk(
                                selectedEmployee.facultyId,
                                payload
                            );
                            toast.success(
                                "Attendance Updated Successfully"
                            );
                        }
                        else if (modalMode === "bulk-selected") {
                            const selectedRecords = filteredAttendance.filter(
                                row => selectedRows.includes(row._id)
                            );
                            const totalNoOfDays = calculateLeaveDays(
                                formData.session1,
                                formData.session2
                            );

                            const payload = {
                                remarks: formData.remarks,
                                updates: selectedRecords.map((row) => ({
                                    date: formatDateForApi(row.date),

                                    session1: formData.session1.value,
                                    session2: formData.session2.value,

                                    leaveTypeId:
                                        formData.session1.leaveTypeId ??
                                        formData.session2.leaveTypeId,

                                    leaveName:
                                        formData.session1.leaveName ??
                                        formData.session2.leaveName,

                                    academicYear: getCurrentAcademicYear(),

                                    totalNoOfDays,
                                })),
                            };

                            await updateAttendanceOverrideEmployeeBulk(
                                selectedEmployee.facultyId,
                                payload
                            );
                            toast.success(
                                "Attendance Updated Successfully"
                            );
                        }
                        setShowModal(false);
                        // const refreshed =
                            // await getEmployeeAttendanceOverride(
                            //     selectedEmployee.facultyId
                            // );
                            await loadAttendance(selectedEmployee.facultyId);
                        // if (refreshed?.success) {
                        //     setAttendanceData(
                        //         refreshed.data || []
                        //     );
                        //     setFilteredAttendance(
                        //         refreshed.data || []
                        //     );
                        // }
                        setSelectedRows([]);
                        setEditedRows([]);
                    } catch (error) {
                        console.error(error);
                        toast.error(
                            error?.response?.data?.message ||
                            "Failed To Update Attendance"
                        );
                    } finally {
                        setUpdateLoading(false);
                    }
                }}
            />
            {/* Fixed Footer */}

            {/* <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#244061] bg-[#0d2138] p-4">

                <div className="flex justify-end">

                    <button
                        onClick={
                            openOverrideModal
                        }
                        className="rounded-lg bg-[#3984ff] px-8 py-3 text-white font-medium hover:bg-[#2d73e8]"
                    >
                        Override
                    </button>

                </div>

            </div> */}

        </>
    );
}