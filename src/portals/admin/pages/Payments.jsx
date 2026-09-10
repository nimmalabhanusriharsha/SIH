import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, Eye, IndianRupee, Download, Building, CreditCard, ChevronDown, X } from 'lucide-react';
import { maskBankAccount } from '../../farmer/data/masterFarmers';

const AdminPayments = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Cascading Filters State
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    centre: '',
    date: '',
    crop: '',
    farmerId: ''
  });

  // Enhance procurements with farmer and centre details to generate payments list
  const allPaymentsTracked = useMemo(() => {
    return state.procurements
      .filter(p => p.status === 'Completed' || p.status === 'Pending')
      .map(proc => {
        const farmer = state.farmers.find(f => f.id === proc.farmerId) || {};
        const centre = state.centres.find(c => c.id === proc.centreId) || {};
        
        // Look for persistent payment record
        const paymentRecord = state.payments.find(pay => pay.procurementId === proc.id);
        
        let paymentStatus = paymentRecord?.status || 'Not Initiated';
        let txRef = paymentRecord?.transactionId || '---';

        // Ensure bank details are masked
        const bankAccount = farmer.bankAccount ? maskBankAccount(farmer.bankAccount) : 'XXXX XXXX 0000';

        const paymentDate = paymentRecord?.date || proc.date || new Date().toISOString().split('T')[0];

        return {
          id: paymentRecord?.id || `PAY-PENDING-${proc.id.split('-')[1] || proc.id}`,
          procurementId: proc.id,
          farmerId: farmer.id || proc.farmerId,
          farmerName: farmer.name || 'Unknown',
          state: farmer.state || 'Andhra Pradesh',
          district: farmer.district || centre.district || 'West Godavari',
          centreName: centre.name || proc.centreId,
          crop: proc.crop || 'Unknown',
          date: paymentDate.split('T')[0],
          amount: proc.totalAmount || proc.amount || 0,
          status: paymentStatus, 
          txRef,
          updatedAt: paymentDate,
          bankAccount,
          ifsc: farmer.ifsc || 'XXXXXXX'
        };
      });
  }, [state]);

  // Derived Options for Cascading Filters
  const availableStates = [...new Set(allPaymentsTracked.map(p => p.state))].filter(Boolean);
  
  const availableDistricts = [...new Set(allPaymentsTracked
    .filter(p => !filters.state || p.state === filters.state)
    .map(p => p.district))].filter(Boolean);

  const availableCentres = [...new Set(allPaymentsTracked
    .filter(p => (!filters.state || p.state === filters.state) && (!filters.district || p.district === filters.district))
    .map(p => p.centreName))].filter(Boolean);

  const availableDates = [...new Set(allPaymentsTracked
    .filter(p => (!filters.state || p.state === filters.state) && (!filters.district || p.district === filters.district) && (!filters.centre || p.centreName === filters.centre))
    .map(p => p.date))].filter(Boolean).sort();

  const availableCrops = [...new Set(allPaymentsTracked
    .filter(p => (!filters.state || p.state === filters.state) && (!filters.district || p.district === filters.district) && (!filters.centre || p.centreName === filters.centre) && (!filters.date || p.date === filters.date))
    .map(p => p.crop))].filter(Boolean);

  const availableFarmers = [...new Set(allPaymentsTracked
    .filter(p => (!filters.state || p.state === filters.state) && (!filters.district || p.district === filters.district) && (!filters.centre || p.centreName === filters.centre) && (!filters.date || p.date === filters.date) && (!filters.crop || p.crop === filters.crop))
    .map(p => p.farmerId))].filter(Boolean);

  // Apply Filters
  const filteredPayments = allPaymentsTracked.filter(pay => {
    if (filters.state && pay.state !== filters.state) return false;
    if (filters.district && pay.district !== filters.district) return false;
    if (filters.centre && pay.centreName !== filters.centre) return false;
    if (filters.date && pay.date !== filters.date) return false;
    if (filters.crop && pay.crop !== filters.crop) return false;
    if (filters.farmerId && pay.farmerId !== filters.farmerId) return false;
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      if (!pay.id.toLowerCase().includes(lowerSearch) &&
          !pay.farmerName.toLowerCase().includes(lowerSearch) &&
          !pay.txRef.toLowerCase().includes(lowerSearch) &&
          !pay.procurementId.toLowerCase().includes(lowerSearch)) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({
      state: '',
      district: '',
      centre: '',
      date: '',
      crop: '',
      farmerId: ''
    });
    setSearchTerm('');
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const next = { ...prev, [field]: value };
      // Cascade clear downstream filters if a higher-level filter changes
      if (field === 'state') { next.district = ''; next.centre = ''; next.date = ''; next.crop = ''; next.farmerId = ''; }
      if (field === 'district') { next.centre = ''; next.date = ''; next.crop = ''; next.farmerId = ''; }
      if (field === 'centre') { next.date = ''; next.crop = ''; next.farmerId = ''; }
      if (field === 'date') { next.crop = ''; next.farmerId = ''; }
      if (field === 'crop') { next.farmerId = ''; }
      return next;
    });
  };

  const totalValue = filteredPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const paid = filteredPayments.filter(p => p.status === 'Completed' || p.status === 'Paid').reduce((acc, p) => acc + (p.amount || 0), 0);
  const processing = filteredPayments.filter(p => p.status === 'Processing' || p.status === 'Initiated').reduce((acc, p) => acc + (p.amount || 0), 0);
  const pending = filteredPayments.filter(p => p.status === 'Pending' || p.status === 'Not Initiated' || p.status === 'Failed').reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-farmer-text tracking-tight">Payment Monitoring</h2>
          <p className="text-earth-600 mt-1">Direct Benefit Transfer (DBT) and procurement settlement status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
            <Input 
              placeholder="Search by ID, Farmer, Transaction..." 
              className="pl-9 bg-white border-farmer-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant={showFilters ? "default" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 ${showFilters ? 'bg-farmer-primary text-white hover:bg-farmer-primary' : 'bg-white text-earth-700'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="shrink-0 bg-white border-farmer-border text-farmer-primary hidden md:flex">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="border-farmer-border shadow-sm bg-white animate-in slide-in-from-top-4">
          <CardContent className="p-4 md:p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-farmer-text text-sm">Cascading Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-farmer-secondary hover:text-red-600 h-8 px-2 text-xs">
                <X className="w-3.5 h-3.5 mr-1" /> Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              
              {/* State Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-earth-700">1. State</label>
                <div className="relative">
                  <select 
                    className="w-full text-sm rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    <option value="">All States</option>
                    {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* District Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-earth-700">2. District</label>
                <div className="relative">
                  <select 
                    className="w-full text-sm rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:opacity-50 disabled:bg-farmer-bg"
                    value={filters.district}
                    onChange={(e) => handleFilterChange('district', e.target.value)}
                    disabled={!filters.state}
                  >
                    <option value="">{filters.state ? 'All Districts' : 'Select State First'}</option>
                    {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* Centre Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-earth-700">3. Centre</label>
                <div className="relative">
                  <select 
                    className="w-full text-sm rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:opacity-50 disabled:bg-farmer-bg"
                    value={filters.centre}
                    onChange={(e) => handleFilterChange('centre', e.target.value)}
                    disabled={!filters.district}
                  >
                    <option value="">{filters.district ? 'All Centres' : 'Select District First'}</option>
                    {availableCentres.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* Date Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-earth-700">4. Date</label>
                <div className="relative">
                  <select 
                    className="w-full text-sm rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:opacity-50 disabled:bg-farmer-bg"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    disabled={!filters.centre}
                  >
                    <option value="">{filters.centre ? 'All Dates' : 'Select Centre First'}</option>
                    {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* Crop Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-earth-700">5. Crop</label>
                <div className="relative">
                  <select 
                    className="w-full text-sm rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:opacity-50 disabled:bg-farmer-bg"
                    value={filters.crop}
                    onChange={(e) => handleFilterChange('crop', e.target.value)}
                    disabled={!filters.date}
                  >
                    <option value="">{filters.date ? 'All Crops' : 'Select Date First'}</option>
                    {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

              {/* Farmer ID Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-earth-700">6. Farmer ID</label>
                <div className="relative">
                  <select 
                    className="w-full text-sm rounded-lg border border-farmer-border bg-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:opacity-50 disabled:bg-farmer-bg"
                    value={filters.farmerId}
                    onChange={(e) => handleFilterChange('farmerId', e.target.value)}
                    disabled={!filters.crop}
                  >
                    <option value="">{filters.crop ? 'All Farmers' : 'Select Crop First'}</option>
                    {availableFarmers.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards based on filtered results */}
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

      <Card className="border-farmer-border shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-farmer-border py-4 bg-farmer-bg flex flex-row items-center justify-between">
           <CardTitle className="text-lg text-farmer-text">Payment Status Tracker</CardTitle>
           <span className="text-xs font-bold text-farmer-secondary">{filteredPayments.length} results</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-farmer-secondary bg-farmer-bg/50 uppercase border-b border-farmer-border tracking-wider">
               <tr>
                  <th className="px-6 py-4 font-bold">Payment / Proc ID</th>
                  <th className="px-6 py-4 font-bold">Farmer & Center</th>
                  <th className="px-6 py-4 font-bold">Crop & Date</th>
                  <th className="px-6 py-4 font-bold">Bank Details (Masked)</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {filteredPayments.length > 0 ? (
                 filteredPayments.slice(0, 15).map(pay => {
                   
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
                           <p className="text-[9px] text-farmer-secondary mt-0.5">{pay.farmerId}</p>
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
                           <p className="font-black text-farmer-text">₹ {pay.amount?.toLocaleString()}</p>
                           <span className="font-mono text-[9px] text-farmer-secondary mt-1 block">{pay.txRef}</span>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={statusBadge} className="uppercase tracking-wider text-[10px]">{pay.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" className="text-farmer-primary hover:text-farmer-primary hover:bg-farmer-primary-light">
                             <Eye className="w-4 h-4 mr-2" />
                             View
                           </Button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-farmer-secondary">
                     <IndianRupee className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-lg font-medium text-farmer-text">No payments found</p>
                     <p className="text-xs mt-1">Try relaxing your filters to see more results</p>
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
