import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { IndianRupee, Download, CheckCircle2, Clock, FileText } from 'lucide-react';

const Payments = () => {
  const { state, currentUser } = useAppContext();
  
  const payments = state.payments.filter(p => p.farmerId === currentUser.id).sort((a,b) => new Date(b.date) - new Date(a.date));
  
  // Aggregate stats
  const totalReceived = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Processing').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Payments & Settlements</h2>
        <p className="text-earth-600 mt-1">Track your procurement payments and download receipts.</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-md bg-gradient-to-br from-forest-800 to-forest-950 text-white">
          <CardContent className="p-6">
            <p className="text-forest-200 text-xs font-bold uppercase tracking-widest mb-2">Total Amount Received (This Year)</p>
            <h3 className="text-4xl font-black">₹{totalReceived.toLocaleString('en-IN')}</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-2">Pending / Processing</p>
            <h3 className="text-4xl font-black">₹{totalPending.toLocaleString('en-IN')}</h3>
          </CardContent>
        </Card>
      </div>

      {/* PAYMENT HISTORY TABLE */}
      <Card className="border-earth-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-row items-center justify-between">
           <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
             <IndianRupee className="w-5 h-5 text-forest-600" /> Payment History
           </CardTitle>
           <Button variant="outline" size="sm" className="font-bold border-earth-300 text-earth-700 bg-white shadow-sm">
             <Download className="w-4 h-4 mr-1.5" /> Statement
           </Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-earth-200 text-earth-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Procurement ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Transaction Ref</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {payments.length > 0 ? payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-earth-50 transition-colors">
                  <td className="p-4 font-bold text-earth-700">
                    {new Date(payment.date).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}
                  </td>
                  <td className="p-4 font-bold text-earth-900">{payment.procurementId}</td>
                  <td className="p-4 font-black text-forest-900 text-lg">₹{payment.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                     <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit ${
                       payment.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                     }`}>
                       {payment.status === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                       {payment.status}
                     </div>
                  </td>
                  <td className="p-4 font-medium text-earth-600 text-sm font-mono">{payment.transactionId || 'Pending'}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="text-forest-600 hover:bg-forest-100" title="Download Receipt">
                      <FileText className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-earth-500 font-medium">
                    No payment history found.
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

export default Payments;
