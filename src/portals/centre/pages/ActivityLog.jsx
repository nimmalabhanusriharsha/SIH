import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { History, Search, User, Clock, FileText, Monitor, CheckCircle2 } from 'lucide-react';

const StaffActivity = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const defaultActivities = [
    {
      id: 'ACT-101',
      timestamp: new Date().toISOString(),
      staffId: 'STAFF-01',
      counterId: 'Counter 1',
      farmerName: 'Ramesh Kumar',
      farmerId: 'KIS-729481C',
      token: 'A105',
      bookingId: 'BK-20250910-0012',
      action: 'Completed procurement for farmer Ramesh Kumar (KIS-729481C, Token A105) at Counter 1. Crop: Paddy, Qty: 540 kg, Amount: ₹12,150'
    },
    {
      id: 'ACT-102',
      timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
      staffId: 'STAFF-02',
      counterId: 'Counter 2',
      farmerName: 'Lakshmi Devi',
      farmerId: 'KIS-318762D',
      token: 'A102',
      bookingId: 'BK-20250910-0008',
      action: 'Completed procurement for farmer Lakshmi Devi (KIS-318762D, Token A102) at Counter 2. Crop: Maize, Qty: 320 kg, Amount: ₹6,400'
    },
    {
      id: 'ACT-103',
      timestamp: new Date(Date.now() - 70 * 60000).toISOString(),
      staffId: 'STAFF-01',
      counterId: 'Counter 1',
      farmerName: 'Anitha Reddy',
      farmerId: 'KIS-662310F',
      token: 'A104',
      bookingId: 'BK-20250910-0004',
      action: 'Completed procurement for farmer Anitha Reddy (KIS-662310F, Token A104) at Counter 1. Crop: Red Gram, Qty: 280 kg, Amount: ₹19,600'
    }
  ];

  const allActivities = (state.activity && state.activity.length > 0) ? state.activity : defaultActivities;

  const filteredActivity = allActivities.filter(a => {
    const searchLower = searchTerm.toLowerCase();
    return a.action.toLowerCase().includes(searchLower) || 
           (a.farmerName && a.farmerName.toLowerCase().includes(searchLower)) ||
           (a.counterId && a.counterId.toLowerCase().includes(searchLower)) ||
           (a.bookingId && a.bookingId.toLowerCase().includes(searchLower));
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] font-extrabold text-[#046a38] uppercase tracking-widest">PROCUREMENT CENTRE</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Activity Log</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Traceability of all farmer procurements and counter operations performed at this centre.</p>
        </div>
      </div>

      <Card className="border border-slate-200/80 shadow-xs overflow-hidden bg-white rounded-2xl">
        <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-xl bg-[#e6f4ea] flex items-center justify-center shrink-0">
               <div className="w-5.5 h-5.5 rounded-lg bg-[#046a38] text-white flex items-center justify-center shadow-xs">
                 <History className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
               </div>
             </div>
             Operational History & Counter Traceability
           </CardTitle>
           
           <div className="relative w-full lg:w-80">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <Input 
               placeholder="Search by action, farmer, or counter..." 
               className="pl-9 h-9 border-slate-200 text-xs font-bold rounded-xl focus:border-[#046a38]"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {filteredActivity.length > 0 ? filteredActivity.map((activity) => (
              <div key={activity.id} className="p-5 hover:bg-slate-50/80 transition-colors flex gap-4">
                 <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[#e6f4ea] text-[#046a38] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="w-px h-full bg-slate-200 min-h-[35px]"></div>
                 </div>
                 
                 <div className="flex-1 pb-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2">
                       <p className="text-sm font-black text-slate-900 leading-snug">{activity.action}</p>
                       <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap bg-slate-100 px-2.5 py-1 rounded-lg">
                         {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                       {activity.counterId && (
                         <span className="bg-[#e6f4ea] border border-emerald-200 text-[#046a38] font-extrabold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                           <Monitor className="w-3 h-3 text-[#046a38]" /> {activity.counterId}
                         </span>
                       )}
                       {activity.farmerName && (
                         <span className="bg-slate-100 border border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                           <User className="w-3 h-3 text-slate-600" /> Farmer: {activity.farmerName} {activity.farmerId ? `(${activity.farmerId})` : ''}
                         </span>
                       )}
                       <span className="bg-slate-50 border border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                         Staff: {activity.staffId}
                       </span>
                       {activity.bookingId && activity.bookingId !== 'N/A' && (
                         <span className="bg-slate-50 border border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                           <FileText className="w-3 h-3 text-[#046a38]" /> Ref: {activity.bookingId}
                         </span>
                       )}
                    </div>
                 </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-sm">No matching activity records found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffActivity;
