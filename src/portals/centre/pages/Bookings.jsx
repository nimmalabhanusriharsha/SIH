import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Calendar, Search, Filter, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffBookings = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter bookings logic
  const filteredBookings = state.bookings
    .filter(b => statusFilter === 'All' || b.status === statusFilter)
    .filter(b => {
       const farmer = state.farmers.find(f => f.id === b.farmerId);
       const searchLower = searchTerm.toLowerCase();
       return b.id.toLowerCase().includes(searchLower) || 
              b.token.toLowerCase().includes(searchLower) ||
              farmer?.name.toLowerCase().includes(searchLower) ||
              farmer?.id.toLowerCase().includes(searchLower);
    });

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">PROCUREMENT CENTRE</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Today's Bookings</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">View and manage all farmer bookings scheduled for today.</p>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <Card className="border border-slate-100 shadow-xs overflow-hidden bg-white rounded-2xl">
        <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto custom-scrollbar pb-1 lg:pb-0">
             {['All', 'Confirmed', 'Processing', 'Procurement', 'Completed', 'Cancelled'].map(f => (
               <button 
                 key={f}
                 onClick={() => setStatusFilter(f)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                   statusFilter === f 
                     ? 'bg-[#046a38] text-white shadow-xs' 
                     : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="flex gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <Input 
                 placeholder="Search booking, token, farmer..." 
                 className="pl-9 h-9 border-slate-200 text-sm font-medium rounded-xl focus:border-[#046a38]"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <Button variant="outline" className="h-9 border-slate-200 text-slate-700 bg-white rounded-xl hover:bg-slate-50">
               <Filter className="w-4 h-4" />
             </Button>
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-100 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Farmer Details</th>
                <th className="p-4">Slot & Token</th>
                <th className="p-4">Crop Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBookings.length > 0 ? filteredBookings.map((b) => {
                const farmer = state.farmers.find(f => f.id === b.farmerId);
                const queue = state.queue.find(q => q.token === b.token);
                
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-[#046a38] text-sm">{b.id}</td>
                    <td className="p-4">
                       <p className="font-bold text-slate-900">{farmer?.name}</p>
                       <p className="text-xs font-medium text-slate-500">{farmer?.id} • {farmer?.mobile}</p>
                    </td>
                    <td className="p-4">
                       <p className="font-black text-slate-900">{b.token}</p>
                       <p className="text-xs font-semibold text-slate-500">{b.slot.split(' - ')[0]}</p>
                    </td>
                    <td className="p-4">
                       <p className="font-bold text-slate-800">{b.crop}</p>
                       <p className="text-xs font-medium text-slate-500">{b.expectedQuantity} Quintals</p>
                    </td>
                    <td className="p-4">
                       <span className={`px-2.5 py-1 rounded-full uppercase font-extrabold tracking-wider text-[10px] border ${
                         b.status === 'Completed' ? 'bg-[#e6f4ea] text-[#046a38] border-emerald-200' :
                         b.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                         'bg-amber-50 text-amber-700 border-amber-200'
                       }`}>
                         {b.status}
                       </span>
                       {queue && (
                         <span className="ml-2 px-2 py-0.5 rounded-full uppercase font-extrabold tracking-wider text-[9px] border border-slate-200 text-slate-600 bg-slate-50">
                           {queue.status}
                         </span>
                       )}
                    </td>
                    <td className="p-4 text-right">
                       {b.status === 'Confirmed' && !queue ? (
                         <Button size="sm" className="h-8 font-bold text-xs shadow-xs bg-[#046a38] hover:bg-[#03522c] text-white rounded-xl cursor-pointer" onClick={() => navigate('/centre/live-queue')}>
                           <ScanLine className="w-3.5 h-3.5 mr-1.5" /> Verify Arrival
                         </Button>
                       ) : (
                         <Button variant="outline" size="sm" className="h-8 font-bold text-xs border-slate-200 text-slate-700 bg-white rounded-xl hover:bg-slate-50">
                           View Details
                         </Button>
                       )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <Calendar className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-500 font-bold text-sm">No bookings found for today.</p>
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

export default StaffBookings;
