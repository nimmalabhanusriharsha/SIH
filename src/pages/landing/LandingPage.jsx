import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Leaf, User, Briefcase, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <header className="bg-white border-b border-earth-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-forest-600 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-forest-900 tracking-tight">KisanQueue</h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-earth-600">
          <a href="#how-it-works" className="hover:text-forest-600 transition-colors">How it works</a>
          <a href="#features" className="hover:text-forest-600 transition-colors">Features</a>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 text-center">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-4xl md:text-6xl font-extrabold text-forest-900 leading-tight">
            Spend less time waiting. <br/>
            <span className="text-forest-600">Know exactly when to arrive.</span>
          </h2>
          <p className="text-lg md:text-xl text-earth-600 max-w-2xl mx-auto">
            Smart Farmer Procurement & Queue Management Platform powered by AI insights and real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Button size="lg" className="gap-2" onClick={() => navigate('/farmer/login')}>
              <User className="w-5 h-5" />
              Farmer Login
            </Button>
            <Button variant="secondary" size="lg" className="gap-2" onClick={() => navigate('/staff/login')}>
              <Briefcase className="w-5 h-5" />
              Staff Login
            </Button>
            <Button variant="outline" size="lg" className="gap-2 bg-white" onClick={() => navigate('/admin/login')}>
              <ShieldCheck className="w-5 h-5" />
              Admin Login
            </Button>
          </div>
        </div>
        
        <div className="mt-16 w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-soft border border-earth-200 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-left space-y-4">
              <h3 className="text-2xl font-bold text-forest-900">Live Queue Tracking</h3>
              <p className="text-earth-600">
                Farmers no longer need to wait all day at the procurement centre. Our smart system provides real-time updates and notifies you when your turn is approaching.
              </p>
            </div>
            <div className="flex-1 bg-forest-50 p-6 rounded-xl border border-forest-100 w-full relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Leaf className="w-24 h-24" />
               </div>
               <div className="relative z-10">
                 <p className="text-sm font-semibold text-forest-600 mb-1">CURRENT TOKEN</p>
                 <p className="text-3xl font-bold text-forest-900">P-104</p>
                 
                 <div className="mt-6 flex justify-between items-center border-t border-forest-200 pt-4">
                   <div>
                     <p className="text-xs text-earth-500 uppercase">Farmers Ahead</p>
                     <p className="font-semibold text-earth-900">8</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-earth-500 uppercase">Est. Wait</p>
                     <p className="font-semibold text-amber-600">42 min</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-earth-200 py-6 text-center text-sm text-earth-500">
        <p>&copy; 2026 KisanQueue. Smart Farmer Procurement Platform.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
