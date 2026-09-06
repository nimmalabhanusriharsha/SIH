import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Scale, Save, Check, User, Calculator } from 'lucide-react';

const StaffWeighing = () => {
  const { state, setState, currentUser } = useAppContext();
  
  // Find farmers who are waiting for Weighing
  const currentFarmerQueue = state.queue.find(q => q.status === 'Weighing');
  const farmer = currentFarmerQueue ? state.farmers.find(f => f.id === currentFarmerQueue.farmerId) : null;
  const booking = currentFarmerQueue ? state.bookings.find(b => b.token === currentFarmerQueue.token) : null;

  const [formData, setFormData] = useState({
    actualQuantity: '',
    rate: '2369', // Default MSP rate
    scaleReference: '',
    remarks: ''
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const qty = parseFloat(formData.actualQuantity) || 0;
    const rate = parseFloat(formData.rate) || 0;
    setTotalAmount(qty * rate);
  }, [formData.actualQuantity, formData.rate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentFarmerQueue) return;

    if (parseFloat(formData.actualQuantity) <= 0 || parseFloat(formData.rate) <= 0) {
      alert("Quantity and Rate must be greater than 0.");
      return;
    }

    // 1. Advance queue status to 'Completed' (removed from active waiting queue conceptually, but we can mark it Procurement)
    const updatedQueue = state.queue.map(q => 
      q.id === currentFarmerQueue.id ? { ...q, status: 'Completed' } : q
    );

    // 2. Advance booking status to 'Procurement' (Pending admin/manager confirmation)
    const updatedBookings = state.bookings.map(b => 
      b.id === booking.id ? { ...b, status: 'Procurement' } : b
    );

    // 3. Create a draft procurement record
    const newProcurement = {
      id: `PRC-${Date.now()}`,
      bookingId: booking.id,
      farmerId: farmer.id,
      centreId: currentUser.centreId,
      crop: booking.crop,
      actualQuantity: parseFloat(formData.actualQuantity),
      rate: parseFloat(formData.rate),
      totalAmount: totalAmount,
      quality: 'Accepted',
      date: new Date().toISOString(),
      status: 'Pending' // Pending final manager confirmation
    };
    
    // 4. Add activity log
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser.id,
      action: `Completed weighing for token ${currentFarmerQueue.token}. Qty: ${formData.actualQuantity}Q, Total: ₹${totalAmount.toLocaleString('en-IN')}`,
      farmerName: farmer?.name,
      bookingId: booking?.id
    };

    setState(prev => ({
      ...prev,
      queue: updatedQueue,
      bookings: updatedBookings,
      procurements: [newProcurement, ...(prev.procurements || [])],
      activity: [newActivity, ...(prev.activity || [])]
    }));

    alert("Weighing completed successfully. Moved to Procurement Confirmation.");
    
    setFormData({
      actualQuantity: '',
      rate: '2369',
      scaleReference: '',
      remarks: ''
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-forest-900 tracking-tight">Digital Weighing</h2>
        <p className="text-earth-600 mt-1 font-medium">Record final weighed quantities and calculate procurement amount.</p>
      </div>

      {!currentFarmerQueue ? (
        <Card className="border-earth-200 border-dashed bg-earth-50/50 shadow-none">
           <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Scale className="w-16 h-16 text-earth-300 mb-4" />
              <h3 className="text-xl font-bold text-earth-700">No Farmer Ready for Weighing</h3>
              <p className="text-earth-500 font-medium max-w-sm mt-2">Complete the quality check for a farmer before they can proceed to weighing.</p>
           </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* CURRENT FARMER DETAILS */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border-forest-200 shadow-sm bg-forest-50/50 overflow-hidden h-full">
               <div className="bg-forest-900 px-4 py-2 flex justify-between items-center">
                 <span className="text-xs font-bold text-forest-200 uppercase tracking-widest">Now Weighing</span>
                 <Badge className="bg-forest-700 text-white border-forest-600 font-black">{currentFarmerQueue.token}</Badge>
               </div>
               <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-forest-100 shadow-sm">
                      <User className="w-6 h-6 text-forest-600" />
                    </div>
                    <div>
                      <p className="font-bold text-forest-900 text-lg">{farmer?.name}</p>
                      <p className="text-xs font-medium text-forest-700">{farmer?.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 bg-white rounded-xl p-4 border border-forest-100 shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Booking ID</p>
                      <p className="font-bold text-earth-900">{booking?.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Crop</p>
                      <p className="font-bold text-forest-700">{booking?.crop}</p>
                    </div>
                    <div className="pt-3 border-t border-forest-50">
                      <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest text-center mb-1">Expected Quantity</p>
                      <p className="text-2xl font-black text-center text-forest-900">{booking?.expectedQuantity} Q</p>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* WEIGHING FORM */}
          <div className="md:col-span-2">
            <Card className="border-earth-200 shadow-sm bg-white h-full">
              <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
                <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-forest-600" /> Weighing Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Actual Quantity (Quintals) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Input 
                          type="number" step="0.01" required
                          placeholder="e.g. 24.72"
                          className="h-14 text-xl border-earth-300 font-black pl-4 pr-12 focus:ring-forest-500"
                          value={formData.actualQuantity}
                          onChange={(e) => setFormData({...formData, actualQuantity: e.target.value})}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-earth-400">Q</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Procurement Rate (₹/Q) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-earth-400">₹</span>
                        <Input 
                          type="number" required
                          className="h-14 text-xl border-earth-300 font-bold pl-8 focus:ring-forest-500"
                          value={formData.rate}
                          onChange={(e) => setFormData({...formData, rate: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-inner flex flex-col items-center justify-center text-center relative overflow-hidden">
                     <Calculator className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-500/10" />
                     <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1 relative z-10">Calculated Total Amount</p>
                     <h3 className="text-4xl font-black text-amber-900 relative z-10">₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Scale/Machine Ref.</label>
                      <Input 
                        placeholder="e.g. SCL-02"
                        className="h-12 border-earth-300 font-bold uppercase"
                        value={formData.scaleReference}
                        onChange={(e) => setFormData({...formData, scaleReference: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Remarks</label>
                      <Input 
                        placeholder="Optional note"
                        className="h-12 border-earth-300 font-medium"
                        value={formData.remarks}
                        onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-earth-100">
                     <Button type="button" variant="outline" className="flex-1 font-bold border-earth-300 text-earth-700 bg-white">
                       <Save className="w-4 h-4 mr-2" /> Save Draft
                     </Button>
                     <Button type="submit" className="flex-1 font-bold bg-green-600 hover:bg-green-700 text-white shadow-md">
                       <Check className="w-4 h-4 mr-2" /> Complete Weighing
                     </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
};

export default StaffWeighing;
