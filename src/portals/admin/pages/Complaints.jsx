import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Badge } from '../../../shared/components/Badge';
import { Search, Filter, MessageSquareWarning, Eye, X, Check, Clock } from 'lucide-react';

const AdminComplaints = () => {
  const { state, updateComplaint } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  // Use state.feedback/complaints or mock some if empty
  const rawComplaints = (state.feedback && state.feedback.length > 0) ? state.feedback : [
    { id: 'CMP-2026-042', farmerId: 'KIS-7F29A81C', name: 'Ramesh Kumar', userType: 'Farmer', centreId: 'C001', type: 'Quality Assessment', description: 'Moisture machine was reading higher than actual.', status: 'Open', date: '2026-09-12T10:00:00Z', resolution: '' },
    { id: 'CMP-2026-043', farmerId: 'F015', name: 'Ravi', userType: 'Farmer', centreId: 'C002', type: 'Payment Delay', description: 'Did not receive payment for 3 days.', status: 'In Progress', date: '2026-09-11T14:30:00Z', resolution: 'Bank processing delay identified.' },
    { id: 'CMP-2026-044', farmerId: 'STAFF001', name: 'Staff User', userType: 'Staff', centreId: 'C001', type: 'System Error', description: 'Tablet crashed during procurement entry.', status: 'Resolved', date: '2026-09-10T09:15:00Z', resolution: 'Tablet software updated.' },
  ];

  const complaints = rawComplaints.map(c => ({
    ...c,
    userType: c.userType || (c.farmerId?.startsWith('STAFF') ? 'Staff' : 'Farmer'),
    type: c.type || c.category || 'General',
    description: c.description || 'No description provided.',
    status: c.status || 'Open'
  }));

  const filteredComplaints = complaints.filter(cmp => {
    const matchesSearch = 
      cmp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cmp.name && cmp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cmp.farmerId && cmp.farmerId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || cmp.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleManageClick = (cmp) => {
    setSelectedComplaint(cmp);
    setResolutionText(cmp.resolution || '');
  };

  const handleStatusUpdate = (newStatus) => {
    updateComplaint(selectedComplaint.id, { status: newStatus, resolution: resolutionText });
    setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
  };

  const handleSaveResolution = () => {
    updateComplaint(selectedComplaint.id, { resolution: resolutionText });
    setSelectedComplaint(null); // Close modal
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-farmer-text tracking-tight">Complaint Tracking</h2>
          <p className="text-sm font-medium text-farmer-secondary mt-1">Monitor and resolve grievances submitted by farmers and staff.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
            <input 
              placeholder="Search by ID, User, or Center..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-farmer-border rounded-xl text-sm font-medium text-farmer-text focus:outline-none focus:border-farmer-primary shadow-sm min-h-[44px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="bg-white border border-farmer-border text-farmer-text font-bold text-sm px-4 py-2 rounded-xl focus:outline-none min-h-[44px] shadow-sm cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl p-2 md:p-6 shadow-sm border border-farmer-border overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-farmer-secondary uppercase tracking-wider border-b border-farmer-border">
               <tr>
                  <th className="px-4 py-4 font-bold">Complaint ID & Date</th>
                  <th className="px-4 py-4 font-bold">Submitted By</th>
                  <th className="px-4 py-4 font-bold">Type & Center</th>
                  <th className="px-4 py-4 font-bold">Description</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 font-bold text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-farmer-border/60">
               {filteredComplaints.length > 0 ? (
                 filteredComplaints.map(cmp => {
                   
                   let badgeClass = 'bg-farmer-bg text-farmer-text border-farmer-border';
                   if (cmp.status === 'Resolved') badgeClass = 'bg-farmer-success-light text-farmer-success border-farmer-success/20';
                   if (cmp.status === 'Open') badgeClass = 'bg-red-50 text-red-700 border-red-200';
                   if (cmp.status === 'In Progress') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                   if (cmp.status === 'Rejected') badgeClass = 'bg-gray-100 text-gray-700 border-gray-300';

                   return (
                     <tr key={cmp.id} className="hover:bg-farmer-bg transition-colors">
                        <td className="px-4 py-4 align-top">
                           <p className="font-bold text-farmer-text">{cmp.id}</p>
                           <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">{new Date(cmp.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-4 align-top">
                           <p className="font-bold text-farmer-text">{cmp.name}</p>
                           <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">{cmp.userType} • {cmp.farmerId}</p>
                        </td>
                        <td className="px-4 py-4 align-top">
                           <p className="font-bold text-farmer-text">{cmp.type}</p>
                           <p className="text-[10px] font-bold text-farmer-secondary mt-0.5">{cmp.centreId}</p>
                        </td>
                        <td className="px-4 py-4 align-top max-w-xs truncate" title={cmp.description}>
                           <p className="text-xs font-medium text-farmer-text truncate">{cmp.description}</p>
                           {cmp.resolution && <p className="text-[10px] font-medium text-farmer-primary mt-1 truncate">Res: {cmp.resolution}</p>}
                        </td>
                        <td className="px-4 py-4 align-top">
                           <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border ${badgeClass} uppercase tracking-wider`}>
                             {cmp.status}
                           </span>
                        </td>
                        <td className="px-4 py-4 align-top text-right">
                           <button 
                             onClick={() => handleManageClick(cmp)}
                             className="inline-flex items-center gap-1.5 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold text-xs px-3 py-1.5 rounded-lg border border-farmer-border transition-colors"
                           >
                             <Eye className="w-3.5 h-3.5" /> Manage
                           </button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="6" className="px-6 py-16 text-center text-farmer-secondary">
                     <MessageSquareWarning className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     <p className="text-sm font-bold text-farmer-text">No complaints found</p>
                     <p className="text-xs">Adjust your search or filter criteria.</p>
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANAGE COMPLAINT MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-farmer-border flex items-center justify-between bg-farmer-card">
              <h3 className="font-black text-lg text-farmer-text flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-farmer-primary" /> Complaint Details
              </h3>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="p-2 hover:bg-farmer-bg rounded-xl text-farmer-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-farmer-bg p-4 rounded-2xl border border-farmer-border/50">
                <div>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase">Complaint ID</p>
                  <p className="font-black text-sm text-farmer-text">{selectedComplaint.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase">Date</p>
                  <p className="font-bold text-sm text-farmer-text">{new Date(selectedComplaint.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase">Center</p>
                  <p className="font-bold text-sm text-farmer-text">{selectedComplaint.centreId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-farmer-secondary uppercase">Type</p>
                  <p className="font-bold text-sm text-farmer-text">{selectedComplaint.type}</p>
                </div>
              </div>

              {/* User Details */}
              <div>
                <h4 className="text-xs font-black text-farmer-text mb-2 uppercase tracking-wider">Submitted By</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-farmer-primary-light flex items-center justify-center font-bold text-farmer-primary">
                    {selectedComplaint.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-farmer-text">{selectedComplaint.name}</p>
                    <p className="text-xs font-medium text-farmer-secondary">{selectedComplaint.userType} • {selectedComplaint.farmerId}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-black text-farmer-text mb-2 uppercase tracking-wider">Description</h4>
                <div className="bg-white border border-farmer-border p-4 rounded-2xl text-sm text-farmer-text font-medium leading-relaxed">
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Resolution Area */}
              <div>
                <h4 className="text-xs font-black text-farmer-text mb-2 uppercase tracking-wider">Resolution Notes</h4>
                <textarea 
                  className="w-full bg-white border border-farmer-border rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-farmer-primary transition-colors min-h-[100px]"
                  placeholder="Enter resolution actions or notes..."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                ></textarea>
              </div>

              {/* Status Actions */}
              <div>
                <h4 className="text-xs font-black text-farmer-text mb-2 uppercase tracking-wider">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['Open', 'In Progress', 'Resolved', 'Rejected'].map(s => {
                    const isActive = selectedComplaint.status === s;
                    let bg = isActive ? 'bg-farmer-primary text-white border-farmer-primary' : 'bg-white text-farmer-text border-farmer-border hover:bg-farmer-bg';
                    if (isActive && s === 'Resolved') bg = 'bg-farmer-success text-white border-farmer-success';
                    if (isActive && s === 'Open') bg = 'bg-red-600 text-white border-red-600';
                    
                    return (
                      <button 
                        key={s}
                        onClick={() => handleStatusUpdate(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${bg}`}
                      >
                        {s === 'Resolved' && isActive && <Check className="w-3.5 h-3.5" />}
                        {s === 'In Progress' && isActive && <Clock className="w-3.5 h-3.5" />}
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-farmer-border bg-farmer-card flex justify-end gap-3">
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-farmer-text hover:bg-farmer-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveResolution}
                className="bg-farmer-primary hover:bg-farmer-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
              >
                Save Resolution
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminComplaints;
