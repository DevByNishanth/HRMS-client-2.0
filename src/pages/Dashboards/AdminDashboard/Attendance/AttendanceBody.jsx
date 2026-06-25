import {
    Users,
    LogIn,
    UserX,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import AttendanceTable from "./AttendanceTable";
import AttendanceStatCard from "./AttendanceStackCard";

import {
    getAttendanceStackCardData,
} from "../../../../services/Attendance/getAttendanceStackCardDataService";

export default function AttendanceBody() {
    const [stats, setStats] = useState([
        {
            title: "Total Staff",
            count: 0,
            color: "#3984ff",
            icon: Users,
        },
        {
            title: "Checked In Today",
            count: 0,
            color: "#18d3bf",
            icon: LogIn,
        },
        {
            title: "Not Checked In Today",
            count: 0,
            color: "#f16868",
            icon: UserX,
        },
    ]);

    useEffect(() => {
        fetchAttendanceSummary();
    }, []);

    const fetchAttendanceSummary = async () => {
        try {
            const response =
                await getAttendanceStackCardData();

            console.log(response);

            setStats([
                {
                    title: "Total Staff",
                    count: response.totalStaff || 0,
                    color: "#3984ff",
                    icon: Users,
                },
                {
                    title: "Checked In Today",
                    count: response.checkedInToday || 0,
                    color: "#18d3bf",
                    icon: LogIn,
                },
                {
                    title: "Not Checked In Today",
                    count: response.notCheckedInToday || 0,
                    color: "#f16868",
                    icon: UserX,
                },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="h-[calc(100vh-100px)] overflow-hidden bg-[#071425] px-4 py-4 text-white">
            <div className="mx-auto h-full flex flex-col min-h-0">
                <div>
                    <h1 className="text-xl font-medium text-white">
                        Attendance Management
                    </h1>
                    <p className="mt-1 text-[16px] text-[#9eb0cc]">
                        Review employee attendance records.
                    </p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stats.map((item) => (
                        <AttendanceStatCard
                            key={item.title}
                            {...item}
                        />
                    ))}
                </div>
                <div className="mt-4 flex-1 min-h-0">
                    <AttendanceTable />
                </div>
            </div>
        </main>
    );
}