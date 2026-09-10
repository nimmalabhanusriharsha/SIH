import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Search, Filter, Download, FileText, Calendar, MapPin, PackageOpen, Building, CheckCircle2 } from 'lucide-react';
import { CROPS_CATALOGUE, getLocalizedCropName } from '../../farmer/data/crops';

const AdminReports = () => {
  const { state } = useAppContext();
  const { t, currentLang } = useTranslation();
  const [successMsg, setSuccessMsg] = useState('');

  const [filters, setFilters] = useState({
    state: 'Andhra Pradesh',
    district: '',
    centreId: '',
    startDate: '',
    endDate: '',
    crop: '',
    farmerId: ''
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      state: 'Andhra Pradesh', district: '', centreId: '', startDate: '', endDate: '', crop: '', farmerId: ''
    });
  };

  const datasets = [
    { id: 'bookings', name: 'Bookings Report', desc: 'Detailed list of farmer slot bookings', icon: Calendar },
    { id: 'procurements', name: 'Procurements Report', desc: 'Records of all completed crop intakes', icon: PackageOpen },
    { id: 'payments', name: 'Payments Report', desc: 'Settlement details and transaction history', icon: FileText },
    { id: 'farmers', name: 'Farmers Directory', desc: 'Registered farmers and their demographics', icon: Search },
    { id: 'centres', name: 'Centers Directory', desc: 'List of all procurement centers and capacities', icon: Building },
    { id: 'staff', name: 'Staff Directory', desc: 'Active procurement staff records', icon: Search },
    { id: 'complaints', name: 'Complaints Log', desc: 'Grievances filed and resolution status', icon: FileText }
  ];

  const exportCSV = (datasetId) => {
    // 1. Fetch raw data
    let dataToExport = [];
    if (datasetId === 'farmers') dataToExport = state.farmers || [];
    if (datasetId === 'bookings') dataToExport = state.bookings || [];
    if (datasetId === 'procurements') dataToExport = state.procurements || [];
    if (datasetId === 'payments') dataToExport = state.payments || [];
    if (datasetId === 'centres') dataToExport = state.centres || [];
    if (datasetId === 'staff') dataToExport = state.staff || [];
    if (datasetId === 'complaints') dataToExport = state.feedback || [];

    // 2. Apply filters (basic filtering logic applicable to common fields)
    const filteredData = dataToExport.filter(item => {
      let keep = true;
      if (filters.district && item.district && !item.district.toLowerCase().includes(filters.district.toLowerCase())) keep = false;
      if (filters.centreId && item.centreId && item.centreId !== filters.centreId) keep = false;
      
      if (filters.crop) {
        const cropObj = CROPS_CATALOGUE.find(c => c.id === filters.crop || c.name.toLowerCase() === filters.crop.toLowerCase());
        const selectedEn = cropObj ? cropObj.name.toLowerCase() : filters.crop.toLowerCase();
        const selectedTe = cropObj ? cropObj.teluguName.toLowerCase() : selectedEn;
        const itemCrop = (item.crop || item.commodity || '').toLowerCase();
        
        if (!itemCrop.includes(selectedEn) && !itemCrop.includes(selectedTe) && itemCrop !== filters.crop.toLowerCase()) {
          keep = false;
        }
      }

      if (filters.farmerId && item.farmerId && item.farmerId !== filters.farmerId) keep = false;
      
      // Date range logic (assuming item has 'date' or 'createdAt')
      const itemDate = item.date || item.createdAt || item.timestamp;
      if (itemDate) {
        const d = new Date(itemDate).getTime();
        if (filters.startDate && d < new Date(filters.startDate).getTime()) keep = false;
        if (filters.endDate && d > new Date(filters.endDate).getTime()) keep = false;
      }
      return keep;
    });

    if (filteredData.length === 0) {
      alert("No data matches the selected filters for this report.");
      return;
    }

    // 3. Convert to CSV
    const headers = Object.keys(filteredData[0]);
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add header row

    for (const row of filteredData) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val || '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    
    // 4. Trigger Download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${datasetId}_report_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setSuccessMsg(`Successfully exported ${filteredData.length} records to CSV.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-farmer-text tracking-tight">Data & Reports</h2>
          <p className="text-sm font-medium text-farmer-secondary mt-1">Generate and export filtered official records.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-farmer-success-light text-farmer-success px-4 py-3 rounded-xl border border-farmer-success/20 font-bold text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {successMsg}
        </div>
      )}

      {/* FILTER PANEL */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-farmer-border">
        <h3 className="font-black text-sm text-farmer-text mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-farmer-border pb-3">
          <Filter className="w-4 h-4 text-farmer-primary" /> Master Filter Configuration
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
            <select
              name="crop"
              value={filters.crop}
              onChange={handleFilterChange}
              className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary bg-white cursor-pointer font-bold"
            >
              <option value="">{currentLang === 'te' ? 'అన్ని పంటలు (All Crops)' : 'All Crops'}</option>
              {CROPS_CATALOGUE.map(c => (
                <option key={c.id} value={c.id}>
                  {currentLang === 'te' ? c.teluguName : c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">Start Date</label>
            <input name="startDate" value={filters.startDate} onChange={handleFilterChange} type="date" className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold text-farmer-secondary mb-1">End Date</label>
            <input name="endDate" value={filters.endDate} onChange={handleFilterChange} type="date" className="w-full border border-farmer-border rounded-xl px-3 py-2 text-sm text-farmer-text focus:outline-none focus:border-farmer-primary" />
          </div>
          <div className="flex items-end">
             <button onClick={clearFilters} className="w-full bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold px-4 py-2 rounded-xl text-sm border border-farmer-border transition-colors">
               Clear Filters
             </button>
          </div>
        </div>
        
        <div className="mt-4 text-[10px] text-farmer-secondary font-medium italic">
          * Filters applied here will strictly restrict the data exported in the reports below. Empty filters are ignored. Bank and sensitive details are masked securely by default in the system state.
        </div>
      </div>

      {/* DATASETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {datasets.map(dataset => (
          <div key={dataset.id} className="bg-white rounded-2xl p-5 shadow-sm border border-farmer-border flex flex-col justify-between hover:border-farmer-primary hover:shadow-md transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-farmer-bg flex items-center justify-center mb-4 border border-farmer-border group-hover:bg-farmer-primary-light transition-colors">
                <dataset.icon className="w-5 h-5 text-farmer-primary" />
              </div>
              <h4 className="font-black text-farmer-text mb-1">{dataset.name}</h4>
              <p className="text-xs font-medium text-farmer-secondary line-clamp-2 leading-relaxed">
                {dataset.desc}
              </p>
            </div>
            
            <button 
              onClick={() => exportCSV(dataset.id)}
              className="mt-6 w-full bg-farmer-bg group-hover:bg-farmer-primary text-farmer-text group-hover:text-white border border-farmer-border group-hover:border-farmer-primary py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminReports;
