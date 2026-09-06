import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Calendar, MapPin, Package, Clock, Hash, FileText } from 'lucide-react';

const MyBooking = () => {
  const { state, currentUser } = useAppContext();
  const navigate = useNavigate();

  const bookings = state.bookings.filter(b => b.farmerId === currentUser.id);
  const activeBooking = bookings.find(b => b.status === 'Confirmed' || b.status === 'Processing');
  const centre = activeBooking ? state.centres.find(c => c.id === activeBooking.centreId) : null;

  if (!activeBooking) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-earth-100">
          <FileText className="w-12 h-12 text-forest-600" />
        </div>
        <h2 className="text-2xl font-bold text-forest-900 mb-2">No Active Booking</h2>
        <p className="text-earth-600 max-w-md mx-auto mb-8 text-lg">
          You don't have any upcoming procurement bookings at the moment.
        </p>
        <Button size="lg" className="shadow-md font-bold" onClick={() => navigate('/farmer/book-slot')}>
          Book a Slot Now
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Booking Details</h2>
        <p className="text-earth-600 mt-1">Review your upcoming procurement schedule.</p>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-forest-900 text-white p-6 md:p-8 relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <Calendar className="w-48 h-48" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                 <Badge className="bg-forest-800 text-forest-100 border-forest-700 mb-3 uppercase tracking-wider font-bold">Upcoming</Badge>
                 <CardTitle className="text-3xl font-black">{centre?.name}</CardTitle>
                 <p className="text-forest-200 mt-2 flex items-center gap-2 font-medium">
                   <MapPin className="w-4 h-4" /> {centre?.district}
                 </p>
              </div>
              <div className="bg-forest-800/80 p-4 rounded-xl border border-forest-700/50 backdrop-blur-sm">
                 <p className="text-forest-300 text-xs font-bold uppercase tracking-wider mb-1">Booking ID</p>
                 <p className="text-xl font-bold text-white tracking-wide">{activeBooking.id}</p>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                 <div>
                   <p className="text-xs font-bold text-earth-500 uppercase tracking-wider flex items-center gap-1 mb-1"><Calendar className="w-4 h-4"/> Date</p>
                   <p className="text-lg font-bold text-earth-900">{new Date(activeBooking.date).toLocaleDateString('en-IN', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-earth-500 uppercase tracking-wider flex items-center gap-1 mb-1"><Clock className="w-4 h-4"/> Time Slot</p>
                   <p className="text-lg font-bold text-earth-900">{activeBooking.slot}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-earth-500 uppercase tracking-wider flex items-center gap-1 mb-1"><Package className="w-4 h-4"/> Produce Details</p>
                   <p className="text-lg font-bold text-earth-900">{activeBooking.expectedQuantity} Quintals of {activeBooking.crop}</p>
                 </div>
              </div>

              <div className="bg-earth-50 p-6 rounded-2xl border border-earth-200 flex flex-col justify-center items-center text-center space-y-4">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <Hash className="w-8 h-8 text-forest-600" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-earth-600 uppercase tracking-wider">Your Digital Token</p>
                   <p className="text-4xl font-black text-forest-900 mt-1">{activeBooking.token}</p>
                 </div>
                 <Badge variant="success" className="uppercase font-bold tracking-widest">{activeBooking.status}</Badge>
                 
                 <Button className="w-full mt-4 font-bold bg-forest-600 hover:bg-forest-700 shadow-md" onClick={() => navigate('/farmer/token')}>
                   View Digital Token
                 </Button>
              </div>

           </div>
           
           <div className="mt-8 pt-6 border-t border-earth-100 flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="font-bold border-earth-300 text-earth-700 flex-1" onClick={() => navigate('/farmer/dashboard')}>Back to Dashboard</Button>
              <Button variant="outline" className="font-bold border-red-200 text-red-600 hover:bg-red-50 flex-1">Cancel Booking</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBooking;
