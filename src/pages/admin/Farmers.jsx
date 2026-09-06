import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, User } from 'lucide-react';

const AdminFarmers = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
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
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-earth-500 bg-earth-50 uppercase border-b border-earth-200">
               <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Farmer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Location</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Crop Details</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Activity</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {currentFarmers.length > 0 ? (
                 currentFarmers.map(farmer => {
                   const farmerBookings = state.bookings.filter(b => b.farmerId === farmer.id);
                   const farmerProcurements = state.procurements.filter(p => p.farmerId === farmer.id);
                   
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
                                   <span>{farmer.id}</span>
                                   <span className="w-1 h-1 rounded-full bg-earth-300"></span>
                                   <span>+91 {farmer.mobile}</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{farmer.village}</p>
                           <p className="text-xs text-earth-500">{farmer.district}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{farmer.primaryCrop}</p>
                           <p className="text-xs text-earth-500">{farmer.expectedQuantity} Q • {farmer.landArea} Acres</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-4 text-xs font-medium">
                              <div>
                                <span className="text-earth-500">Bookings: </span>
                                <span className="text-forest-900">{farmerBookings.length}</span>
                              </div>
                              <div>
                                <span className="text-earth-500">Procured: </span>
                                <span className="text-forest-900">{farmerProcurements.length}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" className="text-forest-600 hover:text-forest-700 hover:bg-forest-50">
                             <Eye className="w-4 h-4 mr-2" />
                             View
                           </Button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="6" className="px-6 py-12 text-center text-earth-500">
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
    </div>
  );
};

export default AdminFarmers;
