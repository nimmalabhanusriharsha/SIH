import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { getCentreCongestion, getRecommendedCentre } from '../../../services/aiRecommendation';
import { 
  MapPin, Clock, Search, Sparkles, 
  ArrowRight, CheckCircle2, ShieldCheck, Scale
} from 'lucide-react';

const FindCentre = () => {
  const { state } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const centres = state.centres || [];
  const enhancedCentres = centres.map(centre => 
    getCentreCongestion(centre, state.queue || [], state.bookings || [])
  );

  const filteredCentres = enhancedCentres.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.district && c.district.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => a.distance - b.distance);

  const recommendedCentre = getRecommendedCentre(centres, state.queue || [], state.bookings || [], 'All');

  // Congestion badge with Muted Teal / Amber / Brick Red
  const renderCongestionBadge = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'low') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-farmer-success-light text-farmer-success border border-farmer-success/30">
          <span className="w-2 h-2 rounded-full bg-farmer-success" />
          {t('centre.congestionLow', 'Low Congestion')}
        </span>
      );
    }
    if (l === 'high') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-farmer-error-light text-farmer-error border border-farmer-error/30">
          <span className="w-2 h-2 rounded-full bg-farmer-error" />
          {t('centre.congestionHigh', 'High Congestion')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-farmer-warning-light text-farmer-warning border border-farmer-warning/30">
        <span className="w-2 h-2 rounded-full bg-farmer-warning" />
        {t('centre.congestionModerate', 'Moderate Congestion')}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-6 font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-farmer-text">
          {t('centre.title', 'Find Procurement Centre')}
        </h1>
        <p className="text-xs md:text-sm text-farmer-secondary mt-1">
          {t('centre.subtitle', 'Locate nearby government procurement centres with real-time crowd updates')}
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 md:p-4 rounded-2xl border border-farmer-border shadow-farmer-card flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmer-secondary" />
          <input 
            type="text"
            placeholder={t('centre.searchPlaceholder', 'Search by centre name or location...')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-farmer-border bg-farmer-bg text-xs md:text-sm font-semibold text-farmer-text placeholder:text-farmer-secondary focus:outline-none focus:ring-2 focus:ring-farmer-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* AI RECOMMENDED CENTRE CARD (Wheat Gold Accent) */}
      {recommendedCentre && (
        <div className="bg-white rounded-3xl p-6 border-2 border-farmer-accent/60 shadow-farmer-card relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-farmer-accent-light text-farmer-text border border-farmer-accent/40 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-farmer-accent" />
              {t('centre.aiRecommended', 'AI Recommended Centre')}
            </span>
            {renderCongestionBadge(recommendedCentre.congestionLevel || 'Low')}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-farmer-text">
                {recommendedCentre.name}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-farmer-secondary mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-farmer-primary" />
                  {recommendedCentre.district || 'West Godavari'} · {t('centre.distance', { distance: recommendedCentre.distance || 3.5 })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-farmer-primary" />
                  {t('centre.travelTime', { time: '18' })}
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/farmer/book-slot', { state: { preSelectedCentreId: recommendedCentre.id } })}
              className="min-h-[48px] px-6 py-3 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center justify-center gap-2 text-xs md:text-sm transition-colors self-start md:self-auto"
            >
              <span>{t('centre.selectCentre', 'Select & Book Slot')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Explainable AI Reasons */}
          <div className="bg-farmer-bg p-4 rounded-2xl border border-farmer-border">
            <h4 className="text-xs font-bold text-farmer-text uppercase tracking-wider mb-2">
              {t('centre.whyRecommended', 'Why is this recommended?')}
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-farmer-secondary font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-farmer-success shrink-0" />
                <span>{t('centre.reasonShorterQueue', 'Shorter queue compared to other centres')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-farmer-success shrink-0" />
                <span>{t('centre.reasonActiveCounters', 'Multiple active weighing counters operating')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-farmer-success shrink-0" />
                <span>{t('centre.reasonCloser', { distance: '3.5' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-farmer-success shrink-0" />
                <span>{t('centre.reasonLowerWait', 'Lowest estimated waiting time today')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL CENTRES LIST */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-farmer-secondary uppercase tracking-wider px-1">
          {t('centre.title', 'Available Procurement Centres')} ({filteredCentres.length})
        </h3>

        <div className="grid gap-4">
          {filteredCentres.map((centre) => (
            <div 
              key={centre.id}
              className="bg-white rounded-3xl p-5 md:p-6 border border-farmer-border shadow-farmer-card hover:border-farmer-primary transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-farmer-text">
                    {centre.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-farmer-secondary mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-farmer-primary" />
                      {centre.district} · {t('centre.distance', { distance: centre.distance || 5.0 })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-farmer-primary" />
                      {t('centre.travelTime', { time: Math.round((centre.distance || 5) * 3) })}
                    </span>
                  </div>
                </div>

                <div>
                  {renderCongestionBadge(centre.congestionLevel || 'Moderate')}
                </div>
              </div>

              {/* Centre Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border mb-4 text-xs">
                <div>
                  <span className="text-[10px] text-farmer-secondary uppercase font-bold block">
                    {t('dashboard.liveQueueTracking', 'Current Queue')}
                  </span>
                  <p className="font-bold text-farmer-text mt-0.5 text-sm">
                    {t('centre.queueCount', { count: centre.queueLength || 12 })}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-farmer-secondary uppercase font-bold block">
                    {t('dashboard.estimatedWait', { minutes: '' }).replace(/:.*/, '')}
                  </span>
                  <p className="font-bold text-farmer-warning mt-0.5 text-sm">
                    {t('centre.estimatedWait', { minutes: centre.estimatedWait || 28 })}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-farmer-secondary uppercase font-bold block">
                    {t('centre.activeCounters', { count: '' }).replace(/\s+.*/, '')}
                  </span>
                  <p className="font-bold text-farmer-text mt-0.5 text-sm">
                    {centre.activeCounters || 2} Active Counters
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-farmer-secondary uppercase font-bold block">
                    {t('centre.capacity', { capacity: '' }).replace(/:.*/, '')}
                  </span>
                  <p className="font-bold text-farmer-text mt-0.5 text-sm">
                    {centre.capacity || 200} Q/day
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => navigate('/farmer/book-slot', { state: { preSelectedCentreId: centre.id } })}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center justify-center gap-2 text-xs md:text-sm transition-colors"
                >
                  <span>{t('centre.selectCentre', 'Select & Book Slot')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FindCentre;
