import { Clock3, FileText, Hourglass, Plus } from "lucide-react";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import ApplyPerimission from "../../../components/ApplyPermission";
import PermissionTable from "./PermissionTable";
import { useState } from "react";

const permissionStats = [
  {
    title: "Total Permission",
    code: "TP",
    used: 4,
    total: 6,
    color: "#3984ff",
    icon: FileText,
  },
  {
    title: "Permission Taken",
    code: "PT",
    used: 4,
    total: 6,
    color: "#18d3bf",
    icon: Clock3,
  },
  {
    title: "Remaining Permission",
    code: "RP",
    used: 2,
    total: 6,
    color: "#f0a15f",
    icon: Hourglass,
  },
];

const PermissionStatCard = ({
  icon: Icon,
  title,
  code,
  used,
  total,
  color,
}) => {
  return (
    <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
      <div
        className="mb-2 flex h-8 w-8 items-center justify-center rounded-md"
        style={{ backgroundColor: `${color}22`, color }}
      >
        <Icon size={15} />
      </div>

      <h3 className="text-[12px]  uppercase tracking-wide text-white">
        {title} ({code})
      </h3>

      <p className="mt-1 text-[12px] font-semibold text-white">
        {total} Hours
      </p>

      {/* <div className="mt-2 h-[4px] overflow-hidden rounded-full bg-[#1c2d45]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${total > 0 ? Math.min((used / total) * 100, 100) : 0}%`,
            backgroundColor: color,
          }}
        />
      </div> */}
    </div>
  );
};

const PermissionPage = () => {
  // states
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);

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
                  Permissions
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Track monthly permission usage and request status.
                </p>
              </div>

              <button
                onClick={() => setIsPermissionApplyModal(true)}
                type="submit"
                className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2564eba3] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
              >
                <Plus size={14} />
                Apply for Permission
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {permissionStats.map((item) => (
                <PermissionStatCard key={item.title} {...item} />
              ))}
            </div>

            <PermissionTable />
          </div>
        </main>
      </div>

      {isPermissionApplyModal && (
        <ApplyPerimission onClose={() => setIsPermissionApplyModal(false)} />
      )}
    </div>
  );
};

export default PermissionPage;
