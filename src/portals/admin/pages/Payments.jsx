import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, Eye, IndianRupee, Download } from 'lucide-react';

const AdminPayments = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Enhance procurements with farmer and centre details to generate payments
  const payments = state.procurements
    .filter(p => p.status === 'Completed' || p.status === 'Pending')
    .map(proc => {
      const farmer = state.farmers.find(f => f.id === proc.farmerId) || {};
      const centre = state.centres.find(c => c.id === proc.centreId) || {};
      
      // Mock payment status based on procurement completion
      let paymentStatus = 'Pending';
      let txRef = '---';
      if (proc.status === 'Completed') {
        // Randomize payment status for demo purposes, heavily weighted towards Completed
        const rand = Math.random();
        if (rand > 0.8) {
          paymentStatus = 'Processing';
          txRef = `TRX-${Math.floor(Math.random() * 90000) + 10000}`;
        } else if (rand > 0.05) {
          paymentStatus = 'Completed';
          txRef = `TRX-${Math.floor(Math.random() * 90000) + 10000}`;
        } else {
          paymentStatus = 'Failed';
        }
      }

      return {
        id: `PAY-${proc.id.split('-')[1] || proc.id}`,
        procurementId: proc.id,
        farmerName: farmer.name,
        centreName: centre.name,
        amount: proc.amount,
        status: paymentStatus,
        txRef,
        updatedAt: proc.date || new Date().toISOString()
      };
    });

  const filteredPayments = payments.filter(pay => 
    pay.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pay.farmerName && pay.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    pay.txRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const paid = payments.filter(p => p.status === 'Completed').reduce((acc, p) => acc + (p.amount || 0), 0);
  const processing = payments.filter(p => p.status === 'Processing').reduce((acc, p) => acc + (p.amount || 0), 0);
  const pending = payments.filter(p => p.status === 'Pending' || p.status === 'Failed').reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Payment Monitoring</h2>
          <p className="text-earth-600 mt-1">Direct Benefit Transfer (DBT) and procurement settlement status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search by ID, Farmer, Transaction..." 
              className="pl-9 bg-white border-earth-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-forest-200 shadow-sm bg-white">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-earth-500">Total Value</p>
            <h3 className="text-2xl font-black text-forest-900 mt-1">₹ {(totalValue / 10000000).toFixed(2)} Cr</h3>
          </CardContent>
        </Card>
        <Card className="border-green-200 shadow-sm bg-green-50/30">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-green-800">Paid (Settled)</p>
            <h3 className="text-2xl font-black text-green-900 mt-1">₹ {(paid / 10000000).toFixed(2)} Cr</h3>
          </CardContent>
        </Card>
        <Card className="border-amber-200 shadow-sm bg-amber-50/30">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-amber-800">Processing</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">₹ {(processing / 100000).toFixed(2)} L</h3>
          </CardContent>
        </Card>
        <Card className="border-red-200 shadow-sm bg-red-50/30">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-medium text-red-800">Pending / Failed</p>
            <h3 className="text-2xl font-black text-red-900 mt-1">₹ {(pending / 100000).toFixed(2)} L</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-earth-100 py-4 bg-earth-50">
           <CardTitle className="text-lg text-forest-900">Payment Queue Backlog</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-earth-500 bg-earth-50/50 uppercase border-b border-earth-200">
               <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Payment / Proc ID</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Farmer & Centre</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Tx Reference</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {filteredPayments.length > 0 ? (
                 filteredPayments.slice(0, 15).map(pay => {
                   
                   let statusBadge = 'neutral';
                   if (pay.status === 'Completed') statusBadge = 'success';
                   if (pay.status === 'Processing') statusBadge = 'warning';
                   if (pay.status === 'Failed') statusBadge = 'danger';
                   if (pay.status === 'Pending') statusBadge = 'outline';

                   return (
                     <tr key={pay.id} className="hover:bg-earth-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-forest-900 mb-0.5">{pay.id}</p>
                           <p className="text-[10px] text-earth-500">{pay.procurementId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{pay.farmerName}</p>
                           <p className="text-[10px] text-earth-500">{pay.centreName}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-forest-900">₹ {pay.amount?.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={statusBadge}>{pay.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-mono text-xs text-earth-600 bg-earth-100 px-2 py-1 rounded">{pay.txRef}</span>
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
                     <IndianRupee className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-lg font-medium text-earth-900">No payments found</p>
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
