import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Clock, CheckCircle2, AlertTriangle, Info, User } from 'lucide-react';

const AdminActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const logs = [
    { id: 1, type: 'success', message: 'Staff user Krishna Rao logged in.', time: '2 mins ago', centre: 'C001' },
    { id: 2, type: 'warning', message: 'Congestion alert generated for Bhimavaram Centre.', time: '15 mins ago', centre: 'C005' },
    { id: 3, type: 'info', message: 'Payment TRX-89104 initiated for Farmer F042.', time: '1 hour ago', centre: 'Global' },
    { id: 4, type: 'success', message: 'New farmer registered: Ramana M (F092).', time: '2 hours ago', centre: 'C002' },
    { id: 5, type: 'error', message: 'API sync failed with Central Pricing DB.', time: '3 hours ago', centre: 'System' },
    { id: 6, type: 'info', message: 'Procurement PR-1002 marked as completed.', time: '3.5 hours ago', centre: 'C001' },
    { id: 7, type: 'success', message: 'Complaint CMP-2026-041 resolved by admin.', time: '4 hours ago', centre: 'Global' },
  ];

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.centre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-forest-600" />
            System Activity Log
          </h2>
          <p className="text-earth-600 mt-1">Global audit trail of all platform events.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search logs..." 
              className="pl-9 bg-white border-earth-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0 bg-white border-earth-200 text-earth-700">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
         <CardContent className="p-0">
           <div className="divide-y divide-earth-100">
             {filteredLogs.map(log => (
               <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-earth-50/50 transition-colors">
                  <div className="shrink-0 mt-1">
                    {log.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {log.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    {log.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    {log.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-earth-900 leading-snug">{log.message}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-earth-500">
                      <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> {log.time}</span>
                      <span className="w-1 h-1 rounded-full bg-earth-300"></span>
                      <span className="flex items-center gap-1 font-medium"><User className="w-3 h-3" /> {log.centre}</span>
                    </div>
                  </div>
               </div>
             ))}
             
             {filteredLogs.length === 0 && (
               <div className="p-12 text-center text-earth-500">
                 <p className="font-medium">No logs found matching your search.</p>
               </div>
             )}
           </div>
           
           <div className="p-4 border-t border-earth-100 bg-earth-50/50 text-center">
             <Button variant="ghost" className="text-forest-600 hover:bg-forest-50 hover:text-forest-700 font-bold text-sm">
               Load Older Logs
             </Button>
           </div>
         </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityLog;
