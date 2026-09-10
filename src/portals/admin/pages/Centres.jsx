import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Search, MapPin, Users, PackageOpen, ArrowRight, Activity, Plus, X, Building, CalendarClock, IndianRupee, MessageSquareWarning } from 'lucide-react';

const AdminCentres = () => {
  const { state, addCentre } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCentreId, setViewCentreId] = useState(null);

  // Add Form State
  const [formData, setFormData] = useState({
    name: '', id: '', state: 'Andhra Pradesh', district: '', mandal: '', village: '',
    contactPerson: '', phone: '', email: '',
    operatingDays: 'Mon-Sat', openTime: '08:00', closeTime: '17:00',
    crops: [], hasCounters: false, numCounters: 3
  });

  const availableCrops = ['Paddy', 'Maize', 'Cotton', 'Wheat', 'Groundnut', 'Sugarcane'];

  const filteredCentres = state.centres.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newCentre = {
      ...formData,
      status: 'Normal',
      capacity: formData.numCounters * 40 || 100, // mock capacity calculation
      activeCounters: formData.hasCounters ? parseInt(formData.numCounters) : 0,
      counters: formData.hasCounters 
        ? Array.from({ length: parseInt(formData.numCounters) }).map((_, i) => `${formData.id}-C${(i+1).toString().padStart(2, '0')}`) 
        : [],
      operatingHours: `${formData.openTime} – ${formData.closeTime}`,
      isActive: true
    };
    addCentre(newCentre);
    setIsAddModalOpen(false);
    setFormData({
      name: '', id: '', state: 'Andhra Pradesh', district: '', mandal: '', village: '',
      contactPerson: '', phone: '', email: '',
      operatingDays: 'Mon-Sat', openTime: '08:00', closeTime: '17:00',
      crops: [], hasCounters: false, numCounters: 3
    });
  };

  const toggleCrop = (crop) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) ? prev.crops.filter(c => c !== crop) : [...prev.crops, crop]
    }));
  };

  // View Details Modal Content
  const selectedCentre = viewCentreId ? state.centres.find(c => c.id === viewCentreId) : null;
  const cQueue = selectedCentre ? state.queue.filter(q => q.centreId === selectedCentre.id && q.status === 'Waiting') : [];
  const cBookings = selectedCentre ? state.bookings.filter(b => b.centreId === selectedCentre.id && b.date === new Date().toISOString().split('T')[0]) : [];
  const cProcurements = selectedCentre ? state.procurements.filter(p => p.centreId === selectedCentre.id && p.status === 'Completed') : [];
  const cPayments = selectedCentre ? state.payments.filter(pay => cProcurements.some(p => p.id === pay.procurementId)) : [];
  const cComplaints = selectedCentre ? (state.feedback || []).filter(cmp => cmp.centreId === selectedCentre.id) : [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-farmer-text tracking-tight">Procurement Centers</h2>
          <p className="text-sm font-medium text-farmer-secondary mt-1">Manage network locations and monitor live operational metrics.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
            <input 
              placeholder="Search centers..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-farmer-border rounded-xl text-sm font-medium text-farmer-text focus:outline-none focus:border-farmer-primary shadow-sm min-h-[44px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-farmer-primary hover:bg-farmer-primary-dark text-white rounded-xl font-bold px-4 py-2 text-sm flex items-center gap-2 shadow-sm transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" /> Add Center
          </button>
        </div>
      </div>

      {/* Grid of Centres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCentres.map(centre => {
           const queue = state.queue.filter(q => q.centreId === centre.id && q.status === 'Waiting');
           const procurements = state.procurements.filter(p => p.centreId === centre.id);
           
           const load = Math.min(100, Math.round((queue.length / (centre.capacity || 100)) * 100));
           const isCritical = load > 80;
           const isBusy = load > 40 && !isCritical;
           const isInactive = centre.isActive === false;

           return (
             <div key={centre.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border ${isInactive ? 'border-gray-200 opacity-80' : isCritical ? 'border-red-200' : 'border-farmer-border'} relative transition-all hover:shadow-md`}>
               {/* Top color bar indicator */}
               <div className={`h-2 w-full ${isInactive ? 'bg-gray-300' : isCritical ? 'bg-red-500' : isBusy ? 'bg-amber-500' : 'bg-farmer-success'}`}></div>
               
               <div className="p-6">
                 <div className="flex justify-between items-start mb-5">
                   <div>
                     <h3 className="font-black text-lg text-farmer-text leading-tight mb-1">{centre.name}</h3>
                     <p className="text-xs font-bold text-farmer-secondary flex items-center gap-1">
                       <MapPin className="w-3 h-3 text-farmer-primary" /> {centre.district} • {centre.id}
                     </p>
                   </div>
                   <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider shrink-0 ${isInactive ? 'bg-gray-100 text-gray-600 border-gray-300' : isCritical ? 'bg-red-50 text-red-700 border-red-200' : isBusy ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-farmer-success-light text-farmer-success border-farmer-success/20'}`}>
                     {isInactive ? 'Inactive' : isCritical ? 'High Load' : isBusy ? 'Moderate' : 'Active'}
                   </span>
                 </div>
                 
                 <div className="space-y-5">
                   {/* Utilization Bar */}
                   <div>
                     <div className="flex justify-between text-[10px] font-bold text-farmer-secondary uppercase tracking-widest mb-1.5">
                       <span>Utilization Load</span>
                       <span className={isCritical ? 'text-red-600' : 'text-farmer-text'}>{load}%</span>
                     </div>
                     <div className="w-full h-2 bg-farmer-bg rounded-full overflow-hidden border border-farmer-border/50">
                       <div 
                         className={`h-full rounded-full ${isInactive ? 'bg-gray-400' : isCritical ? 'bg-red-500' : isBusy ? 'bg-amber-500' : 'bg-farmer-success'}`}
                         style={{ width: `${load}%` }}
                       />
                     </div>
                   </div>
                   
                   {/* Stats Grid */}
                   <div className="grid grid-cols-2 gap-4 py-4 border-y border-farmer-border/60">
                     <div>
                       <p className="text-[10px] uppercase tracking-widest text-farmer-secondary font-bold mb-1">Live Queue</p>
                       <p className="text-2xl font-black text-farmer-text flex items-baseline gap-1.5">
                         {queue.length} <span className="text-[10px] font-bold text-farmer-secondary bg-farmer-bg px-1.5 py-0.5 rounded border border-farmer-border uppercase tracking-wider">Waiting</span>
                       </p>
                     </div>
                     <div>
                       <p className="text-[10px] uppercase tracking-widest text-farmer-secondary font-bold mb-1">Avg Wait</p>
                       <p className="text-2xl font-black text-farmer-text flex items-baseline gap-1.5">
                         {queue.length > 0 ? (isCritical ? '45+' : '25') : '0'} <span className="text-xs font-bold text-farmer-secondary">min</span>
                       </p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="bg-farmer-bg rounded-xl p-3 border border-farmer-border">
                        <Users className="w-4 h-4 mx-auto mb-1.5 text-farmer-primary" />
                        <p className="font-black text-farmer-text text-sm">{state.bookings.filter(b => b.centreId === centre.id).length}</p>
                        <p className="text-[9px] font-bold text-farmer-secondary uppercase mt-0.5">Bookings</p>
                      </div>
                      <div className="bg-farmer-bg rounded-xl p-3 border border-farmer-border">
                        <PackageOpen className="w-4 h-4 mx-auto mb-1.5 text-farmer-success" />
                        <p className="font-black text-farmer-text text-sm">{procurements.length}</p>
                        <p className="text-[9px] font-bold text-farmer-secondary uppercase mt-0.5">Procured</p>
                      </div>
                      <div className="bg-farmer-bg rounded-xl p-3 border border-farmer-border">
                        <Activity className="w-4 h-4 mx-auto mb-1.5 text-farmer-accent" />
                        <p className="font-black text-farmer-text text-sm">{centre.activeCounters || 0}</p>
                        <p className="text-[9px] font-bold text-farmer-secondary uppercase mt-0.5">Counters</p>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => setViewCentreId(centre.id)}
                     className="w-full justify-center font-bold text-sm text-farmer-primary hover:text-farmer-primary-dark hover:bg-farmer-primary-light py-3 rounded-xl transition-colors flex items-center"
                   >
                     View Complete Details <ArrowRight className="w-4 h-4 ml-2" />
                   </button>
                 </div>
               </div>
             </div>
           );
        })}
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedCentre && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            
            <div className="px-6 py-4 border-b border-farmer-border flex items-center justify-between bg-farmer-card">
              <div>
                <h3 className="font-black text-xl text-farmer-text">{selectedCentre.name}</h3>
                <p className="text-xs font-bold text-farmer-secondary mt-0.5">{selectedCentre.id} • {selectedCentre.district}, {selectedCentre.state}</p>
              </div>
              <button onClick={() => setViewCentreId(null)} className="p-2 hover:bg-farmer-bg rounded-xl text-farmer-secondary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-farmer-bg/30">
              
              {/* Top Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-farmer-border shadow-sm">
                  <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest mb-4 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Center Info</h4>
                  <div className="space-y-3 text-sm">
                    <p className="flex justify-between border-b border-farmer-border pb-1"><span className="text-farmer-secondary font-bold">Location</span><span className="font-medium text-farmer-text">{selectedCentre.village || selectedCentre.district}, {selectedCentre.mandal}</span></p>
                    <p className="flex justify-between border-b border-farmer-border pb-1"><span className="text-farmer-secondary font-bold">Contact Person</span><span className="font-medium text-farmer-text">{selectedCentre.contactPerson || 'N/A'}</span></p>
                    <p className="flex justify-between border-b border-farmer-border pb-1"><span className="text-farmer-secondary font-bold">Phone</span><span className="font-medium text-farmer-text">{selectedCentre.phone || 'N/A'}</span></p>
                    <p className="flex justify-between"><span className="text-farmer-secondary font-bold">Operating Hours</span><span className="font-medium text-farmer-text">{selectedCentre.operatingHours}</span></p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-farmer-border shadow-sm">
                  <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest mb-4 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Operations Setup</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-farmer-secondary mb-1.5">Supported Crops</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCentre.crops || []).map(c => <span key={c} className="bg-farmer-primary-light text-farmer-primary text-[10px] font-black px-2 py-1 rounded-md">{c}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-farmer-secondary mb-1.5">Active Counters ({selectedCentre.activeCounters})</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCentre.counters || Array.from({length: selectedCentre.activeCounters || 3}).map((_,i)=>`${selectedCentre.id}-C0${i+1}`)).map(c => 
                          <span key={c} className="bg-farmer-bg border border-farmer-border text-farmer-text text-[10px] font-black px-2 py-1 rounded-md font-mono">{c}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-farmer-border shadow-sm text-center">
                  <CalendarClock className="w-5 h-5 mx-auto mb-2 text-farmer-primary" />
                  <p className="text-3xl font-black text-farmer-text">{cBookings.length}</p>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-widest mt-1">Today's Bookings</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-farmer-border shadow-sm text-center">
                  <Users className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                  <p className="text-3xl font-black text-farmer-text">{cQueue.length}</p>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-widest mt-1">Current Queue</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-farmer-border shadow-sm text-center">
                  <PackageOpen className="w-5 h-5 mx-auto mb-2 text-farmer-success" />
                  <p className="text-3xl font-black text-farmer-text">{cProcurements.length}</p>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-widest mt-1">Completed Trades</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-farmer-border shadow-sm text-center">
                  <IndianRupee className="w-5 h-5 mx-auto mb-2 text-farmer-success" />
                  <p className="text-xl font-black text-farmer-text mt-2 flex justify-center items-baseline"><span className="text-xs mr-0.5">₹</span>{(cPayments.reduce((acc, p) => acc + p.amount, 0)/100000).toFixed(2)}L</p>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-widest mt-1">Settled Value</p>
                </div>
              </div>

              {/* Complaints & Processing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-farmer-border shadow-sm">
                  <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest mb-4 flex items-center gap-1.5"><MessageSquareWarning className="w-3.5 h-3.5" /> Complaints Overview</h4>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <p className="text-3xl font-black text-red-500">{cComplaints.filter(c=>c.status === 'Open').length}</p>
                      <p className="text-[10px] font-bold text-farmer-secondary uppercase">Open</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-farmer-success">{cComplaints.filter(c=>c.status === 'Resolved').length}</p>
                      <p className="text-[10px] font-bold text-farmer-secondary uppercase">Resolved</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-farmer-border shadow-sm">
                  <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest mb-4 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Performance Metrics</h4>
                  <div className="space-y-3">
                     <p className="flex justify-between items-center"><span className="text-xs font-bold text-farmer-secondary">Avg Waiting Time</span> <span className="font-black text-farmer-text">~25 min</span></p>
                     <div className="w-full h-1 bg-farmer-bg rounded-full overflow-hidden"><div className="h-full bg-amber-400 w-1/3"></div></div>
                     
                     <p className="flex justify-between items-center pt-2"><span className="text-xs font-bold text-farmer-secondary">Avg Processing Time</span> <span className="font-black text-farmer-text">12 min/trade</span></p>
                     <div className="w-full h-1 bg-farmer-bg rounded-full overflow-hidden"><div className="h-full bg-farmer-success w-1/4"></div></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADD CENTRE MODAL FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            <div className="px-6 py-4 border-b border-farmer-border flex items-center justify-between bg-farmer-card">
              <h3 className="font-black text-xl text-farmer-text flex items-center gap-2">
                <Plus className="w-5 h-5 text-farmer-primary" /> Add Procurement Center
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-farmer-bg rounded-xl text-farmer-secondary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-farmer-bg/20">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest border-b border-farmer-border pb-2">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Center Name</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Godavari Procurement" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Center ID</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary font-mono" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toUpperCase()})} placeholder="e.g. C006" />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest border-b border-farmer-border pb-2">Location Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">State</label>
                    <input disabled type="text" className="w-full border border-farmer-border bg-farmer-bg rounded-xl px-4 py-2.5 text-sm" value={formData.state} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">District</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Mandal</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.mandal} onChange={e => setFormData({...formData, mandal: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Village</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Contact & Operations */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest border-b border-farmer-border pb-2">Contact & Operations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Contact Person</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Phone</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Email (Optional)</label>
                    <input type="email" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Operating Days</label>
                    <input required type="text" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.operatingDays} onChange={e => setFormData({...formData, operatingDays: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Opening Time</label>
                    <input required type="time" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-farmer-text mb-1">Closing Time</label>
                    <input required type="time" className="w-full border border-farmer-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Crops & Counters */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest border-b border-farmer-border pb-2">Configuration</h4>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-farmer-text mb-2">Supported Crops</label>
                  <div className="flex flex-wrap gap-2">
                    {availableCrops.map(crop => (
                      <button 
                        key={crop} type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${formData.crops.includes(crop) ? 'bg-farmer-primary text-white border-farmer-primary' : 'bg-white text-farmer-secondary border-farmer-border hover:bg-farmer-bg'}`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-farmer-border p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-farmer-primary focus:ring-farmer-primary" checked={formData.hasCounters} onChange={e => setFormData({...formData, hasCounters: e.target.checked})} />
                      <span className="text-sm font-bold text-farmer-text">Enable Internal Counters</span>
                    </label>
                    <p className="text-[10px] text-farmer-secondary mt-1">If enabled, unique Counter IDs will be auto-generated.</p>
                  </div>
                  
                  {formData.hasCounters && (
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-farmer-text shrink-0">Number of Counters:</label>
                      <input type="number" min="1" max="10" className="w-20 border border-farmer-border rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-farmer-primary" value={formData.numCounters} onChange={e => setFormData({...formData, numCounters: e.target.value})} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-farmer-border">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-farmer-text hover:bg-farmer-bg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={!formData.id || !formData.name || formData.crops.length===0} className="bg-farmer-primary hover:bg-farmer-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors">
                  Add Center
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCentres;
