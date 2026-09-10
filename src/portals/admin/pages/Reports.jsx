import React, { useState } from 'react';
import { Card, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { BarChart2, Download, Printer, FileText, ChevronRight } from 'lucide-react';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('Today');

  const reportTypes = [
    { id: 1, name: 'Farmer Registration Report', desc: 'Detailed list of newly registered farmers and demographic breakdown.' },
    { id: 2, name: 'Booking Report', desc: 'Summary of all bookings, cancellations, and no-shows.' },
    { id: 3, name: 'Centre Performance Report', desc: 'Operational efficiency metrics per procurement centre.' },
    { id: 4, name: 'Procurement Report', desc: 'Total quantity, crop-wise split, and quality rejection stats.' },
    { id: 5, name: 'Payment Report', desc: 'DBT status, pending settlements, and transaction histories.' },
    { id: 6, name: 'Congestion Report', desc: 'Wait time analysis and peak hour congestion occurrences.' },
    { id: 7, name: 'Complaint Report', desc: 'Grievance resolution times and open complaint status.' },
    { id: 8, name: 'Staff Performance Report', desc: 'Counter-level processing speeds and staff activity logs.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-forest-900 tracking-tight flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-forest-600" />
            Government Reports
          </h2>
          <p className="text-earth-600 mt-1">Generate official tabular reports for audit and review.</p>
        </div>
        
        <div className="flex bg-earth-100 p-1 rounded-lg border border-earth-200">
          {['Today', '7 Days', '30 Days', 'Custom Range'].map(tf => (
            <button 
              key={tf}
              onClick={() => setDateRange(tf)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                dateRange === tf 
                  ? 'bg-white text-forest-900 shadow-sm' 
                  : 'text-earth-600 hover:text-forest-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-earth-200 shadow-sm bg-white overflow-hidden">
         <div className="divide-y divide-earth-100">
           {reportTypes.map(report => (
             <div key={report.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-earth-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-earth-100 flex items-center justify-center shrink-0 border border-earth-200">
                    <FileText className="w-5 h-5 text-earth-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-900 mb-0.5">{report.name}</h3>
                    <p className="text-sm text-earth-600">{report.desc}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 md:ml-4 pl-12 md:pl-0">
                  <Button variant="outline" size="sm" className="bg-white border-earth-200 text-earth-700">
                    <Printer className="w-4 h-4 mr-2" /> Print
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white border-earth-200 text-forest-700">
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                  </Button>
                  <Button size="sm" className="bg-forest-600 hover:bg-forest-700 text-white border-0">
                    Generate
                  </Button>
                </div>
             </div>
           ))}
         </div>
      </Card>
    </div>
  );
};

export default AdminReports;
