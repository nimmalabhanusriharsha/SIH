import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { User, MapPin, Phone, Hash, Save, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    mobile: currentUser.mobile,
    village: currentUser.village || '',
    district: currentUser.district || '',
    state: currentUser.state || '',
    landArea: currentUser.landArea || '',
    primaryCrop: currentUser.primaryCrop || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, this would update context/backend
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Farmer Profile</h2>
        <p className="text-earth-600 mt-1">Manage your personal details and agricultural information.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <Card className="border-earth-200 shadow-sm bg-gradient-to-b from-forest-900 to-forest-950 text-white overflow-hidden text-center h-full">
            <CardContent className="p-8 flex flex-col items-center justify-center">
               <div className="w-24 h-24 rounded-full bg-forest-700 border-4 border-forest-500 flex items-center justify-center mb-6 shadow-xl relative">
                  <span className="text-4xl font-black text-white">{currentUser.name.charAt(0)}</span>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-forest-900 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
               </div>
               <h3 className="text-2xl font-black">{currentUser.name}</h3>
               <p className="text-forest-300 font-medium mt-1">{currentUser.mobile}</p>
               
               <div className="w-full bg-forest-800/50 rounded-xl p-4 mt-8 border border-forest-700">
                  <p className="text-xs font-bold text-forest-300 uppercase tracking-widest mb-1">Farmer ID (Kisan Card)</p>
                  <p className="text-xl font-mono font-bold tracking-wider">{currentUser.id}</p>
               </div>
               
               <div className="w-full bg-forest-800/50 rounded-xl p-4 mt-4 border border-forest-700">
                  <p className="text-xs font-bold text-forest-300 uppercase tracking-widest mb-1">e-KYC Status</p>
                  <Badge variant="success" className="bg-green-500/20 text-green-300 border-green-500/30 uppercase font-bold text-[10px]">Verified</Badge>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Form */}
        <div className="md:col-span-2">
          <Card className="border-earth-200 shadow-sm h-full">
            <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-row items-center justify-between">
               <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
                 <User className="w-5 h-5 text-forest-600" /> Personal Details
               </CardTitle>
               {!isEditing ? (
                 <Button variant="outline" size="sm" className="font-bold border-earth-300 text-earth-700 bg-white" onClick={() => setIsEditing(true)}>
                   Edit Profile
                 </Button>
               ) : (
                 <Button size="sm" className="font-bold bg-forest-600 hover:bg-forest-700 gap-1" onClick={handleSave}>
                   <Save className="w-4 h-4" /> Save
                 </Button>
               )}
            </CardHeader>
            <CardContent className="p-6 md:p-8">
               <form className="space-y-6">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="text-xs font-bold text-earth-500 uppercase tracking-wider block mb-2">Full Name</label>
                     <Input 
                       value={formData.name} 
                       disabled={!isEditing} 
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className={`font-medium ${!isEditing ? 'bg-earth-50 border-transparent text-earth-900' : 'border-earth-300'}`}
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-earth-500 uppercase tracking-wider block mb-2">Mobile Number</label>
                     <Input 
                       value={formData.mobile} 
                       disabled={true} // Usually can't edit mobile easily
                       className="font-medium bg-earth-50 border-transparent text-earth-900"
                     />
                     <p className="text-[10px] text-earth-400 mt-1 font-medium">* Mobile number is linked to Aadhar</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                     <label className="text-xs font-bold text-earth-500 uppercase tracking-wider block mb-2">Village / Mandal</label>
                     <Input 
                       value={formData.village} 
                       disabled={!isEditing}
                       onChange={(e) => setFormData({...formData, village: e.target.value})}
                       className={`font-medium ${!isEditing ? 'bg-earth-50 border-transparent text-earth-900' : 'border-earth-300'}`}
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-earth-500 uppercase tracking-wider block mb-2">District</label>
                     <Input 
                       value={formData.district} 
                       disabled={!isEditing}
                       onChange={(e) => setFormData({...formData, district: e.target.value})}
                       className={`font-medium ${!isEditing ? 'bg-earth-50 border-transparent text-earth-900' : 'border-earth-300'}`}
                     />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-earth-500 uppercase tracking-wider block mb-2">State</label>
                     <Input 
                       value={formData.state} 
                       disabled={!isEditing}
                       onChange={(e) => setFormData({...formData, state: e.target.value})}
                       className={`font-medium ${!isEditing ? 'bg-earth-50 border-transparent text-earth-900' : 'border-earth-300'}`}
                     />
                   </div>
                 </div>

                 <div className="pt-6 border-t border-earth-100">
                    <h4 className="text-sm font-bold text-forest-900 mb-4">Agricultural Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="text-xs font-bold text-earth-500 uppercase tracking-wider block mb-2">Land Area (Acres)</label>
                         <Input 
                           value={formData.landArea} 
                           disabled={!isEditing}
                           onChange={(e) => setFormData({...formData, landArea: e.target.value})}
                           className={`font-medium ${!isEditing ? 'bg-earth-50 border-transparent text-earth-900' : 'border-earth-300'}`}
                         />
                       </div>
                       <div>
                         <label className="text-xs font-bold text-earth-500 uppercase tracking-wider block mb-2">Primary Crop</label>
                         <Input 
                           value={formData.primaryCrop} 
                           disabled={!isEditing}
                           onChange={(e) => setFormData({...formData, primaryCrop: e.target.value})}
                           className={`font-medium ${!isEditing ? 'bg-earth-50 border-transparent text-earth-900' : 'border-earth-300'}`}
                         />
                       </div>
                    </div>
                 </div>

               </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Profile;
