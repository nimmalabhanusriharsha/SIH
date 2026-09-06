import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, CheckCircle2, Clock, AlertTriangle, MapPin, BrainCircuit, Activity, Info } from 'lucide-react';

const LiveQueue = () => {
  const { state, currentUser } = useAppContext();
  
  const activeBooking = state.bookings.find(b => b.farmerId === currentUser.id && (b.status === 'Confirmed' || b.status === 'Processing'));
  const myQueueEntry = activeBooking ? state.queue.find(q => q.token === activeBooking.token) : null;
  const queueForCentre = activeBooking ? state.queue.filter(q => q.centreId === activeBooking.centreId).sort((a,b) => a.position - b.position) : [];
  
  const servingEntries = queueForCentre.filter(q => q.status === 'Serving');
  const waitingEntries = queueForCentre.filter(q => q.status === 'Waiting');
  
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Simulate smart notifications based on position
  useEffect(() => {
    if (myQueueEntry?.status === 'Waiting') {
      if (myQueueEntry.position === 3) {
        setToastMsg("Your turn is approaching. Please prepare to arrive.");
        setShowToast(true);
      } else if (myQueueEntry.position === 1) {
        setToastMsg("Your token will be called shortly!");
        setShowToast(true);
      }
    } else if (myQueueEntry?.status === 'Serving') {
      setToastMsg(`Token ${myQueueEntry.token} has been called. Please proceed to Counter ${myQueueEntry.counter}.`);
      setShowToast(true);
    }
  }, [myQueueEntry?.position, myQueueEntry?.status, myQueueEntry?.token, myQueueEntry?.counter]);

  if (!activeBooking || !myQueueEntry) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-earth-100">
          <Activity className="w-12 h-12 text-forest-600" />
        </div>
        <h2 className="text-2xl font-bold text-forest-900">No Active Queue</h2>
        <p className="text-earth-600 mt-2 text-lg">You don't have an active booking in the queue right now.</p>
      </div>
    );
  }

  const isServing = myQueueEntry.status === 'Serving';
  const centre = state.centres.find(c => c.id === activeBooking.centreId);
  const currentServingToken = servingEntries.length > 0 ? servingEntries[0].token : 'None';

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 md:top-24 md:right-8 z-50 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-forest-900 text-white p-4 rounded-xl shadow-2xl border border-forest-700 flex items-start gap-3 max-w-sm">
             <Bell className="w-5 h-5 text-forest-300 shrink-0 mt-0.5 animate-pulse" />
             <div>
               <p className="font-bold text-sm">Smart Queue Alert</p>
               <p className="text-forest-100 text-xs mt-1 leading-snug">{toastMsg}</p>
             </div>
             <button onClick={() => setShowToast(false)} className="text-forest-400 hover:text-white ml-2">&times;</button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Live Queue Tracking</h2>
        <p className="text-earth-600 mt-1 flex items-center gap-1 font-medium">
          <MapPin className="w-4 h-4" /> {centre?.name}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Status Card */}
          <Card className={`border-none shadow-xl overflow-hidden relative ${isServing ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-forest-800 to-forest-950'}`}>
            <CardHeader className="relative z-10 text-center pb-2 pt-8">
              <Badge className={`mx-auto mb-3 border-none text-xs font-black tracking-widest px-4 py-1.5 uppercase shadow-sm ${isServing ? 'bg-white text-green-700' : 'bg-forest-600 text-white'}`}>
                {isServing ? 'IT IS YOUR TURN' : 'WAITING IN QUEUE'}
              </Badge>
              <CardTitle className="text-white text-4xl md:text-5xl font-black tracking-tight mt-2">
                {isServing ? `Counter ${myQueueEntry.counter}` : myQueueEntry.token}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-6 px-4 md:px-8 pb-8">
              {!isServing && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl text-center">
                    <p className="text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-1">Your Token</p>
                    <p className="text-2xl font-black text-white">{myQueueEntry.token}</p>
                  </div>
                  <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl text-center">
                    <p className="text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-1">Current</p>
                    <p className="text-2xl font-black text-white">{currentServingToken}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center">
                    <p className="text-forest-100 text-[10px] font-bold uppercase tracking-wider mb-1">Ahead</p>
                    <p className="text-3xl font-black text-white">{myQueueEntry.position}</p>
                  </div>
                  <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 p-4 rounded-xl text-center shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]">
                    <p className="text-amber-200 text-[10px] font-bold uppercase tracking-wider mb-1">Est. Wait</p>
                    <p className="text-3xl font-black text-amber-400">{myQueueEntry.waitTime}<span className="text-sm font-bold ml-0.5">m</span></p>
                  </div>
                </div>
              )}

              {isServing && (
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center mt-2 shadow-inner">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <p className="text-2xl text-white font-black tracking-wide">Your token has been called!</p>
                    <p className="text-green-100 mt-3 text-lg font-medium">Please present your digital token at Counter {myQueueEntry.counter} immediately.</p>
                 </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Visualization */}
          <Card className="border-earth-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
              <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
                 <Users className="w-5 h-5 text-forest-600" /> Live Queue Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="relative px-6 py-10 overflow-x-auto custom-scrollbar">
                  <div className="min-w-[600px] flex items-center justify-between relative px-8">
                    
                    {/* The line */}
                    <div className="absolute top-1/2 left-10 right-10 h-1.5 bg-earth-200 -translate-y-1/2 z-0 rounded-full"></div>
                    
                    {/* Fake past entries */}
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm mb-2">
                         <CheckCircle2 className="w-4 h-4" />
                       </div>
                       <p className="text-[10px] font-bold text-earth-400">P-093</p>
                       <p className="text-[9px] text-green-600 font-bold uppercase mt-0.5">Completed</p>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                       <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm mb-2">
                         <CheckCircle2 className="w-4 h-4" />
                       </div>
                       <p className="text-[10px] font-bold text-earth-400">P-094</p>
                       <p className="text-[9px] text-green-600 font-bold uppercase mt-0.5">Completed</p>
                    </div>

                    {/* Serving entries */}
                    {servingEntries.slice(0, 2).map((q) => (
                      <div key={q.token} className="relative z-10 flex flex-col items-center">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white border-4 border-white shadow-md mb-2 ${q.token === myQueueEntry.token ? 'bg-forest-600 ring-4 ring-forest-200' : 'bg-blue-500'}`}>
                           <span className="font-bold text-sm">{q.token === myQueueEntry.token ? 'YOU' : q.token}</span>
                         </div>
                         <p className={`text-[10px] font-bold ${q.token === myQueueEntry.token ? 'text-forest-700' : 'text-blue-700'} uppercase`}>Processing</p>
                         <p className="text-[9px] text-earth-500 font-bold mt-0.5">Counter {q.counter}</p>
                      </div>
                    ))}

                    {/* Waiting entries */}
                    {waitingEntries.slice(0, 4).map((q, idx) => (
                      <div key={q.token} className="relative z-10 flex flex-col items-center">
                         {q.token === myQueueEntry.token ? (
                           <>
                             <div className="w-14 h-14 bg-forest-600 rounded-full flex items-center justify-center text-white border-4 border-forest-100 shadow-xl mb-2 ring-4 ring-forest-600/30 animate-pulse">
                               <span className="font-black text-sm">YOU</span>
                             </div>
                             <p className="text-xs font-black text-forest-700">{q.token}</p>
                             <p className="text-[10px] text-forest-600 font-bold mt-0.5 uppercase">Waiting</p>
                           </>
                         ) : (
                           <>
                             <div className="w-8 h-8 bg-white border-4 border-earth-300 rounded-full mb-2 shadow-sm"></div>
                             <p className="text-[10px] font-bold text-earth-500">{q.token}</p>
                             <p className="text-[9px] text-earth-400 font-bold mt-0.5 uppercase">Waiting</p>
                           </>
                         )}
                      </div>
                    ))}
                    
                    {/* Ellipsis if more */}
                    {waitingEntries.length > 4 && waitingEntries.findIndex(q => q.token === myQueueEntry.token) >= 4 && (
                      <div className="relative z-10 flex flex-col items-center">
                         <div className="w-8 h-8 flex items-center justify-center text-earth-400 mb-2">•••</div>
                      </div>
                    )}
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* SMART ARRIVAL RECOMMENDATION */}
          {!isServing && (
            <Card className="border-blue-200 shadow-sm bg-gradient-to-b from-blue-50 to-white overflow-hidden">
               <CardHeader className="py-4 border-b border-blue-100">
                  <Badge variant="primary" className="bg-blue-100 text-blue-800 border-blue-200 uppercase font-bold text-[10px] mb-2 w-fit gap-1">
                    <BrainCircuit className="w-3 h-3" /> AI Estimate
                  </Badge>
                  <CardTitle className="text-sm font-black text-blue-900">WHEN SHOULD I ARRIVE?</CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-5">
                  
                  <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                    <span className="text-xs font-bold text-earth-500 uppercase">Current Position</span>
                    <span className="font-black text-earth-900 text-lg">{myQueueEntry.position}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                    <span className="text-xs font-bold text-earth-500 uppercase">Estimated Call</span>
                    <span className="font-black text-blue-900 text-lg">11:12 AM</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                    <span className="text-xs font-bold text-earth-500 uppercase">Travel Estimate</span>
                    <span className="font-black text-earth-900">10 min</span>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center shadow-inner">
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">Recommended Departure</p>
                    <p className="text-2xl font-black text-green-900">10:45 AM</p>
                  </div>
                  
                  <p className="text-[10px] text-earth-500 font-medium leading-relaxed flex gap-2">
                    <Info className="w-4 h-4 shrink-0 text-blue-400" />
                    This is an estimate based on average processing time (5 min/farmer) and mock traffic conditions.
                  </p>
               </CardContent>
            </Card>
          )}

          {/* ACTIVE COUNTERS STATUS */}
          <Card className="border-earth-200 shadow-sm">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
              <CardTitle className="text-sm font-bold text-forest-900 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-forest-600" /> Centre Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-earth-500 uppercase">Queue State</span>
                <Badge variant="success" className="animate-pulse font-bold uppercase text-[10px]">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-earth-500 uppercase">Queue Speed</span>
                <span className="text-sm font-bold text-earth-900">Normal (5m / farmer)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-earth-500 uppercase">Active Counters</span>
                <span className="text-sm font-bold text-earth-900">{centre?.activeCounters} Open</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-earth-500 uppercase">Capacity Load</span>
                <span className="text-sm font-bold text-amber-600">78% (Busy)</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

// Needed for the toast component
const Bell = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;

export default LiveQueue;
