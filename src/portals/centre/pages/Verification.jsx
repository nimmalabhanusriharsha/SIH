import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { ScanLine, CheckCircle2, XCircle, Search, User, MapPin, Package, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffVerification = () => {
  const { state, setState, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [tokenInput, setTokenInput] = useState('');
  const [scannedBooking, setScannedBooking] = useState(null);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    setScannedBooking(null);
    setVerified(false);

    const booking = state.bookings.find(b => b.token.toLowerCase() === tokenInput.toLowerCase());
    
    if (!booking) {
      setError('Invalid token. No booking found.');
      return;
    }
    
    if (booking.status !== 'Confirmed') {
      setError(`Token is not valid for verification. Status: ${booking.status}`);
      return;
    }

    setScannedBooking(booking);
  };

  const handleConfirmArrival = () => {
    // 1. Mark booking as processing
    // 2. Create queue entry
    
    const newQueueEntry = {
      id: `Q-${Date.now()}`,
      token: scannedBooking.token,
      farmerId: scannedBooking.farmerId,
      status: 'Waiting',
      position: state.queue.length + 1,
      counter: null
    };

    const updatedBookings = state.bookings.map(b => b.id === scannedBooking.id ? { ...b, status: 'Processing' } : b);
    
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser.id,
      action: `Verified farmer and marked arrival for token ${scannedBooking.token}`,
      farmerName: state.farmers.find(f => f.id === scannedBooking.farmerId)?.name,
      bookingId: scannedBooking.id
    };

    setState(prev => ({
      ...prev,
      bookings: updatedBookings,
      queue: [...prev.queue, newQueueEntry],
      activity: [newActivity, ...(prev.activity || [])]
    }));

    setVerified(true);
  };

  const farmer = scannedBooking ? state.farmers.find(f => f.id === scannedBooking.farmerId) : null;
  const centre = scannedBooking ? state.centres.find(c => c.id === scannedBooking.centreId) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-forest-900 tracking-tight">Farmer Verification</h2>
        <p className="text-earth-600 mt-1 font-medium">Scan digital token or enter manually to verify arrival.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* SCANNER SECTION */}
        <Card className="border-earth-200 shadow-sm h-fit bg-white">
          <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
             <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
               <ScanLine className="w-5 h-5 text-forest-600" /> Verify Digital Token
             </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            
            <div className="w-full h-48 bg-earth-100 rounded-xl mb-6 border-2 border-dashed border-earth-300 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute w-full h-1 bg-green-500/50 blur-sm shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
               <ScanLine className="w-12 h-12 text-earth-400 group-hover:text-forest-500 transition-colors" />
               <p className="text-sm font-bold text-earth-500 mt-2">Ready to scan QR code</p>
            </div>

            <div className="flex items-center gap-4 mb-4">
               <div className="h-px bg-earth-200 flex-1"></div>
               <span className="text-xs font-bold text-earth-400 uppercase tracking-widest">OR ENTER MANUALLY</span>
               <div className="h-px bg-earth-200 flex-1"></div>
            </div>

            <form onSubmit={handleVerify} className="flex gap-2">
               <Input 
                 placeholder="e.g. P-104"
                 className="flex-1 font-bold uppercase tracking-wider text-center border-earth-300 h-12 text-lg focus:ring-forest-500"
                 value={tokenInput}
                 onChange={(e) => setTokenInput(e.target.value)}
                 disabled={verified}
               />
               <Button type="submit" className="h-12 px-6 font-bold bg-forest-900 hover:bg-forest-800" disabled={!tokenInput || verified}>
                 <Search className="w-5 h-5" />
               </Button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                 <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                 <p className="text-sm font-bold text-red-900">{error}</p>
              </div>
            )}

          </CardContent>
        </Card>

        {/* VERIFICATION RESULT */}
        {scannedBooking ? (
          verified ? (
            <Card className="border-none shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white animate-in zoom-in-95">
               <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Verified & Arrived</h3>
                  <p className="text-green-100 font-medium mb-8">
                    {farmer?.name} (Token {scannedBooking.token}) has been added to the Live Queue.
                  </p>
                  
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white font-bold" onClick={() => navigate('/centre/live-queue')}>
                      View Live Queue
                    </Button>
                    <Button className="bg-white text-green-900 hover:bg-green-50 font-bold" onClick={() => {
                      setScannedBooking(null);
                      setTokenInput('');
                      setVerified(false);
                    }}>
                      Verify Another Token
                    </Button>
                  </div>
               </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 shadow-lg bg-green-50/50 animate-in fade-in slide-in-from-right-4">
              <CardHeader className="bg-green-100/50 border-b border-green-200 py-4 flex flex-row items-center justify-between">
                 <CardTitle className="text-base font-bold text-green-900 flex items-center gap-2">
                   <CheckCircle2 className="w-5 h-5 text-green-600" /> Valid Token Found
                 </CardTitle>
                 <Badge className="bg-green-600 text-white uppercase tracking-widest font-bold text-[10px]">{scannedBooking.token}</Badge>
              </CardHeader>
              <CardContent className="p-6">
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                       <User className="w-5 h-5 text-earth-400 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Farmer</p>
                         <p className="font-bold text-earth-900 text-lg">{farmer?.name}</p>
                         <p className="text-xs font-medium text-earth-500">{farmer?.id} • {farmer?.mobile}</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                         <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Booking ID</p>
                         <p className="font-bold text-earth-900">{scannedBooking.id}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                         <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Crop</p>
                         <p className="font-bold text-forest-700">{scannedBooking.crop} <span className="text-earth-500">({scannedBooking.expectedQuantity} Q)</span></p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                       <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Centre & Slot</p>
                       <p className="font-bold text-earth-900 text-sm">{centre?.name}</p>
                       <p className="font-medium text-earth-600 text-xs mt-0.5">{new Date(scannedBooking.date).toLocaleDateString()} • {scannedBooking.slot}</p>
                    </div>
                 </div>

                 <div className="flex gap-3">
                   <Button variant="outline" className="flex-1 font-bold border-earth-300 text-earth-700 hover:bg-earth-100 bg-white" onClick={() => {
                      setScannedBooking(null);
                      setTokenInput('');
                   }}>
                     Cancel
                   </Button>
                   <Button className="flex-1 font-bold bg-green-600 hover:bg-green-700 shadow-md" onClick={handleConfirmArrival}>
                     <Check className="w-4 h-4 mr-2" /> Confirm Arrival
                   </Button>
                 </div>
                 
              </CardContent>
            </Card>
          )
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center border-2 border-dashed border-earth-200 rounded-xl bg-earth-50/50 text-center p-8">
             <ScanLine className="w-16 h-16 text-earth-300 mb-4" />
             <h3 className="text-lg font-bold text-earth-700">Awaiting Scan</h3>
             <p className="text-sm font-medium text-earth-500 max-w-xs mt-2">Scan a farmer's QR code or enter their token to view details and verify arrival.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffVerification;
