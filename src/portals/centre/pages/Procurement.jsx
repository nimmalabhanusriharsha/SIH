import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import {
  Sprout, Phone, MapPin, Calendar, Clock, CheckCircle2,
  IndianRupee, FileText, Info, Check, X
} from 'lucide-react';
import { CROPS_CATALOGUE, getLocalizedCropName } from '../../farmer/data/crops';

const StaffProcurement = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t, currentLang } = useTranslation();
  const location = useLocation();

  // Find dynamic verified farmer/booking passed from LiveQueue navigation or AppContext
  const navState = location.state || {};
  const activeServingFarmer = state.activeServingFarmer;

  const targetBooking = (navState.bookingId ? (state.bookings || []).find(b => b.id === navState.bookingId || b.token === navState.token) : null) ||
    (state.activeServingBookingId ? (state.bookings || []).find(b => b.id === state.activeServingBookingId) : null) ||
    (state.bookings && state.bookings.length > 0 ? state.bookings[0] : null);

  const targetFarmerProfile = targetBooking ? (state.farmers || []).find(f => f.id === targetBooking.farmerId) : null;

  // Resolved dynamic values (NEVER hardcoded Suresh Reddy)
  const resolvedFarmerName = activeServingFarmer?.farmerName || navState.farmerName || targetBooking?.farmerName || targetFarmerProfile?.name || 'Ramesh Kumar';
  const resolvedFarmerId = activeServingFarmer?.farmerId || navState.farmerId || targetBooking?.farmerId || targetFarmerProfile?.id || 'FARM-9021';
  const resolvedToken = activeServingFarmer?.token || navState.token || targetBooking?.token || '#A-042';
  const resolvedBookingId = activeServingFarmer?.bookingId || navState.bookingId || targetBooking?.id || 'BK-1001';
  const resolvedPhone = activeServingFarmer?.phone || targetFarmerProfile?.phone || targetBooking?.phone || '+91 98765 43210';
  const resolvedLocation = activeServingFarmer?.village || targetFarmerProfile?.village || targetFarmerProfile?.location || 'Bhuvanavaram, West Godavari';
  const resolvedCrop = activeServingFarmer?.crop || targetBooking?.crop || 'Paddy (Rice)';
  const resolvedQty = activeServingFarmer?.quantity || targetBooking?.expectedQuantity || targetBooking?.quantity || 450;

  // Form State initialized dynamically from verified farmer record
  const [formData, setFormData] = useState({
    tokenNumber: resolvedToken,
    bookingId: resolvedBookingId,
    farmerName: resolvedFarmerName,
    farmerId: resolvedFarmerId,
    phone: resolvedPhone,
    location: resolvedLocation,
    bookingDate: targetBooking?.date || new Date().toISOString().split('T')[0],
    bookedSlot: targetBooking?.slot || activeServingFarmer?.slotTime || '09:00 AM – 10:00 AM',
    expectedQuantity: `${resolvedQty} kg`,
    status: 'Arrived',

    // Harvest & Quality Details
    crop: resolvedCrop,
    variety: 'MTU 1010',
    quantity: String(resolvedQty),
    unit: 'Kilograms (kg)',
    moisture: '13.5',
    foreignMatter: '0.6',
    damagedGrains: '1.2',
    grainGrade: 'Grade A',

    // Pricing
    rate: '23.69',

    // Remarks
    remarks: ''
  });

  // Re-sync form data if navigation or serving farmer changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tokenNumber: resolvedToken,
      bookingId: resolvedBookingId,
      farmerName: resolvedFarmerName,
      farmerId: resolvedFarmerId,
      phone: resolvedPhone,
      location: resolvedLocation,
      crop: resolvedCrop,
      expectedQuantity: `${resolvedQty} kg`,
      quantity: String(resolvedQty)
    }));
  }, [navState.bookingId, state.activeServingBookingId, activeServingFarmer]);

  // Calculate Total Amount dynamically: Quantity * Rate
  const qtyNum = parseFloat(formData.quantity) || 0;
  const rateNum = parseFloat(formData.rate) || 0;
  const totalAmount = Math.round(qtyNum * rateNum * 100) / 100;

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'SAVE' or 'INITIATE_PAYMENT'
    data: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Complete Procurement (Save Quality & Procurement details AND add to Pending Payments list)
  const handleCompleteProcurement = () => {
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const newProcurementId = `PRC-${Date.now().toString().slice(-6)}`;
    const newPaymentId = `PAY-${Date.now().toString().slice(-6)}`;

    const newProcurementRecord = {
      id: newProcurementId,
      bookingId: formData.bookingId,
      farmerId: formData.farmerId,
      farmerName: formData.farmerName,
      centreId: currentUser?.centreId || 'C001',
      crop: formData.crop,
      variety: formData.variety,
      actualQuantity: parseFloat(formData.quantity),
      unit: formData.unit,
      rate: parseFloat(formData.rate),
      totalAmount: totalAmount,
      moisture: `${formData.moisture}%`,
      foreignMatter: `${formData.foreignMatter}%`,
      damagedGrains: `${formData.damagedGrains}%`,
      grainGrade: formData.grainGrade,
      remarks: formData.remarks,
      date: new Date().toISOString(),
      status: 'Completed'
    };

    // Create corresponding Pending Payment record so farmer appears in Payments page -> PENDING PAYMENT
    const newPaymentRecord = {
      id: newPaymentId,
      procurementId: newProcurementId,
      bookingId: formData.bookingId,
      token: formData.tokenNumber,
      farmerId: formData.farmerId,
      farmerName: formData.farmerName,
      farmerPhone: formData.phone,
      location: formData.location,
      crop: formData.crop,
      variety: formData.variety,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      rate: parseFloat(formData.rate),
      amount: totalAmount,
      date: new Date().toISOString(),
      status: 'Pending',
      initiatedBy: currentUser?.name || 'Staff User'
    };

    const counterId = currentUser?.counterId || 'Counter 1';
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser?.id || 'STAFF-01',
      counterId: counterId,
      farmerName: formData.farmerName,
      farmerId: formData.farmerId,
      token: formData.tokenNumber,
      bookingId: formData.bookingId,
      action: `Completed procurement for farmer ${formData.farmerName} (${formData.farmerId}, Token ${formData.tokenNumber}) at ${counterId}. Crop: ${formData.crop}, Qty: ${formData.quantity} kg, Amount: ₹${totalAmount.toLocaleString('en-IN')}`
    };

    // Update queue status and booking status to completed
    const updatedQueue = (state.queue || []).map(q =>
      q.token === formData.tokenNumber || q.farmerId === formData.farmerId ? { ...q, status: 'Completed' } : q
    );

    const updatedBookings = (state.bookings || []).map(b =>
      b.id === formData.bookingId || b.token === formData.tokenNumber ? { ...b, status: 'Completed' } : b
    );

    setState(prev => ({
      ...prev,
      bookings: updatedBookings,
      procurements: [newProcurementRecord, ...(prev.procurements || [])],
      payments: [newPaymentRecord, ...(prev.payments || []).filter(p => p.id !== newPaymentId)],
      queue: updatedQueue,
      activity: [newActivity, ...(prev.activity || [])],
      activeServingBookingId: null,
      activeServingFarmer: null
    }));

    setModalState({
      isOpen: true,
      type: 'SAVE',
      data: newProcurementRecord
    });
  };

  // Initiate Payment: Mark payment processing & send to Admin
  const handleInitiatePayment = () => {
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      alert("Please enter a valid quantity before initiating payment.");
      return;
    }

    const newProcurementId = `PRC-${Date.now().toString().slice(-6)}`;
    const newPaymentId = `PAY-${Date.now().toString().slice(-6)}`;

    const newProcurementRecord = {
      id: newProcurementId,
      bookingId: formData.bookingId,
      farmerId: formData.farmerId,
      farmerName: formData.farmerName,
      centreId: currentUser?.centreId || 'C001',
      crop: formData.crop,
      variety: formData.variety,
      actualQuantity: parseFloat(formData.quantity),
      unit: formData.unit,
      rate: parseFloat(formData.rate),
      totalAmount: totalAmount,
      moisture: `${formData.moisture}%`,
      foreignMatter: `${formData.foreignMatter}%`,
      damagedGrains: `${formData.damagedGrains}%`,
      grainGrade: formData.grainGrade,
      remarks: formData.remarks,
      date: new Date().toISOString(),
      status: 'Completed'
    };

    const newPaymentRecord = {
      id: newPaymentId,
      procurementId: newProcurementId,
      bookingId: formData.bookingId,
      token: formData.tokenNumber,
      farmerId: formData.farmerId,
      farmerName: formData.farmerName,
      farmerPhone: formData.phone,
      location: formData.location,
      crop: formData.crop,
      variety: formData.variety,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      rate: parseFloat(formData.rate),
      amount: totalAmount,
      date: new Date().toISOString(),
      status: 'Pending',
      initiatedBy: currentUser?.name || 'Staff User'
    };

    const counterId = currentUser?.counterId || 'Counter 1';
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser?.id || 'STAFF-01',
      counterId: counterId,
      farmerName: formData.farmerName,
      farmerId: formData.farmerId,
      token: formData.tokenNumber,
      bookingId: formData.bookingId,
      action: `Initiated payment processing for farmer ${formData.farmerName} (${formData.farmerId}, Token ${formData.tokenNumber}) at ${counterId} (Amount: ₹${totalAmount.toLocaleString('en-IN')})`
    };

    const updatedQueue = (state.queue || []).map(q =>
      q.token === formData.tokenNumber ? { ...q, status: 'Completed' } : q
    );

    setState(prev => ({
      ...prev,
      procurements: [newProcurementRecord, ...(prev.procurements || [])],
      payments: [newPaymentRecord, ...(prev.payments || []).filter(p => p.id !== newPaymentId)],
      queue: updatedQueue,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    setModalState({
      isOpen: true,
      type: 'INITIATE_PAYMENT',
      data: newPaymentRecord
    });
  };

  return (
    <div className="space-y-6 font-sans pb-12">

      {/* PAGE HEADER & TOP STEPPER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-[11px] font-extrabold text-[#046a38] uppercase tracking-widest">PROCUREMENT CENTRE</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">Procurement</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Complete quality check, record harvest details and process payment for the verified farmer.</p>
        </div>

        {/* TOP STEPPER BADGE */}
        <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl px-4 py-2 shadow-xs text-xs font-bold">
          {/* Step 1: Verify Farmer */}
          <div className="flex items-center gap-1.5 text-emerald-700">
            <div className="w-5 h-5 rounded-full bg-[#046a38] text-white flex items-center justify-center text-[10px] font-extrabold">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Verify Farmer</span>
          </div>

          <span className="text-slate-300 font-normal">──</span>

          {/* Step 2: Quality Check (ACTIVE) */}
          <div className="flex items-center gap-1.5 text-slate-900">
            <div className="w-5 h-5 rounded-full bg-[#046a38] text-white flex items-center justify-center text-[11px] font-black">
              2
            </div>
            <span className="font-extrabold text-[#046a38]">Quality Check</span>
          </div>

          <span className="text-slate-300 font-normal">──</span>

          {/* Step 3: Procurement */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-[11px] font-bold">
              3
            </div>
            <span>Procurement</span>
          </div>

          <span className="text-slate-300 font-normal">──</span>

          {/* Step 4: Payment */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center text-[11px] font-bold">
              4
            </div>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* MAIN 3-COLUMN WORKFLOW LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUMN 1 (lg:col-span-3): VERIFIED FARMER CARD */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
            {/* Header Banner */}
            <div className="bg-[#046a38] px-4 py-3 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-200" strokeWidth={2.5} />
                <span className="font-extrabold text-sm tracking-tight">Verified Farmer</span>
              </div>
              <span className="bg-[#03522c] text-white px-2.5 py-0.5 rounded-md text-xs font-black tracking-wide border border-emerald-500/30">
                {formData.tokenNumber}
              </span>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Profile Avatar & Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#e6f4ea] flex items-center justify-center text-[#046a38] shrink-0 border border-emerald-200">
                  <div className="w-6 h-6 rounded-full bg-[#046a38] text-white flex items-center justify-center text-xs font-black">
                    {formData.farmerName.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">{formData.farmerName}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{formData.farmerId}</p>
                </div>
              </div>

              {/* Farmer Attributes List */}
              <div className="space-y-3.5 pt-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2} />
                  <span>{formData.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2} />
                  <span>{formData.location}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Booking Date</p>
                    <p className="text-slate-900 font-bold">{formData.bookingDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Booked Slot</p>
                    <p className="text-slate-900 font-bold">{formData.bookedSlot}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sprout className="w-4 h-4 text-[#046a38] shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Crop</p>
                    <p className="text-slate-900 font-bold">{formData.crop}</p>
                  </div>
                </div>
              </div>

              {/* Verified Status Alert Box */}
              <div className="bg-[#e6f4ea] border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#046a38] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Farmer Verified</h4>
                  <p className="text-[11px] font-medium text-slate-600 leading-tight mt-0.5">
                    Proceed with quality check and procurement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMN 2 (lg:col-span-6): MIDDLE SECTION - HARVEST, QUALITY, PRICE, REMARKS & BUTTONS */}
        <div className="lg:col-span-6 space-y-6">

          {/* HARVEST & QUALITY DETAILS CARD */}
          <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 py-3.5 px-5">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
                Harvest & Quality Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Crop Selection Dropdown (Complete 39 Crops Catalogue) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Crop <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white cursor-pointer"
                    value={formData.crop}
                    onChange={(e) => handleInputChange('crop', e.target.value)}
                  >
                    {CROPS_CATALOGUE.map(c => (
                      <option key={c.id} value={c.name}>
                        {currentLang === 'te' ? c.teluguName : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Moisture Content */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Moisture Content (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" step="0.1"
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white"
                    value={formData.moisture}
                    onChange={(e) => handleInputChange('moisture', e.target.value)}
                  />
                </div>

                {/* Variety (Optional) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Variety (Optional)
                  </label>
                  <select
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white cursor-pointer"
                    value={formData.variety}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                  >
                    <option value="MTU 1010">MTU 1010</option>
                    <option value="BPT 5204">BPT 5204</option>
                    <option value="Swarna">Swarna</option>
                    <option value="Sona Masoori">Sona Masoori</option>
                    <option value="HMT">HMT</option>
                  </select>
                </div>

                {/* Foreign Matter (%) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Foreign Matter (%)
                  </label>
                  <input
                    type="number" step="0.1"
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white"
                    value={formData.foreignMatter}
                    onChange={(e) => handleInputChange('foreignMatter', e.target.value)}
                  />
                </div>

                {/* Quantity / Weight (kg) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Quantity / Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>

                {/* Damaged Grains (%) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Damaged Grains (%)
                  </label>
                  <input
                    type="number" step="0.1"
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white"
                    value={formData.damagedGrains}
                    onChange={(e) => handleInputChange('damagedGrains', e.target.value)}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Unit
                  </label>
                  <select
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white cursor-pointer"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                  >
                    <option value="Kilograms (kg)">Kilograms (kg)</option>
                    <option value="Quintals (Q)">Quintals (Q)</option>
                  </select>
                </div>

                {/* Grain Grade */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Grain Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#046a38] bg-white cursor-pointer"
                    value={formData.grainGrade}
                    onChange={(e) => handleInputChange('grainGrade', e.target.value)}
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* PRICE & AMOUNT CALCULATION CARD */}
          <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 py-3.5 px-5">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
                Price & Amount Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* MSP Rate */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    MSP / Centre Rate (₹/kg)
                  </label>
                  <input
                    type="number" step="0.5"
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#046a38]"
                    value={formData.rate}
                    onChange={(e) => handleInputChange('rate', e.target.value)}
                  />
                </div>

                {/* Total Quantity */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Total Quantity (kg)
                  </label>
                  <input
                    type="text" readOnly
                    className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
                    value={formData.quantity}
                  />
                </div>

                {/* Total Amount */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Total Amount (₹)
                  </label>
                  <div className="w-full h-10 bg-[#e6f4ea] border border-emerald-200 rounded-xl px-3 flex items-center font-black text-slate-900 text-base">
                    {totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Calculation Formula & Info Pill */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-600">
                  Calculation: <span className="font-bold text-slate-900">{formData.quantity} kg × ₹{formData.rate} = ₹{totalAmount.toLocaleString('en-IN')}</span>
                </span>

                <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50/80 border border-blue-100 px-2.5 py-1 rounded-full text-[11px] font-medium">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Rate is based on current MSP / centre rates</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* REMARKS (OPTIONAL) CARD */}
          <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 py-3.5 px-5">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
                Remarks <span className="text-slate-400 font-semibold text-xs">(Optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <textarea
                className="w-full h-20 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#046a38] resize-none"
                placeholder="Any additional notes about the crop quality, weight, or other observations..."
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
              ></textarea>
            </CardContent>
          </Card>

          {/* ACTION BUTTONS */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* BUTTON 1: COMPLETE PROCUREMENT */}
              <button
                onClick={handleCompleteProcurement}
                className="flex items-center gap-3 p-3.5 bg-[#f0f8f3] border-2 border-[#046a38] rounded-2xl hover:bg-[#e2f3e8] transition-all text-left cursor-pointer group shadow-xs"
              >
                <div className="w-9 h-9 rounded-full bg-[#046a38] text-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#046a38] text-sm leading-tight">Complete Procurement</h4>
                  <p className="text-[11px] font-medium text-emerald-800/80 leading-tight">Save details & add to Pending Payment</p>
                </div>
              </button>

              {/* BUTTON 2: INITIATE PAYMENT */}
              <button
                onClick={handleInitiatePayment}
                className="flex items-center gap-3 p-3.5 bg-[#046a38] border-2 border-[#046a38] text-white rounded-2xl hover:bg-[#03522c] transition-all text-left cursor-pointer group shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <IndianRupee className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm leading-tight">Initiate Payment</h4>
                  <p className="text-[11px] font-medium text-emerald-100/90 leading-tight">Send details to Admin</p>
                </div>
              </button>

            </div>

            {/* INFO ALERT BANNER BELOW BUTTONS */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-blue-800 font-medium">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>When you click Complete Procurement, farmer procurement record is updated and added to Payments page under Pending Payment.</span>
            </div>
          </div>

        </div>

        {/* COLUMN 3 (lg:col-span-3): RIGHT SECTION - BOOKING DETAILS & SUMMARY */}
        <div className="lg:col-span-3 space-y-6">

          {/* BOOKING & TOKEN DETAILS CARD */}
          <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 py-3.5 px-5">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
                Booking & Token Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Token Number</span>
                <span className="font-black text-slate-900 text-sm">{formData.tokenNumber}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Booking ID</span>
                <span className="font-bold text-slate-800">{formData.bookingId}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Expected Quantity</span>
                <span className="font-bold text-slate-800">{formData.expectedQuantity}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Booked Slot</span>
                <span className="font-bold text-slate-800">{formData.bookedSlot}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                  {formData.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* PROCUREMENT SUMMARY CARD */}
          <Card className="border border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 py-3.5 px-5">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
                Procurement Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Crop</span>
                <span className="font-bold text-slate-900">{formData.crop}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Quantity (kg)</span>
                <span className="font-bold text-slate-900">{formData.quantity}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Rate (₹/kg)</span>
                <span className="font-bold text-slate-900">{formData.rate}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-slate-900 font-extrabold text-xs">Total Amount (₹)</span>
                <span className="font-black text-slate-900 text-base">
                  {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* CONFIRMATION MODAL */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-100">
            {/* Modal Header */}
            <div className="bg-[#046a38] p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                <h3 className="font-black text-lg">
                  {modalState.type === 'INITIATE_PAYMENT' ? 'Payment Initiated to Admin' : 'Procurement Completed & Saved'}
                </h3>
              </div>
              <button
                onClick={() => setModalState({ isOpen: false, type: null, data: null })}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs font-semibold text-slate-700">

              <div className="bg-[#e6f4ea] p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-[#046a38] uppercase tracking-wider">Farmer</p>
                  <p className="font-black text-slate-900 text-base">{formData.farmerName}</p>
                  <p className="text-slate-500 font-medium text-xs">{formData.farmerId} • Token: {formData.tokenNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-[#046a38] uppercase tracking-wider">Total Amount</p>
                  <p className="font-black text-slate-900 text-lg">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Procurement Record Details</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-500 font-normal">Crop/Variety:</span> <span className="font-bold">{formData.crop} ({formData.variety})</span></div>
                  <div><span className="text-slate-500 font-normal">Quantity:</span> <span className="font-bold">{formData.quantity} kg</span></div>
                  <div><span className="text-slate-500 font-normal">Rate:</span> <span className="font-bold">₹{formData.rate}/kg</span></div>
                  <div><span className="text-slate-500 font-normal">Grade:</span> <span className="font-bold">{formData.grainGrade}</span></div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 text-[#046a38] rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Farmer procurement marked Completed. Added to Payments page under Pending Payment.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setModalState({ isOpen: false, type: null, data: null });
                    navigate('/centre/payments');
                  }}
                  className="w-full py-3 bg-[#046a38] hover:bg-[#03522c] text-white font-bold rounded-xl transition-colors cursor-pointer text-sm shadow-xs"
                >
                  View Payments Page
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffProcurement;
