import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  Activity, AlertTriangle, TrendingUp, Users, BrainCircuit,
  CalendarClock, IndianRupee, PackageOpen, MapPin, CheckCircle2,
  Clock, ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { state } = useAppContext();
  
  // Calculate KPIs
  const totalFarmers = state.farmers.length;
  const todaysBookings = state.bookings.length;
  
  const waitingFarmers = state.queue.filter(q => q.status === 'Waiting').length;
  
  const completedProcurements = state.procurements.filter(p => p.status === 'Completed');
  const totalProcurementQuantity = completedProcurements.reduce((acc, p) => acc + (p.quantity || 0), 0);
  const totalProcurementValue = completedProcurements.reduce((acc, p) => acc + (p.amount || 0), 0);
  
  // Mock payments pending for demo (in a real app this would come from a payments table)
  // Let's assume 15% of completed procurements are pending payment
  const pendingPayments = Math.max(1, Math.floor(completedProcurements.length * 0.15));
  
  // Average waiting time
  const waitingQueueItems = state.queue.filter(q => q.waitTime);
  const avgWaitTime = waitingQueueItems.length > 0 
    ? Math.floor(waitingQueueItems.reduce((acc, q) => acc + q.waitTime, 0) / waitingQueueItems.length)
    : 0;

  // Centre Utilization (Average across all centres)
  const avgUtilization = Math.round(
    state.centres.reduce((acc, centre) => {
      const qLen = state.queue.filter(q => q.centreId === centre.id && q.status === 'Waiting').length;
      return acc + Math.min(100, (qLen / (centre.capacity || 100)) * 100);
    }, 0) / (state.centres.length || 1)
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* 1. KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <Link to="/admin/farmers" className="block group">
          <Card className="border-forest-200 shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Users className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-earth-500 mb-1">Total Farmers</p>
              <h3 className="text-2xl font-black text-forest-900">{totalFarmers + 1218}</h3>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/bookings" className="block group">
          <Card className="border-forest-200 shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><CalendarClock className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-earth-500 mb-1">Bookings Today</p>
              <h3 className="text-2xl font-black text-forest-900">{todaysBookings + 356}</h3>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/congestion" className="block group">
          <Card className="border-amber-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all h-full bg-amber-50/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><MapPin className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-amber-800 mb-1">Currently Waiting</p>
              <h3 className="text-2xl font-black text-amber-900">{waitingFarmers}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/procurement" className="block group">
          <Card className="border-forest-200 shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><PackageOpen className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-earth-500 mb-1">Procurement (Q)</p>
              <h3 className="text-2xl font-black text-forest-900">{totalProcurementQuantity + 4590}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/payments" className="block group">
          <Card className="border-forest-200 shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><IndianRupee className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-earth-500 mb-1">Pending Payments</p>
              <h3 className="text-2xl font-black text-red-600">{pendingPayments + 28}</h3>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/centres" className="block group">
          <Card className="border-forest-200 shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Activity className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-earth-500 mb-1">Avg Utilization</p>
              <h3 className="text-2xl font-black text-forest-900">{avgUtilization}%</h3>
            </CardContent>
          </Card>
        </Link>
        
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* 2. CENTRE PERFORMANCE OVERVIEW */}
        <div className="lg:col-span-2">
          <Card className="border-earth-200 shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-earth-100 bg-white py-4">
              <div>
                <CardTitle className="text-lg text-forest-900">Procurement Centre Performance</CardTitle>
                <CardDescription>Live operations metrics across all centres</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/centres">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-earth-500 bg-earth-50 uppercase border-b border-earth-200">
                     <tr>
                        <th className="px-4 py-3 font-semibold">Centre</th>
                        <th className="px-4 py-3 font-semibold">Waiting</th>
                        <th className="px-4 py-3 font-semibold">Active Counters</th>
                        <th className="px-4 py-3 font-semibold">Procured</th>
                        <th className="px-4 py-3 font-semibold">Utilization</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-100">
                     {state.centres.map(centre => {
                        const qLen = state.queue.filter(q => q.centreId === centre.id && q.status === 'Waiting').length;
                        const procured = state.procurements.filter(p => p.centreId === centre.id).length;
                        const load = Math.min(100, Math.round((qLen / (centre.capacity || 100)) * 100));
                        
                        let badgeType = 'success';
                        let badgeLabel = 'Normal';
                        if (load > 40) { badgeType = 'warning'; badgeLabel = 'Moderate'; }
                        if (load > 80) { badgeType = 'danger'; badgeLabel = 'High Load'; }

                        return (
                          <tr key={centre.id} className="hover:bg-earth-50/50 transition-colors">
                             <td className="px-4 py-3">
                               <p className="font-bold text-forest-900">{centre.name}</p>
                               <p className="text-[10px] text-earth-500">{centre.district}</p>
                             </td>
                             <td className="px-4 py-3 font-medium">{qLen}</td>
                             <td className="px-4 py-3">{centre.activeCounters || 3}</td>
                             <td className="px-4 py-3">{procured}</td>
                             <td className="px-4 py-3">
                               <div className="flex items-center gap-2">
                                 <div className="w-16 h-1.5 bg-earth-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${load > 80 ? 'bg-red-500' : load > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                                      style={{ width: `${load}%` }}
                                    />
                                 </div>
                                 <span className="text-xs font-medium">{load}%</span>
                               </div>
                             </td>
                             <td className="px-4 py-3">
                                <Badge variant={badgeType} className="text-[10px]">{badgeLabel}</Badge>
                             </td>
                          </tr>
                        );
                     })}
                  </tbody>
               </table>
            </CardContent>
          </Card>
        </div>

        {/* 3. AI SMART INSIGHTS */}
        <div className="lg:col-span-1">
           <Card className="border-forest-300 shadow-md bg-gradient-to-br from-forest-50 to-white relative overflow-hidden h-full flex flex-col">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <BrainCircuit className="w-48 h-48 text-forest-900 -mr-10 -mt-10" />
             </div>
             <CardHeader className="relative z-10 border-b border-forest-100/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-forest-900">
                  <BrainCircuit className="w-5 h-5 text-forest-600" />
                  AI Smart Insights
                </CardTitle>
                <CardDescription>Predictive operational alerts</CardDescription>
             </CardHeader>
             <CardContent className="p-5 space-y-4 relative z-10 flex-1 overflow-y-auto">
                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-red-900 mb-1">Congestion Prediction</h4>
                      <p className="text-xs text-red-700/80 leading-relaxed">Bhimavaram Centre is expected to reach high congestion between 11:00 AM and 1:00 PM based on incoming bookings.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 mb-1">Demand Increase</h4>
                      <p className="text-xs text-amber-700/80 leading-relaxed">Paddy bookings are expected to increase by approximately 18% tomorrow across West Godavari district.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-green-900 mb-1">Capacity Opportunity</h4>
                      <p className="text-xs text-green-700/80 leading-relaxed">Palakollu Centre has available capacity during the afternoon. Consider redirecting overflow.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 mb-1">Processing Delay</h4>
                      <p className="text-xs text-blue-700/80 leading-relaxed">Average processing time at Centre C003 is 14% higher than normal over the last 2 hours.</p>
                    </div>
                  </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
