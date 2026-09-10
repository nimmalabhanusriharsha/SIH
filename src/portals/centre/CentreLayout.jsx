import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  LayoutDashboard, Users, Calendar, FileSignature, 
  MessageSquareWarning, BarChart3, History, Bell, Globe, 
  Menu, X, MapPin, ChevronDown, Sprout, Headphones, 
  ChevronRight, LogOut, Check, AlertCircle, Send, UserCheck, Shield, Phone, Mail, Building
} from 'lucide-react';

import { useTranslation } from '../../data/translations';

const CentreLayout = ({ children }) => {
  const { currentUser, logout, state, setState } = useAppContext();
  const { t, currentLang, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Farmer Booking', message: 'Token A108 (Suresh Babu) booked slot for 11:30 AM', time: '5 mins ago', read: false },
    { id: 2, title: 'Payment Processing Update', message: 'Payment PAY-8821 for Ramesh Kumar approved by Admin', time: '25 mins ago', read: false },
    { id: 3, title: 'Queue Capacity Alert', message: 'Counter 1 serving rate is optimal today', time: '1 hour ago', read: true },
    { id: 4, title: 'MSP Rate Confirmation', message: 'Paddy Grade A MSP rate confirmed at ₹22.50/kg', time: '2 hours ago', read: true }
  ]);

  // Support Issue Form State
  const [issueCategory, setIssueCategory] = useState('Weighing Scale Malfunction');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/centre/login');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!issueDescription.trim()) return;

    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser?.id || 'STAFF-01',
      action: `Raised Support Issue (${issueCategory}): ${issueDescription.slice(0, 40)}...`,
      farmerName: 'System Support',
      bookingId: 'N/A'
    };

    setState(prev => ({
      ...prev,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    setIssueSubmitted(true);
    setTimeout(() => {
      setIssueSubmitted(false);
      setIssueDescription('');
      setIsHelpModalOpen(false);
    }, 1800);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: t('centre.nav.dashboard', 'Dashboard'), path: '/centre/dashboard', icon: LayoutDashboard },
    { name: t('centre.nav.todaysBookings', "Today's Bookings"), path: '/centre/bookings', icon: Calendar },
    { name: t('centre.nav.liveQueue', 'Live Queue'), path: '/centre/live-queue', icon: Users },
    { name: t('centre.nav.procurement', 'Procurement'), path: '/centre/procurement', icon: FileSignature },
    { name: t('centre.nav.complaints', 'Complaints'), path: '/centre/complaints', icon: MessageSquareWarning },
    { name: t('centre.nav.reports', 'Reports'), path: '/centre/reports', icon: BarChart3 },
    { name: t('centre.nav.activityLog', 'Activity Log'), path: '/centre/activity', icon: History },
  ];

  const centre = state.centres.find(c => c.id === currentUser?.centreId) || state.centres[0];
  const bottomNavItems = navItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-farmer-bg flex flex-col md:flex-row font-sans">

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-white border-b border-farmer-border p-4 flex justify-between items-center sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-farmer-text cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-farmer-primary text-white flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-black text-farmer-text text-lg tracking-tight">KisanQueue</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-farmer-secondary cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT MENU */}
      <div className={`md:hidden fixed inset-0 bg-slate-900/60 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <aside className={`md:hidden fixed inset-y-0 left-0 w-[280px] bg-farmer-card text-farmer-text z-50 transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-farmer-border flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-farmer-primary text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-farmer-text">KisanQueue</h1>
              <p className="text-[10px] font-extrabold text-farmer-primary uppercase tracking-wider">Procurement Centre</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-farmer-secondary hover:text-farmer-text rounded-full cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-3 text-xs font-bold transition-all ${isActive ? 'bg-farmer-primary-light text-farmer-primary border-l-4 border-farmer-primary rounded-r-xl' : 'text-farmer-text hover:bg-farmer-primary-light/60'}`}
            >
              <item.icon className="w-5 h-5 text-farmer-primary" /> {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col bg-farmer-card border-r border-farmer-border fixed h-full z-20 shadow-xs">
        {/* LOGO */}
        <div className="p-5 border-b border-farmer-border/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-farmer-primary-light flex items-center justify-center shrink-0">
            <div className="w-7.5 h-7.5 rounded-xl bg-farmer-primary text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-farmer-text leading-tight">KisanQueue</h1>
            <p className="text-[10px] font-extrabold text-farmer-primary uppercase tracking-wider mt-0.5">Procurement Centre</p>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all ${isActive
                  ? 'bg-farmer-primary-light text-farmer-primary border-l-4 border-farmer-primary rounded-r-xl rounded-l-none'
                  : 'text-farmer-text hover:bg-farmer-primary-light/70 hover:text-farmer-primary rounded-xl border-l-4 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-farmer-primary text-white' : 'text-farmer-primary'}`}>
                    <item.icon className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM NEED HELP BUTTON (FUNCTIONAL) */}
        <div className="p-3 border-t border-farmer-border/80">
          <div 
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center justify-between p-3 rounded-2xl bg-white border border-farmer-border/80 shadow-xs hover:border-farmer-primary hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-6 h-6 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <Headphones className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-farmer-text group-hover:text-farmer-primary transition-colors">{t('centre.nav.needHelp', 'Need Help?')}</p>
                <p className="text-[10px] font-medium text-farmer-secondary">{t('centre.nav.contactAdmin', 'Contact Admin')}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-farmer-secondary group-hover:text-farmer-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">

        {/* DESKTOP HEADER */}
        <header className="hidden md:flex bg-white border-b border-farmer-border px-8 py-3.5 justify-between items-center sticky top-0 z-10 shadow-xs">

          {/* LOCATION SELECTOR */}
          <div className="flex items-center gap-3 bg-white border border-farmer-border px-4 py-2 rounded-2xl shadow-xs cursor-pointer hover:border-slate-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
              <div className="w-6.5 h-6.5 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-farmer-text">
                <span>{centre?.name || 'Sri Lakshmi Procurement Centre'}</span>
              </div>
              <p className="text-[11px] font-medium text-farmer-secondary">
                {centre?.id || 'C001'} • {currentUser?.counterId || 'Counter 1'} • {centre?.district || 'West Godavari'}
              </p>
            </div>
          </div>

          {/* RIGHT HEADER ITEMS */}
          <div className="flex items-center gap-4">

            {/* DATE & TIME CARD */}
            <div className="flex items-center gap-2 bg-white border border-farmer-border px-3.5 py-2 rounded-2xl shadow-xs text-xs font-bold text-farmer-text">
              <div className="w-6 h-6 rounded-md bg-farmer-primary-light flex items-center justify-center text-farmer-primary">
                <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
              </div>
              <span>Tue, 10 Sep 2025</span>
              <span className="text-slate-300">|</span>
              <span className="text-farmer-secondary font-medium">10:24 AM</span>
            </div>

            {/* FUNCTIONAL GLOBAL LANGUAGE SELECTOR */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-farmer-text font-bold text-xs bg-white border border-farmer-border px-3.5 py-2 rounded-2xl hover:bg-slate-50 cursor-pointer shadow-xs transition-colors"
              >
                <Globe className="w-4 h-4 text-farmer-primary" strokeWidth={2.5} /> {(currentLang || 'en').toUpperCase()} <ChevronDown className="w-3.5 h-3.5 text-farmer-secondary" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-farmer-border z-50 p-2 text-xs font-bold text-farmer-text animate-in zoom-in-95">
                  <button 
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${currentLang === 'en' ? 'bg-farmer-primary-light text-farmer-primary' : 'hover:bg-slate-50'}`}
                  >
                    English (EN)
                  </button>
                  <button 
                    onClick={() => { setLanguage('te'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${currentLang === 'te' ? 'bg-farmer-primary-light text-farmer-primary' : 'hover:bg-slate-50'}`}
                  >
                    తెలుగు (TE)
                  </button>
                  <button 
                    onClick={() => { setLanguage('hi'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${currentLang === 'hi' ? 'bg-farmer-primary-light text-farmer-primary' : 'hover:bg-slate-50'}`}
                  >
                    हिन्दी (HI)
                  </button>
                </div>
              )}
            </div>

            {/* FUNCTIONAL NOTIFICATION BELL WITH DROPDOWN */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2.5 text-farmer-secondary hover:bg-slate-100 rounded-2xl bg-white border border-farmer-border transition-colors shadow-xs cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-farmer-border z-50 overflow-hidden animate-in zoom-in-95">
                  <div className="bg-farmer-primary p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-200" />
                      <h4 className="font-extrabold text-sm">Centre Notifications</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-emerald-100 hover:text-white underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleMarkNotificationRead(item.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${!item.read ? 'bg-farmer-primary-light/40' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!item.read ? 'bg-farmer-primary' : 'bg-transparent'}`}></div>
                        <div className="flex-1">
                          <h5 className="font-extrabold text-farmer-text text-xs">{item.title}</h5>
                          <p className="text-[11px] text-farmer-secondary font-medium leading-tight mt-0.5">{item.message}</p>
                          <span className="text-[10px] text-farmer-secondary font-semibold block mt-1">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FUNCTIONAL USER PROFILE BUTTON WITH DROPDOWN */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 cursor-pointer group bg-white border border-farmer-border pl-2 pr-4 py-1.5 rounded-full shadow-xs hover:border-farmer-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-farmer-primary text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'S'}
                </div>
                <div className="flex flex-col hidden lg:flex">
                  <span className="text-xs font-black text-farmer-text leading-tight">{currentUser?.name || 'Srinivas Rao'}</span>
                  <span className="text-[10px] font-semibold text-farmer-primary text-left leading-tight">
                    {currentUser?.counterId || 'Counter 1'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-farmer-secondary group-hover:text-farmer-primary" />
              </div>

              {/* USER PROFILE DROPDOWN */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-farmer-border z-50 overflow-hidden animate-in zoom-in-95">
                  <div className="p-4 bg-farmer-card border-b border-farmer-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-farmer-primary text-white flex items-center justify-center font-black text-base">
                      {currentUser?.name ? currentUser.name.charAt(0) : 'S'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-farmer-text text-sm leading-tight">{currentUser?.name || 'Srinivas Rao'}</h4>
                      <p className="text-[11px] font-medium text-farmer-secondary mt-0.5">ID: {currentUser?.id || 'STAFF-01'}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 text-xs font-bold text-farmer-text">
                    <div className="flex items-center justify-between py-1 border-b border-farmer-border">
                      <span className="text-farmer-secondary font-medium">Procurement Centre</span>
                      <span className="text-farmer-text">{centre?.name || 'Sri Lakshmi Centre'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-farmer-border">
                      <span className="text-farmer-secondary font-medium">Counter ID</span>
                      <span className="text-farmer-primary font-black">{currentUser?.counterId || 'Counter 1'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-farmer-border">
                      <span className="text-farmer-secondary font-medium">Phone</span>
                      <span className="text-farmer-text">{currentUser?.phone || '+91 98765 43210'}</span>
                    </div>

                    <div className="pt-2 space-y-1.5">
                      <button
                        onClick={() => { setIsProfileOpen(false); navigate('/centre/activity'); }}
                        className="w-full py-2 px-3 text-left font-extrabold text-farmer-text hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>View Staff Activity Log</span>
                        <ChevronRight className="w-4 h-4 text-farmer-secondary" />
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 px-3 font-extrabold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-farmer-border flex justify-around p-2 pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl text-[10px] font-bold transition-all ${isActive ? 'text-farmer-primary bg-farmer-primary-light' : 'text-farmer-secondary hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-farmer-primary' : 'text-farmer-secondary'}`} />
                {item.name.split(' ')[0]}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FUNCTIONAL NEED HELP / SUPPORT MODAL */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 border border-farmer-border">
            {/* Modal Header */}
            <div className="bg-farmer-primary p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-emerald-200" />
                <h3 className="font-extrabold text-base">Help & Support / Contact Admin</h3>
              </div>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs font-semibold text-farmer-text">
              
              {/* Admin Contact Information */}
              <div className="bg-farmer-primary-light p-4 rounded-xl border border-emerald-200 space-y-2">
                <p className="text-[10px] font-extrabold text-farmer-primary uppercase tracking-wider">Centre Support Desk</p>
                <div className="space-y-1 text-xs text-farmer-text font-bold">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-farmer-primary" />
                    <span>Helpline: 1800-425-1999 (Toll Free)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-farmer-primary" />
                    <span>Email: support@kisanqueue.gov.in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-farmer-primary" />
                    <span>West Godavari District Hub</span>
                  </div>
                </div>
              </div>

              {/* Submit Ticket Form */}
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold text-farmer-text uppercase tracking-wider block mb-1.5">
                    Issue Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    className="w-full h-10 border border-farmer-border rounded-xl px-3 text-xs font-bold text-farmer-text bg-white focus:outline-none focus:border-farmer-primary cursor-pointer"
                  >
                    <option value="Weighing Scale Malfunction">Weighing Scale Malfunction</option>
                    <option value="App / Technical Bug">App / Technical Bug</option>
                    <option value="Queue / Token Congestion">Queue / Token Congestion</option>
                    <option value="Payment Delay Issue">Payment Delay Issue</option>
                    <option value="Other Assistance">Other Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-farmer-text uppercase tracking-wider block mb-1.5">
                    Description / Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the issue or assistance required..."
                    className="w-full border border-farmer-border rounded-xl p-3 text-xs font-medium text-farmer-text focus:outline-none focus:border-farmer-primary resize-none"
                  ></textarea>
                </div>

                {issueSubmitted && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-farmer-primary rounded-xl flex items-center gap-2 font-extrabold text-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Issue submitted successfully! Admin notified.</span>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsHelpModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-farmer-text font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-farmer-primary hover:bg-[#03522c] text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Issue</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export { CentreLayout as StaffLayout };
export default CentreLayout;
