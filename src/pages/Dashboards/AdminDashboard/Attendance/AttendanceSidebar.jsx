import React, { useEffect, useState, useMemo } from 'react';
import { X, Search, ChevronRight, UserX, Clock } from 'lucide-react';
import { getAttendanceTableData } from "../../../../services/Attendance/getAttendanceTableDataService";
import { isFacultyExcluded, loadExcludedFacultyIds } from "../../../../utils/excludedFaculty";
import userImg from "../../../../assets/userImg.svg";

const AttendanceSidebar = ({ type, onClose }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deptSearchQuery, setDeptSearchQuery] = useState("");

    const formatApiDate = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatIstDateTime = (value) => {
        return value
            ? new Date(value).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
            : "";
    };

    useEffect(() => {
        if (type) {
            fetchData();
        }
    }, [type]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const currentDate = formatApiDate(new Date());
            
            const payload = {
                fromDate: currentDate,
                toDate: currentDate,
                status: type === "Late Checked In Today" ? "Late Checked In" : "Not Checked In",
            };

            const response = await getAttendanceTableData(payload);
            let fetchedData = response?.attendance || [];

            // Filter out excluded faculties
            const excludedFacultyIds = await loadExcludedFacultyIds();
            const getEmployeeId = (row) => row.empId || row.employeeId || row.facultyId?.empId || row.facultyId;
            fetchedData = fetchedData.filter(
                (row) => !isFacultyExcluded(getEmployeeId(row), excludedFacultyIds)
            );

            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching sidebar data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Group by department
    const departmentGroups = useMemo(() => {
        const groups = {};
        data.forEach(row => {
            const dept = row.department || "Unknown Department";
            if (!groups[dept]) groups[dept] = [];
            groups[dept].push(row);
        });
        return groups;
    }, [data]);

    // Derived properties for current view
    const currentFaculties = useMemo(() => {
        if (!selectedDept) return [];
        let list = departmentGroups[selectedDept] || [];
        if (searchQuery) {
            const lowerSearch = searchQuery.toLowerCase();
            list = list.filter(row => 
                (row.employeeName || "").toLowerCase().includes(lowerSearch) ||
                (row.empId || "").toLowerCase().includes(lowerSearch)
            );
        }
        return list;
    }, [selectedDept, departmentGroups, searchQuery]);

    // Handle closing backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end transition-opacity"
            onClick={handleBackdropClick}
        >
            <div className="w-[35%] min-w-[350px] bg-[var(--theme-bg-body)] border-l border-[var(--theme-border)] h-full shadow-2xl flex flex-col transform transition-transform duration-300">
                {/* Header */}
                <div className="p-4 border-b border-[var(--theme-border)] flex items-center justify-between shrink-0 bg-[var(--theme-bg-card)]">
                    <h2 className="text-lg font-medium text-[var(--theme-text-main)] flex items-center gap-2">
                        {type === "Late Checked In Today" ? <Clock size={20} className="text-[#f16868]" /> : <UserX size={20} className="text-[#f16868]" />}
                        {type}
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--theme-border)] text-sm text-[var(--theme-text-muted)]">
                            {data.length}
                        </span>
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-[var(--theme-border)] rounded-md transition-colors text-[var(--theme-text-muted)] hover:text-[var(--theme-text-main)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                        </div>
                    ) : !selectedDept ? (
                        // Department List View
                        <div className="space-y-3">
                            <div className="relative mb-4">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search departments..."
                                    value={deptSearchQuery}
                                    onChange={(e) => setDeptSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-card)] text-[var(--theme-text-main)] focus:outline-none focus:border-[#3984ff] text-sm"
                                />
                            </div>
                            {Object.entries(departmentGroups).filter(([dept]) => dept.toLowerCase().includes(deptSearchQuery.toLowerCase())).length > 0 ? (
                                Object.entries(departmentGroups)
                                    .filter(([dept]) => dept.toLowerCase().includes(deptSearchQuery.toLowerCase()))
                                    .sort((a,b) => a[0].localeCompare(b[0]))
                                    .map(([dept, faculties]) => (
                                    <div 
                                        key={dept}
                                        onClick={() => setSelectedDept(dept)}
                                        className="flex items-center justify-between p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] hover:bg-[var(--theme-bg-input)] cursor-pointer transition-colors"
                                    >
                                        <div>
                                            <h3 className="font-medium text-[var(--theme-text-main)]">{dept}</h3>
                                            <p className="text-sm text-[var(--theme-text-muted)] mt-1">{faculties.length} staff member{faculties.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <ChevronRight size={18} className="text-[var(--theme-text-muted)]" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-[var(--theme-text-muted)]">
                                    No records found.
                                </div>
                            )}
                        </div>
                    ) : (
                        // Department Detail View
                        <div className="flex flex-col h-full">
                            {/* Breadcrumbs & Search */}
                            <div className="sticky top-0 bg-[var(--theme-bg-body)] z-10 pb-4">
                                <div className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)] mb-4">
                                    <button 
                                        onClick={() => { setSelectedDept(null); setSearchQuery(""); }}
                                        className="hover:text-[var(--theme-text-main)] transition-colors"
                                    >
                                        All Departments
                                    </button>
                                    <ChevronRight size={14} />
                                    <span className="text-[var(--theme-text-main)] flex items-center gap-2">
                                        {selectedDept}
                                        <span className="px-2 py-0.5 rounded-full bg-[var(--theme-border)] text-xs text-[var(--theme-text-muted)]">
                                            {departmentGroups[selectedDept]?.length || 0}
                                        </span>
                                    </span>
                                </div>

                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)]" />
                                    <input
                                        type="text"
                                        placeholder="Search name or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-card)] text-[var(--theme-text-main)] focus:outline-none focus:border-[#3984ff] text-sm"
                                    />
                                </div>
                            </div>

                            {/* Faculties List */}
                            <div className="space-y-3 pb-4">
                                {console.log("currentFaculties", currentFaculties)}
                                {currentFaculties.length > 0 ? (
                                    currentFaculties.map((faculty, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] flex flex-col gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-[var(--theme-border)] flex items-center justify-center border border-[var(--theme-border-input)]">
                                                   {/* ifmno image show 1st and last letter */}
                                                   {faculty.profileImage?.url ? (
                                                    <img 
                                                           src={faculty.profileImage?.url } 
                                                        alt={faculty.employeeName} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                   ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-[var(--theme-text-main)]">
                                                        {faculty.employeeName?.charAt(0).toUpperCase() + faculty.employeeName?.slice(-1).toUpperCase()}
                                                    </div>
                                                   )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[var(--theme-text-main)] font-medium truncate">{faculty.employeeName}</h4>
                                                    <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">{faculty.empId} • {faculty.designation}</p>
                                                </div>
                                                 {type === "Late Checked In Today" && (
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-[10px] uppercase text-[var(--theme-text-muted)]">In Time</p>
                                                        <p className="text-sm font-medium text-[var(--theme-text-main)]">{formatIstDateTime(faculty.inTime) || "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase text-[var(--theme-text-muted)]">Late By</p>
                                                        <p className="text-sm font-medium text-[#f16868]">{faculty.lateMinutes ? `${faculty.lateMinutes} mins` : "-"}</p>
                                                    </div>
                                                </div>
                                            )}
                                            </div>
                                            
                                           
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-[var(--theme-text-muted)] text-sm">
                                        No matches found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceSidebar;


