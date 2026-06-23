import {
    Download,
    RotateCcw,
    Search,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { getAttendanceTableData } from "../../../../services/Attendance/getAttendanceTableDataService";
import CustomDropdown  from '../../../../components/CustomDropdown';
import CustomDatePicker  from '../../../../components/CustomDatePicker';
import { getfacultiesName } from "../../../../services/LeaveBalance/getEmployeNameService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AttendanceTable() {
    const [department, setDepartment] = useState("");
    const [category, setCategory] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const dropdownRef = useRef();

    const observerRef = useRef();

    const hasFilters =
        employeeSearch ||
        department ||
        category ||
        fromDate ||
        toDate;

    const filteredData = attendanceData;

    useEffect(() => {
        const closeDropdown = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener(
            "mousedown",
            closeDropdown
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                closeDropdown
            );
    }, []);

    const selectEmployee = (employee) => {
        setSelectedEmployee(employee);

        setEmployeeSearch(
            `${employee.name} (${employee.empId})`
        );

        setShowDropdown(false);
    };

    const searchEmployees = async (value) => {
        setEmployeeSearch(value);

        if (value.trim() === "") {
            setSelectedEmployee(null);
        }
        if (value.trim().length < 2) {
            setEmployeeSuggestions([]);
            setShowDropdown(false);
            return;
        }

        try {
            const response =
                await getfacultiesName(value);

            if (response?.success) {
                setEmployeeSuggestions(
                    response.data || []
                );

                setShowDropdown(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setVisibleCount(10);
    }, [
        employeeSearch,
        department,
        category,
        fromDate,
        toDate,
    ]);

    useEffect(() => {
        const observer =
            new IntersectionObserver(
                (entries) => {
                    if (
                        entries[0].isIntersecting
                    ) {
                        setVisibleCount(
                            (prev) => prev + 10
                        );
                    }
                }
            );

        if (observerRef.current) {
            observer.observe(
                observerRef.current
            );
        }

        return () =>
            observer.disconnect();
    }, []);

    const visibleData =
        filteredData.slice(
            0,
            visibleCount
        );

    const resetFilters = () => {
        setEmployeeSearch("");
        setSelectedEmployee(null);
        setDepartment("");
        setCategory("");
        setFromDate(null);
        setToDate(null);
    };

    const formatApiDate = (date) => {
        if (!date) return "";

        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetchAttendanceData();
    }, [
        selectedEmployee,
        department,
        category,
        fromDate,
        toDate,
    ]);
console.log("selected",selectedEmployee)
console.log("fetchAttendanceData called");
    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const currentDate = formatApiDate(new Date());
            const payload = {
                search: selectedEmployee?.firstName || selectedEmployee?.empId || "",
                department,
                employeeCategory: category,
                fromDate: fromDate
                    ? formatApiDate(fromDate)
                    : currentDate,
                toDate: toDate
                    ? formatApiDate(toDate)
                    : currentDate,
            };

            console.log("Payload:", payload);

            const response =
                await getAttendanceTableData(
                    payload
                );

            console.log(
                "Response:",
                response
            );

            setAttendanceData(
                response?.attendance || []
            );
        } catch (error) {
            console.error("Error:", error);
            console.error("Message:", error.message);
            console.error("Response:", error.response);
            console.error("Request:", error.request);
        } finally {
            setLoading(false);
        }
    };
    
    const exportExcel = () => {
        if (!attendanceData.length) {
            alert("No data available to export");
            return;
        }

        const excelData = attendanceData.map((row) => ({
            EmployeeName: row.employeeName,
            EmployeeID: row.empId,
            Department: row.department,
            Category: row.employeeCategory,
            Date: row.attendanceDate,
            InTime: row.inTime,
            OutTime: row.outTime,
            WorkingHours: row.workingHours,
            Status: row.status,
        }));

        const worksheet =
            XLSX.utils.json_to_sheet(excelData);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Attendance"
        );

        const excelBuffer = XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array",
            }
        );

        const file = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }
        );

        saveAs(
            file,
            `Attendance_${new Date()
                .toISOString()
                .split("T")[0]}.xlsx`
        );
    };

    return (
        <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">

            <div className="p-4 border-b border-[#183052]">

                <div className="flex flex-wrap gap-3">

                    <div
                        className="relative"
                        ref={dropdownRef}
                    >
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
                            placeholder="Search Employee Name / ID"
                            className="
                                h-10
                                pl-11
                                w-[300px]
                                rounded-lg
                                border
                                border-[#244061]
                                bg-[#0d2138]
                                text-white
                                px-4
                            "
                        />

                        {showDropdown &&
                            employeeSuggestions.length > 0 && (
                                <div
                                    className="
                                        absolute
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
                                        shadow-xl
                                    "
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
                                                className="
                                                    cursor-pointer
                                                    border-b
                                                    border-[#244061]
                                                    p-3
                                                    hover:bg-[#1f3a5c]
                                                "
                                            >
                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="
                                                            h-10
                                                            w-10
                                                            rounded-full
                                                            bg-[#3984ff]
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-white
                                                            font-semibold
                                                        "
                                                    >
                                                        {employee.name?.charAt(
                                                            0
                                                        )}
                                                    </div>

                                                    <div>

                                                        <div className="text-white font-medium">
                                                            {employee.name}
                                                        </div>

                                                        <div className="text-xs text-[#9eb3cf]">
                                                            {employee.empId}
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

                    <CustomDropdown
                        value={department}
                        placeholder="Department"
                        options={[
                            "AIML",
                            "AIDS",
                            "CYS",
                            "CSE",
                            "CCE",
                            "CSBS",
                            "ECE",
                            "EEE",
                            "Mech",
                            "S&H"
                        ]}
                        onChange={setDepartment}
                    />

                    <CustomDropdown
                        value={category}
                        placeholder="Category"
                        options={[
                            "Teaching",
                            "Non Teaching",
                            "Housekeeping",
                            "Driver"
                        ]}
                        onChange={setCategory}
                    />

                    <CustomDatePicker
                        value={fromDate}
                        onChange={setFromDate}
                        placeholder="From Date"
                    />

                    <CustomDatePicker
                        value={toDate}
                        onChange={setToDate}
                        placeholder="To Date"
                        minDate={fromDate}
                    />

                    <button
                        onClick={exportExcel}
                        className="h-10 px-4 rounded-lg bg-[#3984ff] flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export Excel
                    </button>

                    {hasFilters && (
                        <button
                            onClick={
                                resetFilters
                            }
                            className="h-10 px-4 rounded-lg bg-[#f16868] flex items-center gap-2"
                        >
                            <RotateCcw
                                size={16}
                            />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-auto table-custom-scrollbar">

                <table className="w-full min-w-[1200px]">

                    <thead className="sticky top-0 bg-[#172c46] text-[#9eb0cc]">
                        <tr>
                            <th className="px-4 py-3 text-left">
                                Employee Details
                            </th>

                            <th className="px-4 py-3 text-left">
                                Department
                            </th>

                            <th className="px-4 py-3 text-left">
                                Category
                            </th>

                            <th className="px-4 py-3 text-left">
                                Date
                            </th>

                            <th className="px-4 py-3 text-left">
                                In Time
                            </th>

                            <th className="px-4 py-3 text-left">
                                Out Time
                            </th>

                            <th className="px-4 py-3 text-left">
                                Working Hours
                            </th>

                            <th className="px-4 py-3 text-left">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleData.map((row, index) => {
                            console.log(row.attendanceDate);
                            return (
                                <tr
                                    key={index}
                                    className="border-b border-[#183052]"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="text-white font-medium">
                                                {
                                                    row.employeeName
                                                }
                                            </div>

                                            <div className="text-[#9eb0cc] text-xs">
                                                {
                                                    row.empId
                                                }
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        {
                                            row.department
                                        }
                                    </td>

                                    <td className="px-4 py-3">
                                        {
                                            row.employeeCategory
                                        }
                                    </td>

                                    <td className="px-4 py-3">
                                        {new Date(
                                            row.attendanceDate
                                        ).toLocaleDateString("en-GB", {
                                            timeZone: "Asia/Kolkata",
                                        })}
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.inTime
                                        ? new Date(
                                            row.inTime
                                        ).toLocaleTimeString(
                                            "en-IN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            }
                                        )
                                        : "--"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {row.outTime
                                        ? new Date(
                                            row.outTime
                                        ).toLocaleTimeString(
                                            "en-IN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            }
                                        )
                                        : "--"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {
                                            row.workingHours
                                        }
                                    </td>

                                    <td className="px-4 py-3">
                                        {
                                            row.status
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div
                    ref={observerRef}
                    className="h-5"
                />
            </div>
        </section>
    );
}