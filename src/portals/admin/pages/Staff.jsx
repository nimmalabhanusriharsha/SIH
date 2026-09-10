import React, { useState } from 'react';
import { Card, CardContent } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const AdminStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  const [staffList, setStaffList] = useState([
    { id: 'STF-001', name: 'Krishna Rao', role: 'Centre Manager', centreId: 'C001', phone: '+91 9876543210', email: 'krishna.r@kisanqueue.gov.in', status: 'Active' },
    { id: 'STF-002', name: 'Lakshmi Devi', role: 'Quality Inspector', centreId: 'C001', phone: '+91 9876543211', email: 'lakshmi.d@kisanqueue.gov.in', status: 'Active' },
    { id: 'STF-003', name: 'Ramesh Babu', role: 'Centre Manager', centreId: 'C002', phone: '+91 9876543212', email: 'ramesh.b@kisanqueue.gov.in', status: 'Active' },
    { id: 'STF-004', name: 'Srinivas G', role: 'Quality Inspector', centreId: 'C003', phone: '+91 9876543213', email: 'srinivas.g@kisanqueue.gov.in', status: 'On Leave' },
    { id: 'STF-005', name: 'Anil Kumar', role: 'Data Entry Operator', centreId: 'C001', phone: '+91 9876543214', email: 'anil.k@kisanqueue.gov.in', status: 'Active' },
  ]);

  const handleRevoke = (id) => {
    if (window.confirm("Are you sure you want to revoke access for this staff member?")) {
      setStaffList(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? selectedStaff : s));
    setSelectedStaff(null);
  };

  const filteredStaff = staffList.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.centreId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Staff Directory</h2>
          <p className="text-earth-600 mt-1">Manage personnel access and roles across procurement centres.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <Input 
              placeholder="Search staff, ID, or centre..." 
              className="pl-9 bg-white border-earth-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-forest-600 hover:bg-forest-700 text-white border-0 shrink-0">
            <ShieldCheck className="w-4 h-4 mr-2" /> Add Staff Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredStaff.map(member => (
           <Card key={member.id} className="border-earth-200 shadow-sm bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-earth-100 flex items-center justify-center text-earth-700 font-bold border border-earth-200">
                         {member.name.charAt(0)}
                       </div>
                       <div>
                         <h3 className="font-bold text-forest-900">{member.name}</h3>
                         <p className="text-xs text-earth-500 font-mono">{member.id}</p>
                       </div>
                    </div>
                    <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
                 </div>
                 
                 <div className="space-y-2 mb-4">
                    <p className="text-sm text-earth-700 flex items-center gap-2 font-medium bg-earth-50 px-2 py-1.5 rounded-lg border border-earth-100">
                      <ShieldCheck className="w-4 h-4 text-forest-500" /> {member.role}
                    </p>
                    <p className="text-sm text-earth-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-earth-400" /> Assigned to <strong>{member.centreId}</strong>
                    </p>
                    <p className="text-sm text-earth-600 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-earth-400" /> {member.phone}
                    </p>
                    <p className="text-sm text-earth-600 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-earth-400" /> {member.email}
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" size="sm" className="bg-white border-earth-200"
                      onClick={() => setSelectedStaff(member)}
                    >
                      Edit Details
                    </Button>
                    <Button 
                      variant="outline" size="sm" className="bg-white border-earth-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleRevoke(member.id)}
                    >
                      Revoke Access
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between bg-earth-50">
              <h3 className="font-bold text-lg text-forest-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest-600" /> Edit Staff Details
              </h3>
              <button onClick={() => setSelectedStaff(null)} className="p-1 hover:bg-earth-200 rounded-md text-earth-500">✕</button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Name</label>
                  <Input required value={selectedStaff.name} onChange={e => setSelectedStaff({...selectedStaff, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Role</label>
                  <select 
                    className="w-full border border-earth-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                    value={selectedStaff.role} onChange={e => setSelectedStaff({...selectedStaff, role: e.target.value})}
                  >
                    <option>Centre Manager</option>
                    <option>Quality Inspector</option>
                    <option>Data Entry Operator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-earth-700 mb-1">Assigned Centre</label>
                  <Input required value={selectedStaff.centreId} onChange={e => setSelectedStaff({...selectedStaff, centreId: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-earth-700 mb-1">Phone</label>
                    <Input required value={selectedStaff.phone} onChange={e => setSelectedStaff({...selectedStaff, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-earth-700 mb-1">Status</label>
                    <select 
                      className="w-full border border-earth-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                      value={selectedStaff.status} onChange={e => setSelectedStaff({...selectedStaff, status: e.target.value})}
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-earth-100 bg-earth-50 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setSelectedStaff(null)}>Cancel</Button>
                <Button type="submit" className="bg-forest-600 hover:bg-forest-700 text-white">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminStaff;
