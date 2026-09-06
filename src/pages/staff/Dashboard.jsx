import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Users, Calendar, Clock, CheckCircle2, AlertTriangle, Play,
  BarChart3, Activity, PieChart, ArrowRight, Bell, FileText
} from 'lucide-react';

const StaffDashboard = () => {
  const { state, setState, currentUser } = useAppContext();
  const navigate = useNavigate();

  // Simulated metrics based on mockData
  const todaysBookings = state.bookings.length;
  const waitingFarmers = state.queue.filter(q => q.status === 'Waiting').length;
  const arrivedFarmers = state.queue.length;
  const pendingArrivals = todaysBookings - arrivedFarmers;
  
  const completedProcurements = state.procurements.length;
  const pendingProcurements = state.queue.filter(q => ['Weighing', 'Quality Check'].includes(q.status)).length;
  
  const activeCounters = 3; 

  const currentServing = state.queue.find(q => q.status === 'Serving' && q.counter === 'C2') || state.queue.find(q => q.status === 'Serving');
  const nextInQueue = state.queue.filter(q => q.status === 'Waiting').sort((a,b) => a.position - b.position);

  // Function to call the next farmer
  const handleCallNext = () => {
    if (nextInQueue.length === 0) {
      alert("No farmers waiting in the queue.");
      return;
    }

    const nextFarmer = nextInQueue[0];
    
    // Create new queue array
    const updatedQueue = state.queue.map(q => {
      // Current serving becomes completed (or moves to Quality Check)
      if (q.status === 'Serving') {
        return { ...q, status: 'Quality Check' };
      }
      // Next becomes serving
      if (q.id === nextFarmer.id) {
        return { ...q, status: 'Serving', counter: 'C2' }; // Mock assigning to C2
      }
      return q;
    });

    // Add an activity log entry
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser.id,
      action: `Called token ${nextFarmer.token} to Counter 2`,
      farmerName: state.farmers.find(f => f.id === nextFarmer.farmerId)?.name || 'Unknown',
      bookingId: state.bookings.find(b => b.token === nextFarmer.token)?.id || 'Unknown'
    };

    setState(prev => ({
      ...prev,
      queue: updatedQueue,
      activity: [newActivity, ...(prev.activity || [])]
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Centre Operations</h2>
          <p className="text-earth-600 mt-1 font-medium">Monitor today's procurement activities and manage the farmer queue.</p>
        </div>
      </div>

      {/* DASHBOARD ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {waitingFarmers > 5 ? (
           <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 shadow-sm">
             <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
             <div>
               <h4 className="font-bold text-red-900 text-sm">High Congestion Detected</h4>
               <p className="text-xs font-medium text-red-700 mt-1">{waitingFarmers} farmers are currently waiting. Average wait time is increasing.</p>
             </div>
           </div>
         ) : (
           <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3 shadow-sm">
             <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
             <div>
               <h4 className="font-bold text-green-900 text-sm">Queue Operating Normally</h4>
               <p className="text-xs font-medium text-green-700 mt-1">Processing time is optimal.</p>
             </div>
           </div>
         )}
         
         <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm">
           <Activity className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
           <div>
             <h4 className="font-bold text-amber-900 text-sm">Pending Procurements</h4>
             <p className="text-xs font-medium text-amber-700 mt-1">{pendingProcurements} farmers are waiting for quality check or weighing.</p>
           </div>
         </div>
         
         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 shadow-sm md:hidden lg:flex">
           <PieChart className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
           <div>
             <h4 className="font-bold text-blue-900 text-sm">Centre Capacity</h4>
             <p className="text-xs font-medium text-blue-700 mt-1">Currently at 78% of daily storage capacity.</p>
           </div>
         </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <Card className="border-none shadow-md bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Today's Bookings</p>
                 <div className="w-8 h-8 rounded-full bg-forest-50 flex items-center justify-center"><Calendar className="w-4 h-4 text-forest-600" /></div>
               </div>
               <h3 className="text-3xl font-black text-forest-900">{todaysBookings}</h3>
               <p className="text-xs font-bold text-earth-400 mt-1">{pendingArrivals} pending arrivals</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-md bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Waiting Farmers</p>
                 <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center"><Users className="w-4 h-4 text-amber-600" /></div>
               </div>
               <h3 className="text-3xl font-black text-amber-600">{waitingFarmers}</h3>
               <p className="text-xs font-bold text-earth-400 mt-1">~34 min avg wait</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-md bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Completed</p>
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
               </div>
               <h3 className="text-3xl font-black text-forest-900">{completedProcurements}</h3>
               <p className="text-xs font-bold text-earth-400 mt-1">Procurements today</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-md bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Active Counters</p>
                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-blue-600" /></div>
               </div>
               <h3 className="text-3xl font-black text-forest-900">{activeCounters}</h3>
               <p className="text-xs font-bold text-earth-400 mt-1">Out of 4 total</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         
         {/* LIVE QUEUE OVERVIEW */}
         <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white overflow-hidden h-full">
               <CardHeader className="bg-forest-900 py-4 px-6 flex flex-row items-center justify-between border-b border-forest-800">
                  <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-forest-300" /> Live Queue Control
                  </CardTitle>
                  <Button size="sm" className="bg-green-500 hover:bg-green-400 text-forest-950 font-black shadow-md border-b-2 border-green-600 active:border-b-0 active:translate-y-px" onClick={handleCallNext}>
                    <Play className="w-4 h-4 mr-1.5 fill-current" /> Call Next Farmer
                  </Button>
               </CardHeader>
               
               <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Currently Serving */}
                  <div className="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-earth-100 bg-forest-50/50">
                     <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest mb-4">Currently Serving</p>
                     
                     {currentServing ? (
                       <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth-200 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-forest-100 rounded-bl-full flex items-start justify-end p-3">
                             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                          
                          <p className="text-4xl font-black text-forest-900 mb-1">{currentServing.token}</p>
                          <Badge className="bg-forest-100 text-forest-700 border-forest-200 mb-4 font-bold uppercase tracking-wider text-[10px]">
                            Counter {currentServing.counter || '2'}
                          </Badge>
                          
                          <div className="space-y-3">
                             <div>
                               <p className="text-[10px] font-bold text-earth-500 uppercase tracking-wider">Farmer</p>
                               <p className="font-bold text-earth-900">{state.farmers.find(f => f.id === currentServing.farmerId)?.name}</p>
                             </div>
                             <div>
                               <p className="text-[10px] font-bold text-earth-500 uppercase tracking-wider">Status</p>
                               <p className="font-bold text-forest-700 flex items-center gap-1.5">
                                 <FileText className="w-4 h-4" /> Quality Check
                               </p>
                             </div>
                          </div>
                       </div>
                     ) : (
                       <div className="bg-white rounded-2xl p-8 shadow-sm border border-earth-200 text-center">
                          <Users className="w-12 h-12 text-earth-300 mx-auto mb-3" />
                          <p className="font-bold text-earth-600">No farmer currently at counter</p>
                       </div>
                     )}
                  </div>

                  {/* Next Up */}
                  <div className="p-6 md:w-1/2">
                     <div className="flex justify-between items-center mb-4">
                       <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Next In Queue</p>
                       <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{waitingFarmers} Waiting</span>
                     </div>
                     
                     <div className="space-y-3">
                        {nextInQueue.slice(0, 3).map((q, idx) => {
                          const farmerName = state.farmers.find(f => f.id === q.farmerId)?.name;
                          return (
                            <div key={q.id} className="flex items-center justify-between p-3 rounded-xl border border-earth-200 bg-white shadow-sm hover:border-forest-300 transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-900 font-black">
                                     {q.token.split('-')[1]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-earth-900 text-sm">{q.token}</p>
                                    <p className="text-[10px] font-bold text-earth-500 uppercase">{farmerName}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-[10px] font-bold text-earth-400 uppercase tracking-wider">Est. Wait</p>
                                  <p className="font-bold text-earth-700 text-xs">~{(idx+1) * 5} min</p>
                               </div>
                            </div>
                          )
                        })}
                        {nextInQueue.length === 0 && (
                          <div className="text-center py-6 border border-dashed border-earth-300 rounded-xl">
                            <p className="text-sm font-bold text-earth-500">Queue is empty 🎉</p>
                          </div>
                        )}
                        {nextInQueue.length > 3 && (
                          <Button variant="ghost" className="w-full text-xs font-bold text-forest-600" onClick={() => navigate('/staff/live-queue')}>
                            View All {nextInQueue.length} Farmers <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* COUNTER MANAGEMENT */}
         <div className="lg:col-span-1">
            <Card className="border-none shadow-md bg-white h-full">
               <CardHeader className="bg-earth-50 py-4 px-5 border-b border-earth-100">
                 <CardTitle className="text-sm font-bold text-forest-900">Counter Management</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="divide-y divide-earth-100">
                    
                    <div className="p-4 flex items-center justify-between hover:bg-earth-50">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                           <span className="font-bold text-forest-900 text-sm">Counter 1</span>
                         </div>
                         <p className="text-[10px] font-bold text-earth-500 uppercase">Serving P-094</p>
                       </div>
                       <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">Manage</Button>
                    </div>

                    <div className="p-4 flex items-center justify-between bg-forest-50/50">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                           <span className="font-bold text-forest-900 text-sm">Counter 2 (Yours)</span>
                         </div>
                         <p className="text-[10px] font-bold text-forest-600 uppercase">Serving {currentServing?.token || 'None'}</p>
                       </div>
                       <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold border-forest-300 text-forest-700">Manage</Button>
                    </div>

                    <div className="p-4 flex items-center justify-between hover:bg-earth-50">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                           <span className="font-bold text-forest-900 text-sm">Counter 3</span>
                         </div>
                         <p className="text-[10px] font-bold text-earth-500 uppercase">Serving P-095</p>
                       </div>
                       <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">Manage</Button>
                    </div>

                    <div className="p-4 flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="w-2 h-2 rounded-full bg-earth-300"></span>
                           <span className="font-bold text-earth-900 text-sm">Counter 4</span>
                         </div>
                         <p className="text-[10px] font-bold text-earth-500 uppercase">Inactive</p>
                       </div>
                       <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">Start</Button>
                    </div>

                 </div>
               </CardContent>
            </Card>
         </div>

      </div>
    </div>
  );
};

export default StaffDashboard;
