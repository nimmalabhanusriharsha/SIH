import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, PackageOpen, Download } from 'lucide-react';

const AdminProcurement = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Enhance procurements with farmer and centre details
  const enhancedProcurements = state.procurements.map(proc => {
    const farmer = state.farmers.find(f => f.id === proc.farmerId) || {};
    const centre = state.centres.find(c => c.id === proc.centreId) || {};
    return { ...proc, farmerName: farmer.name, centreName: centre.name };
  });

  // Filter procurements
  const filteredProcurements = enhancedProcurements.filter(proc => 
    proc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (proc.farmerName && proc.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (proc.centreName && proc.centreName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProcurements.length / itemsPerPage);
  const currentProcurements = filteredProcurements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalProcured = filteredProcurements.filter(p => p.status === 'Completed').reduce((acc, p) => acc + (p.quantity || 0), 0);
  const totalValue = filteredProcurements.filter(p => p.status === 'Completed').reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Procurement Monitoring</h2>
          <p className="text-earth-600 mt-1">Track crop intake and generated procurement value.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search by ID, Farmer, Centre..." 
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-forest-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-earth-500">Total Procurements</p>
            <h3 className="text-2xl font-black text-forest-900 mt-1">{filteredProcurements.length}</h3>
          </CardContent>
        </Card>
        <Card className="border-forest-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-earth-500">Total Quantity</p>
            <h3 className="text-2xl font-black text-forest-900 mt-1">{totalProcured.toLocaleString()} Q</h3>
          </CardContent>
        </Card>
        <Card className="border-forest-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-earth-500">Total Value</p>
            <h3 className="text-2xl font-black text-forest-900 mt-1">₹ {totalValue.toLocaleString()}</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-earth-500 bg-earth-50 uppercase border-b border-earth-200">
               <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Procurement ID</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Farmer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Centre</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Crop Details</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Amount Generated</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {currentProcurements.length > 0 ? (
                 currentProcurements.map(proc => {
                   
                   let statusBadge = 'default';
                   if (proc.status === 'Completed') statusBadge = 'success';
                   if (proc.status === 'Pending') statusBadge = 'warning';

                   return (
                     <tr key={proc.id} className="hover:bg-earth-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-forest-900 mb-0.5">{proc.id}</p>
                           <p className="text-[10px] text-earth-500">
                             {new Date(proc.date || new Date()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                           </p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{proc.farmerName}</p>
                           <p className="text-[10px] text-earth-500">{proc.farmerId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{proc.centreName}</p>
                           <p className="text-[10px] text-earth-500">{proc.centreId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-earth-900">{proc.quantity} Q</p>
                           <p className="text-[10px] text-earth-500">{proc.crop} @ ₹{proc.rate}/Q</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-forest-900">₹ {proc.amount?.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={statusBadge}>{proc.status}</Badge>
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
                   <td colSpan="7" className="px-6 py-12 text-center text-earth-500">
                     <PackageOpen className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-lg font-medium text-earth-900">No procurements found</p>
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
              Showing <span className="font-bold text-forest-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-forest-900">{Math.min(currentPage * itemsPerPage, filteredProcurements.length)}</span> of <span className="font-bold text-forest-900">{filteredProcurements.length}</span> records
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

export default AdminProcurement;
