import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QrCode, Download, Activity, Clock, ShieldCheck } from 'lucide-react';

const DigitalToken = () => {
  const { state, currentUser } = useAppContext();
  const navigate = useNavigate();

  const activeBooking = state.bookings.find(b => b.farmerId === currentUser.id && (b.status === 'Confirmed' || b.status === 'Processing'));
  const centre = activeBooking ? state.centres.find(c => c.id === activeBooking.centreId) : null;

  if (!activeBooking) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-earth-100">
          <QrCode className="w-12 h-12 text-forest-600" />
        </div>
        <h2 className="text-2xl font-bold text-forest-900 mb-2">No Active Token</h2>
        <p className="text-earth-600 max-w-md mx-auto mb-8 text-lg">
          You don't have an active digital token. Book a slot first to generate a token.
        </p>
        <Button size="lg" className="shadow-md font-bold" onClick={() => navigate('/farmer/book-slot')}>
          Book a Slot
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Digital Token</h2>
        <p className="text-earth-600 mt-1">Show this QR code at the procurement centre.</p>
      </div>

      <Card className="border-earth-200 shadow-xl overflow-hidden bg-white">
        {/* Token Header */}
        <div className="bg-forest-900 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
             <ShieldCheck className="w-32 h-32" />
          </div>
          <p className="text-forest-300 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Your Token Number</p>
          <h1 className="text-6xl font-black tracking-tight relative z-10">{activeBooking.token}</h1>
          <Badge variant="success" className="mt-4 bg-green-500/20 text-green-300 border-green-500/30 uppercase font-bold tracking-widest relative z-10">
             {activeBooking.status}
          </Badge>
        </div>

        {/* QR Code Area */}
        <CardContent className="p-8 flex flex-col items-center border-b border-earth-100 border-dashed relative">
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-earth-50 rounded-full border-r border-t border-earth-200"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-earth-50 rounded-full border-l border-t border-earth-200"></div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-forest-100">
             {/* Simulating a QR Code with an Icon for the demo */}
             <QrCode className="w-48 h-48 text-forest-900" strokeWidth={1} />
          </div>
          <p className="text-sm font-bold text-earth-500 mt-4 uppercase tracking-widest">Scan at Entry</p>
        </CardContent>

        {/* Details Area */}
        <div className="p-6 bg-earth-50/50 space-y-4">
           <div className="flex justify-between items-center pb-3 border-b border-earth-100">
              <span className="text-xs font-bold text-earth-500 uppercase">Booking ID</span>
              <span className="font-bold text-earth-900">{activeBooking.id}</span>
           </div>
           <div className="flex justify-between items-center pb-3 border-b border-earth-100">
              <span className="text-xs font-bold text-earth-500 uppercase">Centre</span>
              <span className="font-bold text-earth-900 text-right max-w-[60%]">{centre?.name}</span>
           </div>
           <div className="flex justify-between items-center pb-3 border-b border-earth-100">
              <span className="text-xs font-bold text-earth-500 uppercase">Date</span>
              <span className="font-bold text-earth-900">{activeBooking.date}</span>
           </div>
           <div className="flex justify-between items-center pb-3 border-b border-earth-100">
              <span className="text-xs font-bold text-earth-500 uppercase">Time Slot</span>
              <span className="font-bold text-earth-900">{activeBooking.slot}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-earth-500 uppercase">Produce</span>
              <span className="font-bold text-earth-900">{activeBooking.expectedQuantity} Qtl {activeBooking.crop}</span>
           </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
         <Button className="w-full font-bold bg-white text-forest-900 hover:bg-forest-50 shadow-sm border border-earth-200 gap-2">
           <Download className="w-4 h-4" /> Download
         </Button>
         <Button className="w-full font-bold bg-forest-600 hover:bg-forest-700 shadow-md gap-2" onClick={() => navigate('/farmer/live-queue')}>
           <Activity className="w-4 h-4" /> Live Queue
         </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mt-4">
         <Clock className="w-5 h-5 text-blue-600 shrink-0" />
         <div>
            <p className="text-sm font-bold text-blue-900">Arrive 15 mins early</p>
            <p className="text-xs text-blue-700 font-medium mt-1">Please ensure you arrive slightly before your slot starts to allow time for initial entry verification.</p>
         </div>
      </div>
    </div>
  );
};

export default DigitalToken;
