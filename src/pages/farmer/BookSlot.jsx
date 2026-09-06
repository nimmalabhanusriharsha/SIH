import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalIcon, MapPin, Package, Clock, BrainCircuit, Star, AlertTriangle } from 'lucide-react';

const steps = [
  { id: 1, name: 'Select Crop' },
  { id: 2, name: 'Quantity' },
  { id: 3, name: 'Select Centre' },
  { id: 4, name: 'Select Date' },
  { id: 5, name: 'View Slots' },
  { id: 6, name: 'Smart Recommendation' },
  { id: 7, name: 'Confirm Booking' }
];

const BookSlot = () => {
  const { state, setState, currentUser } = useAppContext();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    crop: '',
    quantity: '',
    centreId: '',
    date: '',
    slot: ''
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const canProceed = () => {
    switch(currentStep) {
      case 1: return !!bookingData.crop;
      case 2: return !!bookingData.quantity && parseInt(bookingData.quantity) > 0;
      case 3: return !!bookingData.centreId;
      case 4: return !!bookingData.date;
      case 5: return true; // Just viewing
      case 6: return !!bookingData.slot;
      case 7: return true;
      default: return false;
    }
  };

  const handleConfirm = () => {
    const newBookingId = `BK${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${Math.floor(100 + Math.random() * 900)}`;
    const newToken = `P-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = {
      id: newBookingId,
      farmerId: currentUser.id,
      centreId: bookingData.centreId,
      date: bookingData.date,
      slot: bookingData.slot,
      crop: bookingData.crop,
      expectedQuantity: parseInt(bookingData.quantity),
      token: newToken,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    // Generate smart mock wait time based on random values for demo
    const randomPos = Math.floor(Math.random() * 20) + 5;
    const newQueueEntry = {
      token: newToken,
      farmerId: currentUser.id,
      centreId: bookingData.centreId,
      status: 'Waiting',
      position: randomPos,
      waitTime: randomPos * 5
    };
    
    const newNotification = {
      id: `N${Date.now()}`,
      userId: currentUser.id,
      category: 'Booking',
      message: `Your booking at ${state.centres.find(c=>c.id===bookingData.centreId)?.name} is confirmed. Token: ${newToken}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setState(prev => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings],
      queue: [...prev.queue, newQueueEntry],
      notifications: [newNotification, ...prev.notifications]
    }));

    navigate('/farmer/token');
  };

  // MOCK DATA GENERATION
  const crops = ['Paddy', 'Wheat', 'Maize', 'Cotton', 'Groundnut'];
  const dates = [
    { label: 'Today', value: new Date().toISOString().split('T')[0] },
    { label: 'Tomorrow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: '13 Sep', value: '2026-09-13' },
    { label: '14 Sep', value: '2026-09-14' },
    { label: '15 Sep', value: '2026-09-15' },
  ];
  
  const selectedCentreInfo = state.centres.find(c => c.id === bookingData.centreId);
  const recommendedCentre = [...state.centres].sort((a,b) => a.distance - b.distance)[0]; // Simplistic recommendation

  const timeSlots = [
    { time: '08:00 AM - 08:30 AM', booked: 12, capacity: 25, status: 'Low', wait: 5 },
    { time: '09:00 AM - 09:30 AM', booked: 22, capacity: 25, status: 'High', wait: 28 },
    { time: '10:00 AM - 10:30 AM', booked: 25, capacity: 25, status: 'Full', wait: 45 },
    { time: '10:30 AM - 11:00 AM', booked: 18, capacity: 25, status: 'Low', wait: 18, recommended: true },
    { time: '11:00 AM - 11:30 AM', booked: 20, capacity: 25, status: 'Medium', wait: 22 },
    { time: '12:00 PM - 12:30 PM', booked: 15, capacity: 25, status: 'Low', wait: 12 },
    { time: '02:00 PM - 02:30 PM', booked: 24, capacity: 25, status: 'High', wait: 35 },
    { time: '03:00 PM - 03:30 PM', booked: 10, capacity: 25, status: 'Low', wait: 8 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Book Procurement Slot</h2>
        <p className="text-earth-600 mt-1">Follow the steps to schedule your produce drop-off.</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-earth-200 -translate-y-1/2 z-0 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-forest-600 -translate-y-1/2 z-0 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / 6) * 100}%` }}></div>
        
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold border-2 transition-colors ${
                currentStep > step.id ? 'bg-forest-600 border-forest-600 text-white' :
                currentStep === step.id ? 'bg-white border-forest-600 text-forest-600 shadow-md ring-4 ring-forest-50' :
                'bg-white border-earth-300 text-earth-400'
              }`}>
                {currentStep > step.id ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : step.id}
              </div>
              <span className={`text-[8px] md:text-xs font-bold uppercase mt-2 hidden sm:block ${currentStep >= step.id ? 'text-forest-900' : 'text-earth-400'}`}>{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      <Card className="border-earth-200 shadow-lg min-h-[400px] flex flex-col relative overflow-hidden">
        
        {/* STEP 1: CROP */}
        {currentStep === 1 && (
          <CardContent className="p-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-forest-900 mb-6 flex items-center gap-2"><Package className="w-6 h-6 text-forest-600"/> Select Crop</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {crops.map(crop => (
                <button 
                  key={crop}
                  onClick={() => setBookingData({...bookingData, crop})}
                  className={`p-6 rounded-xl border-2 font-bold transition-all text-center ${
                    bookingData.crop === crop ? 'border-forest-600 bg-forest-50 text-forest-900 shadow-md' : 'border-earth-200 text-earth-700 hover:border-earth-300 hover:bg-earth-50'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </CardContent>
        )}

        {/* STEP 2: QUANTITY */}
        {currentStep === 2 && (
          <CardContent className="p-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-forest-900 mb-6 flex items-center gap-2"><Package className="w-6 h-6 text-forest-600"/> How much produce?</h3>
            <div className="max-w-md mx-auto mt-10">
              <label className="text-sm font-bold text-earth-600 uppercase tracking-wider mb-2 block">Expected Quantity</label>
              <div className="flex gap-4 items-center">
                <Input 
                  type="number" 
                  className="text-3xl h-16 font-black text-forest-900 border-earth-300 shadow-inner" 
                  placeholder="0"
                  value={bookingData.quantity}
                  onChange={(e) => setBookingData({...bookingData, quantity: e.target.value})}
                  autoFocus
                />
                <span className="text-xl font-bold text-earth-500">Quintals</span>
              </div>
              <p className="text-xs text-earth-500 font-medium mt-4 bg-earth-50 p-3 rounded-lg border border-earth-100">
                Accurate quantity helps us recommend the best centre and slot with sufficient capacity.
              </p>
            </div>
          </CardContent>
        )}

        {/* STEP 3: CENTRE */}
        {currentStep === 3 && (
          <CardContent className="p-6 md:p-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-forest-900 mb-6 flex items-center gap-2"><MapPin className="w-6 h-6 text-forest-600"/> Select Centre</h3>
            
            <div className="space-y-4">
              {/* Smart Recommendation Card */}
              <div 
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all relative overflow-hidden ${bookingData.centreId === recommendedCentre?.id ? 'border-forest-600 bg-forest-50 shadow-md' : 'border-forest-200 hover:border-forest-400 bg-gradient-to-r from-forest-50 to-white'}`}
                onClick={() => setBookingData({...bookingData, centreId: recommendedCentre?.id})}
              >
                 <Badge variant="primary" className="absolute top-0 right-0 rounded-bl-xl rounded-tr-none rounded-tl-none bg-forest-600 text-white font-bold uppercase text-[10px]"><BrainCircuit className="w-3 h-3 mr-1"/> AI Recommendation</Badge>
                 <div className="flex justify-between items-start pr-32">
                   <div>
                     <h4 className="font-black text-forest-900 text-lg">{recommendedCentre?.name}</h4>
                     <p className="text-sm font-bold text-earth-600 mt-1">{recommendedCentre?.distance} km away</p>
                   </div>
                 </div>
                 <p className="text-xs font-medium text-forest-700 mt-3 flex items-center gap-1 bg-forest-100 w-fit px-2 py-1 rounded">
                   <Star className="w-3 h-3 fill-current" /> Optimal distance & low queue length.
                 </p>
              </div>

              {/* Other Centres */}
              <h4 className="text-xs font-bold text-earth-500 uppercase tracking-widest mt-6 mb-2">Other Nearby Centres</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {state.centres.filter(c => c.id !== recommendedCentre?.id).slice(0,4).map(centre => (
                  <div 
                    key={centre.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${bookingData.centreId === centre.id ? 'border-forest-600 bg-forest-50 shadow-md' : 'border-earth-200 hover:border-earth-300 bg-white'}`}
                    onClick={() => setBookingData({...bookingData, centreId: centre.id})}
                  >
                    <h4 className="font-bold text-earth-900">{centre.name}</h4>
                    <p className="text-xs font-bold text-earth-600 mt-1">{centre.distance} km away</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}

        {/* STEP 4: DATE */}
        {currentStep === 4 && (
          <CardContent className="p-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-forest-900 mb-6 flex items-center gap-2"><CalIcon className="w-6 h-6 text-forest-600"/> Select Date</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {dates.map((date, idx) => (
                <button 
                  key={idx}
                  onClick={() => setBookingData({...bookingData, date: date.value})}
                  className={`p-4 rounded-xl border-2 font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    bookingData.date === date.value ? 'border-forest-600 bg-forest-50 text-forest-900 shadow-md' : 'border-earth-200 text-earth-700 hover:border-earth-300 hover:bg-earth-50'
                  }`}
                >
                  <span className="text-sm uppercase tracking-wider">{date.label}</span>
                  {idx > 1 && <span className="text-xs text-earth-500 font-medium">{date.value}</span>}
                </button>
              ))}
            </div>
          </CardContent>
        )}

        {/* STEP 5 & 6: SLOTS & SMART RECOMMENDATION */}
        {(currentStep === 5 || currentStep === 6) && (
          <CardContent className="p-6 md:p-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl font-bold text-forest-900 flex items-center gap-2"><Clock className="w-6 h-6 text-forest-600"/> Available Slots</h3>
              {currentStep === 6 && (
                <Badge variant="primary" className="bg-blue-100 text-blue-800 border-blue-200 font-bold uppercase animate-pulse">
                  <BrainCircuit className="w-3 h-3 mr-1" /> Smart Recommendation Active
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeSlots.map((slot, idx) => {
                const isRecommended = currentStep === 6 && slot.recommended;
                const isSelected = bookingData.slot === slot.time;
                const isFull = slot.status === 'Full';
                
                return (
                  <button 
                    key={idx}
                    disabled={isFull}
                    onClick={() => {
                      setBookingData({...bookingData, slot: slot.time});
                      if(currentStep === 5) setCurrentStep(6);
                    }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      isFull ? 'opacity-50 cursor-not-allowed bg-earth-50 border-earth-200' :
                      isSelected ? 'border-forest-600 bg-forest-50 shadow-md ring-1 ring-forest-600' :
                      isRecommended ? 'border-blue-400 bg-blue-50 shadow-md ring-1 ring-blue-400' :
                      'border-earth-200 hover:border-earth-300 hover:bg-earth-50 bg-white'
                    }`}
                  >
                    {isRecommended && (
                       <Badge className="absolute -top-3 right-4 bg-blue-600 text-white font-bold uppercase text-[9px] shadow-sm tracking-wider">★ Recommended</Badge>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-black text-lg ${isFull ? 'text-earth-500' : isRecommended ? 'text-blue-900' : 'text-forest-900'}`}>{slot.time}</span>
                      <Badge variant={slot.status === 'Full' ? 'danger' : slot.status === 'High' ? 'warning' : 'success'} className="uppercase font-bold text-[9px]">
                        {slot.status} Load
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-earth-600">{slot.booked} / {slot.capacity} Booked</span>
                       <span className={isFull ? 'text-earth-500' : slot.status === 'High' ? 'text-amber-600' : 'text-green-600'}>Wait: ~{slot.wait}m</span>
                    </div>

                    {isRecommended && (
                      <p className="text-[10px] font-bold text-blue-700 mt-3 bg-blue-100/50 p-2 rounded flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3" /> Lower expected congestion and sufficient capacity.
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
            
            {currentStep === 5 && (
              <div className="mt-6 flex justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2 shadow-md" onClick={() => setCurrentStep(6)}>
                  <BrainCircuit className="w-4 h-4" /> Apply Smart Recommendation
                </Button>
              </div>
            )}
          </CardContent>
        )}

        {/* STEP 7: SUMMARY */}
        {currentStep === 7 && (
          <CardContent className="p-8 flex-1 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-forest-900 mb-6 text-center">Confirm Booking Details</h3>
            
            <div className="bg-earth-50 rounded-2xl p-6 border border-earth-200 max-w-2xl mx-auto space-y-4 shadow-inner">
              <div className="flex justify-between py-3 border-b border-earth-200">
                <span className="font-bold text-earth-500 uppercase tracking-wider text-xs">Farmer</span>
                <span className="font-black text-earth-900">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-earth-200">
                <span className="font-bold text-earth-500 uppercase tracking-wider text-xs">Produce</span>
                <span className="font-black text-earth-900">{bookingData.quantity} Quintals of {bookingData.crop}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-earth-200">
                <span className="font-bold text-earth-500 uppercase tracking-wider text-xs">Centre</span>
                <span className="font-black text-earth-900 text-right">{selectedCentreInfo?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-earth-200">
                <span className="font-bold text-earth-500 uppercase tracking-wider text-xs">Date</span>
                <span className="font-black text-earth-900">{bookingData.date}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-bold text-earth-500 uppercase tracking-wider text-xs">Slot</span>
                <span className="font-black text-earth-900 bg-forest-100 text-forest-800 px-3 py-1 rounded-lg">{bookingData.slot}</span>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6 flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-bold text-blue-900">Estimated Arrival Note</p>
                   <p className="text-xs font-medium text-blue-700 mt-1">Based on this slot, you should aim to arrive at the centre by <b>10:15 AM</b> to minimize waiting time.</p>
                 </div>
              </div>
            </div>
          </CardContent>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="border-t border-earth-200 p-4 md:p-6 bg-earth-50/50 flex justify-between items-center mt-auto">
           <Button variant="outline" className="font-bold border-earth-300 text-earth-700" onClick={prevStep} disabled={currentStep === 1}>
             <ChevronLeft className="w-4 h-4 mr-1" /> Back
           </Button>
           
           {currentStep < 7 ? (
             <Button className="font-bold bg-forest-600 hover:bg-forest-700 shadow-md px-8" onClick={nextStep} disabled={!canProceed()}>
               Next Step <ChevronRight className="w-4 h-4 ml-1" />
             </Button>
           ) : (
             <Button className="font-black text-lg bg-green-600 hover:bg-green-700 shadow-xl px-10 h-14 animate-pulse" onClick={handleConfirm}>
               CONFIRM BOOKING <CheckCircle2 className="w-5 h-5 ml-2" />
             </Button>
           )}
        </div>
      </Card>
    </div>
  );
};

export default BookSlot;
