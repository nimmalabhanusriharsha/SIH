import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, CalendarClock, Download } from 'lucide-react';

const AdminBookings = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 10;

  // Enhance bookings with farmer and centre details
  const enhancedBookings = state.bookings.map(booking => {
    const farmer = state.farmers.find(f => f.id === booking.farmerId) || {};
    const centre = state.centres.find(c => c.id === booking.centreId) || {};
    return { 
      ...booking, 
      farmerName: booking.farmerName || farmer.name || 'Verified Farmer', 
      centreName: booking.centreName || centre.name || 'Procurement Centre' 
    };
  });

  // Filter bookings
  const filteredBookings = enhancedBookings.filter(booking => 
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.farmerName && booking.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    booking.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.centreName && booking.centreName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Booking Management</h2>
          <p className="text-earth-600 mt-1">Global view of all farmer procurement appointments.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search by ID, Farmer, Token..." 
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
          <Button variant="outline" className="shrink-0 bg-white border-earth-200 text-forest-700 hidden md:flex">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-earth-500 bg-earth-50 uppercase border-b border-earth-200">
               <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Booking ID / Token</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Farmer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Centre</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Schedule</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Expected (Q)</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {currentBookings.length > 0 ? (
                 currentBookings.map(booking => {
                   
                   let statusBadge = 'default';
                   let statusLabel = booking.status;
                   
                   if (booking.status === 'Confirmed') statusBadge = 'success';
                   if (booking.status === 'Completed') statusBadge = 'neutral';
                   if (booking.status === 'Cancelled') statusBadge = 'danger';

                   return (
                     <tr key={booking.id} className="hover:bg-earth-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-forest-900 mb-0.5">{booking.id}</p>
                           <Badge variant="outline" className="text-[10px] bg-white border-earth-200 text-earth-600 font-bold">{booking.token}</Badge>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{booking.farmerName}</p>
                           <p className="text-[10px] text-earth-500">{booking.farmerId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{booking.centreName}</p>
                           <p className="text-[10px] text-earth-500">{booking.centreId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                           <p className="text-xs text-earth-500">{booking.slot}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-earth-900">{booking.expectedQuantity} Q</p>
                           <p className="text-[10px] text-earth-500">{booking.crop}</p>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={statusBadge}>{statusLabel}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button 
                             variant="ghost" size="sm" className="text-forest-600 hover:text-forest-700 hover:bg-forest-50"
                             onClick={() => setSelectedBooking(booking)}
                           >
                             <Eye className="w-4 h-4 mr-2" />
                             View
                           </Button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-earth-500">
                     <CalendarClock className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-lg font-medium text-earth-900">No bookings found</p>
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
              Showing <span className="font-bold text-forest-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-forest-900">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of <span className="font-bold text-forest-900">{filteredBookings.length}</span> bookings
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

      {/* VIEW BOOKING MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between bg-earth-50">
              <h3 className="font-bold text-lg text-forest-900 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-forest-600" /> Booking Details
              </h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-earth-200 rounded-md text-earth-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                <span className="text-sm font-bold text-earth-500">Booking ID</span>
                <span className="text-sm font-bold text-forest-900">{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                <span className="text-sm font-bold text-earth-500">Token</span>
                <Badge variant="outline" className="font-bold">{selectedBooking.token}</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                <span className="text-sm font-bold text-earth-500">Farmer</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-forest-900">{selectedBooking.farmerName}</p>
                  <p className="text-xs text-earth-500">{selectedBooking.farmerId}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                <span className="text-sm font-bold text-earth-500">Centre</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-forest-900">{selectedBooking.centreName}</p>
                  <p className="text-xs text-earth-500">{selectedBooking.centreId}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                <span className="text-sm font-bold text-earth-500">Schedule</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-forest-900">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  <p className="text-xs text-earth-500">{selectedBooking.slot}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-earth-100 pb-3">
                <span className="text-sm font-bold text-earth-500">Crop Expected</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-forest-900">{selectedBooking.expectedQuantity} Quintals</p>
                  <p className="text-xs text-earth-500">{selectedBooking.crop}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-bold text-earth-500">Status</span>
                <Badge variant={selectedBooking.status === 'Confirmed' ? 'success' : selectedBooking.status === 'Cancelled' ? 'danger' : 'neutral'}>
                  {selectedBooking.status}
                </Badge>
              </div>
            </div>
            <div className="p-4 border-t border-earth-100 bg-earth-50 flex justify-end">
              <Button onClick={() => setSelectedBooking(null)} className="bg-forest-600 hover:bg-forest-700 text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
