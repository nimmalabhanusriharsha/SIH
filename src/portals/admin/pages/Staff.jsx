import React, { useState } from 'react';
import { Card, CardContent } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Search, Filter, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const AdminStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const staff = [
    { id: 'STF-001', name: 'Krishna Rao', role: 'Centre Manager', centreId: 'C001', phone: '+91 9876543210', email: 'krishna.r@kisanqueue.gov.in', status: 'Active' },
    { id: 'STF-002', name: 'Lakshmi Devi', role: 'Quality Inspector', centreId: 'C001', phone: '+91 9876543211', email: 'lakshmi.d@kisanqueue.gov.in', status: 'Active' },
    { id: 'STF-003', name: 'Ramesh Babu', role: 'Centre Manager', centreId: 'C002', phone: '+91 9876543212', email: 'ramesh.b@kisanqueue.gov.in', status: 'Active' },
    { id: 'STF-004', name: 'Srinivas G', role: 'Quality Inspector', centreId: 'C003', phone: '+91 9876543213', email: 'srinivas.g@kisanqueue.gov.in', status: 'On Leave' },
    { id: 'STF-005', name: 'Anil Kumar', role: 'Data Entry Operator', centreId: 'C001', phone: '+91 9876543214', email: 'anil.k@kisanqueue.gov.in', status: 'Active' },
  ];

  const filteredStaff = staff.filter(s => 
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
                    <Button variant="outline" size="sm" className="bg-white border-earth-200">Edit Details</Button>
                    <Button variant="outline" size="sm" className="bg-white border-earth-200 text-red-600 hover:bg-red-50 hover:text-red-700">Revoke Access</Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>
    </div>
  );
};

export default AdminStaff;
