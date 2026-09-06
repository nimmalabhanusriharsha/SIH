import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Filter, MessageSquareWarning, User, Eye } from 'lucide-react';

const AdminComplaints = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Use state.feedback/complaints or mock some if empty
  const complaints = (state.feedback && state.feedback.length > 0) ? state.feedback : [
    { id: 'CMP-2026-042', farmerId: 'F002', name: 'Suresh Reddy', centreId: 'C001', category: 'Quality Assessment', priority: 'High', status: 'Open', date: '2026-09-12' },
    { id: 'CMP-2026-043', farmerId: 'F015', name: 'Ravi', centreId: 'C002', category: 'Payment Delay', priority: 'Critical', status: 'Under Review', date: '2026-09-11' },
    { id: 'CMP-2026-044', farmerId: 'F008', name: 'Venkat', centreId: 'C001', category: 'Staff Behavior', priority: 'Medium', status: 'Resolved', date: '2026-09-10' },
  ];

  const filteredComplaints = complaints.filter(cmp => 
    cmp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cmp.name && cmp.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Complaint Management</h2>
          <p className="text-earth-600 mt-1">Track and escalate farmer grievances across the network.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search by ID, Farmer..." 
              className="pl-9 bg-white border-earth-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0 bg-white border-earth-200 text-earth-700">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-earth-500 bg-earth-50 uppercase border-b border-earth-200">
               <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Complaint ID / Date</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Farmer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Priority</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
               {filteredComplaints.length > 0 ? (
                 filteredComplaints.map(cmp => {
                   
                   let statusBadge = 'neutral';
                   if (cmp.status === 'Resolved') statusBadge = 'success';
                   if (cmp.status === 'Open') statusBadge = 'danger';
                   if (cmp.status === 'Under Review') statusBadge = 'warning';

                   let prioBadge = 'neutral';
                   if (cmp.priority === 'Critical') prioBadge = 'danger';
                   if (cmp.priority === 'High') prioBadge = 'warning';
                   if (cmp.priority === 'Medium') prioBadge = 'default';

                   return (
                     <tr key={cmp.id} className="hover:bg-earth-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-forest-900 mb-0.5">{cmp.id}</p>
                           <p className="text-[10px] text-earth-500">{new Date(cmp.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-medium text-earth-900">{cmp.name}</p>
                           <p className="text-[10px] text-earth-500">{cmp.farmerId} • {cmp.centreId}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-earth-900">
                           {cmp.category}
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={prioBadge}>{cmp.priority}</Badge>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={statusBadge}>{cmp.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" className="text-forest-600 hover:text-forest-700 hover:bg-forest-50">
                             <Eye className="w-4 h-4 mr-2" />
                             Manage
                           </Button>
                        </td>
                     </tr>
                   );
                 })
               ) : (
                 <tr>
                   <td colSpan="6" className="px-6 py-12 text-center text-earth-500">
                     <MessageSquareWarning className="w-12 h-12 mx-auto mb-3 text-earth-300" />
                     <p className="text-lg font-medium text-earth-900">No complaints found</p>
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminComplaints;
