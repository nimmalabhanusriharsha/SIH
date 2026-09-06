import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MessageSquareWarning, Search, Filter, X, CheckCircle2, FileText, User } from 'lucide-react';

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
    
    // Add Activity
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-forest-900 tracking-tight">Complaints & Feedback</h2>
          <p className="text-earth-600 mt-1 font-medium">Manage issues raised by farmers at this centre.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white border border-earth-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Open</p>
            <h3 className="text-2xl font-black text-red-600">{(state.feedback || []).filter(c=>c.status==='Open').length}</h3>
         </div>
         <div className="bg-white border border-earth-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Under Review</p>
            <h3 className="text-2xl font-black text-amber-600">{(state.feedback || []).filter(c=>c.status==='Under Review').length}</h3>
         </div>
         <div className="bg-white border border-earth-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Resolved Today</p>
            <h3 className="text-2xl font-black text-green-600">{(state.feedback || []).filter(c=>c.status==='Resolved').length}</h3>
         </div>
         <div className="bg-white border border-earth-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Avg Resolution</p>
            <h3 className="text-2xl font-black text-forest-900">4 hrs</h3>
         </div>
      </div>

      <Card className="border-earth-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-earth-50 border-b border-earth-100 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
           
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto custom-scrollbar pb-2 lg:pb-0">
             {['All', 'Open', 'Under Review', 'Resolved', 'Rejected'].map(f => (
               <button 
                 key={f}
                 onClick={() => setStatusFilter(f)}
                 className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider ${
                   statusFilter === f ? 'bg-forest-900 text-white' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-100'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="flex gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
               <Input 
                 placeholder="Search complaints..." 
                 className="pl-9 h-9 border-earth-300 text-sm font-medium"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
           </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-earth-200 text-earth-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Complaint ID</th>
                <th className="p-4">Category</th>
                <th className="p-4">Farmer</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100 bg-white">
              {filteredComplaints.length > 0 ? filteredComplaints.map((c) => {
                const farmer = state.farmers.find(f => f.id === c.farmerId);
                
                return (
                  <tr key={c.id} className="hover:bg-earth-50 transition-colors">
                    <td className="p-4">
                       <p className="font-bold text-forest-900">{c.id}</p>
                       <p className="text-[10px] font-bold text-earth-400 mt-1 uppercase tracking-wider">{new Date(c.date).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 font-bold text-earth-800">{c.category}</td>
                    <td className="p-4">
                       <p className="font-bold text-earth-800">{farmer?.name}</p>
                       <p className="text-xs font-medium text-earth-500">{farmer?.mobile}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-earth-600 max-w-xs truncate">{c.description}</td>
                    <td className="p-4">
                       <Badge className={`uppercase font-bold tracking-widest text-[9px] ${
                         c.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                         c.status === 'Open' ? 'bg-red-100 text-red-700 border-red-200' :
                         'bg-amber-100 text-amber-700 border-amber-200'
                       }`}>
                         {c.status}
                       </Badge>
                    </td>
                    <td className="p-4 text-right">
                       <Button size="sm" variant="outline" className="h-8 font-bold text-xs shadow-sm bg-white border-earth-300 text-earth-700" onClick={() => setSelectedComplaint(c)}>
                         Review
                       </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <MessageSquareWarning className="w-10 h-10 text-earth-300 mb-2" />
                      <p className="text-earth-500 font-bold">No complaints found.</p>
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
        <div className="fixed inset-0 bg-forest-950/80 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
              <div className="bg-forest-900 p-5 flex justify-between items-center text-white shrink-0">
                 <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquareWarning className="w-5 h-5" /> Review Complaint</h3>
                 <button onClick={() => {
                   setSelectedComplaint(null);
                   setResolutionNote('');
                 }} className="text-forest-300 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                 
                 <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-1">Complaint ID</p>
                      <h3 className="text-2xl font-black text-forest-900">{selectedComplaint.id}</h3>
                    </div>
                    <Badge className={`uppercase font-bold tracking-widest text-[9px] ${
                         selectedComplaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                         selectedComplaint.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {selectedComplaint.status}
                    </Badge>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-earth-50 p-4 rounded-xl border border-earth-100 flex items-center gap-3">
                       <User className="w-5 h-5 text-earth-400 shrink-0" />
                       <div>
                         <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-0.5">Farmer</p>
                         <p className="font-bold text-earth-900 text-sm">{state.farmers.find(f => f.id === selectedComplaint.farmerId)?.name}</p>
                       </div>
                    </div>
                    <div className="bg-earth-50 p-4 rounded-xl border border-earth-100 flex items-center gap-3">
                       <FileText className="w-5 h-5 text-earth-400 shrink-0" />
                       <div>
                         <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-0.5">Category</p>
                         <p className="font-bold text-earth-900 text-sm">{selectedComplaint.category}</p>
                       </div>
                    </div>
                 </div>

                 <div>
                   <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest mb-2">Description</p>
                   <div className="p-4 bg-white border border-earth-200 rounded-lg text-sm font-medium text-earth-800 leading-relaxed">
                      "{selectedComplaint.description}"
                   </div>
                 </div>

                 {selectedComplaint.status === 'Resolved' && selectedComplaint.resolutionNote ? (
                    <div>
                      <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2">Resolution</p>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-800 leading-relaxed">
                         {selectedComplaint.resolutionNote}
                      </div>
                    </div>
                 ) : (
                   <div className="space-y-4 pt-4 border-t border-earth-200">
                      <div>
                        <label className="text-xs font-bold text-earth-600 uppercase tracking-wider block mb-2">Add Resolution Note</label>
                        <textarea
                           className="w-full h-24 border border-earth-300 rounded-lg p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-forest-500 resize-none"
                           placeholder="Type the resolution or response to the farmer here..."
                           value={resolutionNote}
                           onChange={(e) => setResolutionNote(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="flex gap-3">
                         <Button variant="outline" className="flex-1 font-bold border-earth-300 text-earth-700 bg-white" onClick={() => handleUpdateStatus('Under Review')}>
                           Mark Under Review
                         </Button>
                         <Button className="flex-1 font-bold bg-green-600 hover:bg-green-700 text-white shadow-md" onClick={() => handleUpdateStatus('Resolved')}>
                           <CheckCircle2 className="w-4 h-4 mr-2" /> Resolve Issue
                         </Button>
                      </div>
                      <div className="flex justify-center">
                        <button className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest" onClick={() => handleUpdateStatus('Rejected')}>
                           Reject Complaint
                        </button>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default StaffComplaints;
