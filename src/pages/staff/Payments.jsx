import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { IndianRupee, Search, Filter, Check, Clock, X, AlertCircle } from 'lucide-react';

const StaffPayments = () => {
  const { state, setState, currentUser } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');

  // We consider a payment ready to process if there's a completed procurement
  // For this mock, we assume 'payments' are derived from completed procurements, or we have a separate payments array.
  // We'll manage it directly on the procurements array or a dedicated payments array if it exists. 
  // Let's use the `payments` state array if we have it, else derive it.
  
  // Actually, we should use a `payments` array in state. Let's assume it exists, or create mock entries from completed procurements.
  // For the sake of this UI, let's map over procurements that are 'Completed' and check if they have a corresponding payment record, or just manage the payment status on the procurement object itself for simplicity in this frontend demo.
  // Let's assume `procurement.paymentStatus` exists (Pending, Processing, Completed, Failed)
  
  const paymentRecords = state.procurements.filter(p => p.status === 'Completed').map(p => ({
    ...p,
    paymentStatus: p.paymentStatus || 'Pending',
    transactionRef: p.transactionRef || null
  }));

  const filteredPayments = paymentRecords
    .filter(p => statusFilter === 'All' || p.paymentStatus === statusFilter)
    .filter(p => {
       const farmer = state.farmers.find(f => f.id === p.farmerId);
       const searchLower = searchTerm.toLowerCase();
       return p.id.toLowerCase().includes(searchLower) || 
              farmer?.name.toLowerCase().includes(searchLower) ||
              farmer?.id.toLowerCase().includes(searchLower);
    });

  const handleUpdateStatus = (newStatus) => {
    if (!selectedPayment) return;
    
    if (newStatus === 'Completed' && !transactionRef) {
       alert("Transaction Reference is required to mark as Completed.");
       return;
    }

    const updatedProcurements = state.procurements.map(p => 
      p.id === selectedPayment.id ? { 
        ...p, 
        paymentStatus: newStatus,
        transactionRef: newStatus === 'Completed' ? transactionRef : p.transactionRef
      } : p
    );
    
    // Add Activity
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser.id,
      action: `Updated payment status to ${newStatus} for procurement ${selectedPayment.id}`,
      farmerName: state.farmers.find(f => f.id === selectedPayment.farmerId)?.name,
      bookingId: selectedPayment.bookingId
    };

    setState(prev => ({
      ...prev,
      procurements: updatedProcurements,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    setSelectedPayment(null);
    setTransactionRef('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Payment Operations</h2>
          <p className="text-earth-600 mt-1 font-medium">Update the disbursement status for completed procurements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div className="bg-white border border-earth-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Pending Payments</p>
            <h3 className="text-2xl font-black text-amber-600">{paymentRecords.filter(p=>p.paymentStatus==='Pending').length}</h3>
         </div>
         <div className="bg-white border border-earth-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Processing</p>
            <h3 className="text-2xl font-black text-blue-600">{paymentRecords.filter(p=>p.paymentStatus==='Processing').length}</h3>
         </div>
         <div className="bg-white border border-earth-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Completed Today</p>
            <h3 className="text-2xl font-black text-green-600">{paymentRecords.filter(p=>p.paymentStatus==='Completed').length}</h3>
         </div>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto custom-scrollbar pb-2 lg:pb-0">
             {['All', 'Pending', 'Processing', 'Completed', 'Failed'].map(f => (
               <button 
                 key={f}
                 onClick={() => setStatusFilter(f)}
                 className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider ${
                   statusFilter === f ? 'bg-forest-900 text-white' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-100'
                 }`}
               >
                 {f}
               </button>
             ))}
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
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-earth-200 text-earth-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Procurement ID</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Transaction Ref</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {filteredPayments.length > 0 ? filteredPayments.map((p) => {
                const farmer = state.farmers.find(f => f.id === p.farmerId);
                
                return (
                  <tr key={p.id} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4 font-bold text-forest-900">{p.id}</td>
                    <td className="p-4">
                       <p className="font-bold text-earth-800">{farmer?.name}</p>
                       <p className="text-xs font-medium text-earth-500">{farmer?.id}</p>
                    </td>
                    <td className="p-4 font-black text-forest-700 text-lg">₹{p.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="p-4">
                       <Badge className={`uppercase font-bold tracking-widest text-[9px] ${
                         p.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                         p.paymentStatus === 'Processing' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                         p.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700 border-red-200' :
                         'bg-amber-100 text-amber-700 border-amber-200'
                       }`}>
                         {p.paymentStatus}
                       </Badge>
                    </td>
                    <td className="p-4">
                       {p.transactionRef ? (
                         <span className="font-mono text-xs font-bold text-earth-600 bg-earth-100 px-2 py-1 rounded">{p.transactionRef}</span>
                       ) : (
                         <span className="text-earth-400 text-xs">--</span>
                       )}
                    </td>
                    <td className="p-4 text-right">
                       <Button size="sm" variant="outline" className="h-8 font-bold text-xs shadow-sm bg-white border-earth-300 text-earth-700" onClick={() => setSelectedPayment(p)}>
                         Update
                       </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <IndianRupee className="w-10 h-10 text-earth-300 mb-2" />
                      <p className="text-earth-500 font-bold">No payment records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* UPDATE STATUS MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-forest-950/80 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-forest-900 p-5 flex justify-between items-center text-white">
                 <h3 className="font-bold text-lg flex items-center gap-2"><IndianRupee className="w-5 h-5" /> Update Payment</h3>
                 <button onClick={() => {
                   setSelectedPayment(null);
                   setTransactionRef('');
                 }} className="text-forest-300 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-6 space-y-6">
                 
                 <div className="text-center">
                    <p className="text-xs font-bold text-earth-500 uppercase tracking-widest mb-1">Procurement Amount</p>
                    <h3 className="text-4xl font-black text-forest-900 mb-2">₹{selectedPayment.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
                    <p className="text-sm font-bold text-earth-700">{state.farmers.find(f => f.id === selectedPayment.farmerId)?.name}</p>
                 </div>
                 
                 <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 text-sm font-medium text-blue-900">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <p>This does not process actual funds. It only updates the status visible to the farmer.</p>
                 </div>

                 <div className="space-y-3">
                    <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block">Change Status To:</label>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant={selectedPayment.paymentStatus === 'Processing' ? 'default' : 'outline'} className={`h-12 font-bold ${selectedPayment.paymentStatus === 'Processing' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-blue-200 text-blue-700 hover:bg-blue-50 bg-white'}`} onClick={() => handleUpdateStatus('Processing')}>
                         <Clock className="w-4 h-4 mr-2" /> Mark Processing
                       </Button>
                       <Button variant={selectedPayment.paymentStatus === 'Failed' ? 'default' : 'outline'} className={`h-12 font-bold ${selectedPayment.paymentStatus === 'Failed' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-200 text-red-700 hover:bg-red-50 bg-white'}`} onClick={() => handleUpdateStatus('Failed')}>
                         <X className="w-4 h-4 mr-2" /> Mark Failed
                       </Button>
                    </div>
                 </div>

                 <div className="border-t border-earth-200 pt-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Transaction Reference (Required for Completed)</label>
                      <Input 
                        placeholder="e.g. UTR-9876543210"
                        className="h-12 border-earth-300 font-mono font-bold"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                      />
                    </div>
                    <Button className="w-full h-12 font-bold bg-green-600 hover:bg-green-700 text-white shadow-md text-base" onClick={() => handleUpdateStatus('Completed')}>
                      <Check className="w-5 h-5 mr-2" /> Mark Completed
                    </Button>
                 </div>

              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default StaffPayments;
