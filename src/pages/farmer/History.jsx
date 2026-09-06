import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { History as HistoryIcon, Search, PackageCheck, IndianRupee, Eye, MapPin } from 'lucide-react';
import { Input } from '../../components/ui/Input';

const History = () => {
  const { state, currentUser } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');

  const procurements = state.procurements
    .filter(p => p.farmerId === currentUser.id)
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  const filtered = procurements.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Procurement History</h2>
        <p className="text-earth-600 mt-1">View your past procurements and corresponding details.</p>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
           <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
             <HistoryIcon className="w-5 h-5 text-forest-600" /> Past Records
           </CardTitle>
           <div className="relative w-full md:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
             <Input 
               placeholder="Search ID or Crop..." 
               className="pl-9 h-10 border-earth-300"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-earth-200 text-earth-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Procurement ID</th>
                <th className="p-4">Date & Centre</th>
                <th className="p-4">Crop Details</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {filtered.length > 0 ? filtered.map((record) => {
                const centre = state.centres.find(c => c.id === record.centreId);
                return (
                  <tr key={record.id} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-earth-900">{record.id}</p>
                      <Badge variant="outline" className="mt-1 text-[9px] uppercase">{record.bookingId}</Badge>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-earth-700">{new Date(record.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                      <p className="text-xs text-earth-500 flex items-center gap-1 mt-1 font-medium"><MapPin className="w-3 h-3"/> {centre?.name}</p>
                    </td>
                    <td className="p-4">
                       <p className="font-bold text-forest-900 flex items-center gap-1.5"><PackageCheck className="w-4 h-4 text-forest-600"/> {record.actualQuantity} Quintals of {record.crop}</p>
                       <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-1 uppercase font-bold text-[9px]">{record.quality}</Badge>
                    </td>
                    <td className="p-4">
                       <p className="font-black text-earth-900 text-lg">₹{record.totalAmount.toLocaleString('en-IN')}</p>
                       <p className="text-xs font-bold text-earth-500 mt-1">@ ₹{record.rate}/qtl</p>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" className="font-bold text-earth-700 border-earth-300">
                        <Eye className="w-4 h-4 mr-1.5" /> Details
                      </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-earth-500 font-medium">
                    No procurement records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default History;
