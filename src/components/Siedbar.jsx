// Sidebar.jsx
import logo from '../assets/logo.svg'
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, FileText, RotateCw, Users2 } from "lucide-react";

const Sidebar = () => {
    const location = useLocation();

    // Hardcoded for now. Later replace with role fetched from localStorage.
    const role = 'hod';

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard-faculty' },
        { label: 'Leaves', icon: Calendar, path: '/dashboard-faculty/leaves' },
        { label: 'Attendance', icon: Users, path: '/dashboard-faculty/attendance' },
        { label: 'Permission', icon: FileText, path: '/dashboard-faculty/permissions' },
        { label: 'Regularization List', icon: RotateCw, path: '/dashboard/regularizationList' },
    ];

    const hodNavItem = {
        label: 'My team',
        icon: Users2,
        path: '/dashboard-faculty/my-Team'
    };

    const finalNavItems = role === 'hod' ? [...navItems, hodNavItem] : navItems;

    const isActive = (path) => {
        if (path === '/profile') {
            return location.pathname.startsWith('/profile');
        }
        return location.pathname === path;
    };

    return (
        <>
            {/* Sidebar */}
            <div className="w-[18%] bg-[#001d3b] flex flex-col">

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
                    {finalNavItems.map((item) => {
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
            </div>
        </>
    );
};

export default Sidebar;
