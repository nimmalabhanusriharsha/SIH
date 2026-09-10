import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { 
  CreditCard, CheckCircle2, Clock, Search, 
  Check, RefreshCw
} from 'lucide-react';

const StaffPayments = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Derive procurement & payment records strictly without exposing bank details
  const masterRecords = useMemo(() => {
    const procurements = state.procurements || [];

    const baselineRecords = [
      {
        id: 'PRC-1001',
        token: '#A-042',
        bookingId: 'BK-1001',
        farmerName: 'Ramesh Kumar',
        farmerId: 'FARM-9021',
        phone: '+91 98765 43210',
        crop: 'Paddy',
        quantity: 450,
        rate: 23.69,
        amount: 10660.50,
        date: '10 Sep 2026',
        paymentStatus: 'Pending',
        transactionRef: ''
      },
      {
        id: 'PRC-1002',
        token: '#A-043',
        bookingId: 'BK-1002',
        farmerName: 'Suresh Babu',
        farmerId: 'FARM-8812',
        phone: '+91 94401 56789',
        crop: 'Maize',
        quantity: 520,
        rate: 20.90,
        amount: 10868.00,
        date: '10 Sep 2026',
        paymentStatus: 'Pending',
        transactionRef: ''
      },
      {
        id: 'PRC-1003',
        token: '#A-044',
        bookingId: 'BK-1003',
        farmerName: 'Anitha Devi',
        farmerId: 'FARM-7719',
        phone: '+91 98665 43210',
        crop: 'Cotton',
        quantity: 380,
        rate: 71.21,
        amount: 27059.80,
        date: '10 Sep 2026',
        paymentStatus: 'Pending',
        transactionRef: ''
      },
      {
        id: 'PRC-1004',
        token: '#A-038',
        bookingId: 'BK-0998',
        farmerName: 'Venkata Ramana',
        farmerId: 'FARM-6651',
        phone: '+91 99890 11223',
        crop: 'Red Gram',
        quantity: 600,
        rate: 70.00,
        amount: 42000.00,
        date: '09 Sep 2026',
        paymentStatus: 'Paid',
        transactionRef: 'UTR-908234101'
      },
      {
        id: 'PRC-1005',
        token: '#A-039',
        bookingId: 'BK-0999',
        farmerName: 'Lakshmi Prasad',
        farmerId: 'FARM-5541',
        phone: '+91 97012 33445',
        crop: 'Wheat',
        quantity: 400,
        rate: 22.75,
        amount: 9100.00,
        date: '09 Sep 2026',
        paymentStatus: 'Paid',
        transactionRef: 'UTR-908234102'
      },
      {
        id: 'PRC-1006',
        token: '#A-040',
        bookingId: 'BK-1000',
        farmerName: 'Koteswara Rao',
        farmerId: 'FARM-4431',
        phone: '+91 94901 88776',
        crop: 'Groundnut',
        quantity: 480,
        rate: 67.80,
        amount: 32544.00,
        date: '09 Sep 2026',
        paymentStatus: 'Paid',
        transactionRef: 'UTR-908234103'
      }
    ];

    const userProcurements = procurements.map((p, idx) => {
      const isPaid = (p.paymentStatus || 'Pending').toLowerCase() === 'paid';
      const farmer = (state.farmers || []).find(f => f.id === p.farmerId || f.farmerId === p.farmerId);

      return {
        id: p.id || `PRC-${1000 + idx}`,
        token: p.token || `A${100 + idx}`,
        bookingId: p.bookingId || `BK-${1000 + idx}`,
        farmerName: p.farmerName || farmer?.name || 'Verified Farmer',
        farmerId: p.farmerId || farmer?.id || 'KIS-000000',
        phone: p.phone || farmer?.phone || farmer?.mobile || '98765 00000',
        crop: p.crop || p.commodity || 'Paddy',
        quantity: p.actualQuantity || p.quantity || 500,
        rate: p.rate || 22.50,
        amount: p.totalAmount || p.amount || Math.round((p.actualQuantity || p.quantity || 500) * (p.rate || 22.50)),
        date: p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '10 Sep 2026',
        paymentStatus: isPaid ? 'Paid' : 'Pending',
        transactionRef: p.transactionRef || (isPaid ? `UTR-${900000 + idx}` : '')
      };
    });

    const combined = [...userProcurements];
    baselineRecords.forEach(b => {
      if (!combined.some(c => c.bookingId === b.bookingId || c.id === b.id)) {
        combined.push(b);
      }
    });

    return combined;
  }, [state.procurements, state.farmers]);

  // Separate into Pending vs Completed (Paid)
  const pendingRecords = useMemo(() => {
    return masterRecords.filter(r => r.paymentStatus === 'Pending');
  }, [masterRecords]);

  const completedRecords = useMemo(() => {
    return masterRecords.filter(r => r.paymentStatus === 'Paid');
  }, [masterRecords]);

  // Filtered by Search Query
  const displayedRecords = useMemo(() => {
    const list = activeTab === 'pending' ? pendingRecords : completedRecords;
    if (!searchTerm.trim()) return list;

    const q = searchTerm.toLowerCase();
    return list.filter(r => 
      r.farmerName.toLowerCase().includes(q) ||
      r.farmerId.toLowerCase().includes(q) ||
      r.token.toLowerCase().includes(q) ||
      r.bookingId.toLowerCase().includes(q)
    );
  }, [activeTab, pendingRecords, completedRecords, searchTerm]);

  // Mark as Paid Handler with State & Database Persistence
  const handleMarkAsPaid = async (record) => {
    if (updatingId) return; // Prevent duplicate clicks
    setUpdatingId(record.id);

    const transactionRef = `UTR-${Math.floor(100000000 + Math.random() * 900000000)}`;

    // Update state.procurements
    const updatedProcurements = (state.procurements || []).map(p => {
      if (p.id === record.id || p.bookingId === record.bookingId || p.token === record.token) {
        return {
          ...p,
          paymentStatus: 'Paid',
          paymentStatusKey: 'paid',
          status: 'Completed',
          transactionRef: transactionRef
        };
      }
      return p;
    });

    // Update state.payments
    const updatedPayments = (state.payments || []).map(p => {
      if (p.procurementId === record.id || p.bookingId === record.bookingId || p.farmerId === record.farmerId) {
        return {
          ...p,
          status: 'Paid',
          paymentStatus: 'Paid',
          transactionId: transactionRef
        };
      }
      return p;
    });

    // If matching payment entry doesn't exist, push a new payment record
    const paymentExists = (state.payments || []).some(p => p.procurementId === record.id);
    const finalPayments = paymentExists ? updatedPayments : [
      {
        id: `PAY-${Date.now().toString().slice(-6)}`,
        procurementId: record.id,
        bookingId: record.bookingId,
        farmerId: record.farmerId,
        farmerName: record.farmerName,
        amount: record.amount,
        status: 'Paid',
        paymentStatus: 'Paid',
        date: new Date().toISOString(),
        transactionId: transactionRef
      },
      ...updatedPayments
    ];

    // Create activity log entry
    const counterId = currentUser?.counterId || 'Counter 1';
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser?.id || 'STAFF-01',
      counterId: counterId,
      farmerName: record.farmerName,
      farmerId: record.farmerId,
      token: record.token,
      action: `Marked payment as Paid for farmer ${record.farmerName} (${record.farmerId}, Token ${record.token}) - Amount: ₹${record.amount.toLocaleString('en-IN')} [${transactionRef}]`
    };

    // Update AppContext State
    setState(prev => ({
      ...prev,
      procurements: updatedProcurements,
      payments: finalPayments,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    // Optional API call sync if backend server running
    try {
      await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procurementId: record.id,
          farmerId: record.farmerId,
          amount: record.amount,
          status: 'Paid',
          transactionId: transactionRef
        })
      });
    } catch (err) {
      // Offline fallback already saved via AppContext
    }

    setUpdatingId(null);
    setToastMsg(`Payment of ₹${record.amount.toLocaleString('en-IN')} marked as PAID for ${record.farmerName} (${record.token}). Updated across all portals.`);

    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 font-sans relative">
      
      {/* SUCCESS TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 max-w-md bg-emerald-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-sm text-emerald-200">Payment Status Updated</h4>
            <p className="text-xs font-medium text-emerald-100 leading-snug mt-0.5">{toastMsg}</p>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-300 hover:text-white font-bold text-xs p-1">✕</button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <p className="text-[11px] font-extrabold text-[#046a38] uppercase tracking-widest">PROCUREMENT CENTRE</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Payments Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track completed procurements and disburse MSP payments to verified farmers.</p>
        </div>
      </div>

      {/* TWO SECTIONS / TABS HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* TAB 1: PENDING PAYMENTS */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#046a38] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" strokeWidth={2.5} />
            <span>Pending Payments</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingRecords.length}
            </span>
          </button>

          {/* TAB 2: PROCUREMENT COMPLETED (PAID) */}
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#046a38] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
            <span>Procurement Completed (Paid)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#046a38]'
            }`}>
              {completedRecords.length}
            </span>
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-72 pr-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search farmer, ID, token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38]"
          />
        </div>

      </div>

      {/* PAYMENTS TABLE CARD */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 py-4 px-5 flex justify-between items-center">
          <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
            {activeTab === 'pending' ? 'Pending Disburse Payments' : 'Completed Disbursement Ledger'}
          </CardTitle>
          <span className="text-xs font-bold text-slate-500">
            Showing {displayedRecords.length} record(s)
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-slate-400 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="p-4 pl-5">Token / ID</th>
                <th className="p-4">Farmer Details</th>
                <th className="p-4">Crop & Qty</th>
                <th className="p-4">Procurement Date</th>
                <th className="p-4">Amount (₹)</th>
                <th className="p-4">Status</th>
                {activeTab === 'completed' && <th className="p-4">Transaction UTR</th>}
                {activeTab === 'pending' && <th className="p-4 pr-5 text-right">Action</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white text-xs font-semibold">
              {displayedRecords.length > 0 ? (
                displayedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-5">
                      <span className="font-black text-[#046a38] text-sm block">{rec.token}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{rec.bookingId}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 text-sm block">{rec.farmerName}</span>
                      <span className="text-[11px] font-mono text-slate-500 block">{rec.farmerId} • {rec.phone}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{rec.crop}</span>
                      <span className="text-slate-500 font-medium">{rec.quantity} kg</span>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {rec.date}
                    </td>

                    <td className="p-4">
                      <span className="font-black text-slate-900 text-sm block">₹{rec.amount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-medium text-slate-400">@ ₹{rec.rate}/kg</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                        rec.paymentStatus === 'Paid'
                          ? 'bg-[#e6f4ea] text-[#046a38] border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {rec.paymentStatus}
                      </span>
                    </td>

                    {activeTab === 'completed' && (
                      <td className="p-4 font-mono text-slate-600 font-bold text-xs">
                        {rec.transactionRef || '—'}
                      </td>
                    )}

                    {activeTab === 'pending' && (
                      <td className="p-4 pr-5 text-right">
                        <button
                          onClick={() => handleMarkAsPaid(rec)}
                          disabled={updatingId === rec.id}
                          className="bg-[#046a38] hover:bg-[#03522c] text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {updatingId === rec.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                          <span>Mark as Paid</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'pending' ? 7 : 7} className="p-10 text-center text-slate-400 font-bold">
                    <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                    <p className="text-sm text-slate-600">No {activeTab} payment records found.</p>
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

export default StaffPayments;
