import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { AlertTriangle, MapPin, Siren, CheckCircle2, X, Clock, Users, PackageOpen, CheckCircle, Store } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

const AdminCongestion = () => {
  const { state } = useAppContext();
  const [selectedCentre, setSelectedCentre] = useState(null);

  // Compute live congestion and operational stats for each centre
  const centresWithCongestion = state.centres.map(centre => {
    const allQueue = state.queue.filter(q => q.centreId === centre.id);
    const waitingQueue = allQueue.filter(q => q.status === 'Waiting');
    const processingQueue = allQueue.filter(q => ['Serving', 'Quality Check', 'Weighing'].includes(q.status));
    
    const todaysBookings = state.bookings.filter(b => b.centreId === centre.id);
    const completedProcurements = state.procurements.filter(p => p.centreId === centre.id && p.status === 'Completed');

    const load = Math.min(100, Math.round((waitingQueue.length / (centre.capacity || 100)) * 100));
    
    let status = 'Normal';
    let color = 'green';
    let congestionBadge = 'Low';
    
    if (load > 80) { 
      status = 'Critical'; 
      color = 'red'; 
      congestionBadge = 'Critical';
    } else if (load > 60) {
      status = 'High Congestion';
      color = 'orange';
      congestionBadge = 'High';
    } else if (load > 40) { 
      status = 'Moderate'; 
      color = 'amber'; 
      congestionBadge = 'Moderate';
    }

    return { 
      ...centre, 
      waitingCount: waitingQueue.length, 
      processingCount: processingQueue.length,
      bookingsCount: todaysBookings.length,
      completedCount: completedProcurements.length,
      avgWaitTime: Math.max(10, waitingQueue.length * 5), // Estimate 5 mins per person
      avgProcessingTime: 15,
      load, 
      status, 
      color,
      congestionBadge
    };
  }).sort((a, b) => b.load - a.load);

  const highCongestion = centresWithCongestion.filter(c => c.status === 'High Congestion' || c.status === 'Critical');
  const moderate = centresWithCongestion.filter(c => c.status === 'Moderate');
  const normal = centresWithCongestion.filter(c => c.status === 'Normal');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight flex items-center gap-2">
          Live Congestion & Queue Monitoring
          {highCongestion.length > 0 && (
            <span className="flex h-3 w-3 relative ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </h2>
        <p className="text-earth-600 mt-1">Real-time geographical tracking of farmer queues, staff activity, and centre operations.</p>
      </div>

      {/* Congestion Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`border-red-200 shadow-sm ${highCongestion.length > 0 ? 'bg-red-50/50' : 'bg-white'}`}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-red-900 mb-1 flex items-center gap-2">
                  <Siren className="w-4 h-4" /> High/Critical Congestion
                </p>
                <h3 className="text-3xl font-black text-red-700">{highCongestion.length}</h3>
                <p className="text-xs text-red-600 mt-1 font-medium">Centres at &gt;60% capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-amber-200 shadow-sm ${moderate.length > 0 ? 'bg-amber-50/50' : 'bg-white'}`}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">Moderate</p>
                <h3 className="text-3xl font-black text-amber-700">{moderate.length}</h3>
                <p className="text-xs text-amber-600 mt-1 font-medium">Centres at 40-60% capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-sm bg-green-50/50">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-green-900 mb-1">Normal</p>
                <h3 className="text-3xl font-black text-green-700">{normal.length}</h3>
                <p className="text-xs text-green-600 mt-1 font-medium">Centres operating smoothly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Mock Live Map Area */}
        <div className="lg:col-span-2">
          <Card className="border-earth-200 shadow-sm h-full overflow-hidden flex flex-col">
            <CardHeader className="bg-white border-b border-earth-100 flex flex-row items-center justify-between py-4">
               <CardTitle className="text-lg text-forest-900 flex items-center gap-2">
                 <MapPin className="w-5 h-5 text-forest-600" />
                 Live Operational Map
               </CardTitle>
               <div className="flex items-center gap-4 text-xs font-medium">
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical/High</span>
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Moderate</span>
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div> Normal</span>
               </div>
            </CardHeader>
            <CardContent className="p-0 bg-earth-50 relative flex-1 min-h-[500px]">
               {/* Decorative map background grid/pattern */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
               <div className="absolute inset-0 bg-gradient-to-tr from-earth-100/30 to-transparent"></div>
               
               {/* Mock Map Markers mapped visually onto the grid */}
               <div className="relative w-full h-full p-8 flex flex-wrap gap-8 justify-around items-center">
                  {centresWithCongestion.map((centre, i) => {
                    return (
                      <div key={centre.id} className={`relative group z-10 p-4`}>
                        {/* Marker pulse for high congestion */}
                        {(centre.status === 'High Congestion' || centre.status === 'Critical') && (
                          <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>
                        )}
                        
                        <div 
                           className={`relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110`}
                           onClick={() => setSelectedCentre(centre)}
                        >
                           <div className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg
                              ${centre.color === 'red' ? 'bg-red-500 shadow-red-200' : 
                                centre.color === 'orange' ? 'bg-orange-500 shadow-orange-200' :
                                centre.color === 'amber' ? 'bg-amber-500 shadow-amber-200' : 
                                'bg-green-500 shadow-green-200'}`}
                           >
                              {centre.waitingCount}
                           </div>
                           <div className="mt-2 bg-white/90 backdrop-blur border border-earth-200 px-3 py-1 rounded-full shadow-sm text-xs font-bold text-forest-900 whitespace-nowrap">
                             {centre.name}
                           </div>
                        </div>

                        {/* Hover Tooltip/Card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white border border-earth-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                           <div className="p-4 border-b border-earth-100">
                              <h4 className="font-bold text-forest-900 text-sm leading-tight">{centre.name}</h4>
                              <p className="text-xs text-earth-500 mt-0.5">{centre.district}</p>
                           </div>
                           <div className="p-4 bg-earth-50 rounded-b-xl grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-earth-500 mb-0.5">Waiting</p>
                                <p className={`font-bold text-lg ${centre.color === 'red' ? 'text-red-600' : 'text-forest-900'}`}>{centre.waitingCount}</p>
                              </div>
                              <div>
                                <p className="text-earth-500 mb-0.5">Processing</p>
                                <p className="font-bold text-lg text-forest-900">{centre.processingCount}</p>
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Operational Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-red-200 shadow-sm h-full flex flex-col bg-white overflow-hidden">
             <CardHeader className="bg-red-50/50 border-b border-red-100 py-4">
                <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Congestion Alerts
                </CardTitle>
             </CardHeader>
             <CardContent className="p-5 flex-1 overflow-y-auto space-y-4">
                
                {highCongestion.length === 0 && moderate.length === 0 ? (
                  <div className="text-center text-earth-500 py-10">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-300" />
                    <p className="font-medium text-earth-900">All centres operating normally.</p>
                  </div>
                ) : null}

                {highCongestion.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-red-200 bg-red-50">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-red-900 text-sm">{c.name}</h4>
                        <Badge variant="danger" className="text-[10px]">{c.congestionBadge}</Badge>
                     </div>
                     <p className="text-xs text-red-800 leading-relaxed mb-3">
                       <strong>{c.waitingCount} farmers</strong> are currently waiting. Expected wait time is {c.avgWaitTime} minutes. 
                       Currently processing {c.processingCount} farmers.
                     </p>
                     <div className="bg-white p-3 rounded-lg border border-red-100">
                        <p className="text-[10px] uppercase font-bold text-red-500 mb-1">Suggested Action</p>
                        <p className="text-xs text-earth-700 font-medium">Deploy additional staff to Counter #3 immediately.</p>
                     </div>
                  </div>
                ))}

                {moderate.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-amber-900 text-sm">{c.name}</h4>
                        <Badge variant="warning" className="text-[10px]">{c.congestionBadge}</Badge>
                     </div>
                     <p className="text-xs text-amber-800 leading-relaxed mb-3">
                       Centre queue is building up. {c.waitingCount} farmers waiting.
                     </p>
                  </div>
                ))}

             </CardContent>
          </Card>
        </div>

      </div>

      {/* DETAILED CENTRE VIEW MODAL */}
      {selectedCentre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-earth-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-earth-100 bg-earth-50 shrink-0">
              <h3 className="font-bold text-lg text-forest-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-forest-600" />
                Live Operational View: {selectedCentre.name}
              </h3>
              <button onClick={() => setSelectedCentre(null)} className="text-earth-500 hover:text-earth-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              <div className="flex justify-between items-start border-b border-earth-100 pb-4">
                 <div>
                   <p className="text-sm font-bold text-earth-500 uppercase tracking-wider mb-1">Location Details</p>
                   <p className="font-bold text-forest-900 text-lg">{selectedCentre.id}</p>
                   <p className="text-sm text-earth-600">{selectedCentre.district}, {selectedCentre.state || 'Andhra Pradesh'}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-earth-500 uppercase tracking-wider mb-1">Congestion Status</p>
                   <Badge variant={
                     selectedCentre.color === 'red' || selectedCentre.color === 'orange' ? 'danger' :
                     selectedCentre.color === 'amber' ? 'warning' : 'success'
                   } className="text-sm px-3 py-1">
                     {selectedCentre.congestionBadge}
                   </Badge>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <Card className="border-earth-200 shadow-sm">
                   <CardContent className="p-4 flex flex-col justify-center h-full">
                     <p className="text-[11px] font-bold text-earth-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Today's Bookings</p>
                     <h3 className="text-3xl font-black text-forest-900">{selectedCentre.bookingsCount}</h3>
                   </CardContent>
                 </Card>
                 <Card className="border-earth-200 shadow-sm">
                   <CardContent className="p-4 flex flex-col justify-center h-full">
                     <p className="text-[11px] font-bold text-earth-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Current Queue (Waiting)</p>
                     <h3 className={`text-3xl font-black ${selectedCentre.color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>{selectedCentre.waitingCount}</h3>
                   </CardContent>
                 </Card>
                 <Card className="border-earth-200 shadow-sm bg-forest-50 border-forest-100">
                   <CardContent className="p-4 flex flex-col justify-center h-full">
                     <p className="text-[11px] font-bold text-forest-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Store className="w-3.5 h-3.5"/> Currently Processing</p>
                     <h3 className="text-3xl font-black text-forest-700">{selectedCentre.processingCount}</h3>
                   </CardContent>
                 </Card>
                 <Card className="border-earth-200 shadow-sm bg-green-50 border-green-100">
                   <CardContent className="p-4 flex flex-col justify-center h-full">
                     <p className="text-[11px] font-bold text-green-700 uppercase tracking-widest mb-2 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> Completed</p>
                     <h3 className="text-3xl font-black text-green-800">{selectedCentre.completedCount}</h3>
                   </CardContent>
                 </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Card className="border-earth-200 shadow-sm">
                   <CardContent className="p-4 flex justify-between items-center">
                     <div>
                       <p className="text-[11px] font-bold text-earth-500 uppercase tracking-widest mb-1">Avg Waiting Time</p>
                       <p className="text-xl font-bold text-earth-900 flex items-center gap-2">
                         <Clock className="w-4 h-4 text-earth-400" /> {selectedCentre.avgWaitTime} min
                       </p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card className="border-earth-200 shadow-sm">
                   <CardContent className="p-4 flex justify-between items-center">
                     <div>
                       <p className="text-[11px] font-bold text-earth-500 uppercase tracking-widest mb-1">Avg Processing Time</p>
                       <p className="text-xl font-bold text-earth-900 flex items-center gap-2">
                         <PackageOpen className="w-4 h-4 text-earth-400" /> {selectedCentre.avgProcessingTime} min
                       </p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card className="border-earth-200 shadow-sm">
                   <CardContent className="p-4 flex justify-between items-center">
                     <div>
                       <p className="text-[11px] font-bold text-earth-500 uppercase tracking-widest mb-1">Active Counters/Staff</p>
                       <p className="text-xl font-bold text-earth-900 flex items-center gap-2">
                         <Users className="w-4 h-4 text-earth-400" /> {selectedCentre.activeCounters}
                       </p>
                     </div>
                   </CardContent>
                 </Card>
              </div>

            </div>
            
            <div className="p-4 border-t border-earth-100 bg-earth-50 flex justify-end shrink-0">
              <Button variant="outline" onClick={() => setSelectedCentre(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCongestion;
