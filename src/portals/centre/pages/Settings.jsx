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
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="mb-6">
        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">PROCUREMENT CENTRE</p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Settings</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage your profile and centre preferences.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         
         {/* STAFF PROFILE */}
         <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 py-4 px-6">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e6f4ea] flex items-center justify-center shrink-0">
                  <div className="w-5.5 h-5.5 rounded-lg bg-[#046a38] text-white flex items-center justify-center shadow-xs">
                    <User className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                Staff Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Full Name</label>
                  <Input defaultValue={currentUser?.name} className="font-bold border-slate-200 bg-slate-50 rounded-xl" disabled />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Staff ID</label>
                  <Input defaultValue={currentUser?.id} className="font-bold border-slate-200 bg-slate-50 rounded-xl" disabled />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Mobile Number</label>
                  <Input defaultValue={currentUser?.mobile || '+91 9876543210'} className="font-bold border-slate-200 focus:border-[#046a38] rounded-xl" />
               </div>
               <Button className="w-full font-bold bg-[#046a38] hover:bg-[#03522c] text-white rounded-xl shadow-xs cursor-pointer">
                  <Save className="w-4 h-4 mr-2" /> Update Profile
               </Button>
            </CardContent>
         </Card>

         {/* CENTRE INFO */}
         <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 py-4 px-6">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e6f4ea] flex items-center justify-center shrink-0">
                  <div className="w-5.5 h-5.5 rounded-lg bg-[#046a38] text-white flex items-center justify-center shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                Centre Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Centre Name</label>
                  <Input defaultValue={centre?.name} className="font-bold border-slate-200 bg-slate-50 rounded-xl" disabled />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Centre ID</label>
                    <Input defaultValue={centre?.id} className="font-bold border-slate-200 bg-slate-50 rounded-xl" disabled />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Capacity</label>
                    <Input defaultValue={centre?.capacity + ' Q'} className="font-bold border-slate-200 bg-slate-50 rounded-xl" disabled />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">District / State</label>
                  <Input defaultValue={`${centre?.district}, ${centre?.state}`} className="font-bold border-slate-200 bg-slate-50 rounded-xl" disabled />
               </div>
            </CardContent>
         </Card>

         {/* PREFERENCES */}
         <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden md:col-span-2">
            <CardHeader className="bg-slate-50/60 border-b border-slate-100 py-4 px-6">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e6f4ea] flex items-center justify-center shrink-0">
                  <div className="w-5.5 h-5.5 rounded-lg bg-[#046a38] text-white flex items-center justify-center shadow-xs">
                    <Bell className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="grid md:grid-cols-2 gap-8">
                  
                  <div className="space-y-4">
                     <h3 className="font-bold text-slate-900 flex items-center gap-2"><Globe className="w-4 h-4 text-[#046a38]"/> System Language</h3>
                     <div className="flex gap-3">
                        <button className="flex-1 py-2.5 rounded-xl border-2 border-[#046a38] bg-[#e6f4ea] text-[#046a38] font-bold text-xs cursor-pointer">English</button>
                        <button className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer">हिंदी</button>
                        <button className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer">తెలుగు</button>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="font-bold text-slate-900">Notifications</h3>
                     <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#046a38] focus:ring-[#046a38]" />
                           <span className="text-xs font-bold text-slate-700">Push Notifications</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#046a38] focus:ring-[#046a38]" />
                           <span className="text-xs font-bold text-slate-700">Sound Alerts for Queue</span>
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
