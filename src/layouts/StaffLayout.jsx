import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  LayoutDashboard, Users, Calendar, ScanLine, FileText, Scale, 
  FileSignature, IndianRupee, MessageSquareWarning, BarChart3, 
  History, Settings, LogOut, Briefcase, Bell, Globe, Menu, X, Power
} from 'lucide-react';

const StaffLayout = ({ children }) => {
  const { currentUser, logout, state, setState } = useAppContext();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [centreOpen, setCentreOpen] = useState(true); // Demo state for centre status

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { name: 'Live Queue', path: '/staff/live-queue', icon: Users },
    { name: "Today's Bookings", path: '/staff/bookings', icon: Calendar },
    { name: 'Farmer Verification', path: '/staff/verification', icon: ScanLine },
    { name: 'Quality Check', path: '/staff/quality-check', icon: FileText },
    { name: 'Weighing', path: '/staff/weighing', icon: Scale },
    { name: 'Procurement', path: '/staff/procurement', icon: FileSignature },
    { name: 'Payments', path: '/staff/payments', icon: IndianRupee },
    { name: 'Complaints', path: '/staff/complaints', icon: MessageSquareWarning },
    { name: 'Reports', path: '/staff/reports', icon: BarChart3 },
    { name: 'Activity Log', path: '/staff/activity', icon: History },
    { name: 'Settings', path: '/staff/settings', icon: Settings },
  ];

  const centre = state.centres.find(c => c.id === currentUser?.centreId);

  // Mobile Bottom Nav items (primary actions only)
  const bottomNavItems = navItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col md:flex-row">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-white border-b border-earth-200 p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-forest-900">
             <Menu className="w-6 h-6" />
           </button>
           <h1 className="font-black text-forest-900 text-lg tracking-tight">KisanQueue</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full ${centreOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
           <Button variant="ghost" size="icon" className="text-earth-600 rounded-full w-8 h-8"><Bell className="w-5 h-5" /></Button>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT MENU */}
      <div className={`md:hidden fixed inset-0 bg-forest-950/80 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <aside className={`md:hidden fixed inset-y-0 left-0 w-[280px] bg-forest-900 text-white z-50 transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-4 border-b border-forest-800 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black tracking-tight">KisanQueue</h1>
              <p className="text-[10px] font-bold text-forest-300 uppercase tracking-widest mt-0.5">Procurement Centre</p>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-forest-300 hover:text-white bg-forest-800 rounded-full"><X className="w-5 h-5" /></button>
         </div>
         <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-forest-800 text-white shadow-inner' : 'text-forest-200 hover:bg-forest-800/50 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5" /> {item.name}
              </NavLink>
            ))}
         </nav>
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col bg-forest-900 text-white fixed h-full z-20 shadow-xl">
        <div className="p-6 border-b border-forest-800 bg-forest-950/30">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            KisanQueue
          </h1>
          <p className="text-xs font-bold text-forest-400 mt-1 uppercase tracking-widest">Procurement Centre</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-inner border border-forest-700'
                    : 'text-forest-200 hover:bg-forest-800/50 hover:text-white border border-transparent'
                }`
              }
            >
              <item.icon className={`w-5 h-5 ${item.name === 'Complaints' ? 'text-amber-400' : ''}`} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        
        {/* DESKTOP HEADER */}
        <header className="hidden md:flex bg-white border-b border-earth-200 px-8 py-4 justify-between items-center sticky top-0 z-10 shadow-sm">
           
           <div className="flex items-center gap-4">
              <div className="bg-forest-50 p-2.5 rounded-xl border border-forest-100">
                <Briefcase className="w-6 h-6 text-forest-700" />
              </div>
              <div>
                <h2 className="text-lg font-black text-forest-900">Good Morning, {currentUser?.name}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-earth-500 mt-0.5">
                  <span>{centre?.name}</span>
                  <span className="w-1 h-1 bg-earth-300 rounded-full"></span>
                  <span className="uppercase tracking-wider">{centre?.id}</span>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-6">
              
              {/* Centre Status Toggle */}
              <div className="flex items-center gap-3 bg-earth-50 p-1.5 pr-4 rounded-full border border-earth-200 shadow-inner">
                 <button 
                   onClick={() => setCentreOpen(!centreOpen)}
                   className={`p-2 rounded-full shadow-sm transition-colors ${centreOpen ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                 >
                   <Power className="w-4 h-4" />
                 </button>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-earth-500 uppercase tracking-widest leading-none">Centre Status</span>
                   <span className={`text-xs font-black uppercase tracking-wider mt-0.5 ${centreOpen ? 'text-green-700' : 'text-red-600'}`}>
                     {centreOpen ? 'OPEN' : 'PAUSED'}
                   </span>
                 </div>
              </div>

              <div className="h-8 w-px bg-earth-200"></div>
              
              <div className="flex items-center gap-2 text-earth-500 font-bold text-sm bg-white border border-earth-200 px-3 py-1.5 rounded-full hover:bg-earth-50 cursor-pointer transition-colors shadow-sm">
                <Globe className="w-4 h-4 text-forest-600" /> EN
              </div>
              
              <button className="relative p-2 text-earth-500 hover:bg-earth-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-earth-200"></div>

              {/* Profile Menu */}
              <div className="flex items-center gap-3 cursor-pointer group">
                 <div className="w-10 h-10 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-black shadow-sm group-hover:bg-forest-200 transition-colors">
                    {currentUser?.name.charAt(0)}
                 </div>
                 <div className="flex flex-col hidden lg:flex">
                   <span className="text-sm font-bold text-earth-900 group-hover:text-forest-700 transition-colors">{currentUser?.name}</span>
                   <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 text-left mt-0.5 uppercase tracking-wider flex items-center gap-1">
                      <LogOut className="w-3 h-3" /> Sign Out
                   </button>
                 </div>
              </div>
           </div>
        </header>

        {/* MOBILE CENTRE STATUS BAR (Below Header) */}
        <div className="md:hidden bg-earth-50 border-b border-earth-200 px-4 py-3 flex justify-between items-center shadow-inner">
           <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${centreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-xs font-bold uppercase tracking-wider text-earth-700">
                {centreOpen ? 'CENTRE OPEN' : 'CENTRE PAUSED'}
              </span>
           </div>
           <button 
             onClick={() => setCentreOpen(!centreOpen)}
             className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${centreOpen ? 'bg-white border-earth-300 text-earth-600' : 'bg-red-100 border-red-200 text-red-700'}`}
           >
             {centreOpen ? 'Pause' : 'Resume'}
           </button>
        </div>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          {children}
        </main>
        
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-earth-200 flex justify-around p-2 pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? 'text-forest-700 bg-forest-50' : 'text-earth-400 hover:bg-earth-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-forest-600' : 'text-earth-400'}`} />
                {item.name.split(' ')[0]}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
    </div>
  );
};

export default StaffLayout;
