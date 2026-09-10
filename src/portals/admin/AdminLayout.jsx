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
    { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
    { name: 'Complaints', path: '/admin/complaints', icon: AlertTriangle },
    { name: 'Staff Management', path: '/admin/staff', icon: UsersRound },
    { name: 'Activity Log', path: '/admin/activity', icon: History },
    { name: 'MSP Configuration', path: '/admin/settings', icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen bg-farmer-bg flex flex-col md:flex-row relative">

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-farmer-border p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-farmer-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="font-black text-white text-base">K</span>
          </div>
          <h1 className="font-black text-farmer-text tracking-tight">KisanQueue</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-farmer-secondary hover:bg-farmer-primary-light">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-farmer-card text-farmer-text fixed h-full z-30 shadow-sm border-r border-farmer-border">
        <div className="p-5 border-b border-farmer-border flex items-center gap-3">
          <div className="w-10 h-10 bg-farmer-primary rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <span className="font-black text-white text-xl">K</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-farmer-text leading-tight">KisanQueue</h1>
            <p className="text-[10px] text-farmer-primary font-bold uppercase tracking-wider">Government Admin</p>
          </div>
        </div>

        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all min-h-[48px] ${isActive
                  ? 'bg-farmer-primary text-white shadow-sm font-black'
                  : 'text-farmer-secondary hover:bg-farmer-primary-light hover:text-farmer-primary'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-farmer-border bg-farmer-bg/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-farmer-primary flex items-center justify-center font-bold text-white shrink-0 shadow-sm text-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-farmer-text text-sm truncate">{currentUser?.name || 'Admin User'}</p>
              <p className="text-[10px] text-farmer-secondary font-bold uppercase tracking-wider">Admin Profile</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-farmer-error hover:text-white hover:bg-farmer-error rounded-xl transition-colors font-bold text-xs py-2.5" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">

        {/* Desktop Header */}
        <header className="hidden md:flex bg-farmer-card border-b border-farmer-border h-18 items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-farmer-text leading-snug">Good Morning, Admin</h2>
            <p className="text-xs font-medium text-farmer-secondary">National Procurement Operations Overview</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-farmer-success-light rounded-full border border-farmer-success/20">
              <span className="w-2 h-2 rounded-full bg-farmer-success animate-pulse"></span>
              <span className="text-[11px] font-bold text-farmer-success uppercase tracking-wider">All Systems Operational</span>
            </div>

            <div className="flex items-center gap-4 text-farmer-secondary">
              <button className="flex items-center gap-2 hover:text-farmer-primary transition-colors text-sm font-bold">
                <RefreshCw className="w-4 h-4" />
                <div className="text-left leading-tight hidden lg:block">
                  <div className="text-[10px] text-farmer-secondary">Last updated</div>
                  <div className="text-farmer-text">Just now</div>
                </div>
              </button>

              <div className="w-px h-6 bg-farmer-border"></div>

              <button className="hover:text-farmer-primary transition-colors text-xs font-bold hidden lg:flex items-center gap-1.5">
                <CalendarClock className="w-4 h-4" />
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </button>

              <button className="hover:text-farmer-primary transition-colors">
                <Globe className="w-4 h-4" />
              </button>

              <button className="hover:text-farmer-primary transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-farmer-error rounded-full shadow-sm"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 bg-farmer-bg">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-farmer-card border-t border-farmer-border flex justify-around p-2 pb-safe z-30 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl text-[10px] font-bold transition-all ${isActive ? 'text-farmer-primary bg-farmer-primary-light' : 'text-farmer-secondary hover:text-farmer-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-farmer-primary' : 'text-farmer-secondary'}`} />
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
