import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, CalendarPlus, FileText, QrCode, 
  Activity, PackageCheck, IndianRupee, Bell, History, 
  MessageSquareWarning, User, LogOut, Menu, X, Globe, ChevronDown
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';

const navItems = [
  { name: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
  { name: 'Find Centre', path: '/farmer/find-centre', icon: MapPin },
  { name: 'Book Slot', path: '/farmer/book-slot', icon: CalendarPlus },
  { name: 'My Booking', path: '/farmer/my-booking', icon: FileText },
  { name: 'Digital Token', path: '/farmer/token', icon: QrCode },
  { name: 'Live Queue', path: '/farmer/live-queue', icon: Activity },
  { name: 'Procurement', path: '/farmer/procurement', icon: PackageCheck },
  { name: 'Payments', path: '/farmer/payments', icon: IndianRupee },
  { name: 'Notifications', path: '/farmer/notifications', icon: Bell },
  { name: 'History', path: '/farmer/history', icon: History },
  { name: 'Feedback', path: '/farmer/feedback', icon: MessageSquareWarning },
  { name: 'Profile', path: '/farmer/profile', icon: User },
];

const mobileBottomNav = [
  { name: 'Home', path: '/farmer/dashboard', icon: LayoutDashboard },
  { name: 'Book', path: '/farmer/book-slot', icon: CalendarPlus },
  { name: 'Token', path: '/farmer/token', icon: QrCode },
  { name: 'Queue', path: '/farmer/live-queue', icon: Activity },
  { name: 'Menu', action: 'toggleMenu', icon: Menu },
];

const FarmerLayout = ({ children }) => {
  const { currentUser, logout, state } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [language, setLanguage] = useState('English');

  const unreadCount = state.notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavContent = () => (
    <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-forest-600 text-white shadow-sm'
                : 'text-forest-100 hover:bg-forest-800/80 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.name}</span>
            {item.name === 'Notifications' && unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col md:flex-row relative">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-forest-900 text-white fixed h-full z-30 shadow-xl border-r border-forest-800">
        <div className="p-6 border-b border-forest-800/50">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 bg-forest-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">K</span>
             </div>
             <h1 className="text-2xl font-black tracking-tight text-white">KisanQueue</h1>
          </div>
          <p className="text-xs text-forest-300 font-medium uppercase tracking-widest pl-10">Farmer Portal</p>
        </div>
        
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen w-full">
        
        {/* Top Header */}
        <header className="bg-white border-b border-earth-200 sticky top-0 z-20 shadow-sm">
          <div className="flex justify-between items-center px-4 md:px-8 h-16 md:h-20">
            {/* Left: Mobile Brand & Greeting */}
            <div className="flex items-center gap-4">
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white">K</span>
                </div>
                <h1 className="font-bold text-forest-900 text-lg">KisanQueue</h1>
              </div>
              
              <div className="hidden md:block">
                <h2 className="text-lg font-bold text-forest-900">Good Morning, {currentUser?.name.split(' ')[0]}</h2>
                <div className="flex items-center gap-2 text-xs text-earth-500 font-medium mt-0.5">
                  <span className="bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded">ID: {currentUser?.id}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {currentUser?.village}, {currentUser?.state}</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Language Selector */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="hidden sm:flex text-earth-600 gap-1" onClick={() => setLangDropdown(!langDropdown)}>
                  <Globe className="w-4 h-4" /> {language} <ChevronDown className="w-3 h-3" />
                </Button>
                {langDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-earth-200 shadow-lg rounded-lg overflow-hidden py-1">
                    {['English', 'తెలుగు', 'हिन्दी'].map(l => (
                      <button key={l} className="w-full text-left px-4 py-2 text-sm hover:bg-forest-50" onClick={() => { setLanguage(l); setLangDropdown(false); }}>{l}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-earth-600 hover:bg-earth-100 hidden sm:flex" onClick={() => navigate('/farmer/notifications')}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </Button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 focus:outline-none bg-earth-50 hover:bg-earth-100 p-1 pr-3 rounded-full border border-earth-200 transition-colors"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  <div className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center text-white font-bold shadow-sm">
                    {currentUser?.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-4 h-4 text-earth-500 hidden sm:block" />
                </button>
                
                {profileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-earth-200 shadow-xl rounded-xl overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-earth-100 bg-earth-50">
                      <p className="font-bold text-forest-900 text-sm truncate">{currentUser?.name}</p>
                      <p className="text-xs text-earth-500 truncate">{currentUser?.mobile}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-earth-700 hover:bg-forest-50 flex items-center gap-2" onClick={() => { navigate('/farmer/profile'); setProfileDropdown(false); }}>
                      <User className="w-4 h-4 text-earth-400" /> My Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-earth-100" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-28 md:pb-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
      
      {/* Mobile Full Screen Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-forest-900 z-50 flex flex-col animate-in slide-in-from-right">
          <div className="flex justify-between items-center p-4 border-b border-forest-800">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-forest-500 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white">K</span>
                </div>
                <h1 className="font-bold text-white text-lg">Menu</h1>
             </div>
             <Button variant="ghost" size="icon" className="text-white hover:bg-forest-800" onClick={() => setIsMobileMenuOpen(false)}>
               <X className="w-6 h-6" />
             </Button>
          </div>
          <div className="p-4 border-b border-forest-800 bg-forest-950/30">
            <h2 className="text-lg font-bold text-white">Good Morning, {currentUser?.name.split(' ')[0]}</h2>
            <p className="text-sm text-forest-300">ID: {currentUser?.id} | {currentUser?.village}</p>
          </div>
          <NavContent />
          <div className="p-4 border-t border-forest-800">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white gap-2" onClick={handleLogout}>
              <LogOut className="w-5 h-5" /> Logout
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 flex justify-around p-2 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {mobileBottomNav.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.action === 'toggleMenu') {
            return (
              <button
                key={item.name}
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center justify-center w-16 h-12 text-earth-500"
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
                isActive ? 'text-forest-600' : 'text-earth-500 hover:text-earth-700'
              }`}
            >
              <div className={`relative ${isActive ? 'bg-forest-50 p-1 rounded-xl' : ''}`}>
                 <item.icon className={`w-6 h-6 ${isActive ? 'mb-0' : 'mb-1'}`} />
              </div>
              {!isActive && <span className="text-[10px] font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
};

export default FarmerLayout;
