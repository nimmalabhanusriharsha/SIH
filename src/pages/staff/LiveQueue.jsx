import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Users, Search, Filter, Play, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

const StaffLiveQueue = () => {
  const { state, setState, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Get current serving
  const currentServing = state.queue.find(q => q.status === 'Serving');
  const nextInQueue = state.queue.filter(q => q.status === 'Waiting').sort((a,b) => a.position - b.position);
  const waitingFarmers = nextInQueue.length;
  const activeCounters = 3;

  const filteredQueue = state.queue
    .sort((a,b) => a.position - b.position)
    .filter(q => {
       if (filter === 'All') return true;
       return q.status === filter;
    })
    .filter(q => {
       const farmerName = state.farmers.find(f => f.id === q.farmerId)?.name || '';
       return q.token.toLowerCase().includes(searchTerm.toLowerCase()) || farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const handleCallNext = () => {
    if (nextInQueue.length === 0) return alert("Queue is empty.");
    const nextFarmer = nextInQueue[0];
    const updatedQueue = state.queue.map(q => {
      if (q.status === 'Serving') return { ...q, status: 'Quality Check' };
      if (q.id === nextFarmer.id) return { ...q, status: 'Serving', counter: 'C2' };
      return q;
    });
    setState(prev => ({ ...prev, queue: updatedQueue }));
  };

  const handleProcess = (token) => {
    const q = state.queue.find(x => x.token === token);
    if (q.status === 'Quality Check') navigate('/staff/quality-check');
    else if (q.status === 'Weighing') navigate('/staff/weighing');
    else navigate('/staff/verification');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Live Queue</h2>
          <p className="text-earth-600 mt-1 font-medium">Manage and monitor the flow of farmers.</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-400 text-forest-950 font-black shadow-md border-b-2 border-green-600 active:border-b-0 active:translate-y-px" onClick={handleCallNext}>
          <Play className="w-4 h-4 mr-1.5 fill-current" /> Call Next Farmer
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
         <Card className="border-none shadow-sm bg-forest-900 text-white md:col-span-1">
            <CardContent className="p-4 flex flex-col justify-center h-full">
               <p className="text-[10px] font-bold text-forest-300 uppercase tracking-widest mb-1">Now Serving</p>
               <h3 className="text-3xl font-black">{currentServing?.token || '--'}</h3>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white md:col-span-1 border border-earth-200">
            <CardContent className="p-4 flex flex-col justify-center h-full">
               <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Next Token</p>
               <h3 className="text-2xl font-black text-earth-900">{nextInQueue[0]?.token || '--'}</h3>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white md:col-span-1 border border-earth-200">
            <CardContent className="p-4 flex flex-col justify-center h-full">
               <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Queue Length</p>
               <h3 className="text-2xl font-black text-amber-600">{waitingFarmers}</h3>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white md:col-span-1 border border-earth-200">
            <CardContent className="p-4 flex flex-col justify-center h-full">
               <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Avg Wait</p>
               <h3 className="text-2xl font-black text-earth-900">~34m</h3>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white md:col-span-1 border border-earth-200">
            <CardContent className="p-4 flex flex-col justify-center h-full">
               <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Active Counters</p>
               <h3 className="text-2xl font-black text-earth-900">{activeCounters}</h3>
            </CardContent>
         </Card>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto custom-scrollbar pb-2 lg:pb-0">
             {['All', 'Waiting', 'Serving', 'Quality Check', 'Weighing'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider ${
                   filter === f ? 'bg-forest-900 text-white' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-100'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="relative w-full lg:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
             <Input 
               placeholder="Search token or farmer..." 
               className="pl-9 h-9 border-earth-300 text-sm font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-earth-200 text-earth-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Token</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Crop & Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4">Counter</th>
                <th className="p-4">Est. Wait</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {filteredQueue.length > 0 ? filteredQueue.map((q, idx) => {
                const farmer = state.farmers.find(f => f.id === q.farmerId);
                const booking = state.bookings.find(b => b.token === q.token);
                
                return (
                  <tr key={q.id} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4 font-black text-forest-900 text-lg">{q.token}</td>
                    <td className="p-4 font-bold text-earth-800">{farmer?.name}</td>
                    <td className="p-4 font-bold text-earth-700">{booking?.crop} <span className="text-earth-400 font-medium ml-1">{booking?.expectedQuantity}Q</span></td>
                    <td className="p-4">
                       <Badge className={`uppercase font-bold tracking-widest text-[9px] ${
                         q.status === 'Serving' ? 'bg-forest-600 text-white' :
                         q.status === 'Waiting' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200' :
                         'bg-blue-100 text-blue-700 border-blue-200'
                       }`}>
                         {q.status}
                       </Badge>
                    </td>
                    <td className="p-4 font-bold text-earth-600">{q.counter || '--'}</td>
                    <td className="p-4 font-bold text-earth-600">{q.status === 'Waiting' ? `~${(idx+1)*5}m` : '--'}</td>
                    <td className="p-4 text-right">
                       <Button size="sm" className="h-8 font-bold text-xs shadow-sm bg-forest-600 hover:bg-forest-700" onClick={() => handleProcess(q.token)}>
                         Process
                       </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-10 h-10 text-earth-300 mb-2" />
                      <p className="text-earth-500 font-bold">No queue records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StaffLiveQueue;
