import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { IndianRupee, Search, Check, X } from 'lucide-react';

const StaffPayments = () => {
  const { state, setState, currentUser } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');

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
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">PROCUREMENT CENTRE</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Payment Operations</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Update the disbursement status for completed procurements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Pending Payments</p>
            <h3 className="text-2xl md:text-3xl font-black text-amber-600">{paymentRecords.filter(p=>p.paymentStatus==='Pending').length}</h3>
         </div>
         <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Processing</p>
            <h3 className="text-2xl md:text-3xl font-black text-blue-600">{paymentRecords.filter(p=>p.paymentStatus==='Processing').length}</h3>
         </div>
         <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Completed Today</p>
            <h3 className="text-2xl md:text-3xl font-black text-[#046a38]">{paymentRecords.filter(p=>p.paymentStatus==='Completed').length}</h3>
         </div>
      </div>

      <Card className="border border-slate-100 shadow-xs overflow-hidden bg-white rounded-2xl">
        <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto custom-scrollbar pb-1 lg:pb-0">
             {['All', 'Pending', 'Processing', 'Completed', 'Failed'].map(f => (
               <button 
                 key={f}
                 onClick={() => setStatusFilter(f)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                   statusFilter === f 
                     ? 'bg-[#046a38] text-white shadow-xs' 
                     : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="flex gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <Input 
                 placeholder="Search procurement or farmer..." 
                 className="pl-9 h-9 border-slate-200 text-sm font-medium rounded-xl focus:border-[#046a38]"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-100 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Procurement ID</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Transaction Ref</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPayments.length > 0 ? filteredPayments.map((p) => {
                const farmer = state.farmers.find(f => f.id === p.farmerId);
                
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-[#046a38] text-sm">{p.id}</td>
                    <td className="p-4">
                       <p className="font-bold text-slate-900">{farmer?.name}</p>
                       <p className="text-xs font-medium text-slate-500">{farmer?.id}</p>
                    </td>
                    <td className="p-4 font-black text-slate-900 text-lg">₹{p.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="p-4">
                       <span className={`px-2.5 py-1 rounded-full uppercase font-extrabold tracking-wider text-[10px] border ${
                         p.paymentStatus === 'Completed' ? 'bg-[#e6f4ea] text-[#046a38] border-emerald-200' :
                         p.paymentStatus === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                         p.paymentStatus === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                         'bg-amber-50 text-amber-700 border-amber-200'
                       }`}>
                         {p.paymentStatus}
                       </span>
                    </td>
                    <td className="p-4">
                       {p.transactionRef ? (
                         <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">{p.transactionRef}</span>
                       ) : (
                         <span className="text-slate-400 text-xs">--</span>
                       )}
                    </td>
                    <td className="p-4 text-right">
                       <Button size="sm" variant="outline" className="h-8 font-bold text-xs shadow-xs bg-white border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50" onClick={() => setSelectedPayment(p)}>
                         Update
                       </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <IndianRupee className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-500 font-bold text-sm">No payment records found.</p>
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
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-[#046a38] p-5 flex justify-between items-center text-white">
                 <h3 className="font-bold text-lg flex items-center gap-2"><IndianRupee className="w-5 h-5" /> Update Payment</h3>
                 <button onClick={() => setSelectedPayment(null)} className="text-white/80 hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-6 space-y-6">
                 
                 <div className="bg-[#f0f8f3] p-4 rounded-xl border border-emerald-200">
                    <p className="text-[10px] font-extrabold text-[#046a38] uppercase tracking-widest mb-1">Procurement Record</p>
                    <p className="font-bold text-slate-900 text-lg">{selectedPayment.id}</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">Amount: ₹{selectedPayment.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Transaction Reference ID</label>
                   <Input 
                     placeholder="e.g. UTR98234710293"
                     className="h-12 border-slate-200 font-mono font-bold uppercase rounded-xl focus:border-[#046a38]"
                     value={transactionRef}
                     onChange={(e) => setTransactionRef(e.target.value)}
                   />
                 </div>

                 <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Set Payment Status</p>
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" className="text-xs font-bold border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl" onClick={() => handleUpdateStatus('Pending')}>
                         Pending
                       </Button>
                       <Button variant="outline" className="text-xs font-bold border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-xl" onClick={() => handleUpdateStatus('Processing')}>
                         Processing
                       </Button>
                       <Button className="text-xs font-bold bg-[#046a38] hover:bg-[#03522c] text-white rounded-xl" onClick={() => handleUpdateStatus('Completed')}>
                         <Check className="w-3.5 h-3.5 mr-1" /> Complete
                       </Button>
                    </div>
                 </div>

                 <div className="pt-2">
                    <Button variant="ghost" className="w-full font-bold text-slate-500" onClick={() => setSelectedPayment(null)}>Cancel</Button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default StaffPayments;
