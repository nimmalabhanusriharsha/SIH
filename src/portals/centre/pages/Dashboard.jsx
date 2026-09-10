import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Card, CardContent } from '../../../shared/components/Card';
import { 
  Users, Calendar, Clock, CheckCircle2,
  BarChart3, ArrowRight, ShieldCheck, Building2,
  MapPin, Package, ChevronRight, TrendingUp, TrendingDown, IndianRupee
} from 'lucide-react';

const StaffDashboard = () => {
  const { state, currentUser } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [centreOpen, setCentreOpen] = useState(true);

  // Metrics based on mockData/state
  const todaysBookings = state.bookings.length;
  const waitingFarmers = state.queue.filter(q => q.status === 'Waiting').length;
  const arrivedFarmers = state.queue.length;
  const pendingArrivals = todaysBookings - arrivedFarmers;
  
  // Shared source of truth: 20 default completed procurements today (2026-09-10) + any newly completed in state.procurements
  const baseTodayCompletedCount = 20;
  const customProcurementsToday = (state.procurements || []).filter(p => {
    if (!p.date) return true;
    const pDate = p.date.includes('T') ? p.date.split('T')[0] : p.date;
    return pDate === '2026-09-10' || pDate === 'Today';
  }).length;
  const completedTodayCount = baseTodayCompletedCount + customProcurementsToday;

  const currentCentre = state.centres?.[0] || { activeCounters: 3 };
  const activeCountersCount = currentCentre.activeCounters || 3;
  const totalCountersCount = 4;
  const operationalPct = Math.round((activeCountersCount / totalCountersCount) * 100);

  const recentActivities = [
    { time: '10:12 AM', action: 'Farmer Ramesh Kumar arrived', detail: 'Counter C2', dotColor: 'bg-emerald-500' },
    { time: '09:58 AM', action: 'Quality check completed', detail: 'Farmer: Lakshmi Devi', dotColor: 'bg-blue-500' },
    { time: '09:40 AM', action: 'Token A104 served', detail: 'Counter C1', dotColor: 'bg-purple-500' },
    { time: '09:20 AM', action: 'New booking', detail: 'Farmer: Srinivas Goud', dotColor: 'bg-slate-400' },
    { time: '09:10 AM', action: 'Procurement completed', detail: 'Counter C3', dotColor: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* TOP GREETING & CENTRE STATUS TOGGLE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] font-extrabold text-farmer-secondary uppercase tracking-widest">{t('centre.nav.dashboard', 'DASHBOARD')}</p>
          <h1 className="text-2xl md:text-3xl font-black text-farmer-text tracking-tight mt-0.5">
            {t('goodMorning', 'Good Morning')}, {currentUser?.name || 'Staff User'}
          </h1>
          <p className="text-sm font-medium text-farmer-secondary mt-1">
            {t('dashboard.subtitle', "Here's what's happening at your procurement centre today.")}
          </p>
        </div>

        {/* CENTRE STATUS TOGGLE PILL MATCHING SCREENSHOT */}
        <div className="flex items-center gap-3.5 bg-white px-4 py-2.5 rounded-2xl border border-farmer-border/90 shadow-xs">
          {/* Left Target Dot Ring */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${centreOpen ? 'bg-emerald-100/70' : 'bg-slate-100'}`}>
            <span className={`w-3.5 h-3.5 rounded-full transition-colors ${centreOpen ? 'bg-farmer-primary' : 'bg-slate-400'}`}></span>
          </div>
          
          {/* Middle Labels */}
          <div className="flex flex-col justify-center pr-2">
            <span className="text-[11px] font-semibold text-farmer-secondary leading-tight">{t('centre.centreStatus', 'Centre Status')}</span>
            <span className={`text-sm font-black tracking-tight leading-tight mt-0.5 ${centreOpen ? 'text-farmer-primary' : 'text-farmer-secondary'}`}>
              {centreOpen ? t('centre.open', 'OPEN') : t('centre.closed', 'CLOSED')}
            </span>
          </div>

          {/* Right Toggle Switch */}
          <button 
            type="button"
            onClick={() => setCentreOpen(!centreOpen)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors p-0.5 cursor-pointer ${centreOpen ? 'bg-farmer-primary' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-xs transition-transform ${centreOpen ? 'translate-x-5' : 'translate-x-0'}`}>
            </span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Today's Bookings */}
        <Card className="border border-farmer-border shadow-xs bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* COLOURED ICON CONTAINER LIKE REFERRAL */}
              <div className="w-12 h-12 rounded-2xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-8.5 h-8.5 rounded-xl bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <Calendar className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-farmer-secondary">Today's Bookings</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl md:text-3xl font-black text-farmer-text">{todaysBookings}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-farmer-primary-light text-farmer-primary flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> 12%
                  </span>
                </div>
                <p className="text-xs font-medium text-farmer-secondary mt-1">{pendingArrivals} pending arrivals</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/centre/bookings')}
              className="w-8 h-8 rounded-full border border-farmer-border flex items-center justify-center text-farmer-secondary hover:border-farmer-primary hover:text-farmer-primary transition-colors shrink-0 ml-2 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>

        {/* CARD 2: Waiting Farmers */}
        <Card className="border border-farmer-border shadow-xs bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* COLOURED ICON CONTAINER LIKE REFERRAL */}
              <div className="w-12 h-12 rounded-2xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-8.5 h-8.5 rounded-xl bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-farmer-secondary">Waiting Farmers</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl md:text-3xl font-black text-farmer-text">{waitingFarmers}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-farmer-primary-light text-farmer-primary flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> 50%
                  </span>
                </div>
                <p className="text-xs font-medium text-farmer-secondary mt-1">~34 min avg wait</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/centre/live-queue')}
              className="w-8 h-8 rounded-full border border-farmer-border flex items-center justify-center text-farmer-secondary hover:border-farmer-primary hover:text-farmer-primary transition-colors shrink-0 ml-2 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>

        {/* CARD 3: Completed - STATIC INFORMATIONAL CARD */}
        <Card className="border border-farmer-border shadow-xs bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* COLOURED ICON CONTAINER LIKE REFERRAL */}
              <div className="w-12 h-12 rounded-2xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-8.5 h-8.5 rounded-xl bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-farmer-secondary">Completed</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl md:text-3xl font-black text-farmer-text">{completedTodayCount}</span>
                </div>
                <p className="text-xs font-medium text-farmer-secondary mt-1">Procurements today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 4: Active Counters - STATIC INFORMATIONAL CARD */}
        <Card className="border border-farmer-border shadow-xs bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* COLOURED ICON CONTAINER LIKE REFERRAL */}
              <div className="w-12 h-12 rounded-2xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-8.5 h-8.5 rounded-xl bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <BarChart3 className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-farmer-secondary">Active Counters</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl md:text-3xl font-black text-farmer-text">{activeCountersCount} / {totalCountersCount}</span>
                </div>
                <p className="text-xs font-medium text-farmer-secondary mt-1">{operationalPct}% operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* QUICK ACTIONS SECTION */}
      <div>
        <h2 className="text-lg font-extrabold text-farmer-text tracking-tight">Quick Actions</h2>
        <p className="text-xs font-medium text-farmer-secondary mt-0.5">Get started with common tasks.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          
          <div 
            onClick={() => navigate('/centre/live-queue')}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-farmer-border shadow-xs hover:border-farmer-primary hover:shadow transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-7 h-7 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <span className="font-bold text-farmer-text text-sm block leading-tight">Live Queue</span>
                <span className="text-[10px] font-semibold text-farmer-primary block mt-0.5">Queue & Verification</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-farmer-secondary group-hover:text-farmer-primary group-hover:translate-x-0.5 transition-all" />
          </div>

          <div 
            onClick={() => navigate('/centre/bookings')}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-farmer-border shadow-xs hover:border-farmer-primary hover:shadow transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-7 h-7 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <Calendar className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-bold text-farmer-text text-sm">Today's Bookings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-farmer-secondary group-hover:text-farmer-primary group-hover:translate-x-0.5 transition-all" />
          </div>

          <div 
            onClick={() => navigate('/centre/procurement')}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-farmer-border shadow-xs hover:border-farmer-primary hover:shadow transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-7 h-7 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <Package className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-bold text-farmer-text text-sm">Procurement</span>
            </div>
            <ChevronRight className="w-4 h-4 text-farmer-secondary group-hover:text-farmer-primary group-hover:translate-x-0.5 transition-all" />
          </div>

          <div 
            onClick={() => navigate('/centre/reports?tab=payments')}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-farmer-border shadow-xs hover:border-farmer-primary hover:shadow transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-7 h-7 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <IndianRupee className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-bold text-farmer-text text-sm">Payments</span>
            </div>
            <ChevronRight className="w-4 h-4 text-farmer-secondary group-hover:text-farmer-primary group-hover:translate-x-0.5 transition-all" />
          </div>

        </div>
      </div>

      {/* BOTTOM GRID (RECENT ACTIVITY & CENTRE OVERVIEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-farmer-border p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-farmer-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                <div className="w-6.5 h-6.5 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="font-bold text-farmer-text text-base">Recent Activity</h3>
            </div>
            <button 
              onClick={() => navigate('/centre/activity')}
              className="text-xs font-bold text-farmer-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, index) => (
              <div key={index} className="flex items-center justify-between py-2.5 px-3 rounded-xl border border-farmer-border hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-farmer-secondary w-16">{act.time}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${act.dotColor}`}></span>
                  <span className="text-xs md:text-sm font-semibold text-farmer-text">{act.action}</span>
                </div>
                <span className="text-xs font-medium text-farmer-secondary">{act.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTRE OVERVIEW */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-farmer-border p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-farmer-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-farmer-primary-light flex items-center justify-center shrink-0">
                  <div className="w-6.5 h-6.5 rounded-lg bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                    <Building2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="font-bold text-farmer-text text-base">Centre Overview</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-farmer-primary-light text-farmer-primary border border-emerald-200">
                C001
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 py-1">
                <div className="w-8 h-8 rounded-lg bg-farmer-primary-light flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-farmer-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-bold text-farmer-text text-sm">Sri Lakshmi Procurement Centre</p>
                  <p className="text-xs font-medium text-farmer-secondary mt-0.5">Andhra Pradesh</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-farmer-border">
                <div className="w-8 h-8 rounded-lg bg-farmer-primary-light flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-farmer-primary" strokeWidth={2.5} />
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-semibold text-farmer-secondary">Centre Timings</span>
                  <span className="text-xs font-bold text-farmer-text">8:00 AM – 6:00 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-farmer-border">
                <div className="w-8 h-8 rounded-lg bg-farmer-primary-light flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-farmer-primary" strokeWidth={2.5} />
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-semibold text-farmer-secondary">Total Counters</span>
                  <span className="text-xs font-bold text-farmer-text">4</span>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-t border-farmer-border">
                <div className="w-8 h-8 rounded-lg bg-farmer-primary-light flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-farmer-primary" strokeWidth={2.5} />
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-semibold text-farmer-secondary">Commodities</span>
                  <span className="text-xs font-bold text-farmer-text">Paddy, Maize</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StaffDashboard;
