import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, PackageOpen, Download, Building2 } from 'lucide-react';

const AdminProcurement = () => {
  const { state } = useAppContext();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Advanced Filters State
  const [filters, setFilters] = useState({
    state: 'Andhra Pradesh',
    district: '',
    centreId: '',
    startDate: '',
    endDate: '',
    crop: '',
    farmerId: '',
    search: ''
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      state: 'Andhra Pradesh', district: '', centreId: '', startDate: '', endDate: '', crop: '', farmerId: '', search: ''
    });
    setCurrentPage(1);
  };

  const mspConfig = state.mspConfig || [];

  // Enhance procurements with farmer/centre details and DYNAMIC MSP calculation
  const enhancedProcurements = state.procurements.map(proc => {
    const farmer = state.farmers.find(f => f.id === proc.farmerId) || {};
    const centre = state.centres.find(c => c.id === proc.centreId) || {};
    
    // Core Requirement: Do not hardcode MSP. Use centralized configuration.
    const cropMSP = mspConfig.find(m => m.crop === proc.crop)?.price || proc.rate || 0;
    const computedAmount = (proc.quantity || 0) * cropMSP;

    return { 
      ...proc, 
      farmerName: farmer.name, 
      centreName: centre.name, 
      district: centre.district || farmer.district,
      cropMSP,
      computedAmount
    };
  });

  // Apply Advanced Filters
  const filteredProcurements = enhancedProcurements.filter(proc => {
    let keep = true;
    
    // Quick Search
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const matchesSearch = 
        proc.id.toLowerCase().includes(s) ||
        (proc.farmerName && proc.farmerName.toLowerCase().includes(s)) ||
        (proc.centreName && proc.centreName.toLowerCase().includes(s));
      if (!matchesSearch) keep = false;
    }

    if (filters.district && proc.district && !proc.district.toLowerCase().includes(filters.district.toLowerCase())) keep = false;
    if (filters.centreId && proc.centreId && proc.centreId !== filters.centreId) keep = false;
    if (filters.crop && proc.crop && !proc.crop.toLowerCase().includes(filters.crop.toLowerCase())) keep = false;
    if (filters.farmerId && proc.farmerId && proc.farmerId !== filters.farmerId) keep = false;
    
    const itemDate = proc.date;
    if (itemDate) {
      const d = new Date(itemDate).getTime();
      if (filters.startDate && d < new Date(filters.startDate).getTime()) keep = false;
      if (filters.endDate && d > new Date(filters.endDate).getTime()) keep = false;
    }

    return keep;
  });

  const totalPages = Math.ceil(filteredProcurements.length / itemsPerPage);
  const currentProcurements = filteredProcurements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalProcured = filteredProcurements.filter(p => p.status === 'Completed').reduce((acc, p) => acc + (p.quantity || 0), 0);
  const totalValue = filteredProcurements.filter(p => p.status === 'Completed').reduce((acc, p) => acc + (p.computedAmount || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-farmer-text tracking-tight">Procurement Intelligence</h2>
          <p className="text-sm font-medium text-farmer-secondary mt-1">Deep-dive filtering and dynamic valuation based on central MSP.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
            <input 
              name="search"
              placeholder="Quick search by ID, Farmer, Center..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-farmer-border rounded-xl text-sm font-medium text-farmer-text focus:outline-none focus:border-farmer-primary shadow-sm min-h-[44px]"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <button className="hidden md:flex bg-white hover:bg-farmer-bg text-farmer-text font-bold border border-farmer-border px-4 py-2 rounded-xl text-sm items-center gap-2 transition-colors min-h-[44px] shadow-sm">
            <Download className="w-4 h-4" /> Export Filtered
          </button>
        </div>
      </div>

      {/* ADVANCED FILTER PANEL */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-farmer-border">
        <h3 className="font-black text-sm text-farmer-text mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-farmer-border pb-3">
          <Filter className="w-4 h-4 text-farmer-primary" /> Advanced Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">State</label>
            <input type="text" disabled className="w-full border border-farmer-border bg-farmer-bg rounded-xl px-3 py-2 text-sm text-farmer-text" value={filters.state} />
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">District</label>
            <input name="district" value={filters.district} onChange={handleFilterChange} type="text" placeholder="e.g. West Godavari" className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">Center ID</label>
            <input name="centreId" value={filters.centreId} onChange={handleFilterChange} type="text" placeholder="e.g. C001" className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">Farmer ID</label>
            <input name="farmerId" value={filters.farmerId} onChange={handleFilterChange} type="text" placeholder="e.g. KIS-..." className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">Crop</label>
            <input name="crop" value={filters.crop} onChange={handleFilterChange} type="text" placeholder="e.g. Paddy" className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">Date From</label>
            <input name="startDate" value={filters.startDate} onChange={handleFilterChange} type="date" className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">Date To</label>
            <input name="endDate" value={filters.endDate} onChange={handleFilterChange} type="date" className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div className="flex items-end">
             <button onClick={clearFilters} className="w-full bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold px-4 py-2 rounded-xl text-sm border border-farmer-border transition-colors h-10">
               Clear Filters
             </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-farmer-border">
          <p className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest">Matched Procurements</p>
          <h3 className="text-3xl font-black text-farmer-text mt-2">{filteredProcurements.length}</h3>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-farmer-border">
          <p className="text-[10px] font-black text-farmer-secondary uppercase tracking-widest">Total Matched Quantity</p>
          <h3 className="text-3xl font-black text-farmer-text mt-2">{totalProcured.toLocaleString()} Q</h3>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-farmer-primary bg-farmer-primary-light/30">
          <p className="text-[10px] font-black text-farmer-primary uppercase tracking-widest flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5"/> Dynamic Total Value (via MSP)</p>
          <h3 className="text-3xl font-black text-farmer-primary mt-2">₹ {totalValue.toLocaleString()}</h3>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-farmer-border shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-farmer-secondary uppercase tracking-wider border-b border-farmer-border bg-farmer-bg/30">
               <tr>
                  <th className="px-6 py-4 font-bold">Procurement ID & Date</th>
                  <th className="px-6 py-4 font-bold">Farmer Profile</th>
                  <th className="px-6 py-4 font-bold">Center Location</th>
                  <th className="px-6 py-4 font-bold">Crop & Dynamic Rate</th>
                  <th className="px-6 py-4 font-bold">Calculated Value</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-farmer-border/60">
               {currentProcurements.length > 0 ? (
                 currentProcurements.map(proc => {
                   
                   let badgeClass = 'bg-farmer-bg text-farmer-text border-farmer-border';
                   if (proc.status === 'Completed') badgeClass = 'bg-farmer-success-light text-farmer-success border-farmer-success/20';
                   if (proc.status === 'Pending') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

                   return (
                     <tr key={proc.id} className="hover:bg-farmer-bg transition-colors">
                        <td className="px-6 py-4 align-top">
                           <p className="font-black text-farmer-text mb-0.5">{proc.id}</p>
                           <p className="text-[10px] font-bold text-farmer-secondary">
                             {new Date(proc.date || new Date()).toLocaleDateString()}
                           </p>
                        </td>
                        <td className="px-6 py-4 align-top">
                           <p className="font-bold text-farmer-text">{proc.farmerName}</p>
                           <p className="text-[10px] font-bold text-farmer-secondary">{proc.farmerId}</p>
                        </td>
                        <td className="px-6 py-4 align-top">
                           <p className="font-bold text-farmer-text">{proc.centreName}</p>
                           <p className="text-[10px] font-bold text-farmer-secondary">{proc.district} • {proc.centreId}</p>
                        </td>
                        <td className="px-6 py-4 align-top">
                           <p className="font-black text-farmer-primary text-base">{proc.quantity} Q</p>
                           <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">{proc.crop} @ ₹{proc.cropMSP}/Q</p>
                        </td>
                        <td className="px-6 py-4 align-top">
                           <p className="font-black text-farmer-text bg-farmer-primary-light/50 px-2.5 py-1 rounded-lg inline-block border border-farmer-primary/20">₹ {proc.computedAmount?.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 align-top">
                           <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${badgeClass}`}>
                             {proc.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 align-top text-right">
                           <button className="inline-flex items-center gap-1.5 bg-white hover:bg-farmer-primary-light text-farmer-text font-bold text-xs px-3 py-1.5 rounded-lg border border-farmer-border transition-colors">
                             <Eye className="w-3.5 h-3.5" /> View
                           </button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="7" className="px-6 py-16 text-center text-farmer-secondary">
                     <PackageOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     <p className="text-sm font-bold text-farmer-text">No procurements match your filters</p>
                     <p className="text-xs">Adjust your search criteria.</p>
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-farmer-border flex items-center justify-between bg-farmer-bg/30">
            <p className="text-xs text-farmer-secondary font-bold">
              Showing <span className="text-farmer-text">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-farmer-text">{Math.min(currentPage * itemsPerPage, filteredProcurements.length)}</span> of <span className="text-farmer-text">{filteredProcurements.length}</span> records
            </p>
            <div className="flex items-center gap-2">
              <button 
                className="bg-white border border-farmer-border hover:bg-farmer-bg text-farmer-text p-1.5 rounded-lg transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-xs font-black text-farmer-text px-2">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                className="bg-white border border-farmer-border hover:bg-farmer-bg text-farmer-text p-1.5 rounded-lg transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminProcurement;
