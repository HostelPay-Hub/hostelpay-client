import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  FileText, 
  IndianRupee, 
  Receipt,
  Megaphone,
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Activate Real-Time Sync
  useRealTimeSync(user?.hostelId);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Students', path: '/students', icon: <Users className="w-5 h-5" /> },
    { name: 'Rooms', path: '/rooms', icon: <Key className="w-5 h-5" /> },
    { name: 'Leases', path: '/leases', icon: <FileText className="w-5 h-5" /> },
    { name: 'Payments', path: '/payments', icon: <IndianRupee className="w-5 h-5" /> },
    { name: 'Expenses', path: '/expenses', icon: <Receipt className="w-5 h-5" /> },
    { name: 'Notices', path: '/notices', icon: <Megaphone className="w-5 h-5" /> },
    { name: 'Pending Dues', path: '/pending-dues', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  if (user?.role === 'SUPER_ADMIN') {
    navItems.length = 0;
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: <Settings className="w-5 h-5" /> });
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-dark border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-gradient tracking-wider">HostelPay Hub</h1>
        </div>
        
        <div className="p-4 border-b border-slate-800">
          <div className="text-sm font-medium text-slate-300 truncate">{user?.email}</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{user?.role}</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
