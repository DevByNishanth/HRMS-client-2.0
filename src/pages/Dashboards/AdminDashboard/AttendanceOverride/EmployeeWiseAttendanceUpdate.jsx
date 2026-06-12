import React, { useEffect, useRef, useState } from "react";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import AttendanceOverrideModal from "./AttendanceOverrideModal";

import { getfacultiesName } from "../../../../services/LeaveBalance/getEmployeNameService";
import { getEmployeeAttendanceOverride  } from "../../../../services/attendanceOverride/GetAttendanceByEmployee";
import { updateAttendanceOverrideSingle } from "../../../../services/attendanceOverride/updateAttendanceOverrideSingle";
import { updateAttendanceOverrideBulk } from "../../../../services/attendanceOverride/updateAttendanceOverrideBulk";

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
    // const [isBulkOverride, setIsBulkOverride] = useState(false);

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
        console.log("Selected Employee", employee);
        setEmployeeSearch(
            `${employee.name} (${employee.empId})`
        );

        setShowDropdown(false);

        await loadAttendance(employee.facultyId);
    };

    const loadAttendance = async (employeeId) => {
        console.log("Loading Attendance For", employeeId);

        try {
            setLoading(true);

            const response =
                await getEmployeeAttendanceOverride(employeeId);

            console.log("Attendance Response", response);
            console.log("Attendance Data", response?.data);

            if (response?.success) {
                setAttendanceData(response.data || []);
                setFilteredAttendance(response.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

        setFilteredAttendance(attendanceData);
    };

    const handleSessionChange = (
        rowId,
        field,
        value
    ) => {
        const updated = filteredAttendance.map((row) =>
            row._id === rowId
                ? {
                      ...row,
                      [field]: value,
                  }
                : row
        );

        setFilteredAttendance(updated);
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
        if (selectedRows.length === 0) {
            alert(
                "Please select at least one attendance record"
            );
            return;
        }

        setModalMode(
            selectedRows.length > 1
                ? "bulk"
                : "single"
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

    return (
        <>
            {/* FILTERS */}

            <div className="px-6 pt-4 pb-3">

                <div
                    className="flex flex-wrap gap-3 items-center"
                    ref={dropdownRef}
                >
                    <div className="relative">

                        <input
                            type="text"
                            value={employeeSearch}
                            onChange={(e) =>
                                searchEmployees(
                                    e.target.value
                                )
                            }
                            placeholder="Search Employee"
                            className="h-10 w-[300px] rounded-lg border border-[#244061] bg-[#0d2138] text-white px-4"
                        />

                        {showDropdown &&
                            employeeSuggestions.length > 0 && (
                                <div className="absolute top-12 z-50 w-full rounded-lg border border-[#244061] bg-[#172c46] shadow-xl overflow-hidden">

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
                        />
                    </div>

                    {/* <button
                        onClick={handleShow}
                        className="h-11 px-8 rounded-lg bg-[#3984ff] text-white"
                    >
                        Show
                    </button> */}

                    <button
                        onClick={handleReset}
                        className="h-10 px-6 rounded-lg bg-[#223d5f] text-white"
                    >
                        Reset
                    </button>
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

                <div className="max-h-[420px] overflow-y-auto rounded-lg border border-[#1d3657]">

                    <table className="w-full table-fixed border-collapse">

                        <thead className="sticky top-0 bg-[#172c46] text-[#9aacc7] z-10">

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

                        <tbody className="text-[#cad7eb]">
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
                                        No Attendance Records Found
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

                                        <td className="px-3 py-3 text-center">
                                            <select
                                                value={row.session1}
                                                onChange={(e) =>
                                                    handleSessionChange(
                                                        row._id,
                                                        "session1",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-[78px] rounded-lg border border-[#244061] bg-[#172c46] px-2 text-white"
                                            >
                                                <option value="P">
                                                    P
                                                </option>
                                                <option value="A">
                                                    A
                                                </option>
                                                <option value="OD">
                                                    OD
                                                </option>
                                                <option value="L">
                                                    L
                                                </option>
                                            </select>
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            <select
                                                value={row.session2}
                                                onChange={(e) =>
                                                    handleSessionChange(
                                                        row._id,
                                                        "session2",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-[78px] rounded-lg border border-[#244061] bg-[#172c46] px-2 text-white"
                                            >
                                                <option value="P">
                                                    P
                                                </option>
                                                <option value="A">
                                                    A
                                                </option>
                                                <option value="OD">
                                                    OD
                                                </option>
                                                <option value="L">
                                                    L
                                                </option>
                                            </select>
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
                        className="rounded-lg bg-[#3984ff] px-8 py-3 text-white font-medium hover:bg-[#2d73e8]"
                    >
                        Override
                    </button>
                </div>
            </div>

            <AttendanceOverrideModal
                isOpen={showModal}
                mode={modalMode}
                selectedRow={selectedRowData}
                onClose={() =>
                    setShowModal(false)
                }
                onSubmit={async (formData) => {
                    try {
                        setLoading(true);

                        if (modalMode === "single") {
                            const row = filteredAttendance.find(
                                item => selectedRows.includes(item._id)
                            );

                            await updateAttendanceOverrideSingle(
                                row.employeeId,
                                row.date.split("T")[0],
                                {
                                    firstIn: row.firstIn,
                                    lastOut: row.lastOut,
                                    session1: row.session1,
                                    session2: row.session2,
                                    remarks: formData.remarks,
                                }
                            );
                        } else {
                            console.log("Bulk Payload", {
                                employeeId: selectedEmployee.facultyId,
                                fromDate: fromDate
                                    ? new Date(fromDate).toISOString().split("T")[0]
                                    : "",
                                toDate: toDate
                                    ? new Date(toDate).toISOString().split("T")[0]
                                    : "",
                                session1: formData.session1,
                                session2: formData.session2,
                                remarks: formData.remarks,
                            });
                            await updateAttendanceOverrideBulk({
                                employeeId: selectedEmployee.facultyId,
                                fromDate: fromDate
                                    ? new Date(fromDate).toISOString().split("T")[0]
                                    : "",
                                toDate: toDate
                                    ? new Date(toDate).toISOString().split("T")[0]
                                    : "",
                                session1: formData.session1,
                                session2: formData.session2,
                                remarks: formData.remarks,
                            });
                        }

                        // alert(
                        //     "Attendance Override Updated Successfully"
                        // );

                        setShowModal(false);

                        const refreshed =
                            await getEmployeeAttendanceOverride(
                                selectedEmployee.facultyId
                            );
                            console.log("Refreshed Data", refreshed.data);

if (refreshed?.success) {
    setAttendanceData(refreshed.data || []);
    setFilteredAttendance(refreshed.data || []);
}

                        setSelectedRows([]);
                    } catch (error) {
                        console.error(
                            error
                        );

                        alert(
                            "Failed To Update Attendance"
                        );
                    } finally {
                        setLoading(false);
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