import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { TrendingUp, Calendar as CalendarIcon, PackageOpen, MapPin, Users, Lightbulb } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const AdminDemand = () => {
  const [timeframe, setTimeframe] = useState('Tomorrow');

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Procurement Demand Forecast</h2>
          <p className="text-earth-600 mt-1">Estimated future intake and capacity planning.</p>
        </div>
        
        <div className="flex bg-earth-100 p-1 rounded-lg border border-earth-200">
          {['Today', 'Tomorrow', 'Next 7 Days'].map(tf => (
            <button 
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                timeframe === tf 
                  ? 'bg-white text-forest-900 shadow-sm' 
                  : 'text-earth-600 hover:text-forest-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-forest-200 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
               <Users className="w-6 h-6 text-forest-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-earth-500">Expected Farmers</p>
              <h3 className="text-2xl font-black text-forest-900 mt-1">
                {timeframe === 'Today' ? '418' : timeframe === 'Tomorrow' ? '580' : '2,840'}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-forest-200 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
               <CalendarIcon className="w-6 h-6 text-forest-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-earth-500">Expected Bookings</p>
              <h3 className="text-2xl font-black text-forest-900 mt-1">
                {timeframe === 'Today' ? '418' : timeframe === 'Tomorrow' ? '610' : '3,100'}
              </h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-forest-200 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
               <PackageOpen className="w-6 h-6 text-forest-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-earth-500">Expected Quantity (Q)</p>
              <h3 className="text-2xl font-black text-forest-900 mt-1">
                {timeframe === 'Today' ? '5,120' : timeframe === 'Tomorrow' ? '7,060' : '34,250'}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Forecast by Crop */}
        <Card className="border-earth-200 shadow-sm bg-white">
          <CardHeader className="border-b border-earth-100 py-4 bg-earth-50/50">
            <CardTitle className="text-lg text-forest-900">Forecast by Crop ({timeframe})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-earth-100">
               {/* Paddy */}
               <div className="p-5">
                 <div className="flex justify-between items-end mb-2">
                   <div>
                     <h4 className="font-bold text-forest-900 text-lg">Paddy</h4>
                     <p className="text-xs font-medium text-earth-500">Major demand driver</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xl font-black text-forest-900">{timeframe === 'Today' ? '4,100' : timeframe === 'Tomorrow' ? '5,240' : '26,000'} Q</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 text-sm font-medium text-earth-600 bg-earth-50 p-3 rounded-lg border border-earth-100 mt-3">
                   <div className="flex items-center gap-2">
                     <Users className="w-4 h-4 text-earth-400" /> {timeframe === 'Today' ? '320' : timeframe === 'Tomorrow' ? '420' : '2,100'} Farmers
                   </div>
                   <div className="w-px h-4 bg-earth-300"></div>
                   <div className="text-amber-600 flex items-center gap-1.5">
                     <TrendingUp className="w-4 h-4" /> +14% Trend
                   </div>
                 </div>
               </div>

               {/* Wheat */}
               <div className="p-5">
                 <div className="flex justify-between items-end mb-2">
                   <div>
                     <h4 className="font-bold text-forest-900 text-lg">Wheat</h4>
                     <p className="text-xs font-medium text-earth-500">Steady intake</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xl font-black text-forest-900">{timeframe === 'Today' ? '1,020' : timeframe === 'Tomorrow' ? '1,820' : '8,250'} Q</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 text-sm font-medium text-earth-600 bg-earth-50 p-3 rounded-lg border border-earth-100 mt-3">
                   <div className="flex items-center gap-2">
                     <Users className="w-4 h-4 text-earth-400" /> {timeframe === 'Today' ? '98' : timeframe === 'Tomorrow' ? '160' : '740'} Farmers
                   </div>
                   <div className="w-px h-4 bg-earth-300"></div>
                   <div className="text-green-600 flex items-center gap-1.5">
                     <TrendingUp className="w-4 h-4 rotate-180" /> Stable Trend
                   </div>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Recommendations */}
        <Card className="border-forest-200 shadow-sm bg-gradient-to-br from-forest-50 to-white flex flex-col">
          <CardHeader className="border-b border-forest-100 py-4">
            <CardTitle className="text-lg text-forest-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-forest-600" />
              Recommended Resource Allocation
            </CardTitle>
            <CardDescription>Estimated requirements to meet {timeframe.toLowerCase()}'s demand</CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-1 space-y-4">
            
            <div className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
               <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-forest-900 flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-earth-400" />
                   Bhimavaram Centre
                 </h4>
               </div>
               <p className="text-sm font-bold text-red-700 bg-red-50 py-1.5 px-3 rounded inline-block mb-3">
                 +1 counter recommended
               </p>
               <p className="text-xs text-earth-600 leading-relaxed">
                 Expected intake of {timeframe === 'Tomorrow' ? '1,200 Q' : 'High Volume'} exceeds current operational capacity. Activate standby counter to prevent &gt;45 min wait times.
               </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
               <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-forest-900 flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-earth-400" />
                   Palakollu Centre
                 </h4>
               </div>
               <p className="text-sm font-bold text-green-700 bg-green-50 py-1.5 px-3 rounded inline-block mb-3">
                 Current capacity sufficient
               </p>
               <p className="text-xs text-earth-600 leading-relaxed">
                 Forecasted demand is well within the 3 active counters' capacity limits.
               </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
               <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-forest-900 flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-earth-400" />
                   District Level (West Godavari)
                 </h4>
               </div>
               <p className="text-sm font-bold text-blue-700 bg-blue-50 py-1.5 px-3 rounded inline-block mb-3">
                 Shift 12 expected farmers
               </p>
               <p className="text-xs text-earth-600 leading-relaxed">
                 Shift expected farmers toward Palakollu Centre by modifying slot availability ratios.
               </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDemand;
