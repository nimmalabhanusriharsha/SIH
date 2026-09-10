import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LogOut, ShieldCheck, Activity, BarChart2,
  Users, CalendarClock, PackageOpen, IndianRupee, MapPin,
  TrendingUp, AlertTriangle, UsersRound,
  History, Settings, Bell, Globe, RefreshCw
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../shared/components/Button';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Centre Monitoring', path: '/admin/centres', icon: Activity },
    { name: 'Farmer Management', path: '/admin/farmers', icon: Users },
    { name: 'Booking Management', path: '/admin/bookings', icon: CalendarClock },
    { name: 'Procurement Monitoring', path: '/admin/procurement', icon: PackageOpen },
    { name: 'Payment Monitoring', path: '/admin/payments', icon: IndianRupee },
    { name: 'Congestion & Queue', path: '/admin/congestion', icon: MapPin },
    { name: 'Demand Forecast', path: '/admin/demand', icon: TrendingUp },
    { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
    { name: 'Complaints', path: '/admin/complaints', icon: AlertTriangle },
    { name: 'Staff Management', path: '/admin/staff', icon: UsersRound },
    { name: 'Activity Log', path: '/admin/activity', icon: History },
    { name: 'MSP Configuration', path: '/admin/settings', icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col md:flex-row relative">

      {/* Mobile Header */}
      <header className="md:hidden bg-forest-900 border-b border-forest-800 p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">K</span>
          </div>
          <h1 className="font-bold text-white tracking-tight">KisanQueue Admin</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-forest-800">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-forest-900 text-white fixed h-full z-30 shadow-xl border-r border-forest-800">
        <div className="p-6 border-b border-forest-800/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-forest-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">K</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">KisanQueue</h1>
          </div>
          <p className="text-[10px] text-forest-300 font-bold uppercase tracking-widest pl-10">GOVERNMENT ADMIN</p>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-forest-100 hover:bg-forest-800/80 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-forest-800/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="bg-forest-800 p-2 rounded-lg border border-forest-700">
              <ShieldCheck className="w-5 h-5 text-forest-300" />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm truncate">{currentUser?.name || 'Admin User'}</p>
              <p className="text-[10px] text-forest-400 font-medium uppercase">Admin Profile</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-earth-200 h-20 items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-forest-900 tracking-tight">Good Morning, Admin</h2>
            <p className="text-sm font-medium text-earth-500">National Procurement Operations Overview</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-green-700">All Systems Operational</span>
            </div>

            <div className="flex items-center gap-4 text-earth-500">
              <button className="flex items-center gap-2 hover:text-forest-600 transition-colors text-sm font-medium">
                <RefreshCw className="w-4 h-4" />
                <div className="text-left leading-tight hidden lg:block">
                  <div className="text-[10px] text-earth-400">Last updated</div>
                  <div>Just now</div>
                </div>
              </button>

              <div className="w-px h-8 bg-earth-200"></div>

              <button className="hover:text-forest-600 transition-colors text-sm font-medium hidden lg:flex items-center gap-1.5">
                <CalendarClock className="w-4 h-4" />
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </button>

              <button className="hover:text-forest-600 transition-colors">
                <Globe className="w-5 h-5" />
              </button>

              <button className="hover:text-forest-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-earth-200 flex justify-around p-2 pb-safe z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-colors ${isActive ? 'text-forest-700 bg-forest-50' : 'text-earth-500 hover:text-forest-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-forest-700' : 'text-earth-400'}`} />
                <span className="truncate w-14 text-center">{item.name.split(' ')[0]}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;
