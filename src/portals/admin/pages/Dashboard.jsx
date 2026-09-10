import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { Link } from 'react-router-dom';
import {
  Activity, Users, CalendarClock, IndianRupee, PackageOpen, MapPin, Building,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { state } = useAppContext();

  // Calculate KPIs
  const totalFarmers = state.farmers?.length || 0;
  const totalCenters = state.centres?.length || 0;
  const activeCenters = state.centres?.filter(c => c.isActive !== false).length || 0;
  const inactiveCenters = totalCenters - activeCenters;

  const totalBookings = state.bookings?.length || 0;

  const totalProcurementQuantity = state.procurements?.reduce((acc, p) => acc + (p.quantity || 0), 0) || 0;
  const completedProcurements = state.procurements?.filter(p => p.status === 'Completed') || [];
  const totalPaymentAmount = completedProcurements.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* 1. KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">

        <Link to="/admin/farmers" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Users className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-farmer-secondary mb-1">Total Farmers</p>
              <h3 className="text-2xl font-black text-farmer-text">{totalFarmers}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/centres" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Building className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-farmer-secondary mb-1">Total Centers</p>
              <h3 className="text-2xl font-black text-farmer-text">{totalCenters}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/centres" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><Activity className="w-16 h-16 text-green-700" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-green-700 mb-1">Active Centers</p>
              <h3 className="text-2xl font-black text-green-700">{activeCenters}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/centres" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><MapPin className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-farmer-secondary mb-1">Inactive Centers</p>
              <h3 className="text-2xl font-black text-farmer-text">{inactiveCenters}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/bookings" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><CalendarClock className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-farmer-secondary mb-1">Total Bookings</p>
              <h3 className="text-2xl font-black text-farmer-text">{totalBookings}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/procurement" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><PackageOpen className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-farmer-secondary mb-1">Total Procurement (Q)</p>
              <h3 className="text-2xl font-black text-farmer-text">{totalProcurementQuantity}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/procurement" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><PackageOpen className="w-16 h-16 text-green-700" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-farmer-secondary mb-1">Completed Procurements</p>
              <h3 className="text-2xl font-black text-farmer-text">{completedProcurements.length}</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/payments" className="block group">
          <Card className="border-farmer-border shadow-sm hover:border-forest-400 hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform"><IndianRupee className="w-16 h-16" /></div>
            <CardContent className="p-4 md:p-5">
              <p className="text-xs font-medium text-farmer-secondary mb-1">Total Payment Amount</p>
              <h3 className="text-2xl font-black text-farmer-text">₹{totalPaymentAmount}</h3>
            </CardContent>
          </Card>
        </Link>

      </div>

      <div className="grid lg:grid-cols-1 gap-6">

        {/* 2. CENTRE PERFORMANCE OVERVIEW */}
        <div className="lg:col-span-1">
          <Card className="border-farmer-border shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-farmer-border bg-white py-4">
              <div>
                <CardTitle className="text-lg text-farmer-text">Procurement Centre Performance</CardTitle>
                <CardDescription>Live operations metrics across all centres</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/centres">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-farmer-secondary bg-farmer-bg uppercase border-b border-farmer-border">
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
                      <tr key={centre.id} className="hover:bg-farmer-bg/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-bold text-farmer-text">{centre.name}</p>
                          <p className="text-[10px] text-farmer-secondary">{centre.district}</p>
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
      </div>

    </div>
  );
};

export default AdminDashboard;
