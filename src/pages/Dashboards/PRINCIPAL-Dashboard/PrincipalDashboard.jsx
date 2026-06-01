import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import PrincipalDashboardBody from "./PrincipalDashboardBody";

const PrincipalDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <PrincipalDashboardBody />
      </div>
    </div>
  );
};

export default PrincipalDashboard;
