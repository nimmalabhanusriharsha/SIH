import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { IndianRupee, Save, Plus, X, Pencil, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  const { state, updateMSP, logActivity } = useAppContext();
  const [isEditing, setIsEditing] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    crop: '',
    price: '',
    unit: 'Quintal',
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: '2027-03-31',
    status: 'Active'
  });

  const crops = state.mspConfig || [];

  const handleEditClick = (cropItem) => {
    setIsEditing(cropItem.id);
    setFormData({
      crop: cropItem.crop,
      price: cropItem.price,
      unit: cropItem.unit,
      effectiveFrom: cropItem.effectiveFrom,
      effectiveTo: cropItem.effectiveTo,
      status: cropItem.status
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({
      crop: '', price: '', unit: 'Quintal', effectiveFrom: new Date().toISOString().split('T')[0], effectiveTo: '2027-03-31', status: 'Active'
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const id = isEditing || `MSP-${Date.now()}`;
    const payload = { ...formData, price: Number(formData.price) };
    
    updateMSP(id, payload);
    logActivity(
      isEditing ? 'MSP Updated' : 'MSP Created',
      `Configured ${formData.crop} MSP at ₹${formData.price}/${formData.unit}`
    );
    
    setSuccessMsg(`Successfully saved MSP for ${formData.crop}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
    handleCancelEdit();
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-farmer-text tracking-tight flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-farmer-primary" />
            Minimum Support Price (MSP) Configuration
          </h2>
          <p className="text-sm font-medium text-farmer-secondary mt-1">Manage global crop procurement rates and enforcement dates.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-farmer-success-light text-farmer-success px-4 py-3 rounded-xl border border-farmer-success/20 font-bold text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {successMsg}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
         
         {/* Configuration Form */}
         <div className="bg-white border border-farmer-border shadow-sm rounded-3xl p-6 md:col-span-1 h-fit">
           <h3 className="font-black text-lg text-farmer-text mb-4 border-b border-farmer-border pb-3 flex items-center justify-between">
             {isEditing ? 'Edit Configuration' : 'Add New Crop'}
             {isEditing && <button onClick={handleCancelEdit} className="text-farmer-secondary hover:text-farmer-text"><X className="w-4 h-4"/></button>}
           </h3>
           
           <form onSubmit={handleSave} className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-farmer-text mb-1">Crop Name</label>
               <input 
                 required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" 
                 value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} 
                 placeholder="e.g. Paddy (Grade A)" 
               />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-farmer-text mb-1">Price (₹)</label>
                 <input 
                   required type="number" min="1" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" 
                   value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                   placeholder="e.g. 2300" 
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-farmer-text mb-1">Unit</label>
                 <select 
                   className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary bg-white"
                   value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                 >
                   <option>Quintal</option>
                   <option>Ton</option>
                   <option>Kg</option>
                 </select>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-farmer-text mb-1">Effective From</label>
                 <input 
                   required type="date" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" 
                   value={formData.effectiveFrom} onChange={e => setFormData({...formData, effectiveFrom: e.target.value})} 
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-farmer-text mb-1">Effective To</label>
                 <input 
                   type="date" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" 
                   value={formData.effectiveTo} onChange={e => setFormData({...formData, effectiveTo: e.target.value})} 
                 />
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-farmer-text mb-1">Status</label>
               <select 
                 className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary bg-white"
                 value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
               >
                 <option>Active</option>
                 <option>Inactive</option>
               </select>
             </div>

             <div className="pt-2">
               <button type="submit" className="w-full bg-farmer-primary hover:bg-farmer-primary-dark text-white rounded-xl font-bold px-4 py-3 text-sm flex items-center justify-center gap-2 shadow-sm transition-colors">
                 <Save className="w-4 h-4" /> {isEditing ? 'Update MSP' : 'Save Configuration'}
               </button>
             </div>
           </form>
         </div>

         {/* Existing Configurations List */}
         <div className="bg-white border border-farmer-border shadow-sm rounded-3xl p-0 overflow-hidden md:col-span-2 flex flex-col">
           <div className="p-6 border-b border-farmer-border bg-farmer-bg/30">
             <h3 className="font-black text-lg text-farmer-text">Active Price Registry</h3>
             <p className="text-xs font-medium text-farmer-secondary">Global enforcement of centralized pricing.</p>
           </div>
           
           <div className="overflow-x-auto flex-1">
             <table className="w-full text-sm text-left">
               <thead className="text-[10px] text-farmer-secondary uppercase tracking-wider border-b border-farmer-border bg-farmer-bg/10">
                  <tr>
                     <th className="px-6 py-4 font-bold">Crop</th>
                     <th className="px-6 py-4 font-bold">Base Price</th>
                     <th className="px-6 py-4 font-bold">Enforcement Period</th>
                     <th className="px-6 py-4 font-bold">Status</th>
                     <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-farmer-border/60">
                  {crops.length > 0 ? crops.map(c => (
                    <tr key={c.id} className="hover:bg-farmer-bg transition-colors">
                       <td className="px-6 py-4">
                         <p className="font-bold text-farmer-text">{c.crop}</p>
                         <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">{c.id}</p>
                       </td>
                       <td className="px-6 py-4">
                         <p className="font-black text-farmer-primary text-base">₹ {c.price}</p>
                         <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">per {c.unit}</p>
                       </td>
                       <td className="px-6 py-4">
                         <p className="font-medium text-farmer-text text-xs">{new Date(c.effectiveFrom).toLocaleDateString()}</p>
                         <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">to {c.effectiveTo ? new Date(c.effectiveTo).toLocaleDateString() : 'Ongoing'}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${c.status === 'Active' ? 'bg-farmer-success-light text-farmer-success border-farmer-success/20' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                           {c.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => handleEditClick(c)}
                           className="inline-flex items-center gap-1.5 bg-white hover:bg-farmer-bg text-farmer-text font-bold text-xs px-3 py-1.5 rounded-lg border border-farmer-border transition-colors"
                         >
                           <Pencil className="w-3.5 h-3.5" /> Edit
                         </button>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-farmer-secondary">
                        <p className="text-sm font-bold text-farmer-text">No MSP configured.</p>
                      </td>
                    </tr>
                  )}
               </tbody>
             </table>
           </div>
         </div>

      </div>
    </div>
  );
};

export default AdminSettings;
