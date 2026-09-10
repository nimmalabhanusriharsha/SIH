import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import { BrainCircuit, AlertTriangle, TrendingUp, CheckCircle2, Clock, Lightbulb, Activity } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

const AdminInsights = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-forest-600" />
          AI Smart Insights
        </h2>
        <p className="text-earth-600 mt-1">Predictive recommendations and operational intelligence.</p>
        <div className="bg-earth-100 text-earth-600 px-3 py-1.5 rounded-full inline-flex text-xs font-medium mt-3 border border-earth-200">
          <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-earth-500" /> Prototype Mode: Insights are estimated using historical mock data.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Urgent Insights */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-earth-900 border-b border-earth-200 pb-2">High Priority Alerts</h3>
          
          <Card className="border-red-200 shadow-sm bg-red-50/50 hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <AlertTriangle className="w-24 h-24 text-red-900 -mr-4 -mt-4" />
             </div>
             <CardContent className="p-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-red-900 text-lg">Congestion Prediction</h4>
                      <span className="bg-red-100 text-red-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Estimated</span>
                    </div>
                    <p className="text-sm text-red-800 leading-relaxed mb-4">
                      <strong>Bhimavaram Centre</strong> is expected to reach critical congestion levels (&gt;95% capacity) between <strong>11:00 AM and 1:00 PM</strong> based on the current rate of incoming bookings and historical processing delays.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-red-100">
                      <p className="text-[10px] uppercase font-bold text-red-500 mb-1">System Recommendation</p>
                      <p className="text-sm text-earth-800 font-medium mb-3">Activate Counter 4 immediately to offset the incoming load.</p>
                      <div className="flex gap-2">
                         <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white border-0">Approve Action</Button>
                         <Button size="sm" variant="outline" className="border-earth-200">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
             </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-sm bg-blue-50/50 hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Clock className="w-24 h-24 text-blue-900 -mr-4 -mt-4" />
             </div>
             <CardContent className="p-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-blue-900 text-lg">Processing Delay</h4>
                      <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Live Analytics</span>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed mb-4">
                      Average quality assessment processing time at <strong>Centre C003 (Rythu Seva)</strong> is currently <strong>14% higher</strong> than the daily baseline.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-blue-100">
                      <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">System Recommendation</p>
                      <p className="text-sm text-earth-800 font-medium mb-3">Notify center supervisor to check quality assessment equipment or assign an assistant.</p>
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full justify-center">Send Notification to Supervisor</Button>
                    </div>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Strategic Insights */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-earth-900 border-b border-earth-200 pb-2">Strategic Intelligence</h3>
          
          <Card className="border-amber-200 shadow-sm bg-amber-50/50 hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <TrendingUp className="w-24 h-24 text-amber-900 -mr-4 -mt-4" />
             </div>
             <CardContent className="p-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-amber-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-amber-900 text-lg">Demand Increase</h4>
                      <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Forecast</span>
                    </div>
                    <p className="text-sm text-amber-800 leading-relaxed mb-4">
                      <strong>Paddy bookings</strong> are expected to increase by approximately <strong>18% tomorrow</strong> across the West Godavari district due to approaching weather patterns.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-amber-100">
                      <p className="text-[10px] uppercase font-bold text-amber-500 mb-1">System Recommendation</p>
                      <p className="text-sm text-earth-800 font-medium">Pre-emptively increase total operational capacity in the district by activating standby centres or expanding shifts.</p>
                    </div>
                  </div>
                </div>
             </CardContent>
          </Card>

          <Card className="border-green-200 shadow-sm bg-green-50/50 hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <CheckCircle2 className="w-24 h-24 text-green-900 -mr-4 -mt-4" />
             </div>
             <CardContent className="p-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-green-900 text-lg">Capacity Opportunity</h4>
                      <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Live Analytics</span>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed mb-4">
                      <strong>Palakollu Centre</strong> is operating at only 34% capacity and has available throughput for the afternoon session.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-green-100">
                      <p className="text-[10px] uppercase font-bold text-green-500 mb-1">System Recommendation</p>
                      <p className="text-sm text-earth-800 font-medium mb-3">Allow dynamic slot re-booking for farmers waiting at Bhimavaram to Palakollu.</p>
                      <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 w-full justify-center">Enable Dynamic Re-routing</Button>
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

export default AdminInsights;
