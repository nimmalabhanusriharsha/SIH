import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Search, History, Clock, Building2, UserCircle2, ArrowRight } from 'lucide-react';

const AdminActivityLog = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const logs = state.activity || [];

  const filteredLogs = logs.filter(log => 
    (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.centreId && log.centreId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-farmer-text tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-farmer-primary" />
            System Activity Log
          </h2>
          <p className="text-sm font-medium text-farmer-secondary mt-1">Real-time audit trail of all platform events and user actions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
            <input 
              placeholder="Search actions, users, centers..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-farmer-border rounded-xl text-sm font-medium text-farmer-text focus:outline-none focus:border-farmer-primary shadow-sm min-h-[44px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-farmer-border overflow-hidden flex flex-col">
         
         {/* Desktop Table View */}
         <div className="overflow-x-auto hidden md:block">
           <table className="w-full text-sm text-left">
             <thead className="text-[10px] text-farmer-secondary uppercase tracking-wider border-b border-farmer-border bg-farmer-bg/30">
                <tr>
                   <th className="px-6 py-4 font-bold">Timestamp</th>
                   <th className="px-6 py-4 font-bold">User / Role</th>
                   <th className="px-6 py-4 font-bold">Action Taken</th>
                   <th className="px-6 py-4 font-bold">Details</th>
                   <th className="px-6 py-4 font-bold text-right">Location Context</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-farmer-border/60">
                {filteredLogs.length > 0 ? filteredLogs.map(log => {
                  const d = new Date(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-farmer-bg transition-colors">
                       <td className="px-6 py-4 align-top">
                         <div className="flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5 text-farmer-secondary" />
                           <div>
                             <p className="font-bold text-farmer-text">{d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                             <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">{d.toLocaleDateString()}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 align-top">
                         <div className="flex items-center gap-2">
                           <UserCircle2 className="w-6 h-6 text-farmer-primary opacity-20" />
                           <div>
                             <p className="font-bold text-farmer-text">{log.user}</p>
                             <span className="inline-block bg-farmer-bg border border-farmer-border text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mt-1">
                               {log.role}
                             </span>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 align-top">
                         <p className="font-black text-farmer-text">{log.action}</p>
                         <p className="text-[9px] font-mono text-farmer-secondary mt-1">{log.id}</p>
                       </td>
                       <td className="px-6 py-4 align-top max-w-xs">
                         <p className="text-sm font-medium text-farmer-secondary">{log.details}</p>
                       </td>
                       <td className="px-6 py-4 align-top text-right">
                         <div className="inline-flex flex-col items-end">
                           <span className="flex items-center gap-1.5 text-xs font-bold text-farmer-text bg-farmer-bg border border-farmer-border px-2.5 py-1 rounded-lg">
                             <Building2 className="w-3.5 h-3.5 text-farmer-primary" /> {log.centreId}
                           </span>
                         </div>
                       </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-farmer-secondary">
                      <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold text-farmer-text">No activity found</p>
                      <p className="text-xs">Adjust your search criteria to see older logs.</p>
                    </td>
                  </tr>
                )}
             </tbody>
           </table>
         </div>

         {/* Mobile Card View */}
         <div className="md:hidden divide-y divide-farmer-border/60">
            {filteredLogs.length > 0 ? filteredLogs.map(log => {
              const d = new Date(log.timestamp);
              return (
                <div key={log.id} className="p-4 hover:bg-farmer-bg transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block bg-farmer-bg border border-farmer-border text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded text-farmer-secondary">
                      {log.role}
                    </span>
                    <span className="text-[10px] font-bold text-farmer-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  
                  <p className="font-black text-farmer-text text-sm mb-1">{log.action}</p>
                  <p className="text-xs font-medium text-farmer-secondary mb-3">{log.details}</p>
                  
                  <div className="flex items-center justify-between text-xs font-bold text-farmer-text">
                    <span className="flex items-center gap-1.5"><UserCircle2 className="w-3.5 h-3.5 text-farmer-primary" /> {log.user}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-farmer-primary" /> {log.centreId}</span>
                  </div>
                </div>
              )
            }) : (
              <div className="p-10 text-center text-farmer-secondary">
                <p className="text-sm font-bold text-farmer-text">No activity found</p>
              </div>
            )}
         </div>

         <div className="p-4 border-t border-farmer-border bg-farmer-bg/30 text-center">
           <button className="text-farmer-primary hover:text-farmer-primary-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 w-full transition-colors">
             Load More History <ArrowRight className="w-3.5 h-3.5" />
           </button>
         </div>

      </div>
    </div>
  );
};

export default AdminActivityLog;
