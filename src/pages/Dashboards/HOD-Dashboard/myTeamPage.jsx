import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    GraduationCap,
    School,
    UserRoundCog,
} from "lucide-react";
import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import MyTeamTable from "./myteamTable";
import { getMyTeamData } from "../../../services/myTeam/getMyTeamService";

const TeamStatCard = ({ icon: Icon, title, count, color }) => {
    return (
        <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
            <div
                className="mb-2 flex h-8 w-8 items-center justify-center rounded-md"
                style={{ backgroundColor: `${color}22`, color }}
            >
                <Icon size={15} />
            </div>

            <h3 className="text-[12px] uppercase tracking-wide text-white">
                {title}
            </h3>

            <p className="mt-1 text-[16px] font-semibold text-white">
                {count} Members
            </p>
        </div>
    );
};

const MyTeamPage = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                setLoading(true);
                const response = await getMyTeamData();
                if (response.success && Array.isArray(response.data)) {
                    setTeamMembers(response.data);
                } else {
                    setTeamMembers([]);
                }
            } catch (err) {
                console.error("Failed to fetch team data:", err);
                setError("Failed to load team data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    const teamStats = [
        {
            title: "Assistant Professor",
            count: teamMembers.filter((member) => member.designation === "Assistant Professor").length,
            color: "#3984ff",
            icon: GraduationCap,
        },
        {
            title: "Professor",
            count: teamMembers.filter((member) => member.designation === "Professor" || member.designation === "HOD").length,
            color: "#18d3bf",
            icon: School,
        },
        {
            title: "Associate Professor",
            count: teamMembers.filter((member) => member.designation === "Associate Professor").length,
            color: "#f0a15f",
            icon: BriefcaseBusiness,
        },
        {
            title: "Non Teaching",
            count: teamMembers.filter((member) => member.type === "Non-Teaching").length,
            color: "#f16868",
            icon: UserRoundCog,
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#051424]">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <CommonHeader />

                <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
                    <div className="mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-medium leading-tight text-white">
                                    My Team
                                </h1>
                                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                                    Review department members, roles, and daily presence.
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)] animate-pulse"
                                    >
                                        <div className="mb-2 h-8 w-8 rounded-md bg-[#183052]" />
                                        <div className="mt-2 h-3 w-24 rounded bg-[#183052]" />
                                        <div className="mt-2 h-4 w-16 rounded bg-[#183052]" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="mt-5 rounded-lg border border-[#183052] bg-[#0a1a2d] p-6 text-center text-[#f16868]">
                                {error}
                            </div>
                        ) : (
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {teamStats.map((item) => (
                                    <TeamStatCard key={item.title} {...item} />
                                ))}
                            </div>
                        )}

                        <MyTeamTable teamMembers={teamMembers} loading={loading} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyTeamPage;
