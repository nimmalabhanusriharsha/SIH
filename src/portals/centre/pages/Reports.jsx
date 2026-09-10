import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { BarChart3, TrendingUp, Download, PieChart, Users, Activity } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

const StaffReports = () => {
  const { state } = useAppContext();

  // Basic mock metrics
  const totalFarmers = state.bookings.length;
  const completed = state.procurements.length;
  const totalQty = state.procurements.reduce((sum, p) => sum + p.actualQuantity, 0);
  const totalValue = state.procurements.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Centre Reports</h2>
          <p className="text-earth-600 mt-1 font-medium">Daily operational metrics and procurement analytics.</p>
        </div>
        <Button className="bg-forest-900 hover:bg-forest-800 text-white font-bold shadow-md">
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Farmers Served</p>
                 <Users className="w-4 h-4 text-forest-600" />
               </div>
               <h3 className="text-2xl font-black text-forest-900">{completed} / {totalFarmers}</h3>
               <p className="text-xs font-bold text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% vs yesterday</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Total Quantity</p>
                 <PieChart className="w-4 h-4 text-amber-600" />
               </div>
               <h3 className="text-2xl font-black text-amber-600">{totalQty.toFixed(1)} Q</h3>
               <p className="text-xs font-bold text-earth-400 mt-1">Primarily Paddy</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Procurement Value</p>
                 <BarChart3 className="w-4 h-4 text-blue-600" />
               </div>
               <h3 className="text-2xl font-black text-blue-600">₹{totalValue.toLocaleString('en-IN')}</h3>
               <p className="text-xs font-bold text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> MSP Rates Applied</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Avg Wait Time</p>
                 <Activity className="w-4 h-4 text-red-600" />
               </div>
               <h3 className="text-2xl font-black text-red-600">34 min</h3>
               <p className="text-xs font-bold text-red-600 mt-1">Above target (25m)</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <Card className="border-earth-200 shadow-sm bg-white">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
              <CardTitle className="text-base font-bold text-forest-900">Hourly Arrivals</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-64 flex flex-col items-center justify-center border-2 border-dashed border-earth-100 m-6 rounded-xl bg-earth-50/30">
               <BarChart3 className="w-12 h-12 text-earth-300 mb-2" />
               <p className="text-sm font-bold text-earth-500">Chart Visualization Placeholder</p>
               <p className="text-xs font-medium text-earth-400 mt-1">Data ready for charting library integration.</p>
            </CardContent>
         </Card>
         
         <Card className="border-earth-200 shadow-sm bg-white">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
              <CardTitle className="text-base font-bold text-forest-900">Procurement by Crop</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-64 flex flex-col items-center justify-center border-2 border-dashed border-earth-100 m-6 rounded-xl bg-earth-50/30">
               <PieChart className="w-12 h-12 text-earth-300 mb-2" />
               <p className="text-sm font-bold text-earth-500">Chart Visualization Placeholder</p>
               <p className="text-xs font-medium text-earth-400 mt-1">Data ready for charting library integration.</p>
            </CardContent>
         </Card>
      </div>

    </div>
  );
};

export default StaffReports;
