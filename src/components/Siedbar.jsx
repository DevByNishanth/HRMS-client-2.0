// Sidebar.jsx
import logo from '../assets/logo.svg'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, FileText, RotateCw, Users2, CalendarPlus, LogOut, CalendarSync, CalendarX2  } from "lucide-react";
import { getRoleFromToken, logout } from '../utils/tokenUtils';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const role = getRoleFromToken()?.toLowerCase();

    // Navigation items for Faculty
    const facultyNavItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard-faculty' },
        { label: 'Leaves', icon: Calendar, path: '/dashboard-faculty/leaves' },
        { label: 'Attendance', icon: Users, path: '/dashboard-faculty/attendance' },
        { label: 'Permission', icon: FileText, path: '/dashboard-faculty/permissions' },
        { label: 'Regularization List', icon: RotateCw, path: '/dashboard/regularizationList' },
        { label: 'Comp off', icon: CalendarPlus, path: '/dashboard/compOff' },
    ];

    // Navigation items for HOD (same as Faculty + My Team)
    const hodNavItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard-faculty' },
        { label: 'Leaves', icon: Calendar, path: '/dashboard-faculty/leaves' },
        { label: 'Attendance', icon: Users, path: '/dashboard-faculty/attendance' },
        { label: 'Permission', icon: FileText, path: '/dashboard-faculty/permissions' },
        { label: 'Regularization List', icon: RotateCw, path: '/dashboard/regularizationList' },
        { label: 'My Team', icon: Users2, path: '/dashboard-faculty/my-Team' },
    ];

    // Navigation items for Admin
    const adminNavItems = [
        { label: 'Faculty Management', icon: Users, path: '/dashboard-admin' },
        { label: 'Shift Management', icon: CalendarSync, path: '/dashboard-admin/shifts' },
        { label: 'Holiday Management', icon: CalendarX2, path: '/dashboard-admin/holidays' },
    ];

    // Navigation items for Principal
    const principalNavItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard-principal' },
    ];

    // Navigation items for Non-Teaching (same as Faculty)
    const nonTeachingNavItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard-faculty' },
        { label: 'Leaves', icon: Calendar, path: '/dashboard-faculty/leaves' },
        { label: 'Attendance', icon: Users, path: '/dashboard-faculty/attendance' },
        { label: 'Permission', icon: FileText, path: '/dashboard-faculty/permissions' },
        { label: 'Regularization List', icon: RotateCw, path: '/dashboard/regularizationList' },
    ];

    // Determine navigation items based on role
    let navItems = facultyNavItems;
    switch (role) {
        case 'hod':
            navItems = hodNavItems;
            break;
        case 'admin':
            navItems = adminNavItems;
            break;
        case 'principal':
            navItems = principalNavItems;
            break;
        case 'non-teaching':
            navItems = nonTeachingNavItems;
            break;
        default:
            navItems = facultyNavItems;
    }

    const isActive = (path) => {
        if (path === '/profile') {
            return location.pathname.startsWith('/profile');
        }
        return location.pathname === path;
    };

    return (
        <>
            {/* Sidebar */}
            <div className="w-[18%] bg-[#001d3b] flex flex-col relative">

                {/* Logo */}
                <div className="px-3 py-4 mt-4">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[70%]  object-contain"
                    />
                </div>

                {/* Menu */}
                <div className="mt-6 px-2 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative w-full flex items-center gap-2 text-white text-[18px] px-3 py-2 rounded-md transition font-semibold ${active
                                    ? 'bg-[#0b2a73]/40 hover:bg-[#0d3a8f]'
                                    : 'bg-transparent hover:bg-[#0b2a73]'
                                    }`}
                            >
                                <Icon size={16} className="text-[#7ea6ff]" />
                                <span>{item.label}</span>
                                {active && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[3px] bg-[#5b8cff] rounded-full"></div>
                                )}
                            </Link>
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
