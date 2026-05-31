import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import userImg from "../../../assets/userImg.svg";
import { teamMembers } from "./myTeamData";

const presenceStyles = {
    Present: "text-[#18d3bf] bg-[#18d3bf1f]",
    Absent: "text-[#f16868] bg-[#f168681f]",
    "On Leave": "text-[#f0a15f] bg-[#f0a15f1f]",
};

const MyTeamTable = () => {
    const navigate = useNavigate();

    const handleViewProfile = (member) => {
        navigate(`/profile/${member.empid}`, {
            state: { userId: member.empid },
        });
    };

    return (
        <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
            <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-[18px] font-semibold text-white">
                    My Team <span>({teamMembers.length})</span>
                </h2>
            </div>

            <div className="relative z-0 max-h-[calc(100vh-330px)] overflow-auto table-custom-scrollbar">
                <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Role</th>
                            <th className="px-4 py-3 font-semibold">Type</th>
                            <th className="px-4 py-3 font-semibold">Presence</th>
                            <th className="px-4 py-3 text-right font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-[13px] text-[#cad7eb]">
                        {teamMembers.map((member) => (
                            <tr
                                key={member.empid}
                                className="border-b border-[#132944] last:border-0"
                            >
                                <td className="px-4 py-3 font-semibold text-white">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={userImg}
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate">{member.name}</p>
                                            <p className="mt-0.5 text-[12px] font-normal text-[#8ca1bd]">
                                                {member.empid}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{member.role}</td>
                                <td className="px-4 py-3">{member.type}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${presenceStyles[member.presence]}`}
                                    >
                                        <span className="h-[4px] w-[4px] rounded-full bg-current" />
                                        {member.presence}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleViewProfile(member)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                                            aria-label={`View profile for ${member.name}`}
                                            title="View Profile"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MyTeamTable;
