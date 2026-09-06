import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Settings, Save, IndianRupee, ShieldAlert, Calendar, RefreshCcw } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { useAppContext } from '../../context/AppContext';

const AdminSettings = () => {
  const { state } = useAppContext();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-forest-600" />
            Platform Configuration
          </h2>
          <p className="text-earth-600 mt-1">Global settings, pricing, and system controls.</p>
        </div>
        <Button className="bg-forest-600 hover:bg-forest-700 text-white">
          <Save className="w-4 h-4 mr-2" /> Save All Changes
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         
         {/* Crop Pricing (MSP) */}
         <Card className="border-earth-200 shadow-sm bg-white md:col-span-2">
           <CardHeader className="border-b border-earth-100 bg-earth-50 py-4">
             <CardTitle className="text-lg text-forest-900 flex items-center gap-2">
               <IndianRupee className="w-5 h-5 text-forest-600" /> Minimum Support Price (MSP) Configuration
             </CardTitle>
             <CardDescription>Update global procurement rates across all centres.</CardDescription>
           </CardHeader>
           <CardContent className="p-6">
             <div className="grid md:grid-cols-3 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-earth-700 block">Paddy (Grade A)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-earth-500 font-medium">₹</span>
                   </div>
                   <Input type="number" defaultValue="2203" className="pl-8 bg-earth-50 border-earth-200" />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <span className="text-earth-500 text-xs">/ Quintal</span>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-bold text-earth-700 block">Paddy (Common)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-earth-500 font-medium">₹</span>
                   </div>
                   <Input type="number" defaultValue="2183" className="pl-8 bg-earth-50 border-earth-200" />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <span className="text-earth-500 text-xs">/ Quintal</span>
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-earth-700 block">Wheat</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-earth-500 font-medium">₹</span>
                   </div>
                   <Input type="number" defaultValue="2275" className="pl-8 bg-earth-50 border-earth-200" />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <span className="text-earth-500 text-xs">/ Quintal</span>
                   </div>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>

         {/* Season Configuration */}
         <Card className="border-earth-200 shadow-sm bg-white">
           <CardHeader className="border-b border-earth-100 bg-earth-50 py-4">
             <CardTitle className="text-lg text-forest-900 flex items-center gap-2">
               <Calendar className="w-5 h-5 text-forest-600" /> Season Control
             </CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-4">
             <div>
               <label className="text-sm font-bold text-earth-700 block mb-2">Active Procurement Season</label>
               <select className="w-full h-10 px-3 rounded-md border border-earth-200 bg-earth-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500">
                 <option>Kharif 2026-27</option>
                 <option>Rabi 2026-27</option>
               </select>
             </div>
             <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                 <RefreshCcw className="w-5 h-5 text-blue-500" />
               </div>
               <div>
                 <p className="text-sm font-bold text-blue-900">Season Transition</p>
                 <p className="text-xs text-blue-800">Archive current season data and prep for next cycle.</p>
               </div>
               <Button variant="outline" size="sm" className="ml-auto bg-white border-blue-200 text-blue-700">Initiate</Button>
             </div>
           </CardContent>
         </Card>

         {/* System Controls */}
         <Card className="border-red-200 shadow-sm bg-white">
           <CardHeader className="border-b border-red-100 bg-red-50/50 py-4">
             <CardTitle className="text-lg text-red-900 flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-red-600" /> Emergency Controls
             </CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-4">
             <div className="flex items-center justify-between p-3 border border-earth-200 rounded-lg">
               <div>
                 <p className="font-bold text-earth-900 text-sm">Halt New Bookings</p>
                 <p className="text-xs text-earth-500">Temporarily stop farmers from booking new slots.</p>
               </div>
               <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">Halt Bookings</Button>
             </div>
             
             <div className="flex items-center justify-between p-3 border border-earth-200 rounded-lg">
               <div>
                 <p className="font-bold text-earth-900 text-sm">System Maintenance Mode</p>
                 <p className="text-xs text-earth-500">Take Farmer and Staff portals offline for updates.</p>
               </div>
               <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">Enable Maintenance</Button>
             </div>
           </CardContent>
         </Card>

      </div>
    </div>
  );
};

export default AdminSettings;
