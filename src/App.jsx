import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FacultyDashboard from "./pages/Dashboards/FacultyDashboard/FacultyDashboard";
import ProfilePage from "./pages/ProfilePage";
import LeavePage from "./pages/Dashboards/FacultyDashboard/LeavePage";
import AttendancePage from "./pages/Dashboards/FacultyDashboard/AttendancePage";
import PermissionPage from "./pages/Dashboards/FacultyDashboard/PermissionPage";
import RegularaizationListPage from "./pages/Common/RegularaizationListPage";
import MyTeamPage from "./pages/Dashboards/HOD-Dashboard/myTeamPage";
import ShiftManagement from "./pages/Dashboards/AdminDashboard/shift/ShiftManagement";
import PrincipalDashboard from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalDashboard";
import PrincipalLeavePage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalLeavePage";
import PrincipalPermissionPage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalPermissionPage";

function App() {
  const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

  return <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard-faculty" element={<FacultyDashboard />} />
      <Route path="/dashboard-faculty/leaves" element={<LeavePage />} />
      <Route path="/dashboard-faculty/attendance" element={<AttendancePage />} />
      <Route path="/dashboard-faculty/permissions" element={<PermissionPage />} />
      <Route path="/dashboard-principal" element={<PrincipalDashboard />} />
      <Route path="/dashboard-principal/leaves" element={<PrincipalLeavePage />} />
      <Route path="/dashboard-principal/permissions" element={<PrincipalPermissionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:empid" element={<ProfilePage />} />
      <Route path="/dashboard/regularizationList" element={<RegularaizationListPage />} />
      <Route path="/dashboard-faculty/my-Team" element={<MyTeamPage />} />
      <Route path="/dashboard-admin/shifts" element={<ShiftManagement />} />
    </Routes>
  </>
}

export default App;
