import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { History, Search, User, Clock, FileText } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const StaffActivity = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivity = (state.activity || [])
    .filter(a => {
       const searchLower = searchTerm.toLowerCase();
       return a.action.toLowerCase().includes(searchLower) || 
              (a.farmerName && a.farmerName.toLowerCase().includes(searchLower)) ||
              (a.bookingId && a.bookingId.toLowerCase().includes(searchLower));
    });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Activity Log</h2>
          <p className="text-earth-600 mt-1 font-medium">Traceability of all operational actions performed at this centre.</p>
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
             <History className="w-5 h-5 text-forest-600" /> Operational History
           </CardTitle>
           
           <div className="relative w-full lg:w-80">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
             <Input 
               placeholder="Search by action, farmer, or booking..." 
               className="pl-9 h-9 border-earth-300 text-sm font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-earth-100 max-h-[70vh] overflow-y-auto">
            {filteredActivity.length > 0 ? filteredActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-earth-50 transition-colors flex gap-4">
                 <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center border border-forest-200">
                      <Clock className="w-5 h-5 text-forest-600" />
                    </div>
                    <div className="w-px h-full bg-earth-200 min-h-[40px]"></div>
                 </div>
                 
                 <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-sm font-black text-forest-900">{activity.action}</p>
                       <span className="text-xs font-bold text-earth-500 whitespace-nowrap bg-earth-100 px-2 py-1 rounded-md">
                         {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-3">
                       <Badge variant="outline" className="bg-white border-earth-200 text-earth-600 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                         <User className="w-3 h-3" /> Staff: {activity.staffId}
                       </Badge>
                       {activity.farmerName && (
                         <Badge variant="outline" className="bg-white border-earth-200 text-earth-600 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                           Farmer: {activity.farmerName}
                         </Badge>
                       )}
                       {activity.bookingId && activity.bookingId !== 'N/A' && (
                         <Badge variant="outline" className="bg-white border-earth-200 text-earth-600 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                           <FileText className="w-3 h-3" /> Ref: {activity.bookingId}
                         </Badge>
                       )}
                    </div>
                 </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <History className="w-12 h-12 text-earth-300 mx-auto mb-4" />
                <p className="text-earth-500 font-bold">No activity records found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffActivity;
