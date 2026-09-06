import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Clock, Users, Search, BrainCircuit, Activity, CalendarDays, Star, Filter } from 'lucide-react';

const FindCentre = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'compare'

  // Enhance centres with mock real-time data
  const enhancedCentres = state.centres.map(centre => {
    const queue = state.queue.filter(q => q.centreId === centre.id && q.status === 'Waiting');
    const expectedWait = queue.length > 0 ? queue.length * 6 : 0;
    const availableSlots = Math.max(0, centre.capacity - state.bookings.filter(b => b.centreId === centre.id).length);
    const score = (100 - centre.distance * 2) - (queue.length * 2) + (availableSlots * 0.5);
    return { ...centre, queueLength: queue.length, expectedWait, availableSlots, score };
  });

  const filteredCentres = enhancedCentres.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedCrop === 'All' || c.crops.includes(selectedCrop))
  ).sort((a, b) => a.distance - b.distance);

  const recommendedCentre = [...filteredCentres].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Find Procurement Centre</h2>
        <p className="text-earth-600 mt-1">Discover, compare, and select the best centre for your produce.</p>
      </div>

      {/* SEARCH AND FILTERS */}
      <Card className="border-earth-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
             <Input 
               placeholder="Search by centre name or location..." 
               className="pl-10 h-12 text-lg border-earth-300"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="h-12 rounded-lg border border-earth-300 bg-white px-4 py-2 font-medium text-earth-700 w-full md:w-auto flex-1"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="All">All Crops</option>
              <option value="Paddy">Paddy</option>
              <option value="Maize">Maize</option>
              <option value="Cotton">Cotton</option>
            </select>
            <Button variant="outline" className="h-12 border-earth-300 text-earth-700 font-bold" onClick={() => setViewMode(viewMode === 'list' ? 'compare' : 'list')}>
               <Filter className="w-4 h-4 mr-2" />
               {viewMode === 'list' ? 'Compare View' : 'List View'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SMART RECOMMENDATION HERO (Only in list view) */}
      {viewMode === 'list' && recommendedCentre && (
        <Card className="border-forest-400 shadow-md bg-gradient-to-br from-forest-50 to-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Star className="w-48 h-48 text-forest-900" />
          </div>
          <CardHeader className="py-4 pb-0 relative z-10 border-b border-forest-100 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="primary" className="w-fit mb-2 gap-1 text-[10px] bg-forest-600 text-white border-forest-700 font-bold uppercase"><BrainCircuit className="w-3 h-3"/> AI Smart Recommendation</Badge>
                <CardTitle className="text-xl font-black text-forest-900">{recommendedCentre.name}</CardTitle>
                <p className="text-sm font-bold text-forest-700 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {recommendedCentre.district} ({recommendedCentre.distance} km away)
                </p>
              </div>
              <Badge variant="success" className="hidden md:flex uppercase font-bold tracking-wider">{recommendedCentre.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="font-bold text-earth-900 mb-4 italic">"Recommended based on optimal distance, low expected waiting time, and high slot availability."</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-3 rounded-lg border border-forest-100 shadow-sm text-center">
                <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">Queue</p>
                <p className="text-2xl font-black text-forest-900">{recommendedCentre.queueLength}</p>
                <p className="text-[10px] text-earth-500 font-bold">Farmers</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-forest-100 shadow-sm text-center">
                <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">Expected Wait</p>
                <p className="text-2xl font-black text-green-600">{recommendedCentre.expectedWait}</p>
                <p className="text-[10px] text-earth-500 font-bold">Minutes</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-forest-100 shadow-sm text-center">
                <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">Available Slots</p>
                <p className="text-2xl font-black text-blue-600">{recommendedCentre.availableSlots}</p>
                <p className="text-[10px] text-earth-500 font-bold">Today</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-forest-100 shadow-sm text-center">
                <p className="text-[10px] font-bold text-earth-500 uppercase mb-1">Active Counters</p>
                <p className="text-2xl font-black text-earth-900">{recommendedCentre.activeCounters}</p>
                <p className="text-[10px] text-earth-500 font-bold">Open</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-forest-600 hover:bg-forest-700 font-bold shadow-md w-full sm:w-auto" onClick={() => navigate('/farmer/book-slot')}>Select & Book Slot</Button>
              <Button variant="outline" size="lg" className="border-forest-300 text-forest-800 font-bold w-full sm:w-auto bg-white">View Full Details</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-earth-500 uppercase tracking-widest mt-8">All Nearby Centres</h3>
          {filteredCentres.filter(c => c.id !== recommendedCentre?.id).map((centre) => (
            <Card key={centre.id} className="border-earth-200 shadow-sm hover:border-forest-300 transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                     <h4 className="text-lg font-black text-earth-900">{centre.name}</h4>
                     {centre.status === 'Critical' && <Badge variant="danger" className="uppercase font-bold text-[10px]">High Load</Badge>}
                   </div>
                   <p className="text-sm font-bold text-earth-600 flex items-center gap-1 mb-3">
                     <MapPin className="w-4 h-4" /> {centre.distance} km | {centre.district}
                   </p>
                   
                   <div className="flex flex-wrap gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1 text-earth-700"><Users className="w-4 h-4 text-earth-400"/> Queue: {centre.queueLength}</span>
                      <span className="flex items-center gap-1 text-earth-700"><Clock className="w-4 h-4 text-earth-400"/> Wait: ~{centre.expectedWait}m</span>
                      <span className="flex items-center gap-1 text-earth-700"><CalendarDays className="w-4 h-4 text-earth-400"/> Slots: {centre.availableSlots}</span>
                      <span className="flex items-center gap-1 text-earth-700"><Activity className="w-4 h-4 text-earth-400"/> Counters: {centre.activeCounters}</span>
                   </div>
                 </div>
                 
                 <div className="w-full md:w-auto flex flex-col gap-2">
                   <Button onClick={() => navigate('/farmer/book-slot')} className="w-full md:w-32 font-bold shadow-sm">Select</Button>
                   <Button variant="outline" className="w-full md:w-32 font-bold text-earth-700 border-earth-300">Details</Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* COMPARE VIEW */}
      {viewMode === 'compare' && (
        <Card className="border-earth-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-earth-100 text-earth-700 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="p-4 rounded-tl-lg">Procurement Centre</th>
                <th className="p-4">Distance</th>
                <th className="p-4">Current Queue</th>
                <th className="p-4">Est. Wait</th>
                <th className="p-4">Available Slots</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {filteredCentres.map((centre) => (
                <tr key={centre.id} className={centre.id === recommendedCentre?.id ? 'bg-forest-50/50' : 'hover:bg-earth-50'}>
                  <td className="p-4">
                    <p className="font-bold text-earth-900">{centre.name}</p>
                    {centre.id === recommendedCentre?.id && (
                      <Badge variant="primary" className="mt-1 bg-forest-600 text-white uppercase text-[8px] tracking-widest"><BrainCircuit className="w-2 h-2 mr-1"/> AI Recommended</Badge>
                    )}
                  </td>
                  <td className="p-4 font-bold text-earth-700">{centre.distance} km</td>
                  <td className="p-4 font-bold text-earth-700">{centre.queueLength} farmers</td>
                  <td className={`p-4 font-black ${centre.expectedWait > 60 ? 'text-amber-600' : 'text-green-600'}`}>{centre.expectedWait} min</td>
                  <td className="p-4 font-bold text-blue-600">{centre.availableSlots}</td>
                  <td className="p-4">
                     <Badge variant={centre.status === 'Critical' ? 'danger' : centre.status === 'Busy' ? 'warning' : 'success'} className="uppercase font-bold text-[10px]">
                       {centre.status}
                     </Badge>
                  </td>
                  <td className="p-4">
                    <Button size="sm" className="font-bold shadow-sm w-full" onClick={() => navigate('/farmer/book-slot')}>Book</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default FindCentre;
