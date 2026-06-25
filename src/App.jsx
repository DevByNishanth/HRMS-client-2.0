import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import PrincipalLeaveRequestPage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalLeaveRequestPage";
import PrincipalPermissionPage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalPermissionPage";
import PrincipalFacultyListPage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalFacultyListPage";
import PrincipalAttendancePage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalAttendancePage";
import PrincipalRegularizationListPage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalRegularizationListPage";
import PrincipalCompOffPage from "./pages/Dashboards/PRINCIPAL-Dashboard/PrincipalCompOffPage";
import FacultyManagementPage from "./pages/Dashboards/AdminDashboard/Faculty-Management/FacultyManagementPage";
import DeanDashboard from "./pages/Dashboards/DEAN-Dashboard/DeanDashboard";
import DeanLeavePage from "./pages/Dashboards/DEAN-Dashboard/LeavePage";
import DeanAttendancePage from "./pages/Dashboards/DEAN-Dashboard/AttendancePage";
import DeanPermissionPage from "./pages/Dashboards/DEAN-Dashboard/PermissionPage";
import OdApprovalsPage from "./pages/Dashboards/DEAN-Dashboard/OdApprovalsPage";
import HolidayManagement from "./pages/Dashboards/AdminDashboard/Holiday/HolidayManagement";
import LeaveTypeManagement from "./pages/Dashboards/AdminDashboard/LeaveType/LeaveTypeManagement";
import LeaveBalanceManagement from "./pages/Dashboards/AdminDashboard/LeaveBalance/LeaveBalanceManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import { getRoleFromToken, isTokenValid } from "./utils/tokenUtils";
import AttendanceManagement from "./pages/Dashboards/AdminDashboard/AttendanceReport/AttendanceReportManagement";
import AttendanceOverrideManagement from "./pages/Dashboards/AdminDashboard/AttendanceOverride/AttendanceOverrideManagement";
import FacultyCalendar from "./pages/Common/Calendar";
// import AttendanceOverrideManagement from './pages/Dashboards/AdminDashboard/AttendanceOverride/AttendanceOverrideManagement';
import DoumentUploadFormModal from './components/DoumentUploadFormModal'
import CompoffPage from "./components/CompoffPage";
import Attendance from "./pages/Dashboards/AdminDashboard/Attendance/AttendanceManagement"

function App() {
  // Role-based default route redirect
  const getRoleBasedDefaultRoute = () => {
    if (!isTokenValid()) {
      return "/";
    }

    const role = getRoleFromToken();
    switch (role?.toLowerCase()) {
      case "hr":
        return "/dashboard-admin";
      case "faculty":
        return "/dashboard-faculty";
      case "hod":
        return "/dashboard-faculty";
      case "principal":
        return "/dashboard-principal";
      case "dean":
        return "/dashboard-dean";
      case "non-teaching":
        return "/dashboard-faculty";
      default:
        return "/";
    }
  };

  return (
    <>
{/* 
      <DoumentUploadFormModal/> */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes - Faculty, HOD, Non-Teaching */}
        <Route
          path="/dashboard-faculty"
          element={
            <ProtectedRoute requiredRoles={["faculty", "hod", "non-teaching"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/leaves"
          element={
            <ProtectedRoute requiredRoles={["faculty", "hod", "non-teaching"]}>
              <LeavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/attendance"
          element={
            <ProtectedRoute requiredRoles={["faculty", "hod", "non-teaching"]}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/permissions"
          element={
            <ProtectedRoute requiredRoles={["faculty", "hod", "non-teaching"]}>
              <PermissionPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Principal Only */}
        <Route
          path="/dashboard-principal"
          element={
            <ProtectedRoute requiredRoles={["principal"]}>
              <PrincipalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/faculty-list"
          element={
            <ProtectedRoute requiredRoles={["principal"]}>
              <PrincipalFacultyListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/leaves"
          element={
            <ProtectedRoute requiredRoles={["principal"]}>
              <PrincipalLeaveRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/attendance"
          element={
            <ProtectedRoute requiredRoles={["principal"]}>
              <PrincipalAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/permissions"
          element={
            <ProtectedRoute requiredRoles={["principal"]}>
              <PrincipalPermissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/regularizationList"
          element={
            <ProtectedRoute requiredRoles={["principal"]}>
              <PrincipalRegularizationListPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Dean Only */}
        <Route
          path="/dashboard-dean"
          element={
            <ProtectedRoute requiredRoles={["dean", "dean-academics", "dean-iqac", "dean-research", "coe", "iqac"]}>
              <DeanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-dean/leaves"
          element={
            <ProtectedRoute requiredRoles={["dean", "dean-academics", "dean-iqac", "dean-research", "coe", "iqac"]}>
              <DeanLeavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-dean/attendance"
          element={
            <ProtectedRoute requiredRoles={["dean", "dean-academics", "dean-iqac", "dean-research", "coe", "iqac"]}>
              <DeanAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-dean/permissions"
          element={
            <ProtectedRoute requiredRoles={["dean", "dean-academics", "dean-iqac", "dean-research", "coe", "iqac"]}>
              <DeanPermissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-dean/od-approvals"
          element={
            <ProtectedRoute requiredRoles={["dean", "dean-academics", "dean-iqac", "dean-research", "coe", "iqac"]}>
              <OdApprovalsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin Only */}
        <Route
          path="/dashboard-admin"
          element={
            // <ProtectedRoute requiredRoles={['admin', 'hr']}>
            <ProtectedRoute requiredRoles={["admin", "hr"]}>
              <FacultyManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin/shifts"
          element={
            // <ProtectedRoute requiredRoles={['admin', 'hr']}>
            <ProtectedRoute requiredRoles={["admin", "hr"]}>
              <ShiftManagement />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Profile (All Authenticated Users) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              requiredRoles={[
                "faculty",
                "hod",
                "principal",
                "admin",
                "non-teaching",
                "dean",
                "dean-iqac",
                "dean-research",
                "dean-academics",
                "hr"
              ]}
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:empid"
          element={
            <ProtectedRoute
              requiredRoles={[
                "faculty",
                "hod",
                "principal",
                "admin",
                "non-teaching",
                "dean",
                "dean-academics",
                "dean-iqac",
                "dean-research",
                "hr"
              ]}
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Regularization (Faculty, HOD, Non-Teaching) */}
        <Route
          path="/dashboard/regularizationList"
          element={
            <ProtectedRoute
              requiredRoles={["faculty", "hod", "non-teaching", "dean", "dean-academics", "dean-iqac", "dean-research"]}
            >
              <RegularaizationListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/compoff"
          element={
            <ProtectedRoute requiredRoles={['faculty', 'hod', 'non-teaching', 'dean', 'dean-academics', 'dean-iqac', 'dean-research']}>
              <CompoffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal/compoff"
          element={
            <ProtectedRoute requiredRoles={["principal"]}>
              <PrincipalCompOffPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - HOD Only */}
        <Route
          path="/dashboard-faculty/my-Team"
          element={
            <ProtectedRoute requiredRoles={["hod"]}>
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
        <Route
          path="/dashboard-admin/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-faculty/calender"
          element={
            <ProtectedRoute>
              <FacultyCalendar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
