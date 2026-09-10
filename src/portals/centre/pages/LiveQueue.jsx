import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { 
  Users, CheckCircle2, QrCode, ScanLine, ChevronRight, Phone, 
  MapPin, Ticket, Clock, Leaf, Scale, Calendar, Play, FileText, 
  RefreshCw, Check, FastForward, User
} from 'lucide-react';

const StaffLiveQueue = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Queue List Default / Mock Data combined with state
  const mockQueueList = [
    { id: 1, token: 'A106', farmerName: 'Siva Prasad', commodity: 'Paddy', slotTime: '10:30 AM', farmerId: 'KIS-98231A', phone: '98480 12345', village: 'Gannavaram', qty: '65 kg' },
    { id: 2, token: 'A107', farmerName: 'Lakshmi Devi', commodity: 'Maize', slotTime: '10:45 AM', farmerId: 'KIS-88123B', phone: '94401 56789', village: 'Nuzvid', qty: '48 kg' },
    { id: 3, token: 'A108', farmerName: 'Ravi Teja', commodity: 'Paddy', slotTime: '11:00 AM', farmerId: 'KIS-77192C', phone: '98665 43210', village: 'Eluru', qty: '80 kg' },
    { id: 4, token: 'A109', farmerName: 'Anitha Reddy', commodity: 'Groundnut', slotTime: '11:15 AM', farmerId: 'KIS-66512D', phone: '99890 11223', village: 'Tadepalligudem', qty: '40 kg' },
    { id: 5, token: 'A110', farmerName: 'Mahesh Babu', commodity: 'Paddy', slotTime: '11:30 AM', farmerId: 'KIS-55410E', phone: '97012 33445', village: 'Bhimavaram', qty: '55 kg' },
    { id: 6, token: 'A111', farmerName: 'Sunita Rao', commodity: 'Maize', slotTime: '11:45 AM', farmerId: 'KIS-44321F', phone: '98499 88776', village: 'Tanuku', qty: '60 kg' },
    { id: 7, token: 'A112', farmerName: 'Venkatesh', commodity: 'Paddy', slotTime: '12:00 PM', farmerId: 'KIS-33210G', phone: '94412 99887', village: 'Palakollu', qty: '72 kg' },
    { id: 8, token: 'A113', farmerName: 'Kavitha', commodity: 'Red Gram', slotTime: '12:15 PM', farmerId: 'KIS-22109H', phone: '98660 55443', village: 'Narsapur', qty: '35 kg' },
    { id: 9, token: 'A114', farmerName: 'Pradeep', commodity: 'Maize', slotTime: '12:30 PM', farmerId: 'KIS-11098I', phone: '99480 66778', village: 'Jangareddygudem', qty: '50 kg' },
    { id: 10, token: 'A115', farmerName: 'Saroja', commodity: 'Paddy', slotTime: '12:45 PM', farmerId: 'KIS-00987J', phone: '97045 11223', village: 'Kovvur', qty: '68 kg' },
  ];

  // Currently Serving state
  const [currentlyServing, setCurrentlyServing] = useState({
    token: 'A105',
    farmerName: 'Ramesh Kumar',
    farmerId: 'KIS-729481C',
    phone: '98765 43210',
    village: 'Bhuvanavaram',
    slotTime: '10:00 AM – 10:30 AM',
    commodity: 'Paddy',
    qty: '54 kg',
    date: '10 Sep 2025',
    verificationTime: '10:24 AM'
  });

  const [isScanning, setIsScanning] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Trigger QR Scanning / Verify Next Farmer
  const handleScanFarmer = (farmer = null) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const targetFarmer = farmer || mockQueueList[0];
      setCurrentlyServing({
        token: targetFarmer.token,
        farmerName: targetFarmer.farmerName,
        farmerId: targetFarmer.farmerId || 'KIS-729481C',
        phone: targetFarmer.phone || '98765 43210',
        village: targetFarmer.village || 'Bhuvanavaram',
        slotTime: targetFarmer.slotTime ? `${targetFarmer.slotTime} – 11:00 AM` : '10:00 AM – 10:30 AM',
        commodity: targetFarmer.commodity || 'Paddy',
        qty: targetFarmer.qty || '54 kg',
        date: '10 Sep 2025',
        verificationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 500);
  };

  // Start Procurement handler
  const handleStartProcurement = () => {
    // Log activity
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser?.id || 'STAFF-01',
      action: `Started procurement for token ${currentlyServing.token} (${currentlyServing.farmerName})`,
      farmerName: currentlyServing.farmerName,
      bookingId: 'BK-105'
    };

    setState(prev => ({
      ...prev,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    navigate('/centre/procurement');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div>
        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">LIVE QUEUE</p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Live Queue</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Scan farmer's QR to verify and manage the queue efficiently.</p>
      </div>

      {/* TWO COLUMN MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: SERVING, VERIFICATION, VERIFIED DETAILS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TOP 2 STAT CARDS: CURRENTLY SERVING & FARMERS WAITING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CURRENTLY SERVING CARD */}
            <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600">Currently Serving</p>
                    <h3 className="text-2xl md:text-3xl font-black text-[#046a38] mt-0.5">{currentlyServing.token}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{currentlyServing.farmerName}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleScanFarmer()}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#046a38] hover:text-[#046a38] transition-colors shrink-0 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            {/* FARMERS WAITING CARD (GREEN ACCENT) */}
            <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600">Farmers Waiting</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-0.5">{mockQueueList.length}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">in queue</p>
                  </div>
                </div>
                <button 
                  type="button"
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#046a38] hover:text-[#046a38] transition-colors shrink-0 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

          </div>

          {/* QR-ONLY FARMER VERIFICATION CARD (MAIN FOCUS) */}
          <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#046a38] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Farmer Verification</CardTitle>
                  <p className="text-xs font-medium text-slate-500">Scan the farmer's QR code to verify and proceed.</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* QR SCANNER VIEWPORT */}
              <div 
                onClick={() => handleScanFarmer()}
                className="w-full bg-[#e6f4ea] rounded-2xl py-10 px-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#d8edd9] transition-colors relative group border border-emerald-200"
              >
                {/* CORNER BRACKETS */}
                <div className="w-48 h-36 relative flex flex-col items-center justify-center">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-[#046a38] rounded-tl-md"></div>
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-[#046a38] rounded-tr-md"></div>
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-[#046a38] rounded-bl-md"></div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-[#046a38] rounded-br-md"></div>

                  {/* QR LOGO ICON */}
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-[#046a38] shadow-xs mb-2">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 mt-2">Scan Farmer QR</h3>
                <p className="text-xs font-medium text-slate-600 mt-1">Place the QR code within the frame to verify</p>
                
                {isScanning && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-2xl flex items-center justify-center">
                    <div className="flex items-center gap-2 text-[#046a38] font-bold text-sm">
                      <RefreshCw className="w-5 h-5 animate-spin" /> Verifying QR...
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* VERIFIED FARMER DETAILS CARD (BELOW QR SCANNER) */}
          <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#046a38] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">Verified Farmer Details</CardTitle>
              </div>

              {/* VERIFIED BADGE */}
              <span className="px-3 py-1 rounded-full bg-[#e6f4ea] text-[#046a38] border border-emerald-300 font-bold text-xs flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#046a38] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                Verified
              </span>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              
              {/* FARMER PROFILE & METADATA GRID */}
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* FARMER PROFILE INFO */}
                <div className="flex items-start gap-4 md:w-5/12 pr-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                  <div className="w-14 h-14 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{currentlyServing.farmerName}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Farmer ID: {currentlyServing.farmerId}</p>
                    
                    <div className="mt-3 space-y-1 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{currentlyServing.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{currentlyServing.village}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* METADATA GRID (3 COLUMNS X 2 ROWS) */}
                <div className="grid grid-cols-3 gap-y-4 gap-x-2 md:w-7/12">
                  
                  {/* TOKEN NUMBER */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Ticket className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Token Number</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{currentlyServing.token}</p>
                    </div>
                  </div>

                  {/* BOOKED SLOT */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Booked Slot</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.slotTime}</p>
                    </div>
                  </div>

                  {/* COMMODITY */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Leaf className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Commodity</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.commodity}</p>
                    </div>
                  </div>

                  {/* EXPECTED QUANTITY */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Scale className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Expected Quantity</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.qty}</p>
                    </div>
                  </div>

                  {/* BOOKING DATE */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Booking Date</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.date}</p>
                    </div>
                  </div>

                  {/* VERIFICATION TIME */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Verification Time</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.verificationTime}</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartProcurement}
                  className="flex-1 bg-[#046a38] hover:bg-[#03522c] text-white font-bold h-12 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Procurement <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-12 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <FileText className="w-4 h-4 text-slate-600" /> View Booking Details
                </button>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: QUEUE LIST (18 WAITING) TABLE & CALL NEXT FARMER BUTTON */}
        <div className="lg:col-span-5 space-y-4">
          
          <Card className="border border-slate-100 shadow-xs bg-white rounded-2xl overflow-hidden flex flex-col justify-between h-full">
            <div>
              {/* QUEUE LIST HEADER */}
              <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#046a38]" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    Queue List ({mockQueueList.length} waiting)
                  </CardTitle>
                </div>

                <button
                  type="button"
                  onClick={() => handleScanFarmer()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" /> Refresh
                </button>
              </CardHeader>

              {/* QUEUE LIST TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 pl-5">#</th>
                      <th className="p-3">Token</th>
                      <th className="p-3">Farmer Name</th>
                      <th className="p-3">Commodity</th>
                      <th className="p-3 pr-5 text-right">Slot Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {mockQueueList.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => handleScanFarmer(item)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="p-3 pl-5 text-xs font-bold text-slate-400">{item.id}</td>
                        <td className="p-3 font-black text-[#046a38] text-sm group-hover:underline">{item.token}</td>
                        <td className="p-3 font-bold text-slate-900 text-xs">{item.farmerName}</td>
                        <td className="p-3 font-medium text-slate-600 text-xs">{item.commodity}</td>
                        <td className="p-3 pr-5 text-right font-medium text-slate-500 text-xs">{item.slotTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FULL-WIDTH CALL NEXT FARMER BUTTON AT BOTTOM OF QUEUE LIST */}
            <div className="p-4 bg-white border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleScanFarmer(mockQueueList[0])}
                className="w-full bg-[#e6f4ea] hover:bg-[#d8edd9] text-[#046a38] font-black h-12 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <FastForward className="w-4 h-4 fill-current" /> Call Next Farmer ({mockQueueList[0]?.token || 'A106'})
              </button>
            </div>

          </Card>

        </div>

      </div>

      {/* BOOKING DETAILS MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#046a38] p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileText className="w-5 h-5" /> Booking Details - {currentlyServing.token}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowBookingModal(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm font-medium text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Farmer Name:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Farmer ID:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.farmerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Phone:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Location:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.village}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Commodity:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.commodity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Expected Qty:</span>
                  <span className="font-bold text-[#046a38]">{currentlyServing.qty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Booked Slot:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.slotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-xs">Booking Date:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.date}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full bg-[#046a38] hover:bg-[#03522c] text-white font-bold rounded-xl h-11"
                  onClick={() => setShowBookingModal(false)}
                >
                  Close Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffLiveQueue;
