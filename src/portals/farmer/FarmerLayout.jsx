import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, CalendarPlus, FileText, QrCode, 
  Activity, PackageCheck, IndianRupee, Bell, History, 
  MessageSquareWarning, User, LogOut, Menu, X, Globe, ChevronDown,
  Mic, Sparkles, Check
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../data/translations';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import ConnectivityStatus from './components/ConnectivityStatus';
import DemoSimulationDrawer from './components/DemoSimulationDrawer';
import useNetworkStatus from '../../utils/useNetworkStatus';

const FarmerLayout = ({ children }) => {
  const { currentUser, logout, state } = useAppContext();
  const { t, currentLang, setLanguage } = useTranslation();
  const { isOnline, wasOffline, lastSyncTime } = useNetworkStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Monitor unread notifications strictly for current authenticated farmer
  const unreadCount = (state.notifications || []).filter(
    n => n.userId === currentUser?.id && !n.read
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: t('dashboard', 'Dashboard'), path: '/farmer/dashboard', icon: LayoutDashboard },
    { name: t('findCentre', 'Find Centre'), path: '/farmer/find-centre', icon: MapPin },
    { name: t('bookSlot', 'Book Slot'), path: '/farmer/book-slot', icon: CalendarPlus },
    { name: t('myBooking', 'My Booking'), path: '/farmer/my-booking', icon: FileText },
    { name: t('digitalToken', 'Digital Token'), path: '/farmer/token', icon: QrCode },
    { name: t('liveQueue', 'Live Queue'), path: '/farmer/live-queue', icon: Activity },
    { name: t('procurement', 'Procurement Track'), path: '/farmer/procurement', icon: PackageCheck },
    { name: t('payments', 'Payments'), path: '/farmer/payments', icon: IndianRupee },
    { name: t('notifications', 'Notifications'), path: '/farmer/notifications', icon: Bell, badge: unreadCount },
    { name: t('history', 'History'), path: '/farmer/history', icon: History },
    { name: t('feedbackSupport', 'Help & Complaints'), path: '/farmer/feedback', icon: MessageSquareWarning },
    { name: t('profile', 'Profile'), path: '/farmer/profile', icon: User },
  ];

  const mobileBottomNav = [
    { name: t('home', 'Home'), path: '/farmer/dashboard', icon: LayoutDashboard },
    { name: t('bookings', 'Bookings'), path: '/farmer/my-booking', icon: FileText },
    { name: t('queue', 'Queue'), path: '/farmer/live-queue', icon: Activity },
    { name: t('track', 'Track'), path: '/farmer/procurement', icon: PackageCheck },
    { name: t('profile', 'Profile'), path: '/farmer/profile', icon: User },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  const currentLangLabel = languages.find(l => l.code === currentLang)?.label || 'English';

  const NavContent = () => (
    <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all min-h-[48px] ${
              isActive
                ? 'bg-farmer-primary text-white shadow-sm font-black'
                : 'text-farmer-secondary hover:bg-farmer-primary-light hover:text-farmer-primary'
            }`}
          >
            <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-farmer-secondary'}`} />
            <span className="truncate">{item.name}</span>
            {item.badge > 0 && (
              <span className="ml-auto bg-farmer-error text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-farmer-bg flex flex-col md:flex-row relative font-sans text-farmer-text antialiased">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-farmer-card text-farmer-text fixed h-full z-30 shadow-sm border-r border-farmer-border">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-farmer-border flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-farmer-primary rounded-2xl flex items-center justify-center shadow-sm">
                <span className="font-black text-white text-xl">K</span>
             </div>
             <div>
               <h1 className="text-base font-black tracking-tight text-farmer-text leading-tight">{t('appName', 'KisanQueue')}</h1>
               <p className="text-[10px] text-farmer-secondary font-bold uppercase tracking-wider">{t('farmerPortal', 'Farmer Portal')}</p>
             </div>
          </div>
        </div>

        {/* AI Voice Assistant Trigger */}
        <div className="p-3 mx-3 mt-3 bg-farmer-accent-light/70 rounded-2xl border border-farmer-accent/30">
           <div className="flex items-center justify-between mb-2">
             <span className="text-[11px] font-bold text-farmer-text uppercase tracking-wider flex items-center gap-1.5">
               <Sparkles className="w-3.5 h-3.5 text-farmer-accent" /> {t('voice.title', 'Voice Assistant')}
             </span>
             <span className="text-[9px] font-bold bg-farmer-accent/20 text-farmer-text px-1.5 py-0.5 rounded">
               AI
             </span>
           </div>
           <button 
             className="w-full bg-white hover:bg-farmer-primary hover:text-white text-farmer-text font-bold text-xs py-2.5 px-3 rounded-xl border border-farmer-border flex items-center justify-center gap-2 transition-colors shadow-sm min-h-[44px]"
             onClick={() => setIsVoiceModalOpen(true)}
             aria-label={t('voice.speakNow', 'Tap to Speak')}
           >
             <Mic className="w-4 h-4 text-farmer-primary group-hover:text-white" />
             <span>{t('voice.speakNow', 'Tap to Speak')}</span>
           </button>
        </div>
        
        <NavContent />

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-farmer-border bg-farmer-bg/60 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-9 h-9 rounded-full bg-farmer-primary flex items-center justify-center font-bold text-white shrink-0 shadow-sm text-sm">
               {currentUser?.name?.charAt(0) || 'F'}
             </div>
             <div className="overflow-hidden">
               <p className="text-xs font-bold text-farmer-text truncate">{currentUser?.name || 'Farmer'}</p>
               <p className="text-[10px] text-farmer-secondary font-mono">ID: {currentUser?.id || ''}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-farmer-secondary hover:text-farmer-error p-2 rounded-xl hover:bg-farmer-error-light transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={t('logout', 'Logout')}
            aria-label={t('logout', 'Logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen w-full">
        
        {/* Automatic Connectivity Status Bar */}
        <ConnectivityStatus 
          isOnline={isOnline} 
          wasOffline={wasOffline} 
          lastSyncTime={lastSyncTime} 
        />

        {/* Top Header */}
        <header className="bg-farmer-card border-b border-farmer-border sticky top-0 z-20 shadow-sm">
          <div className="flex justify-between items-center px-4 md:px-8 h-16 md:h-18">
            
            {/* Left: Brand / Farmer Greeting */}
            <div className="flex items-center gap-3">
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-farmer-primary rounded-xl flex items-center justify-center shadow-sm">
                  <span className="font-black text-white text-base">K</span>
                </div>
                <span className="font-black text-farmer-text text-base">{t('appName', 'KisanQueue')}</span>
              </div>
              
              <div className="hidden md:block">
                <h2 className="text-sm font-bold text-farmer-text leading-snug">
                  {t('dashboard.welcome', { name: currentUser?.name?.split(' ')[0] || 'Farmer' })}
                </h2>
                <div className="flex items-center gap-2 text-xs text-farmer-secondary font-medium mt-0.5">
                  <span className="bg-farmer-bg text-farmer-primary font-bold px-2 py-0.5 rounded-md border border-farmer-border font-mono text-[11px]">
                    {currentUser?.id || ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-farmer-primary"/> {currentUser?.village ? `${currentUser.village}, ` : ''}{currentUser?.district || 'West Godavari'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions (Sync status, Language, Voice, Notifications, Profile) */}
            <div className="flex items-center gap-2 md:gap-3">
              
              {/* Subtle Live Sync Status Pill */}
              {isOnline && (
                <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-farmer-success px-2.5 py-1 rounded-full bg-farmer-success-light border border-farmer-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-farmer-success animate-pulse" />
                  <span>{t('connectivity.syncedJustNow', '✓ Synced just now')}</span>
                </div>
              )}

              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-1.5 bg-farmer-bg hover:bg-farmer-primary-light border border-farmer-border text-farmer-text px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm min-h-[44px]"
                  onClick={() => setLangDropdown(!langDropdown)}
                  aria-label="Select Language"
                >
                  <Globe className="w-4 h-4 text-farmer-primary" />
                  <span>{currentLangLabel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-farmer-secondary" />
                </button>
                {langDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-farmer-border shadow-farmer-elevated rounded-2xl overflow-hidden py-1 z-30 animate-in fade-in zoom-in-95">
                    {languages.map(l => (
                      <button 
                        key={l.code} 
                        className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between ${
                          currentLang === l.code 
                            ? 'bg-farmer-primary-light text-farmer-primary font-black' 
                            : 'hover:bg-farmer-bg text-farmer-text'
                        }`}
                        onClick={() => { setLanguage(l.code); setLangDropdown(false); }}
                      >
                        <span>{l.label}</span>
                        {currentLang === l.code && <Check className="w-3.5 h-3.5 text-farmer-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Voice Assistant Button in Header */}
              <button 
                className="bg-farmer-primary hover:bg-farmer-primary-dark text-white rounded-2xl font-bold px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-sm transition-colors min-h-[44px]"
                onClick={() => setIsVoiceModalOpen(true)}
                aria-label={t('voice.title', 'Voice Assistant')}
              >
                <Mic className="w-4 h-4 text-farmer-accent" />
                <span className="hidden sm:inline">{t('voice.title', 'Voice')}</span>
              </button>

              {/* Notifications Button */}
              <button 
                className="relative p-2.5 rounded-2xl text-farmer-text hover:bg-farmer-primary-light transition-colors border border-farmer-border min-h-[44px] min-w-[44px] flex items-center justify-center bg-farmer-bg"
                onClick={() => navigate('/farmer/notifications')}
                title={t('notifications.title', 'Notifications')}
                aria-label={t('notifications.title', 'Notifications')}
              >
                <Bell className="w-4 h-4 text-farmer-text" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-farmer-error rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Mobile Drawer Menu Toggle */}
              <button 
                className="md:hidden p-2.5 rounded-2xl text-farmer-text hover:bg-farmer-primary-light transition-colors border border-farmer-border min-h-[44px] min-w-[44px] flex items-center justify-center bg-farmer-bg"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Profile Dropdown (Desktop) */}
              <div className="relative hidden sm:block">
                <button 
                  className="flex items-center gap-2 bg-farmer-bg hover:bg-farmer-primary-light p-1.5 pr-3 rounded-full border border-farmer-border transition-colors min-h-[44px]"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  aria-label="User Profile Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-farmer-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {currentUser?.name?.charAt(0) || 'R'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-farmer-secondary" />
                </button>
                
                {profileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-farmer-border shadow-farmer-elevated rounded-2xl overflow-hidden py-1.5 z-30 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-farmer-border bg-farmer-bg">
                      <p className="font-bold text-farmer-text text-sm truncate">{currentUser?.name || 'Farmer'}</p>
                      <p className="text-xs text-farmer-secondary font-mono truncate">{currentUser?.mobile || ''}</p>
                    </div>
                    <button 
                      className="w-full text-left px-4 py-3 text-xs font-bold text-farmer-text hover:bg-farmer-primary-light flex items-center gap-2.5" 
                      onClick={() => { navigate('/farmer/profile'); setProfileDropdown(false); }}
                    >
                      <User className="w-4 h-4 text-farmer-primary" /> {t('profile', 'Profile')}
                    </button>
                    <button 
                      className="w-full text-left px-4 py-3 text-xs font-bold text-farmer-text hover:bg-farmer-primary-light flex items-center gap-2.5" 
                      onClick={() => { navigate('/farmer/feedback'); setProfileDropdown(false); }}
                    >
                      <MessageSquareWarning className="w-4 h-4 text-farmer-warning" /> {t('feedbackSupport', 'Help & Complaints')}
                    </button>
                    <button 
                      className="w-full text-left px-4 py-3 text-xs font-bold text-farmer-error hover:bg-farmer-error-light flex items-center gap-2.5 border-t border-farmer-border" 
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 text-farmer-error" /> {t('logout', 'Logout')}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-32 md:pb-16 max-w-[1300px] w-full mx-auto">
          {children}
        </main>
      </div>
      
      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="flex justify-between items-center p-4 bg-farmer-card border-b border-farmer-border">
             <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-farmer-primary rounded-xl flex items-center justify-center shadow-sm">
                  <span className="font-black text-white text-lg">K</span>
                </div>
                <div>
                  <h1 className="font-black text-farmer-text text-base leading-tight">{t('appName', 'KisanQueue')}</h1>
                  <p className="text-[10px] text-farmer-secondary font-bold uppercase">{t('farmerPortal', 'Farmer Portal')}</p>
                </div>
             </div>
             <button 
               className="text-farmer-secondary hover:text-farmer-text p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
               onClick={() => setIsMobileMenuOpen(false)}
               aria-label="Close Menu"
             >
               <X className="w-6 h-6" />
             </button>
          </div>
          
          <div className="p-4 bg-farmer-bg border-b border-farmer-border">
            <h2 className="text-sm font-bold text-farmer-text">{currentUser?.name || 'Farmer'}</h2>
            <p className="text-xs text-farmer-secondary font-medium mt-0.5">
              ID: {currentUser?.id || ''}{currentUser?.village ? ` · ${currentUser.village}` : ''}
            </p>
          </div>

          <div className="bg-farmer-card flex-1 overflow-y-auto">
            <NavContent />
          </div>

          <div className="p-4 bg-farmer-card border-t border-farmer-border flex gap-3">
            <button 
              className="flex-1 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs min-h-[48px] shadow-sm"
              onClick={() => { setIsMobileMenuOpen(false); setIsVoiceModalOpen(true); }}
            >
              <Mic className="w-4 h-4 text-farmer-accent" /> {t('voice.title', 'Voice Assistant')}
            </button>
            <button 
              className="bg-farmer-error-light hover:bg-farmer-error text-farmer-error hover:text-white px-4 py-3 rounded-2xl font-bold flex items-center justify-center transition-colors min-h-[48px]"
              onClick={handleLogout}
              title={t('logout', 'Logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation (5 Key Tabs with 48px min touch target) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-farmer-border flex justify-around p-1 pb-safe z-30 shadow-[0_-2px_15px_rgba(38,55,70,0.06)]">
        {mobileBottomNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all rounded-xl ${
                isActive ? 'text-farmer-primary font-black' : 'text-farmer-secondary hover:text-farmer-text'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-farmer-primary-light text-farmer-primary' : ''}`}>
                 <item.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold mt-0.5">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Discrete Demo Mode Simulation Drawer */}
      <DemoSimulationDrawer />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />

    </div>
  );
};

export default FarmerLayout;
