import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, User, Plus, X, MapPin, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminFarmers = () => {
  const { state, setState } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Add Farmer Form State
  const [formData, setFormData] = useState({
    farmerId: `KIS-${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`,
    name: '',
    mobile: '',
    village: '',
    district: '',
    state: 'Andhra Pradesh'
  });
  const [formError, setFormError] = useState('');

  // Filter farmers
  const filteredFarmers = state.farmers.filter(farmer => 
    farmer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.mobile.includes(searchTerm) ||
    farmer.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
  const currentFarmers = filteredFarmers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddFarmer = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanId = formData.farmerId.trim().toUpperCase();
    if (!cleanId) return setFormError('Farmer ID is required');
    if (!formData.name.trim()) return setFormError('Farmer Name is required');
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.trim())) return setFormError('Valid 10-digit mobile is required');

    // Check uniqueness
    if (state.farmers.some(f => (f.farmerId || f.id).toUpperCase() === cleanId)) {
      return setFormError('Farmer ID already exists! It must be unique.');
    }

    const newFarmer = {
      ...formData,
      id: cleanId,
      farmerId: cleanId,
      isRegistered: false,
      landArea: 0,
      primaryCrop: 'Not Specified',
      expectedQuantity: 0
    };

    setState(prev => ({
      ...prev,
      farmers: [newFarmer, ...prev.farmers]
    }));

    setShowAddModal(false);
    setFormData({
      farmerId: `KIS-${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`,
      name: '',
      mobile: '',
      village: '',
      district: '',
      state: 'Andhra Pradesh'
    });
  };

  const openDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Farmer Management</h2>
          <p className="text-earth-600 mt-1">Registry of all {state.farmers.length} enrolled farmers across the state.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search by name, ID, mobile, district..." 
              className="pl-9 bg-white border-earth-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button variant="outline" className="shrink-0 bg-white border-earth-200 text-earth-700">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="shrink-0 bg-forest-600 hover:bg-forest-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Farmer
          </Button>
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-earth-500 bg-earth-50 uppercase border-b border-earth-200">
               <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Farmer Details</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Address</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Activity</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {currentFarmers.length > 0 ? (
                 currentFarmers.map(farmer => {
                   const farmerBookings = state.bookings.filter(b => b.farmerId === farmer.id);
                   const farmerProcurements = state.procurements.filter(p => p.farmerId === farmer.id && p.status === 'Completed');
                   
                   return (
                     <tr key={farmer.id} className="hover:bg-earth-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold shrink-0">
                                 {farmer.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-forest-900 leading-tight mb-0.5">{farmer.name}</p>
                                 <div className="flex items-center gap-2 text-[10px] font-medium text-earth-500">
                                   <span>{farmer.farmerId || farmer.id}</span>
                                   <span className="w-1 h-1 rounded-full bg-earth-300"></span>
                                   <span>+91 {farmer.mobile}</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{farmer.village || '--'}</p>
                           <p className="text-xs text-earth-500">{farmer.district || '--'}, {farmer.state}</p>
                        </td>
                        <td className="px-6 py-4">
                           {farmer.isRegistered === false ? (
                             <Badge variant="warning" className="bg-amber-100 text-amber-800">Pending Registration</Badge>
                           ) : (
                             <Badge variant="success" className="bg-green-100 text-green-800">Registered</Badge>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1 text-xs font-medium">
                              <div>
                                <span className="text-earth-500">Bookings: </span>
                                <span className="text-forest-900 font-bold">{farmerBookings.length}</span>
                              </div>
                              <div>
                                <span className="text-earth-500">Completed Procurements: </span>
                                <span className="text-forest-900 font-bold">{farmerProcurements.length}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" onClick={() => openDetails(farmer)} className="text-forest-600 hover:text-forest-700 hover:bg-forest-50">
                             <Eye className="w-4 h-4 mr-2" />
                             View
                           </Button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="5" className="px-6 py-12 text-center text-earth-500">
                     <User className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-lg font-medium text-earth-900">No farmers found</p>
                     <p className="text-sm mt-1">Try adjusting your search criteria</p>
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </CardContent>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-earth-100 flex items-center justify-between bg-earth-50/50">
            <p className="text-sm text-earth-600 font-medium">
              Showing <span className="font-bold text-forest-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-forest-900">{Math.min(currentPage * itemsPerPage, filteredFarmers.length)}</span> of <span className="font-bold text-forest-900">{filteredFarmers.length}</span> farmers
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-earth-200"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium text-earth-600 px-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-earth-200"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ADD FARMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-earth-200">
            <div className="flex justify-between items-center p-5 border-b border-earth-100 bg-earth-50">
              <h3 className="font-bold text-lg text-forest-900">Add New Farmer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-earth-500 hover:text-earth-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddFarmer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Farmer ID (Must be unique)</label>
                  <Input 
                    value={formData.farmerId} 
                    onChange={e => setFormData({...formData, farmerId: e.target.value})} 
                    placeholder="KIS-XXXXXX"
                    className="font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Full Name (As per Aadhaar)</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Ramesh Kumar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Mobile Number</label>
                  <Input 
                    value={formData.mobile} 
                    onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})} 
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-earth-700 mb-1">State</label>
                    <Input 
                      value={formData.state} 
                      onChange={e => setFormData({...formData, state: e.target.value})} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-earth-700 mb-1">District</label>
                    <Input 
                      value={formData.district} 
                      onChange={e => setFormData({...formData, district: e.target.value})} 
                      placeholder="e.g. West Godavari"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Village</label>
                  <Input 
                    value={formData.village} 
                    onChange={e => setFormData({...formData, village: e.target.value})} 
                    placeholder="e.g. Bhimavaram"
                    required
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="w-full">Cancel</Button>
                  <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-700 text-white">Create Farmer</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW FARMER DETAILS MODAL */}
      {showDetailsModal && selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-earth-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-earth-100 bg-earth-50 shrink-0">
              <h3 className="font-bold text-lg text-forest-900 flex items-center gap-2">
                <User className="w-5 h-5 text-forest-600" />
                Farmer Details
              </h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-earth-500 hover:text-earth-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Profile Info */}
              <div className="flex flex-col md:flex-row gap-6 items-start bg-forest-50/50 p-5 rounded-2xl border border-forest-100">
                <div className="w-16 h-16 rounded-full bg-forest-200 flex items-center justify-center text-forest-800 font-bold text-2xl shrink-0">
                   {selectedFarmer.name.charAt(0)}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">Farmer Name</p>
                    <p className="font-bold text-forest-900 text-lg">{selectedFarmer.name}</p>
                    <p className="text-sm font-mono text-earth-600">{selectedFarmer.farmerId || selectedFarmer.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">Contact</p>
                    <p className="font-medium text-earth-900 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> +91 {selectedFarmer.mobile}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">Location</p>
                    <p className="font-medium text-earth-900 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {selectedFarmer.village || '--'}</p>
                    <p className="text-xs text-earth-500 ml-5">{selectedFarmer.district || '--'}, {selectedFarmer.state}</p>
                  </div>
                </div>
                <div>
                  {selectedFarmer.isRegistered === false ? (
                    <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5"/> Pending Registration
                    </Badge>
                  ) : (
                    <Badge variant="success" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5"/> Registered
                    </Badge>
                  )}
                </div>
              </div>

              {/* Booking History */}
              <div>
                <h4 className="font-bold text-earth-900 mb-3 border-b border-earth-100 pb-2">Booking History</h4>
                <div className="overflow-x-auto bg-white border border-earth-200 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-earth-500 bg-earth-50 uppercase border-b border-earth-200">
                      <tr>
                        <th className="px-4 py-3 font-bold">Booking ID</th>
                        <th className="px-4 py-3 font-bold">Date</th>
                        <th className="px-4 py-3 font-bold">Center</th>
                        <th className="px-4 py-3 font-bold">Token</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-100">
                      {state.bookings.filter(b => b.farmerId === selectedFarmer.id).length > 0 ? (
                        state.bookings.filter(b => b.farmerId === selectedFarmer.id).map(booking => {
                          const centre = state.centres.find(c => c.id === booking.centreId);
                          return (
                            <tr key={booking.id}>
                              <td className="px-4 py-3 font-medium text-earth-900">{booking.id}</td>
                              <td className="px-4 py-3 text-earth-600">{booking.date}</td>
                              <td className="px-4 py-3 text-earth-800">{centre?.name || booking.centreId}</td>
                              <td className="px-4 py-3 font-bold text-forest-700">{booking.token}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline">{booking.status}</Badge>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-center text-earth-500 text-sm">No bookings found for this farmer.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Procurement History */}
              <div>
                <h4 className="font-bold text-earth-900 mb-3 border-b border-earth-100 pb-2">Complete Procurement History</h4>
                <div className="overflow-x-auto bg-white border border-earth-200 rounded-xl">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[11px] text-earth-500 bg-earth-50 uppercase tracking-wider border-b border-earth-200">
                      <tr>
                        <th className="px-4 py-3 font-bold">Proc ID</th>
                        <th className="px-4 py-3 font-bold">Date</th>
                        <th className="px-4 py-3 font-bold">Center</th>
                        <th className="px-4 py-3 font-bold">Crop</th>
                        <th className="px-4 py-3 font-bold">Quantity</th>
                        <th className="px-4 py-3 font-bold">MSP (Rate)</th>
                        <th className="px-4 py-3 font-bold text-right">Total Value</th>
                        <th className="px-4 py-3 font-bold">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-100">
                      {state.procurements.filter(p => p.farmerId === selectedFarmer.id && p.status === 'Completed').length > 0 ? (
                        state.procurements.filter(p => p.farmerId === selectedFarmer.id && p.status === 'Completed').map(proc => {
                          const centre = state.centres.find(c => c.id === proc.centreId);
                          const payment = state.payments.find(p => p.procurementId === proc.id);
                          return (
                            <tr key={proc.id}>
                              <td className="px-4 py-3 font-medium text-earth-900">{proc.id}</td>
                              <td className="px-4 py-3 text-earth-600">{proc.date}</td>
                              <td className="px-4 py-3 text-earth-800">{centre?.name || proc.centreId}</td>
                              <td className="px-4 py-3 font-medium text-earth-900">{proc.crop}</td>
                              <td className="px-4 py-3 text-earth-900">{proc.actualQuantity} Q</td>
                              <td className="px-4 py-3 text-earth-600">₹{proc.rate?.toLocaleString()}/Q</td>
                              <td className="px-4 py-3 font-bold text-forest-900 text-right">₹{proc.totalAmount?.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <Badge variant={payment?.status === 'Completed' || payment?.status === 'Paid' ? 'success' : 'warning'} className="text-[10px]">
                                  {payment?.status || 'Pending'}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-4 py-6 text-center text-earth-500 text-sm">No completed procurements found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-earth-100 bg-earth-50 flex justify-end shrink-0">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFarmers;
