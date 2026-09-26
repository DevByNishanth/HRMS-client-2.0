import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import PrincipalDashboardBody from "./PrincipalDashboardBody";

const PrincipalDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#051424] transition-colors duration-200">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <PrincipalDashboardBody />
      </div>
    </div>
  );
};

export default PrincipalDashboard;
