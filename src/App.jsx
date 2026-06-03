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
import FacultyManagementPage from "./pages/Dashboards/AdminDashboard/Faculty-Management/FacultyManagementPage";
import HolidayManagement from "./pages/Dashboards/AdminDashboard/Holiday/HolidayManagement";
import LeaveTypeManagement from "./pages/Dashboards/AdminDashboard/LeaveType/LeaveTypeManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import { getRoleFromToken, isTokenValid } from "./utils/tokenUtils";

function App() {
  // Role-based default route redirect
  const getRoleBasedDefaultRoute = () => {
    if (!isTokenValid()) {
      return "/";
    }

    const role = getRoleFromToken();
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/dashboard-admin';
      case 'faculty':
        return '/dashboard-faculty';
      case 'hod':
        return '/dashboard-faculty';
      case 'principal':
        return '/dashboard-principal';
      case 'non-teaching':
        return '/dashboard-faculty';
      default:
        return '/';
    }
  };

  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard-faculty"
          element={
            <ProtectedRoute>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/leaves"
          element={
            <ProtectedRoute>
              <LeavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/permissions"
          element={
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal"
          element={
            <ProtectedRoute>
              <PrincipalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/leaves"
          element={
            <ProtectedRoute>
              <PrincipalLeavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/permissions"
          element={
            <ProtectedRoute>
              <PrincipalPermissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:empid"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/regularizationList"
          element={
            <ProtectedRoute>
              <RegularaizationListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/my-Team"
          element={
            <ProtectedRoute>
              <MyTeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin/shifts"
          element={
            <ProtectedRoute>
              <ShiftManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute>
              <FacultyManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin/holidays"
          element={
            <ProtectedRoute>
              <HolidayManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin/leavetype"
          element={
            <ProtectedRoute>
              <LeaveTypeManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App;
