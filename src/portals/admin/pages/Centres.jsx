import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Search, Filter, MapPin, Users, PackageOpen, ArrowRight, Activity } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

const AdminCentres = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCentres = state.centres.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Centre Monitoring</h2>
          <p className="text-earth-600 mt-1">Live operational status of all procurement centres.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search centres..." 
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCentres.map(centre => {
           const queue = state.queue.filter(q => q.centreId === centre.id && q.status === 'Waiting');
           const bookings = state.bookings.filter(b => b.centreId === centre.id);
           const procurements = state.procurements.filter(p => p.centreId === centre.id);
           
           const load = Math.min(100, Math.round((queue.length / (centre.capacity || 100)) * 100));
           const isCritical = load > 80;
           const isBusy = load > 40 && !isCritical;

           return (
             <Card key={centre.id} className={`border-earth-200 overflow-hidden transition-all hover:shadow-md bg-white ${isCritical ? 'border-red-200' : ''}`}>
               <div className={`h-1.5 w-full ${isCritical ? 'bg-red-500' : isBusy ? 'bg-amber-500' : 'bg-green-500'}`}></div>
               <CardContent className="p-5">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h3 className="font-bold text-lg text-forest-900 leading-tight mb-1">{centre.name}</h3>
                     <p className="text-xs font-medium text-earth-500 flex items-center">
                       <MapPin className="w-3 h-3 mr-1" /> {centre.district}
                     </p>
                   </div>
                   <Badge variant={isCritical ? 'danger' : isBusy ? 'warning' : 'success'} className="ml-2 shrink-0">
                     {isCritical ? 'High Load' : isBusy ? 'Moderate' : 'Normal'}
                   </Badge>
                 </div>
                 
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-xs font-medium text-earth-600 mb-1.5">
                       <span>Utilization Capacity</span>
                       <span className={isCritical ? 'text-red-600 font-bold' : ''}>{load}%</span>
                     </div>
                     <div className="w-full h-2 bg-earth-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isBusy ? 'bg-amber-500' : 'bg-green-500'}`}
                         style={{ width: `${load}%` }}
                       />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 py-3 border-y border-earth-100">
                     <div>
                       <p className="text-[10px] uppercase tracking-wider text-earth-500 font-bold mb-1">Live Queue</p>
                       <p className="text-xl font-black text-forest-900 flex items-center gap-2">
                         {queue.length} <span className="text-[10px] font-bold text-earth-600 bg-earth-100 px-1.5 py-0.5 rounded uppercase">Waiting</span>
                       </p>
                     </div>
                     <div>
                       <p className="text-[10px] uppercase tracking-wider text-earth-500 font-bold mb-1">Avg Wait</p>
                       <p className="text-xl font-black text-forest-900">
                         {queue.length > 0 ? (isCritical ? '45+' : '25') : '0'} <span className="text-xs font-medium text-earth-500">min</span>
                       </p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-earth-50 rounded-lg p-2 border border-earth-100/50">
                        <Users className="w-4 h-4 mx-auto mb-1 text-earth-400" />
                        <p className="font-bold text-forest-900">{bookings.length}</p>
                        <p className="text-[9px] text-earth-500 mt-0.5">Bookings</p>
                      </div>
                      <div className="bg-earth-50 rounded-lg p-2 border border-earth-100/50">
                        <PackageOpen className="w-4 h-4 mx-auto mb-1 text-earth-400" />
                        <p className="font-bold text-forest-900">{procurements.length}</p>
                        <p className="text-[9px] text-earth-500 mt-0.5">Procured</p>
                      </div>
                      <div className="bg-earth-50 rounded-lg p-2 border border-earth-100/50">
                        <Activity className="w-4 h-4 mx-auto mb-1 text-earth-400" />
                        <p className="font-bold text-forest-900">{centre.activeCounters || 3}</p>
                        <p className="text-[9px] text-earth-500 mt-0.5">Counters</p>
                      </div>
                   </div>
                   
                   <Button variant="ghost" className="w-full justify-center text-forest-600 hover:text-forest-700 hover:bg-forest-50 mt-2">
                     View Complete Details <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                 </div>
               </CardContent>
             </Card>
           );
        })}
      </div>
    </div>
  );
};

export default AdminCentres;
