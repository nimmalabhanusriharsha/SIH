import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AlertTriangle, MapPin, Search, Users, Activity, ExternalLink, Siren, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const AdminCongestion = () => {
  const { state } = useAppContext();

  // Sort centres by congestion (queue length vs capacity)
  const centresWithCongestion = state.centres.map(centre => {
    const queue = state.queue.filter(q => q.centreId === centre.id && q.status === 'Waiting');
    const load = Math.min(100, Math.round((queue.length / (centre.capacity || 100)) * 100));
    
    let status = 'Normal';
    let color = 'green';
    if (load > 80) { status = 'High Congestion'; color = 'red'; }
    else if (load > 40) { status = 'Moderate'; color = 'amber'; }

    return { ...centre, queueLength: queue.length, load, status, color };
  }).sort((a, b) => b.load - a.load);

  const highCongestion = centresWithCongestion.filter(c => c.status === 'High Congestion');
  const moderate = centresWithCongestion.filter(c => c.status === 'Moderate');
  const normal = centresWithCongestion.filter(c => c.status === 'Normal');

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight flex items-center gap-2">
          Live Congestion Monitoring
          {highCongestion.length > 0 && (
            <span className="flex h-3 w-3 relative ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </h2>
        <p className="text-earth-600 mt-1">Real-time geographical tracking of farmer queues and centre capacity.</p>
      </div>

      {/* Congestion Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`border-red-200 shadow-sm ${highCongestion.length > 0 ? 'bg-red-50/50' : 'bg-white'}`}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-red-900 mb-1 flex items-center gap-2">
                  <Siren className="w-4 h-4" /> High Congestion
                </p>
                <h3 className="text-3xl font-black text-red-700">{highCongestion.length}</h3>
                <p className="text-xs text-red-600 mt-1 font-medium">Centres at &gt;80% capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-amber-200 shadow-sm ${moderate.length > 0 ? 'bg-amber-50/50' : 'bg-white'}`}>
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">Moderate</p>
                <h3 className="text-3xl font-black text-amber-700">{moderate.length}</h3>
                <p className="text-xs text-amber-600 mt-1 font-medium">Centres at 40-80% capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-sm bg-green-50/50">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-green-900 mb-1">Normal</p>
                <h3 className="text-3xl font-black text-green-700">{normal.length}</h3>
                <p className="text-xs text-green-600 mt-1 font-medium">Centres operating smoothly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Mock Live Map Area */}
        <div className="lg:col-span-2">
          <Card className="border-earth-200 shadow-sm h-full overflow-hidden flex flex-col">
            <CardHeader className="bg-white border-b border-earth-100 flex flex-row items-center justify-between py-4">
               <CardTitle className="text-lg text-forest-900 flex items-center gap-2">
                 <MapPin className="w-5 h-5 text-forest-600" />
                 Live Congestion Map
               </CardTitle>
               <div className="flex items-center gap-4 text-xs font-medium">
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical</span>
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Moderate</span>
                 <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div> Normal</span>
               </div>
            </CardHeader>
            <CardContent className="p-0 bg-earth-50 relative flex-1 min-h-[500px]">
               {/* Decorative map background grid/pattern */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
               <div className="absolute inset-0 bg-gradient-to-tr from-earth-100/30 to-transparent"></div>
               
               {/* Mock Map Markers mapped visually onto the grid */}
               <div className="relative w-full h-full p-8 flex flex-wrap gap-8 justify-around items-center">
                  {centresWithCongestion.map((centre, i) => {
                    const positions = [
                      'top-1/4 left-1/4', 'top-1/3 right-1/4', 'bottom-1/3 left-1/3', 'bottom-1/4 right-1/3', 'top-1/2 left-1/2'
                    ];
                    
                    return (
                      <div key={centre.id} className={`relative group z-10 p-4`}>
                        {/* Marker pulse for high congestion */}
                        {centre.status === 'High Congestion' && (
                          <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>
                        )}
                        
                        <div className={`relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110`}>
                           <div className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg
                              ${centre.color === 'red' ? 'bg-red-500 shadow-red-200' : 
                                centre.color === 'amber' ? 'bg-amber-500 shadow-amber-200' : 
                                'bg-green-500 shadow-green-200'}`}
                           >
                              {centre.queueLength}
                           </div>
                           <div className="mt-2 bg-white/90 backdrop-blur border border-earth-200 px-3 py-1 rounded-full shadow-sm text-xs font-bold text-forest-900 whitespace-nowrap">
                             {centre.name}
                           </div>
                        </div>

                        {/* Hover Tooltip/Card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white border border-earth-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                           <div className="p-4 border-b border-earth-100">
                              <h4 className="font-bold text-forest-900 text-sm leading-tight">{centre.name}</h4>
                              <p className="text-xs text-earth-500 mt-0.5">{centre.district}</p>
                           </div>
                           <div className="p-4 bg-earth-50 rounded-b-xl grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-earth-500 mb-0.5">Waiting Queue</p>
                                <p className={`font-bold text-lg ${centre.color === 'red' ? 'text-red-600' : 'text-forest-900'}`}>{centre.queueLength}</p>
                              </div>
                              <div>
                                <p className="text-earth-500 mb-0.5">Utilization</p>
                                <p className="font-bold text-lg text-forest-900">{centre.load}%</p>
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Operational Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-red-200 shadow-sm h-full flex flex-col bg-white overflow-hidden">
             <CardHeader className="bg-red-50/50 border-b border-red-100 py-4">
                <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Congestion Alerts
                </CardTitle>
             </CardHeader>
             <CardContent className="p-5 flex-1 overflow-y-auto space-y-4">
                
                {highCongestion.length === 0 && moderate.length === 0 ? (
                  <div className="text-center text-earth-500 py-10">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-300" />
                    <p className="font-medium text-earth-900">All centres operating normally.</p>
                  </div>
                ) : null}

                {highCongestion.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-red-200 bg-red-50">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-red-900 text-sm">{c.name}</h4>
                        <Badge variant="danger" className="text-[10px]">Critical Load</Badge>
                     </div>
                     <p className="text-xs text-red-800 leading-relaxed mb-3">
                       <strong>{c.queueLength} farmers</strong> are currently waiting. Expected wait time has exceeded 45 minutes. Utilization is at {c.load}%.
                     </p>
                     <div className="bg-white p-3 rounded-lg border border-red-100">
                        <p className="text-[10px] uppercase font-bold text-red-500 mb-1">Suggested Action</p>
                        <p className="text-xs text-earth-700 font-medium">Consider activating an additional operational counter immediately.</p>
                     </div>
                  </div>
                ))}

                {moderate.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-amber-900 text-sm">{c.name}</h4>
                        <Badge variant="warning" className="text-[10px]">Capacity Alert</Badge>
                     </div>
                     <p className="text-xs text-amber-800 leading-relaxed mb-3">
                       Centre utilization has reached {c.load}%. Queue is building up.
                     </p>
                     <div className="bg-white p-3 rounded-lg border border-amber-100">
                        <p className="text-[10px] uppercase font-bold text-amber-500 mb-1">Suggested Action</p>
                        <p className="text-xs text-earth-700 font-medium">Monitor closely for the next 30 minutes.</p>
                     </div>
                  </div>
                ))}

             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminCongestion;
