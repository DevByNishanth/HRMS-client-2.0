// Sidebar.jsx
// import logo from '../assets/logo.svg'
import logo from "../assets/college_logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BadgeIndianRupee,
  Users,
  FileText,
  Network,
  RotateCw,
  Users2,
  CalendarPlus,
  LogOut,
  CalendarSync,
  CalendarX2,
  CalendarPlus2,
  Hourglass,
  FingerprintPattern,
  UserPen,
  UserCheck,
  GitPullRequestArrow,
} from "lucide-react";
import { getRoleFromToken, logout } from "../utils/tokenUtils";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getRoleFromToken()?.toLowerCase();

  // Navigation items for Faculty
  const facultyNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard-faculty" },
    { label: "Leaves", icon: Calendar, path: "/dashboard-faculty/leaves" },
    { label: "Attendance", icon: Users, path: "/dashboard-faculty/attendance" },
    {
      label: "Permission",
      icon: FileText,
      path: "/dashboard-faculty/permissions",
    },
    {
      label: "Regularization List",
      icon: RotateCw,
      path: "/dashboard/regularizationList",
    },
    { label: "Comp off", icon: CalendarPlus, path: "/dashboard/compOff" },
    { label: "Calender", icon: Calendar, path: "/dashboard-faculty/calender" },
    {
      label: "Payroll",
      icon: BadgeIndianRupee,
      path: "/dashboard-faculty/payroll",
    },
  ];

  // Navigation items for HOD (same as Faculty + My Team + Payroll)
  const hodNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard-faculty" },
    { label: "Leaves", icon: Calendar, path: "/dashboard-faculty/leaves" },
    { label: "Attendance", icon: Users, path: "/dashboard-faculty/attendance" },
    {
      label: "Permission",
      icon: FileText,
      path: "/dashboard-faculty/permissions",
    },
    {
      label: "Regularization List",
      icon: RotateCw,
      path: "/dashboard/regularizationList",
    },
    { label: "Comp off", icon: CalendarPlus, path: "/dashboard/compOff" },
    { label: "My Team", icon: Users2, path: "/dashboard-faculty/my-Team" },
    {
      label: "Payroll",
      icon: BadgeIndianRupee,
      path: "/dashboard-faculty/payroll",
    },
  ];

  // Navigation items for Principal
  const principalNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard-principal" },
    {
      label: "Faculty List",
      icon: Users,
      path: "/dashboard-principal/faculty-list",
    },
    { label: "Leaves", icon: Calendar, path: "/dashboard-principal/leaves" },
    // { label: 'Attendance', icon: Users, path: '/dashboard-principal/attendance' },
    {
      label: "Permission",
      icon: FileText,
      path: "/dashboard-principal/permissions",
    },
    {
      label: "Comp off",
      icon: CalendarPlus,
      path: "/dashboard-principal/compOff",
    },
    {
      label: "Regularization List",
      icon: RotateCw,
      path: "/dashboard-principal/regularizationList",
    },
    {
      label: "Payroll",
      icon: BadgeIndianRupee,
      path: "/dashboard-principal/payroll",
    },
  ];
  // Navigation items for Admin
  const adminNavItems = [
    { label: "Faculty Management", icon: Users, path: "/dashboard-admin" },
    {
      label: "Shift Management",
      icon: CalendarSync,
      path: "/dashboard-admin/shifts",
    },
    {
      label: "Holiday Management",
      icon: CalendarX2,
      path: "/dashboard-admin/holidays",
    },
    {
      label: "Leave Management",
      icon: CalendarPlus2,
      path: "/dashboard-admin/leavetype",
    },
    {
      label: "Leave Balance",
      icon: Hourglass,
      path: "/dashboard-admin/leavebalance",
    },
    {
      label: "Attendance Report",
      icon: FingerprintPattern,
      path: "/dashboard-admin/attendance-report",
    },
    {
      label: "Attendance Override",
      icon: UserPen,
      path: "/dashboard-admin/attendance-override",
    },
    
    {
      label: "Requests",
      icon: GitPullRequestArrow,
      path: "#",
      subItems: [
        { label: "Leave Requests", path: "/dashboard-admin/requests/leave" },
        {
          label: "Permission Requests",
          path: "/dashboard-admin/requests/permission",
        },
        {
          label: "Regularization Requests",
          path: "/dashboard-admin/requests/regularization",
        },
        {
          label: "Comp off Requests",
          path: "/dashboard-admin/requests/compoff",
        },
      ],
    },
    {
      label: "Attendance List",
      icon: UserCheck,
      path: "/dashboard-admin/attendance",
    },
    {
      label: "Payroll",
      icon: BadgeIndianRupee,
      path: "/dashboard-admin/payroll",
    },
    { label: "Teams", icon: Network, path: "/dashboard-admin/teams" },
  ];

  // Navigation items for Non-Teaching (same as Faculty)
  const nonTeachingNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard-faculty" },
    { label: "Leaves", icon: Calendar, path: "/dashboard-faculty/leaves" },
    { label: "Attendance", icon: Users, path: "/dashboard-faculty/attendance" },
    {
      label: "Permission",
      icon: FileText,
      path: "/dashboard-faculty/permissions",
    },
    {
      label: "Regularization List",
      icon: RotateCw,
      path: "/dashboard/regularizationList",
    },
    { label: "Comp off", icon: CalendarPlus, path: "/dashboard/compOff" },
    {
      label: "Payroll",
      icon: BadgeIndianRupee,
      path: "/dashboard-faculty/payroll",
    },
  ];

  // Navigation items for Dean (same as Faculty + OD Approvals)
  const deanNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard-dean" },
    { label: "Leaves", icon: Calendar, path: "/dashboard-dean/leaves" },
    { label: "Attendance", icon: Users, path: "/dashboard-dean/attendance" },
    {
      label: "Permission",
      icon: FileText,
      path: "/dashboard-dean/permissions",
    },
    {
      label: "Regularization List",
      icon: RotateCw,
      path: "/dashboard/regularizationList",
    },
    {
      label: "OD Approvals",
      icon: CalendarPlus,
      path: "/dashboard-dean/od-approvals",
    },
    { label: "Comp off", icon: CalendarPlus, path: "/dashboard/compOff" },
  ];

  // Determine navigation items based on role
  let navItems = facultyNavItems;
  switch (role) {
    case "hod":
      navItems = hodNavItems;
      break;
    case "hr":
      navItems = adminNavItems;
      break;
    case "admin":
      navItems = adminNavItems;
      break;
    case "principal":
      navItems = principalNavItems;
      break;
    case "non-teaching":
      navItems = nonTeachingNavItems;
      break;
    case "dean":
      navItems = deanNavItems;
      break;
    case "dean-iqac":
      navItems = deanNavItems;
      break;
    case "dean-research":
      navItems = deanNavItems;
      break;
    case "dean-academics":
      navItems = deanNavItems;
      break;
    case "coe":
      navItems = deanNavItems;
      break;
    case "iqac":
      navItems = deanNavItems;
      break;
    default:
      navItems = facultyNavItems;
  }

  const isActive = (path) => {
    if (path === "/profile") {
      return location.pathname.startsWith("/profile");
    }
    return location.pathname === path;
  };

  return (
        <>
            {/* Sidebar */}
            {/* <div className="w-[18%] bg-[#001d3b] flex flex-col relative"> */}
            <div className="w-[18%] bg-[#0f172a] dark:bg-[#0d2643] border-r border-slate-200 dark:border-transparent flex flex-col relative transition-colors duration-200">

                {/* Logo */}
                <div className="px-3 py-4 mt-4 ">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[60%]  object-contain"
                    />
                </div>

                

                {/* Menu */}
                <div className="mt-6 px-2 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        const active = isActive(item.path) || (hasSubItems && item.subItems.some(sub => isActive(sub.path)));
                        
                        return (
                            <div key={item.label} className="relative group">
                                <Link
                                    to={item.path}
                                    className={`relative w-full flex items-center gap-2 text-[15px] px-3 py-2 rounded-md transition font-semibold ${active
                                        ? 'bg-blue-50 text-blue-600 dark:bg-[#0b2a73]/40 dark:text-white dark:hover:bg-[#0d3a8f]'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white dark:hover:bg-[#0b2a73]'
                                        }`}
                                >
                                    <Icon size={16} className={active ? "text-blue-600 dark:text-[#7ea6ff]" : "text-slate-400 dark:text-[#7ea6ff]"} />
                                    <span>{item.label}</span>
                                    {active && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-[#5b8cff] rounded-full"></div>
                                    )}
                                </Link>
                                {hasSubItems && (
                                    <div className="hidden group-hover:flex absolute left-[95%] top-0 ml-2 flex-col bg-white dark:bg-[#0d2643] rounded-md shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 min-w-[200px] overflow-hidden border border-slate-200 dark:border-[#213857]">
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                to={subItem.path}
                                                className={`px-4 py-3 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#183052] transition text-[14px] font-medium border-b border-slate-100 dark:border-[#183052] last:border-0 ${isActive(subItem.path) ? 'bg-slate-50 dark:bg-[#183052] border-l-[3px] border-l-blue-600 dark:border-l-[#5b8cff]' : ''}`}
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="btn-container absolute bottom-4 w-full px-4">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="my-2 px-4 py-2 w-full bg-[#0b2a73] text-white rounded-md hover:bg-[#0d3a8f] flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>

            </div>
        </>
    );
};


export default Sidebar;
