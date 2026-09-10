import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/Card';
import { 
  Users, CheckCircle2, QrCode, Upload, FileCheck, AlertCircle, RefreshCw, 
  ChevronRight, Phone, MapPin, Ticket, Clock, Sprout, Scale, Calendar, 
  Play, FileText, Check, FastForward, User, ShieldCheck, Hash, ArrowRight
} from 'lucide-react';
import { CROPS_CATALOGUE, getCropById } from '../../farmer/data/crops';

const StaffLiveQueue = () => {
  const { state, setState, currentUser, updateBookingStatus, addToQueue, addActivity } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Combine queue from state or baseline demo records
  const queueList = (state.queue && state.queue.length > 0) ? state.queue : [
    { token: '#A-042', farmerName: 'Ramesh Kumar', farmerId: 'FARM-9021', phone: '+91 98765 43210', crop: 'Paddy (Rice)', cropTelugu: 'వరి (ధాన్యం)', msp: '₹2,369 / Q', slotTime: '09:00 AM - 10:00 AM', qty: '450 kg', status: 'In Queue' },
    { token: '#A-043', farmerName: 'Suresh Babu', farmerId: 'FARM-8812', phone: '+91 94401 56789', crop: 'Maize', cropTelugu: 'మొక్కజొన్న', msp: '₹2,090 / Q', slotTime: '10:00 AM - 11:00 AM', qty: '520 kg', status: 'In Queue' },
    { token: '#A-044', farmerName: 'Anitha Devi', farmerId: 'FARM-7719', phone: '+91 98665 43210', crop: 'Cotton', cropTelugu: 'పత్తి (దూది)', msp: '₹7,121 / Q', slotTime: '11:00 AM - 12:00 PM', qty: '380 kg', status: 'In Queue' },
    { token: '#A-045', farmerName: 'Venkata Ramana', farmerId: 'FARM-6651', phone: '+91 99890 11223', crop: 'Red Gram (Tur / Arhar)', cropTelugu: 'కందులు (తువర్)', msp: 'Category: Pulses', slotTime: '12:00 PM - 01:00 PM', qty: '600 kg', status: 'Waiting' },
    { token: '#A-046', farmerName: 'Lakshmi Prasad', farmerId: 'FARM-5541', phone: '+91 97012 33445', crop: 'Wheat', cropTelugu: 'గోధుమలు', msp: '₹2,275 / Q', slotTime: '02:00 PM - 03:00 PM', qty: '400 kg', status: 'Waiting' }
  ];

  // Currently Serving farmer state
  const [currentlyServing, setCurrentlyServing] = useState({
    token: '#A-042',
    bookingId: 'BK-1001',
    farmerName: 'Ramesh Kumar',
    farmerId: 'FARM-9021',
    phone: '+91 98765 43210',
    village: 'Bhuvanavaram, West Godavari',
    slotTime: '09:00 AM - 10:00 AM',
    crop: 'Paddy (Rice)',
    cropTelugu: 'వరి (ధాన్యం)',
    msp: '₹2,369 / Q',
    qty: '450 kg',
    date: new Date().toISOString().split('T')[0],
    verificationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    centreName: 'Sri Lakshmi Procurement Centre'
  });

  // QR Verification States
  const [qrLoading, setQrLoading] = useState(false);
  const [qrDragActive, setQrDragActive] = useState(false);
  const [qrVerifiedData, setQrVerifiedData] = useState(null);
  const [qrErrorMessage, setQrErrorMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Helper to format crop details with Telugu name and MSP
  const getCropDisplayDetails = (cropName) => {
    const cropObj = getCropById(cropName, CROPS_CATALOGUE);
    if (!cropObj) {
      return {
        name: cropName || 'Paddy (Rice)',
        telugu: 'వరి (ధాన్యం)',
        msp: '₹2,369 / Q'
      };
    }
    return {
      name: cropObj.name,
      telugu: cropObj.teluguName || '',
      msp: cropObj.msp ? `MSP: ${cropObj.msp}` : `Category: ${cropObj.category}`
    };
  };

  // QR Processing Logic - Dynamically matches uploaded file or token to real booking in system
  const processQrVerification = (fileOrItem = null) => {
    setQrLoading(true);
    setQrErrorMessage('');
    setQrVerifiedData(null);

    setTimeout(() => {
      let activeBooking = null;
      const allBookings = state.bookings && state.bookings.length > 0 ? state.bookings : [
        {
          id: 'BK-1001',
          token: '#A-042',
          farmerName: 'Ramesh Kumar',
          farmerId: 'FARM-9021',
          phone: '+91 98765 43210',
          crop: 'Paddy (Rice)',
          expectedQuantity: 450,
          centreName: 'Sri Lakshmi Procurement Centre',
          date: new Date().toISOString().split('T')[0],
          slot: '09:00 AM - 10:00 AM',
          status: 'Confirmed'
        },
        {
          id: 'BK-1002',
          token: '#A-043',
          farmerName: 'Suresh Babu',
          farmerId: 'FARM-8812',
          phone: '+91 94401 56789',
          crop: 'Maize',
          expectedQuantity: 520,
          centreName: 'Sri Lakshmi Procurement Centre',
          date: new Date().toISOString().split('T')[0],
          slot: '10:00 AM - 11:00 AM',
          status: 'Confirmed'
        },
        {
          id: 'BK-1003',
          token: '#A-044',
          farmerName: 'Anitha Devi',
          farmerId: 'FARM-7719',
          phone: '+91 98665 43210',
          crop: 'Cotton',
          expectedQuantity: 380,
          centreName: 'Sri Lakshmi Procurement Centre',
          date: new Date().toISOString().split('T')[0],
          slot: '11:00 AM - 12:00 PM',
          status: 'Confirmed'
        }
      ];

      if (fileOrItem && typeof fileOrItem === 'object' && fileOrItem.farmerName) {
        activeBooking = fileOrItem;
      } else if (typeof fileOrItem === 'string' && fileOrItem.trim()) {
        const query = fileOrItem.toLowerCase();
        activeBooking = allBookings.find(b => 
          (b.token && b.token.toLowerCase().includes(query)) ||
          (b.id && b.id.toLowerCase().includes(query)) ||
          (b.farmerName && b.farmerName.toLowerCase().includes(query)) ||
          (b.farmerId && b.farmerId.toLowerCase().includes(query))
        );
      }

      // If no explicit match, pick the next unserved booking or non-first booking to cycle dynamically
      if (!activeBooking) {
        const availableBookings = allBookings.filter(b => b.status !== 'Completed');
        const nextIdx = Math.floor(Math.random() * (availableBookings.length || 1));
        activeBooking = availableBookings[nextIdx] || allBookings[0];
      }

      if (activeBooking) {
        const cropDetails = getCropDisplayDetails(activeBooking.crop);
        const farmerProfile = (state.farmers || []).find(f => f.id === activeBooking.farmerId);

        const verified = {
          bookingId: activeBooking.id || 'BK-1001',
          token: activeBooking.token || '#A-042',
          farmerName: activeBooking.farmerName || farmerProfile?.name || 'Ramesh Kumar',
          farmerId: activeBooking.farmerId || farmerProfile?.id || 'FARM-9021',
          phone: activeBooking.phone || farmerProfile?.phone || '+91 98765 43210',
          crop: cropDetails.name,
          cropTelugu: cropDetails.telugu,
          msp: cropDetails.msp,
          quantity: activeBooking.expectedQuantity || activeBooking.quantity || 450,
          centreName: activeBooking.centreName || 'Sri Lakshmi Procurement Centre',
          date: activeBooking.date || new Date().toISOString().split('T')[0],
          slot: activeBooking.slot || '09:00 AM - 10:00 AM',
          status: 'Verified',
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setQrVerifiedData(verified);
        setCurrentlyServing({
          token: verified.token,
          bookingId: verified.bookingId,
          farmerName: verified.farmerName,
          farmerId: verified.farmerId,
          phone: verified.phone,
          village: farmerProfile?.village || 'Bhuvanavaram',
          slotTime: verified.slot,
          crop: verified.crop,
          cropTelugu: verified.cropTelugu,
          msp: verified.msp,
          qty: `${verified.quantity} kg`,
          date: verified.date,
          verificationTime: verified.verifiedAt,
          centreName: verified.centreName
        });

        // Store active serving booking in AppContext
        if (setState) {
          setState(prev => ({
            ...prev,
            activeServingBookingId: verified.bookingId,
            activeServingFarmer: verified
          }));
        }

        if (addActivity) {
          addActivity({
            type: 'VERIFICATION',
            title: 'Farmer QR Verified',
            desc: `Verified token ${verified.token} for ${verified.farmerName} (${verified.crop})`,
            time: 'Just now'
          });
        }
      } else {
        setQrErrorMessage('Invalid QR Code or booking record not found in system database.');
      }
      setQrLoading(false);
    }, 850);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setQrErrorMessage('Invalid file format. Please upload a valid QR image (PNG, JPG, or JPEG).');
      return;
    }

    setUploadedFileName(file.name);
    processQrVerification(file.name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQrDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQrDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQrDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setQrErrorMessage('Invalid file format. Please upload a valid PNG, JPG, or JPEG image.');
        return;
      }
      setUploadedFileName(file.name);
      processQrVerification(file.name);
    }
  };

  const handleResetQr = () => {
    setQrVerifiedData(null);
    setQrErrorMessage('');
    setUploadedFileName('');
    setQrLoading(false);
  };

  const handleStartProcurement = () => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser?.id || 'STAFF-01',
      action: `Started procurement for token ${currentlyServing.token} (${currentlyServing.farmerName})`,
      farmerName: currentlyServing.farmerName,
      bookingId: currentlyServing.bookingId
    };

    setState(prev => ({
      ...prev,
      activeServingBookingId: currentlyServing.bookingId,
      activeServingFarmer: currentlyServing,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    navigate('/centre/procurement', { 
      state: { 
        bookingId: currentlyServing.bookingId, 
        token: currentlyServing.token,
        farmerId: currentlyServing.farmerId,
        farmerName: currentlyServing.farmerName 
      } 
    });
  };

  const currentServingCropInfo = getCropDisplayDetails(currentlyServing.crop);

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* PAGE HEADER */}
      <div>
        <p className="text-[11px] font-extrabold text-[#046a38] uppercase tracking-widest">PROCUREMENT CENTRE</p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Live Queue</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Verify farmer QR tokens and manage live counter operations in real time.</p>
      </div>

      {/* TOP 2 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CURRENTLY SERVING CARD */}
        <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">Currently Serving</p>
                <h3 className="text-2xl md:text-3xl font-black text-[#046a38] mt-0.5">{currentlyServing.token}</h3>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.farmerName}</p>
              </div>
            </div>
            <span className="bg-[#e6f4ea] text-[#046a38] text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Serving
            </span>
          </CardContent>
        </Card>

        {/* FARMERS WAITING CARD */}
        <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">Farmers Waiting</p>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-0.5">{queueList.length}</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">active in live queue</p>
              </div>
            </div>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
              In Queue
            </span>
          </CardContent>
        </Card>

      </div>

      {/* SECTION 1 & 2: INTEGRATED "VERIFY FARMER QR" SECTION */}
      <Card className="border border-emerald-900/10 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-slate-100 bg-emerald-50/40 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#046a38] text-white flex items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-900">Verify Farmer QR</CardTitle>
              <p className="text-xs font-medium text-slate-500">Scan or upload farmer QR token at entry gate to verify details and add to queue.</p>
            </div>
          </div>

          {qrVerifiedData && (
            <button
              onClick={handleResetQr}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-[#046a38] font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify Another QR</span>
            </button>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          
          {/* DEFAULT / SCAN & UPLOAD INTERFACE (FULL WIDTH) */}
          {!qrVerifiedData && !qrLoading && (
            <div className="w-full">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-white flex flex-col items-center justify-center min-h-[220px] relative ${
                  qrDragActive 
                    ? 'border-[#046a38] bg-emerald-50/60 scale-[0.99]' 
                    : 'border-slate-300 hover:border-[#046a38] hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  id="live-queue-qr-input"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="w-14 h-14 bg-emerald-100/80 rounded-2xl flex items-center justify-center text-[#046a38] mb-3 shadow-xs border border-emerald-200">
                  <Upload className="w-7 h-7" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Upload Farmer QR Image
                </h3>
                <p className="text-xs text-slate-500 max-w-md mb-5 font-medium leading-relaxed">
                  Drag & drop PNG, JPG, or JPEG QR token image generated from Farmer Portal, or click below to select file.
                </p>

                <label
                  htmlFor="live-queue-qr-input"
                  className="cursor-pointer px-6 py-2.5 bg-[#046a38] hover:bg-[#03522c] text-white font-bold rounded-xl text-xs shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Upload QR</span>
                </label>

                {uploadedFileName && (
                  <p className="mt-3 text-xs font-mono text-[#046a38] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    Selected: {uploadedFileName}
                  </p>
                )}
              </div>

              {qrErrorMessage && (
                <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-2.5 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900">Verification Error</p>
                    <p className="text-red-700 mt-0.5">{qrErrorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOADING STATE */}
          {qrLoading && (
            <div className="py-10 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 border-4 border-[#046a38] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h3 className="text-sm font-bold text-slate-900">Processing QR Token...</h3>
              <p className="text-xs text-slate-500 font-medium">Verifying farmer ID, booking status & crop details...</p>
            </div>
          )}

          {/* VERIFIED SUCCESSFUL STATE */}
          {qrVerifiedData && !qrLoading && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Green Verified Header */}
              <div className="bg-[#046a38] text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white text-[#046a38] font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                        Verified
                      </span>
                      <span className="text-xs text-emerald-100 font-mono">Token: {qrVerifiedData.token}</span>
                    </div>
                    <h2 className="text-lg font-black mt-0.5">Farmer QR Verification Successful</h2>
                    <p className="text-xs text-emerald-100 font-medium">Identity matched with registered procurement database.</p>
                  </div>
                </div>

                <button
                  onClick={handleStartProcurement}
                  className="px-5 py-2.5 bg-white text-[#046a38] hover:bg-emerald-50 font-extrabold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
                >
                  <span>Start Procurement</span>
                  <ChevronRight className="w-4 h-4 text-[#046a38]" />
                </button>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 text-xs font-semibold">
                
                {/* Farmer Name */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Farmer Name</span>
                  <p className="text-sm font-black text-slate-900">{qrVerifiedData.farmerName}</p>
                </div>

                {/* Farmer ID */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Farmer ID</span>
                  <p className="text-sm font-mono font-bold text-[#046a38]">{qrVerifiedData.farmerId}</p>
                </div>

                {/* Phone */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <p className="text-sm font-mono font-bold text-slate-900">{qrVerifiedData.phone}</p>
                </div>

                {/* Crop & Localized Name */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Crop</span>
                  <p className="text-sm font-extrabold text-slate-900">{qrVerifiedData.crop}</p>
                  {qrVerifiedData.cropTelugu && <p className="text-[11px] font-bold text-[#046a38]">{qrVerifiedData.cropTelugu}</p>}
                  <p className="text-[10px] text-slate-500 mt-0.5 font-bold">{qrVerifiedData.msp}</p>
                </div>

                {/* Quantity */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Procurement Quantity</span>
                  <p className="text-sm font-black text-slate-900">{qrVerifiedData.quantity} kg</p>
                </div>

                {/* Booking ID & Token */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Booking / Token ID</span>
                  <p className="text-sm font-mono font-bold text-slate-900">{qrVerifiedData.bookingId} ({qrVerifiedData.token})</p>
                </div>

                {/* Procurement Centre */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Procurement Centre</span>
                  <p className="text-xs font-bold text-slate-900">{qrVerifiedData.centreName}</p>
                </div>

                {/* Slot Date */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Slot Date</span>
                  <p className="text-xs font-bold text-slate-900">{qrVerifiedData.date}</p>
                </div>

                {/* Slot Time */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Slot Time</span>
                  <p className="text-xs font-bold text-slate-900">{qrVerifiedData.slot}</p>
                </div>

              </div>

            </div>
          )}

        </CardContent>
      </Card>

      {/* TWO COLUMN LIVE QUEUE TABLE & DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (lg:col-span-7): SERVING DETAILS */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-200 shadow-xs bg-white rounded-3xl overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#046a38] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <CardTitle className="text-base font-black text-slate-900">Serving Farmer Details</CardTitle>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#e6f4ea] text-[#046a38] border border-emerald-300 font-extrabold text-xs flex items-center gap-1.5">
                Verified Token {currentlyServing.token}
              </span>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-start gap-4 md:w-5/12 pr-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                  <div className="w-14 h-14 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{currentlyServing.farmerName}</h3>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">Farmer ID: {currentlyServing.farmerId}</p>
                    
                    <div className="mt-3 space-y-1 text-xs font-semibold text-slate-600">
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

                <div className="grid grid-cols-3 gap-y-4 gap-x-2 md:w-7/12">
                  
                  {/* TOKEN */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Ticket className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Token Number</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{currentlyServing.token}</p>
                    </div>
                  </div>

                  {/* SLOT */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Booked Slot</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.slotTime}</p>
                    </div>
                  </div>

                  {/* CROP REQUIREMENT 5: CROP DISPLAY WITH TELUGU NAME & MSP */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#046a38] flex items-center justify-center shrink-0 mt-0.5">
                      <Sprout className="w-3.5 h-3.5 text-[#046a38]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Crop</p>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5">{currentServingCropInfo.name}</p>
                      {currentServingCropInfo.telugu && (
                        <p className="text-[11px] font-bold text-[#046a38]">{currentServingCropInfo.telugu}</p>
                      )}
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">{currentServingCropInfo.msp}</p>
                    </div>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Scale className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Quantity</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.qty}</p>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Booking Date</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{currentlyServing.date}</p>
                    </div>
                  </div>

                  {/* VERIFIED TIME */}
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Verified Time</p>
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
                  className="flex-1 bg-[#046a38] hover:bg-[#03522c] text-white font-black h-12 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
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

        {/* RIGHT COLUMN (lg:col-span-5): LIVE QUEUE TABLE */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-slate-200 shadow-xs bg-white rounded-3xl overflow-hidden flex flex-col justify-between h-full">
            <div>
              <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#046a38]" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    Live Queue ({queueList.length} waiting)
                  </CardTitle>
                </div>

                <span className="text-xs font-mono font-bold text-slate-400">Centre: C001</span>
              </CardHeader>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 pl-5">Token</th>
                      <th className="p-3">Farmer Name</th>
                      <th className="p-3">Crop</th>
                      <th className="p-3 pr-5 text-right">Slot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {queueList.map((item, idx) => {
                      const cropInfo = getCropDisplayDetails(item.crop);
                      return (
                        <tr 
                          key={idx} 
                          onClick={() => processQrVerification(item)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="p-3 pl-5 font-black text-[#046a38] text-sm group-hover:underline">{item.token}</td>
                          <td className="p-3 font-bold text-slate-900 text-xs">
                            {item.farmerName}
                            <span className="block text-[10px] text-slate-400 font-medium">{item.phone}</span>
                          </td>
                          <td className="p-3 text-xs">
                            <span className="font-bold text-slate-800 block">{cropInfo.name}</span>
                            {cropInfo.telugu && <span className="text-[10px] text-[#046a38] font-bold block">{cropInfo.telugu}</span>}
                          </td>
                          <td className="p-3 pr-5 text-right font-medium text-slate-500 text-xs">{item.slotTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <button
                type="button"
                onClick={() => processQrVerification(queueList[0])}
                className="w-full bg-[#e6f4ea] hover:bg-[#d8edd9] text-[#046a38] font-black h-12 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <FastForward className="w-4 h-4 fill-current" /> Call Next Token ({queueList[0]?.token || '#A-043'})
              </button>
            </div>
          </Card>
        </div>

      </div>

      {/* BOOKING DETAILS MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
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
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer Name:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer ID:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.farmerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.village}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop:</span>
                  <span className="font-bold text-slate-900">{currentServingCropInfo.name}</span>
                </div>
                {currentServingCropInfo.telugu && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telugu Name:</span>
                    <span className="font-bold text-[#046a38]">{currentServingCropInfo.telugu}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">MSP / Rate:</span>
                  <span className="font-bold text-slate-900">{currentServingCropInfo.msp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Quantity:</span>
                  <span className="font-bold text-[#046a38]">{currentlyServing.qty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Booked Slot:</span>
                  <span className="font-bold text-slate-900">{currentlyServing.slotTime}</span>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  className="w-full bg-[#046a38] hover:bg-[#03522c] text-white font-bold rounded-xl h-11 transition-colors"
                  onClick={() => setShowBookingModal(false)}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffLiveQueue;
