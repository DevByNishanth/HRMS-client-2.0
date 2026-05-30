import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FacultyDashboard from "./pages/Dashboards/FacultyDashboard/FacultyDashboard";
import ProfilePage from "./pages/ProfilePage";
import LeavePage from "./pages/Dashboards/FacultyDashboard/LeavePage";
import AttendancePage from "./pages/Dashboards/FacultyDashboard/AttendancePage";
import PermissionPage from "./pages/Dashboards/FacultyDashboard/PermissionPage";

function App() {
  return <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard-faculty" element={<FacultyDashboard />} />
      <Route path="/dashboard-faculty/leaves" element={<LeavePage />} />
      <Route path="/dashboard-faculty/attendance" element={<AttendancePage />} />
      <Route path="/dashboard-faculty/permissions" element={<PermissionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  </>
}

export default App;
