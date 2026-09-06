import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileSignature, Search, Filter, Check, X, ClipboardCheck } from 'lucide-react';

const StaffProcurement = () => {
  const { state, setState, currentUser } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcurement, setSelectedProcurement] = useState(null);

  // Get procurements that are pending confirmation
  const pendingProcurements = state.procurements
    .filter(p => p.status === 'Pending')
    .filter(p => {
       const farmer = state.farmers.find(f => f.id === p.farmerId);
       const searchLower = searchTerm.toLowerCase();
       return p.id.toLowerCase().includes(searchLower) || 
              farmer?.name.toLowerCase().includes(searchLower) ||
              farmer?.id.toLowerCase().includes(searchLower);
    });

  const handleConfirm = () => {
    if (!selectedProcurement) return;

    // 1. Update procurement status
    const updatedProcurements = state.procurements.map(p => 
      p.id === selectedProcurement.id ? { ...p, status: 'Completed' } : p
    );

    // 2. Add payment record conceptually (or mark booking as Payment Processing)
    const updatedBookings = state.bookings.map(b => 
      b.id === selectedProcurement.bookingId ? { ...b, status: 'Completed' } : b
    );

    // 3. Add Activity
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser.id,
      action: `Confirmed procurement ${selectedProcurement.id} for ₹${selectedProcurement.totalAmount.toLocaleString('en-IN')}`,
      farmerName: state.farmers.find(f => f.id === selectedProcurement.farmerId)?.name,
      bookingId: selectedProcurement.bookingId
    };

    setState(prev => ({
      ...prev,
      procurements: updatedProcurements,
      bookings: updatedBookings,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    setSelectedProcurement(null);
    alert("Procurement confirmed successfully. Added to Payments queue.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Procurement Confirmation</h2>
          <p className="text-earth-600 mt-1 font-medium">Review weighed crops and generate final procurement receipts.</p>
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex items-center gap-2">
             <Badge className="bg-amber-100 text-amber-700 font-bold px-3 py-1 text-sm rounded-full">
               {pendingProcurements.length} Pending
             </Badge>
           </div>
           
           <div className="flex gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
               <Input 
                 placeholder="Search procurement or farmer..." 
                 className="pl-9 h-9 border-earth-300 text-sm font-medium"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <Button variant="outline" className="h-9 border-earth-300 text-earth-700 bg-white">
               <Filter className="w-4 h-4" />
             </Button>
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-earth-200 text-earth-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Procurement ID</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Crop</th>
                <th className="p-4">Actual Qty</th>
                <th className="p-4">Rate</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {pendingProcurements.length > 0 ? pendingProcurements.map((p) => {
                const farmer = state.farmers.find(f => f.id === p.farmerId);
                
                return (
                  <tr key={p.id} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4">
                       <p className="font-bold text-forest-900">{p.id}</p>
                       <p className="text-[10px] font-bold text-earth-400 mt-1 uppercase tracking-wider">{new Date(p.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="p-4">
                       <p className="font-bold text-earth-800">{farmer?.name}</p>
                       <p className="text-xs font-medium text-earth-500">{farmer?.id}</p>
                    </td>
                    <td className="p-4 font-bold text-earth-700">{p.crop}</td>
                    <td className="p-4 font-black text-earth-900">{p.actualQuantity} Q</td>
                    <td className="p-4 font-bold text-earth-700">₹{p.rate}</td>
                    <td className="p-4 font-black text-forest-700 text-lg">₹{p.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="p-4 text-right">
                       <Button size="sm" className="h-8 font-bold text-xs shadow-sm bg-forest-600 hover:bg-forest-700" onClick={() => setSelectedProcurement(p)}>
                         Confirm
                       </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <ClipboardCheck className="w-10 h-10 text-earth-300 mb-2" />
                      <p className="text-earth-500 font-bold">No pending procurements to confirm.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CONFIRMATION MODAL */}
      {selectedProcurement && (
        <div className="fixed inset-0 bg-forest-950/80 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-forest-900 p-5 flex justify-between items-center text-white">
                 <h3 className="font-bold text-lg flex items-center gap-2"><FileSignature className="w-5 h-5" /> Confirm Procurement</h3>
                 <button onClick={() => setSelectedProcurement(null)} className="text-forest-300 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-6 space-y-6">
                 
                 <div className="bg-forest-50 p-4 rounded-xl border border-forest-100">
                    <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest mb-1">Farmer</p>
                    <p className="font-bold text-forest-900 text-lg">{state.farmers.find(f => f.id === selectedProcurement.farmerId)?.name}</p>
                    <p className="text-xs font-medium text-forest-700">{selectedProcurement.farmerId}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white border border-earth-200 p-3 rounded-lg">
                      <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Crop</p>
                      <p className="font-bold text-earth-900">{selectedProcurement.crop}</p>
                   </div>
                   <div className="bg-white border border-earth-200 p-3 rounded-lg">
                      <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Quantity</p>
                      <p className="font-black text-forest-700">{selectedProcurement.actualQuantity} Q</p>
                   </div>
                 </div>

                 <div className="border-t border-dashed border-earth-300 pt-4">
                    <div className="flex justify-between items-end">
                       <p className="font-bold text-earth-700">Total Amount</p>
                       <p className="text-3xl font-black text-forest-900">₹{selectedProcurement.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                    </div>
                 </div>

                 <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 font-bold border-earth-300 text-earth-700 hover:bg-earth-100" onClick={() => setSelectedProcurement(null)}>Cancel</Button>
                    <Button className="flex-1 font-bold bg-green-600 hover:bg-green-700 text-white shadow-md" onClick={handleConfirm}>
                      <Check className="w-4 h-4 mr-2" /> Confirm & Issue Receipt
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default StaffProcurement;
