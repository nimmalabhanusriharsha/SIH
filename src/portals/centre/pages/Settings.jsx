import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { User, MapPin, Bell, Globe, Save } from 'lucide-react';

const StaffSettings = () => {
  const { currentUser, state } = useAppContext();
  const centre = state.centres.find(c => c.id === currentUser?.centreId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-forest-900 tracking-tight">Settings</h2>
        <p className="text-earth-600 mt-1 font-medium">Manage your profile and centre preferences.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         
         {/* STAFF PROFILE */}
         <Card className="border-earth-200 shadow-sm bg-white">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
              <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
                <User className="w-5 h-5 text-forest-600" /> Staff Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div>
                  <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Full Name</label>
                  <Input defaultValue={currentUser?.name} className="font-bold border-earth-300" disabled />
               </div>
               <div>
                  <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Staff ID</label>
                  <Input defaultValue={currentUser?.id} className="font-bold border-earth-300" disabled />
               </div>
               <div>
                  <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Mobile Number</label>
                  <Input defaultValue={currentUser?.mobile || '+91 9876543210'} className="font-bold border-earth-300" />
               </div>
               <Button className="w-full font-bold bg-forest-900 hover:bg-forest-800">
                  <Save className="w-4 h-4 mr-2" /> Update Profile
               </Button>
            </CardContent>
         </Card>

         {/* CENTRE INFO */}
         <Card className="border-earth-200 shadow-sm bg-white">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
              <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-forest-600" /> Centre Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div>
                  <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Centre Name</label>
                  <Input defaultValue={centre?.name} className="font-bold border-earth-300 bg-earth-50" disabled />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Centre ID</label>
                    <Input defaultValue={centre?.id} className="font-bold border-earth-300 bg-earth-50" disabled />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Capacity</label>
                    <Input defaultValue={centre?.capacity + ' Q'} className="font-bold border-earth-300 bg-earth-50" disabled />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">District / State</label>
                  <Input defaultValue={`${centre?.district}, ${centre?.state}`} className="font-bold border-earth-300 bg-earth-50" disabled />
               </div>
            </CardContent>
         </Card>

         {/* PREFERENCES */}
         <Card className="border-earth-200 shadow-sm bg-white md:col-span-2">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
              <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-forest-600" /> Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="grid md:grid-cols-2 gap-8">
                  
                  <div className="space-y-4">
                     <h3 className="font-bold text-forest-900 flex items-center gap-2"><Globe className="w-4 h-4"/> System Language</h3>
                     <div className="flex gap-3">
                        <button className="flex-1 py-2 rounded-lg border-2 border-forest-600 bg-forest-50 text-forest-700 font-bold text-sm">English</button>
                        <button className="flex-1 py-2 rounded-lg border border-earth-200 hover:bg-earth-50 text-earth-600 font-bold text-sm transition-colors">हिंदी</button>
                        <button className="flex-1 py-2 rounded-lg border border-earth-200 hover:bg-earth-50 text-earth-600 font-bold text-sm transition-colors">తెలుగు</button>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="font-bold text-forest-900">Notifications</h3>
                     <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-earth-300 text-forest-600 focus:ring-forest-500" />
                           <span className="text-sm font-bold text-earth-700">Push Notifications</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-earth-300 text-forest-600 focus:ring-forest-500" />
                           <span className="text-sm font-bold text-earth-700">Sound Alerts for Queue</span>
                        </label>
                     </div>
                  </div>

               </div>
            </CardContent>
         </Card>

      </div>
    </div>
  );
};

export default StaffSettings;
