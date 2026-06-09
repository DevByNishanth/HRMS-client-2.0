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
import LeaveBalanceManagement from './pages/Dashboards/AdminDashboard/LeaveBalance/LeaveBalanceManagement'
import ProtectedRoute from "./components/ProtectedRoute";
import { getRoleFromToken, isTokenValid } from "./utils/tokenUtils";
import AttendanceManagement from "./pages/Dashboards/AdminDashboard/AttendanceReport/AttendanceReportManagement";
import AttendanceOverrideManagement from './pages/Dashboards/AdminDashboard/AttendanceOverride/AttendanceOverrideManagement';

function App() {
  // Role-based default route redirect
  const getRoleBasedDefaultRoute = () => {
    if (!isTokenValid()) {
      return "/";
    }

    const role = getRoleFromToken();
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'hr':
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

        {/* Protected Routes - Faculty, HOD, Non-Teaching */}
        <Route
          path="/dashboard-faculty"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'non-teaching']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/leaves"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'non-teaching']}>
              <LeavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/attendance"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'non-teaching']}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/permissions"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'non-teaching']}>
              <PermissionPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Principal Only */}
        <Route
          path="/dashboard-principal"
          element={
            <ProtectedRoute requiredRoles={['principal']}>
              <PrincipalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/leaves"
          element={
            <ProtectedRoute requiredRoles={['principal']}>
              <PrincipalLeavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/permissions"
          element={
            <ProtectedRoute requiredRoles={['principal']}>
              <PrincipalPermissionPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin Only */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <FacultyManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin/shifts"
          element={
            <ProtectedRoute requiredRoles={['admin', 'hr']}>
              <ShiftManagement />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Profile (All Authenticated Users) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'principal', 'admin', 'non-teaching']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:empid"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'principal', 'admin', 'non-teaching']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Regularization (Faculty, HOD, Non-Teaching) */}
        <Route
          path="/dashboard/regularizationList"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'non-teaching']}>
              <RegularaizationListPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - HOD Only */}
        <Route
          path="/dashboard-faculty/my-Team"
          element={
            <ProtectedRoute requiredRoles={['hod']}>
              <MyTeamPage />
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
        <Route
          path="/dashboard-admin/leavebalance"
          element={
            <ProtectedRoute>
              <LeaveBalanceManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin/attendance-report"
          element={
            <ProtectedRoute>
              <AttendanceManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin/attendance-override"
          element={
            <ProtectedRoute>
              <AttendanceOverrideManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App;
