import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, Eye, IndianRupee, Download, Building, CreditCard, ChevronDown, X, Check, Loader2 } from 'lucide-react';
import { maskBankAccount } from '../../farmer/data/masterFarmers';

const AdminPayments = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Independent Filters State (NO cascading logic)
  const [filters, setFilters] = useState({
    farmerId: '',
    centre: '',
    status: '',
    state: '',
    district: '',
    date: '',
    crop: ''
  });

  // Enhance procurements with farmer and centre details to generate payments list
  const allPaymentsTracked = useMemo(() => {
    const procurements = state.procurements || [];
    return procurements
      .filter(p => p.status === 'Completed' || p.status === 'Pending' || p.status === 'Arrived')
      .map(proc => {
        const farmer = (state.farmers || []).find(f => f.id === proc.farmerId || f.farmerId === proc.farmerId) || {};
        const centre = (state.centres || []).find(c => c.id === proc.centreId || c.name === proc.centreName) || {};
        
        // Look for persistent payment record
        const paymentRecord = (state.payments || []).find(pay => pay.procurementId === proc.id || pay.bookingId === proc.bookingId);
        
        let paymentStatus = paymentRecord?.status || paymentRecord?.paymentStatus || proc.paymentStatus || 'Pending';
        let txRef = paymentRecord?.transactionId || paymentRecord?.transactionRef || proc.transactionRef || '---';

        // Ensure bank details are masked
        const bankAccount = farmer.bankAccount ? maskBankAccount(farmer.bankAccount) : 'XXXX XXXX 4589';

        const paymentDate = paymentRecord?.date || proc.date || new Date().toISOString().split('T')[0];

        return {
          id: paymentRecord?.id || `PAY-${proc.id?.replace(/^(PRC-|BK-)/, '') || Date.now().toString().slice(-6)}`,
          procurementId: proc.id || 'PRC-1001',
          bookingId: proc.bookingId || 'BK-1001',
          farmerId: farmer.id || farmer.farmerId || proc.farmerId || 'KIS-7F29A81C',
          farmerName: farmer.name || proc.farmerName || 'Ramesh Kumar',
          state: farmer.state || centre.state || 'Andhra Pradesh',
          district: farmer.district || centre.district || 'West Godavari',
          centreId: centre.id || proc.centreId || 'C001',
          centreName: centre.name || proc.centreName || 'Sri Lakshmi Procurement Centre',
          crop: proc.crop || 'Paddy (Rice)',
          date: paymentDate.split('T')[0],
          amount: proc.totalAmount || proc.amount || Math.round((proc.actualQuantity || proc.quantity || 450) * (proc.rate || 23.69)),
          status: paymentStatus, 
          txRef,
          updatedAt: paymentDate,
          bankAccount,
          ifsc: farmer.ifsc || 'SBIN0001234'
        };
      });
  }, [state]);

  // Independent Filter Options derived directly from full dataset & state.centres (NO cascading dependence)
  const availableCentres = useMemo(() => {
    const fromCentres = (state.centres || []).map(c => c.name);
    const fromPayments = allPaymentsTracked.map(p => p.centreName);
    return [...new Set([...fromCentres, ...fromPayments])].filter(Boolean).sort();
  }, [state.centres, allPaymentsTracked]);

  const availableFarmers = useMemo(() => {
    return [...new Set(allPaymentsTracked.map(p => p.farmerId))].filter(Boolean).sort();
  }, [allPaymentsTracked]);

  const availableStates = useMemo(() => {
    return [...new Set(allPaymentsTracked.map(p => p.state))].filter(Boolean).sort();
  }, [allPaymentsTracked]);

  const availableDistricts = useMemo(() => {
    return [...new Set(allPaymentsTracked.map(p => p.district))].filter(Boolean).sort();
  }, [allPaymentsTracked]);

  const availableDates = useMemo(() => {
    return [...new Set(allPaymentsTracked.map(p => p.date))].filter(Boolean).sort();
  }, [allPaymentsTracked]);

  const availableCrops = useMemo(() => {
    return [...new Set(allPaymentsTracked.map(p => p.crop))].filter(Boolean).sort();
  }, [allPaymentsTracked]);

  const availableStatuses = ['Completed', 'Paid', 'Pending', 'Processing', 'Initiated', 'Failed', 'Not Initiated'];

  // Apply Independent Filters & Search Term
  const filteredPayments = useMemo(() => {
    return allPaymentsTracked.filter(pay => {
      // 1. Farmer ID filter (matches exact or partial ID/name)
      if (filters.farmerId) {
        const queryFid = filters.farmerId.trim().toLowerCase();
        const fidMatch = pay.farmerId.toLowerCase().includes(queryFid);
        const fnameMatch = pay.farmerName.toLowerCase().includes(queryFid);
        if (!fidMatch && !fnameMatch) return false;
      }

      // 2. Select Centre filter
      if (filters.centre && pay.centreName !== filters.centre && pay.centreId !== filters.centre) {
        return false;
      }

      // 3. Payment Status filter
      if (filters.status && pay.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // 4. State filter
      if (filters.state && pay.state !== filters.state) return false;

      // 5. District filter
      if (filters.district && pay.district !== filters.district) return false;

      // 6. Date filter
      if (filters.date && pay.date !== filters.date) return false;

      // 7. Crop filter
      if (filters.crop && pay.crop !== filters.crop) return false;

      // 8. Global search query
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchId = pay.id.toLowerCase().includes(q);
        const matchProc = pay.procurementId.toLowerCase().includes(q);
        const matchFarmerName = pay.farmerName.toLowerCase().includes(q);
        const matchFarmerId = pay.farmerId.toLowerCase().includes(q);
        const matchTx = pay.txRef.toLowerCase().includes(q);
        const matchCentre = pay.centreName.toLowerCase().includes(q);

        if (!matchId && !matchProc && !matchFarmerName && !matchFarmerId && !matchTx && !matchCentre) {
          return false;
        }
      }

      return true;
    });
  }, [allPaymentsTracked, filters, searchTerm]);

  // Handle Independent Filter Change (modifies only specified field, NO cascading clearing)
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all active filters
  const clearFilters = () => {
    setFilters({
      farmerId: '',
      centre: '',
      status: '',
      state: '',
      district: '',
      date: '',
      crop: ''
    });
    setSearchTerm('');
  };

  // Fully functional CSV Export that respects currently active filters
  const handleExportCSV = () => {
    if (filteredPayments.length === 0) {
      setToastMsg('No records available to export.');
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    setIsExporting(true);

    try {
      const headers = [
        'Payment ID',
        'Procurement ID',
        'Farmer ID',
        'Farmer Name',
        'State',
        'District',
        'Procurement Centre',
        'Crop',
        'Date',
        'Amount (INR)',
        'Payment Status',
        'Transaction Ref'
      ];

      const rows = filteredPayments.map(p => [
        `"${p.id || ''}"`,
        `"${p.procurementId || ''}"`,
        `"${p.farmerId || ''}"`,
        `"${p.farmerName || ''}"`,
        `"${p.state || ''}"`,
        `"${p.district || ''}"`,
        `"${p.centreName || ''}"`,
        `"${p.crop || ''}"`,
        `"${p.date || ''}"`,
        `"${p.amount || 0}"`,
        `"${p.status || ''}"`,
        `"${p.txRef || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.setAttribute('download', `payments_export_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMsg(`Exported ${filteredPayments.length} payment records to CSV!`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err) {
      setToastMsg('Export failed. Please try again.');
      setTimeout(() => setToastMsg(null), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  // Summary Metrics calculated from currently filtered list
  const totalValue = filteredPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const paid = filteredPayments.filter(p => p.status === 'Completed' || p.status === 'Paid').reduce((acc, p) => acc + (p.amount || 0), 0);
  const processing = filteredPayments.filter(p => p.status === 'Processing' || p.status === 'Initiated').reduce((acc, p) => acc + (p.amount || 0), 0);
  const pending = filteredPayments.filter(p => p.status === 'Pending' || p.status === 'Not Initiated' || p.status === 'Failed').reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#046a38] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-400 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER & SEARCH / EXPORT BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-farmer-text tracking-tight">Payment Monitoring</h2>
          <p className="text-earth-600 mt-1 text-xs">Direct Benefit Transfer (DBT) and procurement settlement status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
            <Input 
              placeholder="Search by ID, Farmer, Transaction..." 
              className="pl-9 bg-white border-farmer-border text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button 
            variant={showFilters ? "default" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 text-xs font-bold ${showFilters ? 'bg-farmer-primary text-white hover:bg-farmer-primary' : 'bg-white text-earth-700'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            disabled={isExporting || filteredPayments.length === 0}
            className="shrink-0 bg-white border-farmer-border text-farmer-primary font-bold text-xs hover:bg-emerald-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-farmer-primary" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* INDEPENDENT FILTER ROW */}
      {showFilters && (
        <Card className="border-farmer-border shadow-sm bg-white animate-in slide-in-from-top-4">
          <CardContent className="p-4 md:p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-farmer-text text-sm">Independent Search & Filters</h3>
                <p className="text-[11px] text-farmer-secondary">Select options independently. Filters do not clear or restrict each other.</p>
              </div>

              {(filters.farmerId || filters.centre || filters.status || filters.state || filters.district || filters.date || filters.crop || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3 text-xs font-bold rounded-xl">
                  <X className="w-3.5 h-3.5 mr-1" /> Clear Filters
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              
              {/* 1. FARMER ID FILTER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-earth-700 block">Farmer ID / Name</label>
                <div className="relative">
                  <Input 
                    placeholder="Enter Farmer ID..." 
                    className="text-xs bg-white border-farmer-border h-9"
                    value={filters.farmerId}
                    onChange={(e) => handleFilterChange('farmerId', e.target.value)}
                  />
                  {filters.farmerId && (
                    <button 
                      onClick={() => handleFilterChange('farmerId', '')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. SELECT CENTRE FILTER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-earth-700 block">Select Centre</label>
                <div className="relative">
                  <select 
                    className="w-full text-xs rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
                    value={filters.centre}
                    onChange={(e) => handleFilterChange('centre', e.target.value)}
                  >
                    <option value="">All Centres</option>
                    {availableCentres.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* 3. PAYMENT STATUS FILTER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-earth-700 block">Payment Status</label>
                <div className="relative">
                  <select 
                    className="w-full text-xs rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* 4. STATE FILTER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-earth-700 block">State</label>
                <div className="relative">
                  <select 
                    className="w-full text-xs rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    <option value="">All States</option>
                    {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* 5. DISTRICT FILTER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-earth-700 block">District</label>
                <div className="relative">
                  <select 
                    className="w-full text-xs rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
                    value={filters.district}
                    onChange={(e) => handleFilterChange('district', e.target.value)}
                  >
                    <option value="">All Districts</option>
                    {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* 6. CROP FILTER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-earth-700 block">Crop</label>
                <div className="relative">
                  <select 
                    className="w-full text-xs rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
                    value={filters.crop}
                    onChange={(e) => handleFilterChange('crop', e.target.value)}
                  >
                    <option value="">All Crops</option>
                    {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* 7. DATE FILTER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-earth-700 block">Date</label>
                <div className="relative">
                  <select 
                    className="w-full text-xs rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  >
                    <option value="">All Dates</option>
                    {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards calculated dynamically from filtered result */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-farmer-border shadow-sm bg-white">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-farmer-secondary">Filtered Procurement Value</p>
            <h3 className="text-2xl font-black text-farmer-text mt-1">₹ {(totalValue / 100000).toFixed(2)} L</h3>
          </CardContent>
        </Card>
        <Card className="border-green-200 shadow-sm bg-green-50/30">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-green-800">Filtered Payments Completed</p>
            <h3 className="text-2xl font-black text-green-900 mt-1">₹ {(paid / 100000).toFixed(2)} L</h3>
          </CardContent>
        </Card>
        <Card className="border-amber-200 shadow-sm bg-amber-50/30">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-amber-800">Processing / Initiated</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">₹ {(processing / 1000).toFixed(1)} K</h3>
          </CardContent>
        </Card>
        <Card className="border-red-200 shadow-sm bg-red-50/30">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-red-800">Pending / Failed</p>
            <h3 className="text-2xl font-black text-red-900 mt-1">₹ {(pending / 1000).toFixed(1)} K</h3>
          </CardContent>
        </Card>
      </div>

      {/* PAYMENTS DATA TABLE */}
      <Card className="border-farmer-border shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-farmer-border py-4 bg-farmer-bg flex flex-row items-center justify-between">
           <CardTitle className="text-base font-black text-farmer-text">Payment Settlement Tracker</CardTitle>
           <span className="text-xs font-bold text-farmer-primary bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
             {filteredPayments.length} records matching filters
           </span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-farmer-secondary bg-farmer-bg/50 uppercase border-b border-farmer-border tracking-wider">
               <tr>
                  <th className="px-6 py-4 font-bold">Payment / Proc ID</th>
                  <th className="px-6 py-4 font-bold">Farmer & Centre</th>
                  <th className="px-6 py-4 font-bold">Crop & Date</th>
                  <th className="px-6 py-4 font-bold">Bank Details (Masked)</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {filteredPayments.length > 0 ? (
                 filteredPayments.map(pay => {
                   
                   let statusBadge = 'neutral';
                   if (pay.status === 'Completed' || pay.status === 'Paid') statusBadge = 'success';
                   if (pay.status === 'Processing' || pay.status === 'Initiated') statusBadge = 'warning';
                   if (pay.status === 'Failed') statusBadge = 'danger';
                   if (pay.status === 'Not Initiated' || pay.status === 'Pending') statusBadge = 'outline';

                   return (
                     <tr key={pay.id} className="hover:bg-farmer-bg/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-farmer-text mb-0.5">{pay.id}</p>
                           <p className="text-[10px] text-farmer-secondary font-mono">{pay.procurementId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-farmer-text">{pay.farmerName}</p>
                           <p className="text-[10px] text-farmer-secondary flex items-center gap-1 mt-0.5">
                             <Building className="w-3 h-3"/>{pay.centreName}
                           </p>
                           <p className="text-[10px] font-mono text-farmer-primary font-bold mt-0.5">{pay.farmerId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-farmer-text">{pay.crop}</p>
                           <p className="text-[10px] text-farmer-secondary mt-0.5">{pay.date}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-mono text-xs text-earth-700 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-farmer-secondary"/> {pay.bankAccount}</p>
                           <p className="text-[10px] text-farmer-secondary mt-0.5">IFSC: {pay.ifsc}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-black text-farmer-text">₹ {pay.amount?.toLocaleString('en-IN')}</p>
                           <span className="font-mono text-[9px] text-farmer-secondary mt-1 block">{pay.txRef}</span>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={statusBadge} className="uppercase tracking-wider text-[10px]">{pay.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" className="text-farmer-primary hover:text-farmer-primary hover:bg-farmer-primary-light">
                             <Eye className="w-4 h-4 mr-1" />
                             Details
                           </Button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-farmer-secondary">
                     <IndianRupee className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-base font-bold text-farmer-text">No payment records found</p>
                     <p className="text-xs text-slate-500 mt-1">Try adjusting or clearing your filters to view more records.</p>
                     <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4 bg-white text-xs font-bold">
                       Clear All Filters
                     </Button>
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
