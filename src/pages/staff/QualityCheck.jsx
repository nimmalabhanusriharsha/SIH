import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, Save, Check, User, Search, RefreshCw } from 'lucide-react';

const StaffQualityCheck = () => {
  const { state, setState, currentUser } = useAppContext();
  
  // Find farmers who are waiting for Quality Check
  // In our simplified mock flow, 'Serving' implies they are at the counter doing QC or Weighing.
  // We'll specifically look for status 'Quality Check' or 'Serving'.
  const currentFarmerQueue = state.queue.find(q => q.status === 'Quality Check' || q.status === 'Serving');
  const farmer = currentFarmerQueue ? state.farmers.find(f => f.id === currentFarmerQueue.farmerId) : null;
  const booking = currentFarmerQueue ? state.bookings.find(b => b.token === currentFarmerQueue.token) : null;

  const [formData, setFormData] = useState({
    moisture: '',
    grade: '',
    foreignMatter: '',
    damagedGrains: '',
    remarks: '',
    status: 'Accepted'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentFarmerQueue) return;

    // Advance queue status to 'Weighing'
    const updatedQueue = state.queue.map(q => 
      q.id === currentFarmerQueue.id ? { ...q, status: 'Weighing' } : q
    );
    
    // Add activity log
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser.id,
      action: `Completed quality check for token ${currentFarmerQueue.token} (Status: ${formData.status})`,
      farmerName: farmer?.name,
      bookingId: booking?.id
    };

    setState(prev => ({
      ...prev,
      queue: updatedQueue,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    alert("Quality Check completed successfully. Farmer moved to Weighing.");
    
    setFormData({
      moisture: '',
      grade: '',
      foreignMatter: '',
      damagedGrains: '',
      remarks: '',
      status: 'Accepted'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-forest-900 tracking-tight">Quality Check</h2>
        <p className="text-earth-600 mt-1 font-medium">Record quality parameters for the farmer currently at your counter.</p>
      </div>

      {!currentFarmerQueue ? (
        <Card className="border-earth-200 border-dashed bg-earth-50/50 shadow-none">
           <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-16 h-16 text-earth-300 mb-4" />
              <h3 className="text-xl font-bold text-earth-700">No Farmer at Counter</h3>
              <p className="text-earth-500 font-medium max-w-sm mt-2">Call the next farmer from the Live Queue to begin their quality assessment.</p>
           </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* CURRENT FARMER DETAILS */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border-forest-200 shadow-sm bg-forest-50/50 overflow-hidden">
               <div className="bg-forest-900 px-4 py-2 flex justify-between items-center">
                 <span className="text-xs font-bold text-forest-200 uppercase tracking-widest">Now Serving</span>
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
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Expected Qty</p>
                      <p className="font-bold text-earth-900">{booking?.expectedQuantity} Quintals</p>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* QUALITY ASSESSMENT FORM */}
          <div className="md:col-span-2">
            <Card className="border-earth-200 shadow-sm bg-white">
              <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
                <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-forest-600" /> Quality Assessment Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Moisture (%) <span className="text-red-500">*</span></label>
                      <Input 
                        type="number" step="0.1" required
                        placeholder="e.g. 14.2"
                        className="h-12 border-earth-300 font-bold"
                        value={formData.moisture}
                        onChange={(e) => setFormData({...formData, moisture: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Grain Grade <span className="text-red-500">*</span></label>
                      <select 
                        required
                        className="w-full h-12 border border-earth-300 rounded-lg px-3 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-forest-500"
                        value={formData.grade}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      >
                        <option value="">Select grade...</option>
                        <option value="A">Grade A (Premium)</option>
                        <option value="B">Grade B (Standard)</option>
                        <option value="C">Grade C (Acceptable)</option>
                        <option value="Reject">Below standard</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Foreign Matter (%) <span className="text-red-500">*</span></label>
                      <Input 
                        type="number" step="0.1" required
                        placeholder="e.g. 0.8"
                        className="h-12 border-earth-300 font-bold"
                        value={formData.foreignMatter}
                        onChange={(e) => setFormData({...formData, foreignMatter: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Damaged Grains (%)</label>
                      <Input 
                        type="number" step="0.1"
                        placeholder="e.g. 1.2"
                        className="h-12 border-earth-300 font-bold"
                        value={formData.damagedGrains}
                        onChange={(e) => setFormData({...formData, damagedGrains: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Quality Status</label>
                     <div className="flex gap-3">
                       {['Accepted', 'Needs Review', 'Rejected'].map(status => (
                         <button 
                           key={status} type="button"
                           onClick={() => setFormData({...formData, status})}
                           className={`flex-1 py-3 rounded-lg text-sm font-bold border transition-colors ${
                             formData.status === status 
                               ? status === 'Rejected' ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' : 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                               : 'bg-white border-earth-200 text-earth-600 hover:bg-earth-50'
                           }`}
                         >
                           {status}
                         </button>
                       ))}
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Remarks (Optional)</label>
                     <textarea
                        className="w-full h-20 border border-earth-300 rounded-lg p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-forest-500 resize-none"
                        placeholder="Any additional notes about the quality..."
                        value={formData.remarks}
                        onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                     ></textarea>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-earth-100">
                     <Button type="button" variant="outline" className="flex-1 font-bold border-earth-300 text-earth-700 bg-white">
                       <Save className="w-4 h-4 mr-2" /> Save Draft
                     </Button>
                     <Button type="submit" className="flex-1 font-bold bg-green-600 hover:bg-green-700 text-white shadow-md">
                       <Check className="w-4 h-4 mr-2" /> Complete Quality Check
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

export default StaffQualityCheck;
