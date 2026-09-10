import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Badge } from '../../../shared/components/Badge';
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Today's Bookings</h2>
          <p className="text-earth-600 mt-1 font-medium">View and manage all farmer bookings scheduled for today.</p>
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto custom-scrollbar pb-2 lg:pb-0">
             {['All', 'Confirmed', 'Processing', 'Procurement', 'Completed', 'Cancelled'].map(f => (
               <button 
                 key={f}
                 onClick={() => setStatusFilter(f)}
                 className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider ${
                   statusFilter === f ? 'bg-forest-900 text-white' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-100'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="flex gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
               <Input 
                 placeholder="Search booking, token, farmer..." 
                 className="pl-9 h-9 border-earth-300 text-sm font-medium"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <Button variant="outline" className="h-9 border-earth-300 text-earth-700 bg-white">
               <Filter className="w-4 h-4" />
             </Button>
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-earth-200 text-earth-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Farmer Details</th>
                <th className="p-4">Slot & Token</th>
                <th className="p-4">Crop Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {filteredBookings.length > 0 ? filteredBookings.map((b) => {
                const farmer = state.farmers.find(f => f.id === b.farmerId);
                const queue = state.queue.find(q => q.token === b.token);
                
                return (
                  <tr key={b.id} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4 font-bold text-forest-900">{b.id}</td>
                    <td className="p-4">
                       <p className="font-bold text-earth-800">{farmer?.name}</p>
                       <p className="text-xs font-medium text-earth-500">{farmer?.id} • {farmer?.mobile}</p>
                    </td>
                    <td className="p-4">
                       <p className="font-black text-forest-900">{b.token}</p>
                       <p className="text-xs font-bold text-earth-500">{b.slot.split(' - ')[0]}</p>
                    </td>
                    <td className="p-4">
                       <p className="font-bold text-earth-800">{b.crop}</p>
                       <p className="text-xs font-medium text-earth-500">{b.expectedQuantity} Quintals</p>
                    </td>
                    <td className="p-4">
                       <Badge className={`uppercase font-bold tracking-widest text-[9px] ${
                         b.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' :
                         b.status === 'Cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' :
                         'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200'
                       }`}>
                         {b.status}
                       </Badge>
                       {queue && (
                         <Badge variant="outline" className="ml-2 uppercase font-bold tracking-widest text-[9px] border-earth-200 text-earth-600">
                           {queue.status}
                         </Badge>
                       )}
                    </td>
                    <td className="p-4 text-right">
                       {b.status === 'Confirmed' && !queue ? (
                         <Button size="sm" className="h-8 font-bold text-xs shadow-sm bg-forest-600 hover:bg-forest-700" onClick={() => navigate('/centre/verification')}>
                           <ScanLine className="w-3 h-3 mr-1.5" /> Verify Arrival
                         </Button>
                       ) : (
                         <Button variant="outline" size="sm" className="h-8 font-bold text-xs border-earth-300 text-earth-700 bg-white">
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
                      <Calendar className="w-10 h-10 text-earth-300 mb-2" />
                      <p className="text-earth-500 font-bold">No bookings found for today.</p>
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
