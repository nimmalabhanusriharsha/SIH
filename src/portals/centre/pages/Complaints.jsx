import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Card, CardHeader } from '../../../shared/components/Card';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { MessageSquareWarning, Search, X, Check } from 'lucide-react';

const StaffComplaints = () => {
  const { state, setState, currentUser } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredComplaints = (state.feedback || [])
    .filter(c => statusFilter === 'All' || c.status === statusFilter)
    .filter(c => {
       const searchLower = searchTerm.toLowerCase();
       return c.id.toLowerCase().includes(searchLower) || 
              c.category.toLowerCase().includes(searchLower) ||
              c.description.toLowerCase().includes(searchLower);
    });

  const handleUpdateStatus = (newStatus) => {
    if (!selectedComplaint) return;
    
    if (newStatus === 'Resolved' && !resolutionNote) {
       alert("A resolution note is required to close a complaint.");
       return;
    }

    const updatedFeedback = state.feedback.map(c => 
      c.id === selectedComplaint.id ? { 
        ...c, 
        status: newStatus,
        resolutionNote: newStatus === 'Resolved' ? resolutionNote : c.resolutionNote
      } : c
    );
    
    const newActivity = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: currentUser.id,
      action: `Updated complaint ${selectedComplaint.id} to ${newStatus}`,
      farmerName: state.farmers.find(f => f.id === selectedComplaint.farmerId)?.name || 'Unknown',
      bookingId: 'N/A'
    };

    setState(prev => ({
      ...prev,
      feedback: updatedFeedback,
      activity: [newActivity, ...(prev.activity || [])]
    }));

    setSelectedComplaint(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] font-extrabold text-farmer-secondary uppercase tracking-widest">PROCUREMENT CENTRE</p>
          <h1 className="text-2xl md:text-3xl font-black text-farmer-text tracking-tight mt-0.5">Complaints & Feedback</h1>
          <p className="text-sm font-medium text-farmer-secondary mt-1">Manage issues raised by farmers at this centre.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white border border-farmer-border rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-farmer-secondary uppercase tracking-widest mb-1">Under Review</p>
            <h3 className="text-2xl md:text-3xl font-black text-amber-600">{(state.feedback || []).filter(c=>c.status==='Under Review').length}</h3>
         </div>
         <div className="bg-white border border-farmer-border rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-farmer-secondary uppercase tracking-widest mb-1">Resolved Today</p>
            <h3 className="text-2xl md:text-3xl font-black text-farmer-primary">{(state.feedback || []).filter(c=>c.status==='Resolved').length}</h3>
         </div>
      </div>

      <Card className="border border-farmer-border shadow-xs overflow-hidden bg-white rounded-2xl">
        <CardHeader className="bg-slate-50/60 border-b border-farmer-border p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto custom-scrollbar pb-1 lg:pb-0">
             {['All', 'Open', 'Under Review', 'Resolved', 'Rejected'].map(f => (
               <button 
                 key={f}
                 onClick={() => setStatusFilter(f)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                   statusFilter === f 
                     ? 'bg-farmer-primary text-white shadow-xs' 
                     : 'bg-white text-farmer-secondary border border-farmer-border hover:bg-slate-100'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="flex gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
               <Input 
                 placeholder="Search complaints..." 
                 className="pl-9 h-9 border-farmer-border text-sm font-medium rounded-xl focus:border-farmer-primary"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-farmer-border text-farmer-secondary uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Complaint ID</th>
                <th className="p-4">Category</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredComplaints.length > 0 ? filteredComplaints.map((c) => {
                const farmer = state.farmers.find(f => f.id === c.farmerId);
                
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                       <p className="font-bold text-farmer-primary text-sm">{c.id}</p>
                       <p className="text-[10px] font-bold text-farmer-secondary mt-0.5 uppercase tracking-wider">{new Date(c.date).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 font-bold text-farmer-text">{c.category}</td>
                    <td className="p-4">
                       <p className="font-bold text-farmer-text">{farmer?.name}</p>
                       <p className="text-xs font-medium text-farmer-secondary">{farmer?.mobile}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-farmer-secondary max-w-xs truncate">{c.description}</td>
                    <td className="p-4">
                       <span className={`px-2.5 py-1 rounded-full uppercase font-extrabold tracking-wider text-[10px] border ${
                         c.status === 'Resolved' ? 'bg-farmer-primary-light text-farmer-primary border-emerald-200' :
                         c.status === 'Open' ? 'bg-red-50 text-red-700 border-red-200' :
                         'bg-amber-50 text-amber-700 border-amber-200'
                       }`}>
                         {c.status}
                       </span>
                    </td>
                    <td className="p-4 text-right">
                       <Button size="sm" variant="outline" className="h-8 font-bold text-xs shadow-xs bg-white border-farmer-border text-farmer-text rounded-xl hover:bg-slate-50" onClick={() => setSelectedComplaint(c)}>
                         Review
                       </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <MessageSquareWarning className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-farmer-secondary font-bold text-sm">No complaints found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* REVIEW MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
              <div className="bg-farmer-primary p-5 flex justify-between items-center text-white shrink-0">
                 <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquareWarning className="w-5 h-5" /> Review Complaint</h3>
                 <button onClick={() => {
                   setSelectedComplaint(null);
                   setResolutionNote('');
                 }} className="text-white/80 hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                 
                 <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-extrabold text-farmer-secondary uppercase tracking-widest mb-1">Complaint ID</p>
                      <h3 className="text-2xl font-black text-farmer-text">{selectedComplaint.id}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full uppercase font-extrabold tracking-wider text-[10px] border ${
                         selectedComplaint.status === 'Resolved' ? 'bg-farmer-primary-light text-farmer-primary border-emerald-200' :
                         selectedComplaint.status === 'Open' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {selectedComplaint.status}
                    </span>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-farmer-border space-y-2">
                    <p className="text-[10px] font-extrabold text-farmer-secondary uppercase tracking-widest">Description</p>
                    <p className="text-sm font-medium text-farmer-text">{selectedComplaint.description}</p>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-2">Resolution Note</label>
                    <textarea 
                      className="w-full h-24 border border-farmer-border rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-farmer-primary resize-none"
                      placeholder="Add resolution details..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                    ></textarea>
                 </div>

                 <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 font-bold border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl" onClick={() => handleUpdateStatus('Under Review')}>
                      Mark Under Review
                    </Button>
                    <Button className="flex-1 font-bold bg-farmer-primary hover:bg-[#03522c] text-white rounded-xl shadow-xs cursor-pointer" onClick={() => handleUpdateStatus('Resolved')}>
                      <Check className="w-4 h-4 mr-1.5" /> Resolve Issue
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default StaffComplaints;
