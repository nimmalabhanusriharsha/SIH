import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Calendar, PackageCheck, Clock, QrCode, AlertCircle, Trash2, CalendarPlus } from 'lucide-react';

const MyBooking = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'active', 'completed', 'cancelled'

  // Filter bookings strictly for the authenticated farmer
  const userBookings = (state.bookings || []).filter(b => b.farmerId === currentUser?.id);
  const upcomingBookings = userBookings.filter(b => b.status === 'Confirmed' || b.status === 'active');
  const activeBookings = userBookings.filter(b => b.status === 'Processing' || b.stage === 'weighing');
  const completedBookings = userBookings.filter(b => b.status === 'completed');
  const cancelledBookings = userBookings.filter(b => b.status === 'cancelled' || b.status === 'Cancelled');

  const handleCancelBooking = (bookingId) => {
    const targetBooking = (state.bookings || []).find(b => b.id === bookingId);
    setState(prev => ({
      ...prev,
      bookings: (prev.bookings || []).map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b),
      queue: (prev.queue || []).filter(q => q.token !== targetBooking?.token)
    }));
  };

  const getDisplayedList = () => {
    switch (activeTab) {
      case 'upcoming': return upcomingBookings;
      case 'active': return activeBookings;
      case 'completed': return completedBookings;
      case 'cancelled': return cancelledBookings;
      default: return upcomingBookings;
    }
  };

  const displayedItems = getDisplayedList();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-farmer-text">
            {t('myBookings.title', 'My Bookings')}
          </h1>
          <p className="text-xs md:text-sm text-farmer-secondary mt-0.5 font-medium">
            {t('dashboard.noActiveBookingDesc', 'Manage your upcoming slot appointments and token passes.')}
          </p>
        </div>
        <button 
          className="min-h-[48px] px-5 py-2.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center gap-2 text-xs transition-colors"
          onClick={() => navigate('/farmer/book-slot')}
        >
          <CalendarPlus className="w-4 h-4" />
          <span>{t('dashboard.bookSlotNow', 'Book a Slot')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-farmer-bg p-1.5 rounded-2xl border border-farmer-border overflow-x-auto text-xs font-bold">
        {[
          { key: 'upcoming', label: t('myBookings.tabUpcoming', 'Upcoming'), count: upcomingBookings.length },
          { key: 'active', label: t('myBookings.tabActive', 'Active'), count: activeBookings.length },
          { key: 'completed', label: t('myBookings.tabCompleted', 'Completed'), count: completedBookings.length },
          { key: 'cancelled', label: t('myBookings.tabCancelled', 'Cancelled'), count: cancelledBookings.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 min-h-[44px] ${
              activeTab === tab.key 
                ? 'bg-white text-farmer-primary shadow-sm font-black' 
                : 'text-farmer-secondary hover:text-farmer-text font-semibold'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === tab.key ? 'bg-farmer-primary-light text-farmer-primary' : 'bg-farmer-border text-farmer-secondary'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Booking List */}
      {displayedItems.length > 0 ? (
        <div className="space-y-4">
          {displayedItems.map((item) => {
            const centre = (state.centres || []).find(c => c.id === item.centreId) || (state.centres || [])[0] || {
              name: 'Procurement Centre'
            };

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl p-5 md:p-6 border border-farmer-border shadow-farmer-card hover:border-farmer-primary transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-farmer-primary-light text-farmer-primary border border-farmer-primary/20">
                      {item.status === 'completed' ? '✓ Completed' : item.status}
                    </span>
                    <span className="text-xs font-mono text-farmer-secondary font-semibold">ID: {item.id}</span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-farmer-text">
                    {centre.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-farmer-secondary pt-1 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-farmer-primary shrink-0"/> {item.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-farmer-primary shrink-0"/> {item.slot}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <PackageCheck className="w-3.5 h-3.5 text-farmer-primary shrink-0"/> {item.expectedQuantity} kg ({item.crop})
                    </span>
                  </div>
                </div>

                {/* Right Token / Actions */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 bg-farmer-bg p-4 rounded-2xl border border-farmer-border">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block">
                      {t('token.yourToken', 'Token')}
                    </span>
                    <span className="text-2xl font-black text-farmer-primary">
                      {item.token}
                    </span>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 w-full">
                    {item.status !== 'cancelled' && (
                      <button 
                        className="min-h-[44px] px-4 py-2 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-xl text-xs w-full flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        onClick={() => navigate('/farmer/token')}
                      >
                        <QrCode className="w-3.5 h-3.5 text-farmer-accent" />
                        <span>{t('token.title', 'QR Token')}</span>
                      </button>
                    )}

                    {item.status !== 'cancelled' && item.status !== 'completed' && (
                      <button 
                        className="min-h-[44px] px-4 py-2 bg-white hover:bg-farmer-error-light text-farmer-error font-bold rounded-xl text-xs w-full border border-farmer-border flex items-center justify-center gap-1.5 transition-colors"
                        onClick={() => handleCancelBooking(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('booking.cancelBooking', 'Cancel')}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-farmer-border shadow-farmer-card p-12 text-center">
          <AlertCircle className="w-10 h-10 text-farmer-secondary mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-farmer-text">
            {t('myBookings.emptyState', 'No bookings found in this category.')}
          </h3>
          <p className="text-xs text-farmer-secondary mt-1 font-medium">
            {t('dashboard.noActiveBookingDesc', 'Find a nearby centre and book a slot to avoid waiting times.')}
          </p>
        </div>
      )}

    </div>
  );
};

export default MyBooking;
