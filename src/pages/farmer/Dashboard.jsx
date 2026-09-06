import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  MapPin, Calendar, Clock, ChevronRight, Bell, QrCode, 
  Activity, PackageCheck, IndianRupee, Info, TrendingUp,
  BrainCircuit, CheckCircle2, Circle
} from 'lucide-react';

const FarmerDashboard = () => {
  const { currentUser, state } = useAppContext();
  const navigate = useNavigate();

  // Active Booking & Queue Data
  const activeBooking = state.bookings.find(b => b.farmerId === currentUser?.id && (b.status === 'Confirmed' || b.status === 'Processing'));
  const queueEntry = activeBooking ? state.queue.find(q => q.token === activeBooking.token) : null;
  
  // Recent Notifications
  const notifications = state.notifications.filter(n => n.userId === currentUser?.id).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
  
  // Activity / History Data (Mocking recent activity for demo)
  const activities = [
    { time: 'Today, 10:22 AM', desc: `Token ${activeBooking?.token || 'P-104'} generated` },
    { time: 'Today, 09:55 AM', desc: 'Booking confirmed' },
    { time: 'Yesterday, 05:42 PM', desc: 'Slot selected for Sri Lakshmi Centre' }
  ];

  const centre = activeBooking ? state.centres.find(c => c.id === activeBooking.centreId) : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 1. HERO CARD: CURRENT BOOKING */}
      {activeBooking ? (
        <Card className="bg-forest-900 border-none text-white shadow-xl overflow-hidden relative">
          <div className="absolute -bottom-10 -right-10 opacity-10">
             <QrCode className="w-64 h-64" />
          </div>
          <CardHeader className="relative z-10 pb-2">
            <Badge className="w-fit bg-forest-800 text-forest-100 hover:bg-forest-700 border-forest-700 mb-2 font-semibold tracking-wider">
              UPCOMING PROCUREMENT
            </Badge>
            <CardTitle className="text-white text-2xl md:text-3xl font-black">{centre?.name}</CardTitle>
            <CardDescription className="text-forest-200 text-base font-medium flex flex-wrap gap-x-6 gap-y-2 mt-2">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(activeBooking.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeBooking.slot}</span>
              <span className="flex items-center gap-1"><PackageCheck className="w-4 h-4" /> {activeBooking.crop} ({activeBooking.expectedQuantity} Quintals)</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 mt-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-forest-800/60 p-5 rounded-xl border border-forest-700/50 backdrop-blur-sm">
              <div>
                <p className="text-forest-300 text-xs font-bold uppercase tracking-wider mb-1">Token</p>
                <p className="text-4xl font-black text-white">{activeBooking.token}</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-forest-700"></div>
              <div>
                <p className="text-forest-300 text-xs font-bold uppercase tracking-wider mb-1">Booking ID</p>
                <p className="text-lg font-bold text-forest-100">{activeBooking.id}</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-forest-700"></div>
              <div>
                <p className="text-forest-300 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                <Badge variant="success" className="text-sm bg-green-500/20 text-green-300 border-green-500/30 font-bold uppercase">{activeBooking.status}</Badge>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button className="bg-white text-forest-900 hover:bg-forest-50 w-full sm:w-auto shadow-md gap-2 font-bold" onClick={() => navigate('/farmer/token')}>
                <QrCode className="w-4 h-4" /> Show QR Token
              </Button>
              <Button variant="outline" className="text-white border-forest-600 hover:bg-forest-800 hover:text-white w-full sm:w-auto gap-2" onClick={() => navigate('/farmer/live-queue')}>
                <Activity className="w-4 h-4" /> View Live Queue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-forest-50 border-forest-100 shadow-sm">
          <CardContent className="p-8 text-center flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-earth-100">
               <Calendar className="w-10 h-10 text-forest-600" />
             </div>
             <h3 className="text-2xl font-bold text-forest-900 mb-2">No Active Booking</h3>
             <p className="text-earth-600 max-w-md mx-auto mb-6">
               You don't have an upcoming procurement booking. Find a nearby centre and book a slot to skip the queue.
             </p>
             <Button size="lg" className="shadow-md font-bold" onClick={() => navigate('/farmer/book-slot')}>
               Book a Slot Now
             </Button>
          </CardContent>
        </Card>
      )}

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-sm font-bold text-earth-500 uppercase tracking-widest mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { title: 'Book Slot', icon: Calendar, path: '/farmer/book-slot' },
            { title: 'Find Centre', icon: MapPin, path: '/farmer/find-centre' },
            { title: 'View Token', icon: QrCode, path: '/farmer/token' },
            { title: 'Track Queue', icon: Activity, path: '/farmer/live-queue' },
            { title: 'Procurement', icon: PackageCheck, path: '/farmer/procurement' },
            { title: 'Payment Status', icon: IndianRupee, path: '/farmer/payments' },
          ].map((action, i) => (
            <button key={i} onClick={() => navigate(action.path)} className="bg-white border border-earth-200 rounded-xl p-4 flex flex-col items-center text-center hover:border-forest-400 hover:shadow-md transition-all group focus:outline-none">
              <div className="bg-forest-50 p-3 rounded-full mb-3 group-hover:bg-forest-100 transition-colors">
                <action.icon className="w-6 h-6 text-forest-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-semibold text-earth-800 text-xs">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeBooking && queueEntry ? (
            <>
              {/* LIVE QUEUE SUMMARY */}
              <Card className="border-earth-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-forest-600" /> Live Queue Tracking
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">Queue Active</Badge>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-earth-50 p-3 rounded-lg border border-earth-100">
                      <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">Your Token</p>
                      <p className="text-xl font-black text-forest-900">{queueEntry.token}</p>
                    </div>
                    <div className="bg-earth-50 p-3 rounded-lg border border-earth-100">
                      <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">Current Token</p>
                      <p className="text-xl font-black text-earth-900">P-096</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Farmers Ahead</p>
                      <p className="text-xl font-black text-blue-900">{queueEntry.position}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Est. Wait</p>
                      <p className="text-xl font-black text-amber-900">{queueEntry.waitTime} min</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold text-earth-600">
                      <span>Progress</span>
                      <span>{queueEntry.position} farmers ahead</span>
                    </div>
                    <div className="w-full bg-earth-200 rounded-full h-2">
                      <div className="bg-forest-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full font-bold" onClick={() => navigate('/farmer/live-queue')}>Track Detailed Queue</Button>
                </CardContent>
              </Card>

              {/* SMART ARRIVAL TIME */}
              <Card className="border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <BrainCircuit className="w-24 h-24 text-blue-900" />
                </div>
                <CardHeader className="py-4 pb-0 relative z-10">
                  <Badge variant="primary" className="w-fit mb-2 gap-1 text-[10px] bg-blue-100 text-blue-700 border-blue-200 font-bold uppercase"><BrainCircuit className="w-3 h-3"/> AI Estimate</Badge>
                  <CardTitle className="text-lg font-bold text-blue-900">Smart Arrival Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 relative z-10">
                  <p className="font-bold text-lg text-blue-950 mb-4">"Your turn is approaching."</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 bg-white/60 p-4 rounded-xl border border-blue-100/50 mb-4">
                     <div className="flex-1">
                       <p className="text-xs font-bold text-blue-700 uppercase mb-1">Estimated Call Time</p>
                       <p className="text-3xl font-black text-blue-900">11:12 AM</p>
                     </div>
                     <div className="hidden sm:block w-px bg-blue-200/50"></div>
                     <div className="flex-1">
                       <p className="text-xs font-bold text-blue-700 uppercase mb-1">Recommended Arrival</p>
                       <p className="text-3xl font-black text-green-700">10:55 AM</p>
                     </div>
                  </div>
                  
                  <p className="text-xs text-blue-800 font-medium flex items-start gap-2 bg-blue-100/50 p-3 rounded-lg">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" /> 
                    Based on current queue movement (5 min/farmer) and 10 mins estimated travel time.
                  </p>
                </CardContent>
              </Card>

              {/* PROCUREMENT PROGRESS */}
              <Card className="border-earth-200 shadow-sm">
                 <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
                   <CardTitle className="text-lg font-bold text-forest-900">Procurement Status</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6">
                    <div className="flex justify-between items-center relative">
                       <div className="absolute top-1/2 left-0 right-0 h-1 bg-earth-200 -translate-y-1/2 z-0"></div>
                       <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-green-500 -translate-y-1/2 z-0"></div>
                       
                       {[
                         { step: 'Booking', done: true },
                         { step: 'Queue', done: true },
                         { step: 'Verification', done: false },
                         { step: 'Quality', done: false },
                         { step: 'Weighing', done: false },
                         { step: 'Payment', done: false },
                       ].map((s, i) => (
                         <div key={i} className="relative z-10 flex flex-col items-center group">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 bg-white ${s.done ? 'border-green-500 text-green-500' : 'border-earth-300 text-earth-300'}`}>
                             {s.done ? <CheckCircle2 className="w-5 h-5 bg-white" /> : <Circle className="w-3 h-3 fill-current" />}
                           </div>
                           <p className={`text-[10px] font-bold uppercase hidden md:block ${s.done ? 'text-green-700' : 'text-earth-500'}`}>{s.step}</p>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
            </>
          ) : (
             /* SMART RECOMMENDATION CARD (If no active booking) */
             <Card className="border-forest-200 shadow-sm bg-gradient-to-br from-forest-50 to-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <TrendingUp className="w-24 h-24 text-forest-900" />
                </div>
                <CardHeader className="py-4 pb-0 relative z-10">
                  <Badge variant="primary" className="w-fit mb-2 gap-1 text-[10px] bg-forest-100 text-forest-700 border-forest-200 font-bold uppercase"><BrainCircuit className="w-3 h-3"/> AI Recommendation</Badge>
                  <CardTitle className="text-lg font-bold text-forest-900">Recommended Procurement Centre</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 relative z-10">
                  <p className="font-bold text-earth-900 mb-4">"Sri Lakshmi Centre currently has lower expected waiting times."</p>
                  
                  <div className="bg-white rounded-xl border border-earth-100 p-4 mb-4 shadow-sm">
                    <h4 className="font-bold text-forest-900 mb-2">Sri Lakshmi Procurement Centre</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       <div><p className="text-[10px] font-bold text-earth-500 uppercase">Distance</p><p className="font-bold text-earth-900">2.4 km</p></div>
                       <div><p className="text-[10px] font-bold text-earth-500 uppercase">Queue</p><p className="font-bold text-earth-900">18 farmers</p></div>
                       <div><p className="text-[10px] font-bold text-earth-500 uppercase">Est. Wait</p><p className="font-bold text-green-600">52 min</p></div>
                       <div><p className="text-[10px] font-bold text-earth-500 uppercase">Slots</p><p className="font-bold text-blue-600">12 Avail</p></div>
                    </div>
                  </div>

                  <Button className="font-bold gap-2 shadow-sm" onClick={() => navigate('/farmer/find-centre')}>
                    <MapPin className="w-4 h-4" /> View Centre Details
                  </Button>
                </CardContent>
              </Card>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* PAYMENT STATUS CARD */}
          <Card className="border-earth-200 shadow-sm">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-3">
               <CardTitle className="text-sm font-bold text-forest-900 flex items-center gap-2">
                 <IndianRupee className="w-4 h-4 text-forest-600" /> Recent Payment
               </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
               <p className="text-xs font-bold text-earth-500 uppercase mb-1">Procurement Amount</p>
               <h3 className="text-3xl font-black text-forest-900 mb-3">₹50,600</h3>
               
               <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-4">
                 <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                   <CheckCircle2 className="w-4 h-4" /> Payment Completed
                 </div>
                 <p className="text-xs text-green-600 font-medium">Ref: PAY-8821</p>
               </div>
               
               <Button variant="outline" className="w-full text-xs font-bold" onClick={() => navigate('/farmer/payments')}>View Payment History</Button>
            </CardContent>
          </Card>

          {/* NOTIFICATIONS PREVIEW */}
          <Card className="border-earth-200 shadow-sm">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-3 flex flex-row items-center justify-between">
               <CardTitle className="text-sm font-bold text-forest-900 flex items-center gap-2">
                 <Bell className="w-4 h-4 text-forest-600" /> Notifications
               </CardTitle>
               <Button variant="ghost" size="sm" className="text-xs font-bold text-forest-600" onClick={() => navigate('/farmer/notifications')}>View All</Button>
            </CardHeader>
            <CardContent className="p-0">
               <ul className="divide-y divide-earth-100">
                 {notifications.map(n => (
                   <li key={n.id} className={`p-4 flex gap-3 ${!n.read ? 'bg-forest-50/50' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-forest-600' : 'bg-earth-300'}`}></div>
                      <div>
                        <p className="text-sm text-earth-800 font-medium leading-snug">{n.message}</p>
                        <p className="text-[10px] text-earth-500 font-bold mt-1 uppercase">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                   </li>
                 ))}
               </ul>
            </CardContent>
          </Card>

          {/* RECENT ACTIVITY */}
          <Card className="border-earth-200 shadow-sm">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-3">
               <CardTitle className="text-sm font-bold text-forest-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
               <div className="relative border-l border-earth-200 ml-2 space-y-6">
                 {activities.map((act, i) => (
                   <div key={i} className="relative pl-6">
                     <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-forest-200 border-2 border-white"></div>
                     <p className="text-sm font-bold text-earth-900">{act.desc}</p>
                     <p className="text-xs text-earth-500 font-medium mt-0.5">{act.time}</p>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
