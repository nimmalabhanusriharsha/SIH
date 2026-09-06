import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Bell, CheckCircle2, AlertTriangle, Calendar, Activity, Check } from 'lucide-react';

const Notifications = () => {
  const { state, setState, currentUser } = useAppContext();
  
  const [filter, setFilter] = useState('All');

  const notifications = state.notifications
    .filter(n => n.userId === currentUser.id)
    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredNotifications = filter === 'All' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.userId === currentUser.id ? { ...n, read: true } : n
      )
    }));
  };

  const getIcon = (category) => {
    switch(category) {
      case 'Booking': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'Queue': return <Activity className="w-5 h-5 text-amber-600" />;
      case 'Payment': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'System': return <Bell className="w-5 h-5 text-forest-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-earth-600" />;
    }
  };

  const getBg = (category) => {
    switch(category) {
      case 'Booking': return 'bg-blue-100';
      case 'Queue': return 'bg-amber-100';
      case 'Payment': return 'bg-green-100';
      case 'System': return 'bg-forest-100';
      default: return 'bg-earth-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Notifications</h2>
          <p className="text-earth-600 mt-1">Stay updated with your latest alerts and activities.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="font-bold text-forest-700 border-forest-300 gap-2" onClick={markAllAsRead}>
             <Check className="w-4 h-4" /> Mark All as Read
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
         {['All', 'Booking', 'Queue', 'Payment', 'System'].map(cat => (
           <button 
             key={cat}
             onClick={() => setFilter(cat)}
             className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
               filter === cat ? 'bg-forest-900 text-white shadow-sm' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-50'
             }`}
           >
             {cat}
           </button>
         ))}
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white min-h-[400px]">
         {filteredNotifications.length > 0 ? (
           <div className="divide-y divide-earth-100">
             {filteredNotifications.map(n => (
               <div key={n.id} className={`p-4 md:p-6 flex gap-4 transition-colors ${!n.read ? 'bg-forest-50/30' : 'hover:bg-earth-50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getBg(n.category)}`}>
                    {getIcon(n.category)}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                       <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-earth-500 border-earth-200">{n.category}</Badge>
                       <span className="text-xs font-bold text-earth-400">{new Date(n.timestamp).toLocaleString('en-IN', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</span>
                     </div>
                     <p className={`text-base ${!n.read ? 'font-bold text-earth-900' : 'font-medium text-earth-700'}`}>{n.message}</p>
                  </div>
                  {!n.read && (
                    <div className="w-3 h-3 bg-forest-600 rounded-full shrink-0 mt-2"></div>
                  )}
               </div>
             ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-[400px] text-center">
             <Bell className="w-16 h-16 text-earth-300 mb-4" />
             <h3 className="text-xl font-bold text-earth-600">No Notifications</h3>
             <p className="text-earth-500 mt-2">You're all caught up! Check back later.</p>
           </div>
         )}
      </Card>
    </div>
  );
};

export default Notifications;
