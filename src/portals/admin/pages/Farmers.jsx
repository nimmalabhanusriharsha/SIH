import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, User, X, MapPin, Phone, CheckCircle2, ChevronDown, Building, Sprout, CreditCard } from 'lucide-react';
import { maskBankAccount } from '../../farmer/data/masterFarmers';

const AdminFarmers = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Available Centres dropdown options
  const availableCentres = useMemo(() => {
    return (state.centres || []).map(c => ({ id: c.id, name: c.name }));
  }, [state.centres]);

  // Filter farmers by Centre AND Search Term
  const filteredFarmers = useMemo(() => {
    return (state.farmers || []).filter(farmer => {
      // Centre Filter
      if (selectedCentreId) {
        const farmerBookings = (state.bookings || []).filter(b => b.farmerId === farmer.id || b.farmerId === farmer.farmerId);
        const farmerProcurements = (state.procurements || []).filter(p => p.farmerId === farmer.id || p.farmerId === farmer.farmerId);
        const matchesCentre = farmerBookings.some(b => b.centreId === selectedCentreId) || 
                              farmerProcurements.some(p => p.centreId === selectedCentreId) ||
                              farmer.district === (state.centres || []).find(c => c.id === selectedCentreId)?.district;
        if (!matchesCentre) return false;
      }

      // Search Query Filter
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const fid = (farmer.farmerId || farmer.id || '').toLowerCase();
        const fname = (farmer.name || '').toLowerCase();
        const fphone = (farmer.mobile || farmer.phone || '');
        const fdistrict = (farmer.district || '').toLowerCase();
        const fvillage = (farmer.village || '').toLowerCase();

        if (!fid.includes(q) && !fname.includes(q) && !fphone.includes(q) && !fdistrict.includes(q) && !fvillage.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [state.farmers, state.bookings, state.procurements, state.centres, selectedCentreId, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredFarmers.length / itemsPerPage));
  const currentFarmers = filteredFarmers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCentreId('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-farmer-text tracking-tight">Farmer Management</h2>
          <p className="text-earth-600 mt-1 text-xs">Registry of enrolled farmers across procurement centres.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
            <Input 
              placeholder="Search by name, ID, mobile..." 
              className="pl-9 bg-white border-farmer-border text-xs"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Select Centre Dropdown Filter */}
          <div className="relative w-full sm:w-56">
            <select
              className="w-full text-xs rounded-xl border border-farmer-border bg-white px-3 py-2.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
              value={selectedCentreId}
              onChange={(e) => {
                setSelectedCentreId(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Centres</option>
              {availableCentres.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-farmer-secondary pointer-events-none" />
          </div>

          {(searchTerm || selectedCentreId) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold h-9">
              <X className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}

        </div>
      </div>

      <Card className="border-farmer-border shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-farmer-border py-4 bg-farmer-bg flex flex-row items-center justify-between">
           <CardTitle className="text-base font-black text-farmer-text">Registered Farmers</CardTitle>
           <span className="text-xs font-bold text-farmer-primary bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
             {filteredFarmers.length} farmers enrolled
           </span>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-farmer-secondary bg-farmer-bg uppercase border-b border-farmer-border">
               <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Farmer Details</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Address & District</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Registration Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Activity Overview</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {currentFarmers.length > 0 ? (
                 currentFarmers.map(farmer => {
                   const farmerBookings = (state.bookings || []).filter(b => b.farmerId === farmer.id || b.farmerId === farmer.farmerId);
                   const farmerProcurements = (state.procurements || []).filter(p => (p.farmerId === farmer.id || p.farmerId === farmer.farmerId) && p.status === 'Completed');
                   
                   return (
                     <tr key={farmer.id} className="hover:bg-farmer-bg/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-farmer-primary font-black shrink-0">
                                 {(farmer.name || 'F').charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-farmer-text leading-tight mb-0.5">{farmer.name}</p>
                                 <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-farmer-primary">
                                   <span>{farmer.farmerId || farmer.id}</span>
                                   <span className="w-1 h-1 rounded-full bg-earth-300"></span>
                                   <span className="text-farmer-secondary font-sans">+91 {farmer.mobile || farmer.phone}</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-farmer-text">{farmer.village || 'N/A'}</p>
                           <p className="text-xs text-farmer-secondary">{farmer.district || 'West Godavari'}, {farmer.state || 'Andhra Pradesh'}</p>
                        </td>
                        <td className="px-6 py-4">
                           {farmer.isRegistered === false ? (
                             <Badge variant="warning" className="bg-amber-100 text-amber-800 font-bold">Pending Setup</Badge>
                           ) : (
                             <Badge variant="success" className="bg-green-100 text-green-800 font-bold">Registered</Badge>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1 text-xs font-medium">
                              <div>
                                <span className="text-farmer-secondary">Bookings: </span>
                                <span className="text-farmer-text font-bold">{farmerBookings.length}</span>
                              </div>
                              <div>
                                <span className="text-farmer-secondary">Completed Procurements: </span>
                                <span className="text-farmer-text font-bold">{farmerProcurements.length}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" onClick={() => openDetails(farmer)} className="text-farmer-primary hover:text-farmer-primary hover:bg-farmer-primary-light font-bold text-xs">
                             <Eye className="w-4 h-4 mr-1" />
                             View Profile
                           </Button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-farmer-secondary">
                     <User className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-base font-bold text-farmer-text">No farmers found</p>
                     <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or centre selection filter.</p>
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </CardContent>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-farmer-border flex items-center justify-between bg-farmer-bg/50">
            <p className="text-xs text-earth-600 font-medium">
              Showing <span className="font-bold text-farmer-text">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-farmer-text">{Math.min(currentPage * itemsPerPage, filteredFarmers.length)}</span> of <span className="font-bold text-farmer-text">{filteredFarmers.length}</span> farmers
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-farmer-border"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-xs font-bold text-earth-600 px-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-farmer-border"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* FARMER DETAILS MODAL */}
      {showDetailsModal && selectedFarmer && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 font-sans">
            <div className="bg-[#046a38] p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <User className="w-5 h-5" /> Farmer Profile Details
              </h3>
              <button 
                type="button" 
                onClick={() => setShowDetailsModal(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <div className="w-12 h-12 rounded-2xl bg-[#046a38] text-white flex items-center justify-center font-black text-lg">
                  {selectedFarmer.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedFarmer.name}</h4>
                  <p className="text-xs font-mono font-bold text-[#046a38]">{selectedFarmer.farmerId || selectedFarmer.id}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile Number:</span>
                  <span className="font-bold text-slate-900">+91 {selectedFarmer.mobile || selectedFarmer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Village / Mandal:</span>
                  <span className="font-bold text-slate-900">{selectedFarmer.village || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">District:</span>
                  <span className="font-bold text-slate-900">{selectedFarmer.district || 'West Godavari'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">State:</span>
                  <span className="font-bold text-slate-900">{selectedFarmer.state || 'Andhra Pradesh'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Land Area:</span>
                  <span className="font-bold text-slate-900">{selectedFarmer.landArea || 5.2} Acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Crop:</span>
                  <span className="font-bold text-[#046a38]">{selectedFarmer.primaryCrop || 'Paddy (Rice)'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">Masked Bank Account Details</p>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Account:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedFarmer.bankAccount ? maskBankAccount(selectedFarmer.bankAccount) : 'XXXX XXXX 4589'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IFSC Code:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedFarmer.ifsc || 'SBIN0001234'}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full bg-[#046a38] hover:bg-[#03522c] text-white font-bold rounded-xl h-11 transition-colors"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFarmers;
