import {
    BriefcaseBusiness,
    GraduationCap,
    School,
    UserRoundCog,
} from "lucide-react";
import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import MyTeamTable from "./myteamTable";
import { teamMembers } from "./myTeamData";

const teamStats = [
    {
        title: "Assistant Professor",
        count: teamMembers.filter((member) => member.role === "Assistant Professor").length,
        color: "#3984ff",
        icon: GraduationCap,
    },
    {
        title: "Professor",
        count: teamMembers.filter((member) => member.role === "Professor").length,
        color: "#18d3bf",
        icon: School,
    },
    {
        title: "Associate Professor",
        count: teamMembers.filter((member) => member.role === "Associate Professor").length,
        color: "#f0a15f",
        icon: BriefcaseBusiness,
    },
    {
        title: "Non Teaching",
        count: teamMembers.filter((member) => member.type === "Non Teaching").length,
        color: "#f16868",
        icon: UserRoundCog,
    },
];

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

                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {teamStats.map((item) => (
                                <TeamStatCard key={item.title} {...item} />
                            ))}
                        </div>

                        <MyTeamTable />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyTeamPage;
