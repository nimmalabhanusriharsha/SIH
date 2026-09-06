import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  CheckCircle2, Circle, RefreshCw, AlertCircle, FileText, ArrowRight,
  PackageCheck, MapPin, Calendar, Hash, QrCode, ClipboardCheck, 
  Scale, FileSignature, IndianRupee, MessageSquareWarning, Phone
} from 'lucide-react';

const Procurement = () => {
  const { state, setState, currentUser } = useAppContext();
  const navigate = useNavigate();

  // We find an active booking, or if none, we fall back to empty state.
  // We'll consider status: Confirmed, Processing, or Procurement as active.
  const activeBooking = state.bookings.find(b => 
    b.farmerId === currentUser.id && 
    (b.status === 'Confirmed' || b.status === 'Processing' || b.status === 'Procurement')
  );

  const centre = activeBooking ? state.centres.find(c => c.id === activeBooking.centreId) : null;
  const myQueueEntry = activeBooking ? state.queue.find(q => q.token === activeBooking.token) : null;

  // Mock State Management for Demo purposes
  // A realistic app would use a state variable on the activeBooking itself.
  // We will simulate the state based on the booking.status and queue.status.
  let procurementStatus = 'VERIFICATION';
  if (myQueueEntry?.status === 'Serving') {
    procurementStatus = 'WEIGHING'; // Jump to weighing for demo
  }
  if (activeBooking?.status === 'Procurement') {
    procurementStatus = 'PROCUREMENT';
  }
  // To show full capability, we'll manually set state using a toggle for the demo, 
  // but by default we use the derived state.
  const [demoState, setDemoState] = useState(procurementStatus);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [issueDesc, setIssueDesc] = useState('');

  const submitIssue = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: `CMP-${Date.now()}`,
      farmerId: currentUser.id,
      type: issueType,
      description: issueDesc,
      status: 'Open',
      date: new Date().toISOString()
    };
    setState(prev => ({ ...prev, complaints: [newComplaint, ...(prev.complaints || [])] }));
    setShowIssueModal(false);
    setIssueType('');
    setIssueDesc('');
    alert("Issue reported successfully!");
  };

  // Past procurements for the bottom section
  const pastProcurements = state.procurements
    .filter(p => p.farmerId === currentUser.id)
    .sort((a,b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (!activeBooking) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-earth-100">
          <PackageCheck className="w-12 h-12 text-forest-600" />
        </div>
        <h2 className="text-2xl font-bold text-forest-900 mb-2">No Active Procurement</h2>
        <p className="text-earth-600 mt-2 text-lg mb-6">
          Once your crop enters the procurement process, you will be able to track verification, quality, weighing, procurement and payment here.
        </p>
        <Button size="lg" className="shadow-md font-bold" onClick={() => navigate('/farmer/book-slot')}>
          Book a Procurement Slot <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Define steps
  const stages = [
    { id: 'VERIFICATION', label: 'Verification', icon: ClipboardCheck },
    { id: 'QUALITY_CHECK', label: 'Quality Check', icon: FileText },
    { id: 'WEIGHING', label: 'Weighing', icon: Scale },
    { id: 'PROCUREMENT', label: 'Procurement', icon: FileSignature },
    { id: 'PAYMENT', label: 'Payment', icon: IndianRupee },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === demoState);

  // Mock data calculations based on demo state
  const mockQuality = {
    moisture: '14.2%',
    grade: 'A',
    foreign: '0.8%',
    status: currentStageIndex >= 1 ? 'Accepted' : 'Pending'
  };

  const expectedQty = activeBooking.expectedQuantity;
  const actualQty = currentStageIndex >= 2 ? (expectedQty - 0.28).toFixed(2) : '--';
  const rate = 2369;
  const estAmount = currentStageIndex >= 2 ? (actualQty * rate) : (expectedQty * rate);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* 2. PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-earth-200 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-forest-900 tracking-tight">Crop Procurement</h2>
          <p className="text-earth-600 mt-1 font-medium">Track your crop procurement from verification to payment.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-earth-200 shadow-sm">
           <span className="text-xs font-bold text-earth-500">Last updated: Just now</span>
           <button onClick={handleRefresh} className={`text-forest-600 hover:text-forest-800 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}>
             <RefreshCw className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* DEV DEMO CONTROLS (Invisible in real production, kept here for simulation requirement) */}
      <div className="flex gap-2 overflow-x-auto text-xs opacity-50 hover:opacity-100 transition-opacity">
        <span className="font-bold mr-2 mt-1">Demo State:</span>
        {stages.map(s => (
          <button key={s.id} onClick={()=>setDemoState(s.id)} className={`px-2 py-1 rounded border ${demoState===s.id ? 'bg-forest-600 text-white' : 'bg-white'}`}>{s.label}</button>
        ))}
        <button onClick={()=>setDemoState('COMPLETED')} className={`px-2 py-1 rounded border ${demoState==='COMPLETED' ? 'bg-forest-600 text-white' : 'bg-white'}`}>Completed</button>
      </div>

      {/* 3. CURRENT PROCUREMENT — MAIN HERO CARD */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-forest-900 to-forest-950 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <PackageCheck className="w-48 h-48" />
         </div>
         <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <Badge className="bg-forest-800 text-forest-100 hover:bg-forest-700 border-forest-700 mb-2 uppercase font-bold tracking-widest text-[10px]">
                    Current Procurement
                  </Badge>
                  <h3 className="text-3xl font-black">{activeBooking.crop}</h3>
               </div>
               <Badge className={`uppercase font-black tracking-widest px-4 py-1.5 shadow-sm ${demoState==='COMPLETED'?'bg-green-500 text-white':'bg-amber-500 text-amber-950'}`}>
                  {demoState.replace('_', ' ')} IN PROGRESS
               </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-forest-800/50 p-6 rounded-2xl border border-forest-700/50 backdrop-blur-sm">
               <div>
                  <p className="text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Hash className="w-3 h-3"/> Booking ID</p>
                  <p className="text-lg font-bold text-white">{activeBooking.id}</p>
               </div>
               <div>
                  <p className="text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><QrCode className="w-3 h-3"/> Token</p>
                  <p className="text-xl font-black text-white">{activeBooking.token}</p>
               </div>
               <div>
                  <p className="text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Centre</p>
                  <p className="text-sm font-bold text-white line-clamp-2">{centre?.name}</p>
               </div>
               <div>
                  <p className="text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Scheduled</p>
                  <p className="text-sm font-bold text-white">{new Date(activeBooking.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</p>
                  <p className="text-xs text-forest-200 font-medium">{activeBooking.slot.split(' - ')[0]}</p>
               </div>
            </div>
            
            <div className="mt-6 flex justify-between items-end">
               <div>
                 <p className="text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-1">Expected Quantity</p>
                 <p className="text-2xl font-black">{activeBooking.expectedQuantity}.00 Quintals</p>
               </div>
            </div>
         </CardContent>
      </Card>

      {/* 4. PROCUREMENT JOURNEY / PROGRESS TRACKER */}
      <Card className="border-earth-200 shadow-sm overflow-x-auto">
         <CardContent className="p-6 md:p-8">
           <div className="flex flex-col md:flex-row justify-between relative min-w-[600px] md:min-w-0 gap-4 md:gap-0">
             
             {/* Background Line (Desktop) */}
             <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-earth-200 z-0"></div>
             
             {/* Active Line (Desktop) */}
             <div className="hidden md:block absolute top-6 left-12 h-1 bg-forest-600 z-0 transition-all duration-500" 
                  style={{ width: `${demoState==='COMPLETED' ? 100 : (Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%` }}></div>
             
             {stages.map((stage, idx) => {
               const isCompleted = demoState === 'COMPLETED' || currentStageIndex > idx;
               const isCurrent = demoState === stage.id;
               const isPending = !isCompleted && !isCurrent;
               
               return (
                 <div key={stage.id} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 group">
                   
                   {/* Mobile Line connecting nodes */}
                   {idx < stages.length - 1 && (
                      <div className={`md:hidden absolute left-6 top-12 bottom-[-16px] w-0.5 ${currentStageIndex > idx || demoState==='COMPLETED' ? 'bg-forest-600' : 'bg-earth-200'} z-0`}></div>
                   )}
                   
                   {/* Circle */}
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm relative z-10 bg-white
                     ${isCompleted ? 'border-green-500 text-green-500' : 
                       isCurrent ? 'border-forest-600 text-forest-600 ring-4 ring-forest-100 scale-110' : 
                       'border-earth-200 text-earth-300'}`}
                   >
                     {isCompleted ? <CheckCircle2 className="w-5 h-5 fill-current text-white" /> : <stage.icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />}
                   </div>
                   
                   {/* Label */}
                   <div className="md:text-center">
                     <p className={`text-xs md:text-sm font-bold uppercase tracking-wider ${isCompleted ? 'text-green-700' : isCurrent ? 'text-forest-900' : 'text-earth-400'}`}>
                       {isCompleted && <span className="md:hidden mr-1 text-green-500">✓</span>}
                       {isCurrent && <span className="md:hidden mr-1 text-forest-600">●</span>}
                       {isPending && <span className="md:hidden mr-1 text-earth-300">○</span>}
                       {stage.label}
                     </p>
                     <p className={`text-[10px] md:text-xs font-bold mt-1 uppercase ${isCompleted ? 'text-green-600' : isCurrent ? 'text-forest-600' : 'text-earth-400'}`}>
                       {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                     </p>
                   </div>
                 </div>
               );
             })}
           </div>
         </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: TIMELINE & DETAILS */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* 5. PROCUREMENT TIMELINE */}
           <Card className="border-earth-200 shadow-sm">
             <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
               <CardTitle className="text-lg font-bold text-forest-900">Live Timeline</CardTitle>
             </CardHeader>
             <CardContent className="p-6">
               <div className="relative border-l-2 border-earth-200 ml-4 space-y-8">
                 
                 {stages.map((stage, idx) => {
                   const isCompleted = demoState === 'COMPLETED' || currentStageIndex > idx;
                   const isCurrent = demoState === stage.id;
                   
                   let desc = '';
                   if (stage.id === 'VERIFICATION') desc = isCompleted ? 'Farmer identity and booking verified successfully.' : isCurrent ? 'Verifying identity and land records.' : 'Pending verification.';
                   if (stage.id === 'QUALITY_CHECK') desc = isCompleted ? 'Crop quality has been accepted.' : isCurrent ? 'Conducting moisture and grade assessment.' : 'Waiting for quality check.';
                   if (stage.id === 'WEIGHING') desc = isCompleted ? 'Weighing completed and recorded.' : isCurrent ? 'Your crop is currently being weighed.' : 'Waiting for weighing.';
                   if (stage.id === 'PROCUREMENT') desc = isCompleted ? 'Procurement confirmed by officials.' : isCurrent ? 'Finalizing procurement receipt.' : 'Waiting for weighing completion.';
                   if (stage.id === 'PAYMENT') desc = isCompleted ? 'Payment transferred to bank account.' : isCurrent ? 'Processing payment transfer.' : 'Payment will begin after procurement confirmation.';

                   return (
                     <div key={stage.id} className={`relative pl-8 transition-opacity ${!isCompleted && !isCurrent ? 'opacity-40' : 'opacity-100'}`}>
                        {/* Dot Indicator */}
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                          isCompleted ? 'bg-green-500' : isCurrent ? 'bg-forest-600 ring-2 ring-forest-200 animate-pulse' : 'bg-earth-300'
                        }`}></div>
                        
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-base font-bold ${isCurrent ? 'text-forest-900' : isCompleted ? 'text-green-800' : 'text-earth-600'}`}>
                            {isCompleted ? '✓ ' : isCurrent ? '● ' : '○ '}{stage.label}
                          </h4>
                          {isCompleted && <span className="text-xs font-bold text-earth-400">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>}
                        </div>
                        
                        <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-widest mb-2 border-none px-0 ${
                          isCompleted ? 'text-green-600' : isCurrent ? 'text-forest-600' : 'text-earth-400'
                        }`}>
                          {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                        </Badge>
                        
                        <p className={`text-sm font-medium ${isCurrent ? 'text-forest-700 bg-forest-50 p-3 rounded-lg border border-forest-100' : 'text-earth-600'}`}>
                          {desc}
                        </p>
                     </div>
                   );
                 })}
               </div>
             </CardContent>
           </Card>

           {/* 6. QUALITY ASSESSMENT CARD */}
           <Card className="border-earth-200 shadow-sm">
             <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
               <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-forest-600" /> Quality Assessment
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                {currentStageIndex >= 1 || demoState === 'COMPLETED' ? (
                  <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-earth-200 text-center shadow-sm">
                          <p className="text-[10px] font-bold text-earth-500 uppercase tracking-wider mb-1">Moisture</p>
                          <p className="text-xl font-black text-earth-900">{mockQuality.moisture}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-earth-200 text-center shadow-sm">
                          <p className="text-[10px] font-bold text-earth-500 uppercase tracking-wider mb-1">Grain Grade</p>
                          <p className="text-xl font-black text-earth-900">{mockQuality.grade}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-earth-200 text-center shadow-sm">
                          <p className="text-[10px] font-bold text-earth-500 uppercase tracking-wider mb-1">Foreign Matter</p>
                          <p className="text-xl font-black text-earth-900">{mockQuality.foreign}</p>
                        </div>
                     </div>
                     <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-200">
                        <span className="font-bold text-green-900">Quality Status</span>
                        <Badge className="bg-green-600 text-white uppercase font-bold text-xs px-3">{mockQuality.status}</Badge>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                     <FileText className="w-12 h-12 text-earth-300 mx-auto mb-3" />
                     <p className="text-earth-600 font-bold">Quality assessment is pending.</p>
                     <p className="text-earth-500 text-sm mt-1">Data will appear once the quality check is complete.</p>
                  </div>
                )}
             </CardContent>
           </Card>

           {/* 7. WEIGHING DETAILS CARD */}
           <Card className="border-earth-200 shadow-sm">
             <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
               <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
                 <Scale className="w-5 h-5 text-forest-600" /> Weighing Details
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <div className="space-y-4">
                   <div className="flex justify-between items-center pb-3 border-b border-earth-100">
                      <span className="text-xs font-bold text-earth-500 uppercase tracking-wider">Expected Quantity</span>
                      <span className="font-bold text-earth-900 text-lg">{expectedQty}.00 Quintals</span>
                   </div>
                   
                   {currentStageIndex >= 2 || demoState === 'COMPLETED' ? (
                     <>
                       <div className="flex justify-between items-center pb-3 border-b border-earth-100">
                          <span className="text-xs font-bold text-earth-500 uppercase tracking-wider">Actual Quantity</span>
                          <span className="font-black text-forest-900 text-xl">{actualQty} Quintals</span>
                       </div>
                       <div className="flex justify-between items-center pb-3 border-b border-earth-100">
                          <span className="text-xs font-bold text-earth-500 uppercase tracking-wider">Rate</span>
                          <span className="font-bold text-earth-900 text-lg">₹{rate.toLocaleString('en-IN')} / Quintal</span>
                       </div>
                       <div className={`flex justify-between items-center p-4 rounded-xl border ${currentStageIndex > 2 || demoState === 'COMPLETED' ? 'bg-forest-50 border-forest-200' : 'bg-amber-50 border-amber-200'}`}>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-earth-600">
                              {currentStageIndex > 2 || demoState === 'COMPLETED' ? 'Final Procurement Amount' : 'Estimated Procurement Amount'}
                            </span>
                            <span className={`font-black text-3xl ${currentStageIndex > 2 || demoState === 'COMPLETED' ? 'text-forest-900' : 'text-amber-900'}`}>
                              ₹{estAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          {currentStageIndex === 2 && demoState !== 'COMPLETED' && (
                            <Badge className="bg-amber-500 text-amber-950 uppercase font-bold text-[10px]">In Progress</Badge>
                          )}
                       </div>
                     </>
                   ) : (
                     <div className="text-center py-6">
                        <Scale className="w-10 h-10 text-earth-300 mx-auto mb-3" />
                        <p className="text-earth-600 font-bold">Weighing is pending.</p>
                     </div>
                   )}
                </div>
             </CardContent>
           </Card>

        </div>

        {/* RIGHT COLUMN: SUMMARIES & ACTIONS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 8. PROCUREMENT SUMMARY */}
          <Card className="border-earth-200 shadow-sm">
             <CardHeader className="bg-forest-900 border-b border-forest-800 py-4">
               <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                 <FileSignature className="w-4 h-4 text-forest-300" /> Procurement Summary
               </CardTitle>
             </CardHeader>
             <CardContent className="p-5">
                {currentStageIndex >= 3 || demoState === 'COMPLETED' ? (
                  <div className="space-y-4">
                     <div className="flex justify-between">
                       <span className="text-xs font-bold text-earth-500 uppercase">Crop</span>
                       <span className="font-bold text-earth-900">{activeBooking.crop}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-xs font-bold text-earth-500 uppercase">Actual Qty</span>
                       <span className="font-bold text-earth-900">{actualQty} Q</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-xs font-bold text-earth-500 uppercase">Rate</span>
                       <span className="font-bold text-earth-900">₹{rate}/Q</span>
                     </div>
                     <div className="border-t border-earth-100 pt-3">
                       <span className="text-[10px] font-bold text-earth-500 uppercase tracking-wider block mb-1">Total Amount</span>
                       <span className="font-black text-2xl text-forest-900">₹{estAmount.toLocaleString('en-IN')}</span>
                     </div>
                     <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1 flex justify-between">
                          Status 
                          <span className="text-earth-500 lowercase font-medium">{new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</span>
                        </p>
                        <p className="font-bold text-green-900">Completed</p>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                     <p className="text-earth-600 font-bold">Procurement pending</p>
                     <p className="text-xs text-earth-500 mt-2">Summary will generate after weighing.</p>
                  </div>
                )}
             </CardContent>
          </Card>

          {/* 9. PAYMENT SUMMARY */}
          <Card className="border-earth-200 shadow-sm">
             <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
               <CardTitle className="text-base font-bold text-forest-900 flex items-center gap-2">
                 <IndianRupee className="w-4 h-4 text-forest-600" /> Payment Status
               </CardTitle>
             </CardHeader>
             <CardContent className="p-5">
                {currentStageIndex >= 3 || demoState === 'COMPLETED' ? (
                  <div className="space-y-4">
                     <div>
                       <span className="text-[10px] font-bold text-earth-500 uppercase tracking-wider block mb-1">Amount</span>
                       <span className="font-black text-2xl text-earth-900">₹{estAmount.toLocaleString('en-IN')}</span>
                     </div>
                     
                     <div className={`p-3 rounded-lg border ${demoState==='COMPLETED' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                        <p className="font-bold flex items-center gap-2">
                          {demoState === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
                          {demoState === 'COMPLETED' ? 'Payment Completed' : 'Payment Processing'}
                        </p>
                     </div>

                     <div className="flex justify-between text-sm border-t border-earth-100 pt-3">
                       <span className="font-bold text-earth-500">Method</span>
                       <span className="font-bold text-earth-900">Bank Transfer</span>
                     </div>
                     
                     <Button className="w-full font-bold shadow-sm" onClick={() => navigate('/farmer/payments')}>
                       View Payment Details <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                     <p className="text-earth-600 font-bold">Payment pending</p>
                     <p className="text-xs text-earth-500 mt-2">Will process after procurement.</p>
                  </div>
                )}
             </CardContent>
          </Card>

          {/* 10. RECENT PROCUREMENT */}
          <Card className="border-earth-200 shadow-sm">
             <CardHeader className="bg-earth-50 border-b border-earth-100 py-3">
               <CardTitle className="text-sm font-bold text-forest-900">Recent Procurement</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-earth-100">
                  {pastProcurements.map(p => (
                    <div key={p.id} className="p-4 hover:bg-earth-50 transition-colors">
                       <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-earth-900 text-sm">{p.crop}</span>
                          <span className="text-[10px] font-bold text-earth-500">{new Date(p.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <span className="font-bold text-forest-700 text-xs">{p.actualQuantity} Q</span>
                          <span className="font-black text-earth-900">₹{p.totalAmount.toLocaleString('en-IN')}</span>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-earth-100">
                  <Button variant="ghost" className="w-full text-xs font-bold text-forest-600" onClick={() => navigate('/farmer/history')}>
                    View Full History <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
             </CardContent>
          </Card>

          {/* 11. HELP / REPORT ISSUE */}
          <Card className="border-earth-200 shadow-sm bg-earth-50">
             <CardContent className="p-5 text-center">
                <h4 className="font-bold text-earth-900 mb-1">Having an issue?</h4>
                <p className="text-xs text-earth-600 mb-4">Report discrepancies immediately.</p>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="font-bold border-red-200 text-red-600 bg-white hover:bg-red-50 gap-2" onClick={() => setShowIssueModal(true)}>
                    <MessageSquareWarning className="w-4 h-4" /> Report an Issue
                  </Button>
                  <Button variant="outline" className="font-bold border-earth-300 text-earth-700 bg-white gap-2">
                    <Phone className="w-4 h-4" /> Contact Centre
                  </Button>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>

      {/* REPORT ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                 <h3 className="font-bold text-red-900 flex items-center gap-2">
                   <MessageSquareWarning className="w-5 h-5 text-red-600" /> Report Procurement Issue
                 </h3>
                 <button onClick={() => setShowIssueModal(false)} className="text-red-400 hover:text-red-700 font-black text-xl">&times;</button>
              </div>
              <div className="p-6">
                 <form onSubmit={submitIssue} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Issue Type</label>
                      <select 
                        required
                        className="w-full h-10 border border-earth-300 rounded-lg px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                      >
                        <option value="">Select issue...</option>
                        <option value="Wrong quantity">Wrong quantity</option>
                        <option value="Quality issue">Quality issue</option>
                        <option value="Weighing issue">Weighing issue</option>
                        <option value="Procurement issue">Procurement issue</option>
                        <option value="Payment issue">Payment issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Description</label>
                      <textarea
                        required
                        className="w-full h-24 border border-earth-300 rounded-lg p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                        placeholder="Briefly describe the problem..."
                        value={issueDesc}
                        onChange={(e) => setIssueDesc(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-100 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-medium text-amber-800">Your issue will be flagged to the Centre Manager immediately.</p>
                    </div>
                    <Button type="submit" className="w-full font-bold bg-red-600 hover:bg-red-700 text-white">Submit Report</Button>
                 </form>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Procurement;
