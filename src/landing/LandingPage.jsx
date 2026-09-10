<<<<<<<< HEAD:src/pages/landing/LandingPage.jsx
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import { AboutSection, PurposeSection, FarmerFirstSection, KisanSahayakSection } from './components/InfoSections';
import { ServicesSection, HowItWorksSection } from './components/FeatureSections';
import { CentreAndGovSections, MapAndDemandSections } from './components/GovCentreSections';
import { SchemesSupportSection, FarmerResourcesSection, ImpactStatisticsSection, FAQSection, ContactSection } from './components/ResourcesSection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
========
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/components/Button';
import { Leaf, User, Briefcase, ShieldCheck } from 'lucide-react';
>>>>>>>> origin/main:src/landing/LandingPage.jsx

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-forest-200 selection:text-forest-900 overflow-x-hidden">
      {/* Navigation (TopBar + MainNavbar) */}
      <Navigation onLoginClick={openLoginModal} />

<<<<<<<< HEAD:src/pages/landing/LandingPage.jsx
      {/* Main Content Area */}
      <main id="main-content" className="flex-grow flex flex-col w-full outline-none pt-16">
========
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 text-center overflow-y-auto scroll-smooth">
        <div className="max-w-3xl space-y-6 pt-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-forest-900 leading-tight">
            Spend less time waiting. <br/>
            <span className="text-forest-600">Know exactly when to arrive.</span>
          </h2>
          <p className="text-lg md:text-xl text-earth-600 max-w-2xl mx-auto">
            Smart Farmer Procurement & Queue Management Platform powered by AI insights and real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 pb-10">
            <Button size="lg" className="gap-2" onClick={() => navigate('/farmer/login')}>
              <User className="w-5 h-5" />
              Farmer Login
            </Button>
            <Button variant="secondary" size="lg" className="gap-2" onClick={() => navigate('/centre/login')}>
              <Briefcase className="w-5 h-5" />
              Procurement Centre Login
            </Button>
            <Button variant="outline" size="lg" className="gap-2 bg-white" onClick={() => navigate('/admin/login')}>
              <ShieldCheck className="w-5 h-5" />
              Admin Login
            </Button>
          </div>
        </div>
>>>>>>>> origin/main:src/landing/LandingPage.jsx
        
        {/* 1. Hero */}
        <HeroSection onLoginClick={openLoginModal} />
        
        {/* 2. About KisanQueue */}
        <AboutSection />
        
        {/* 3. Purpose (Making Procurement Simpler) */}
        <PurposeSection />
        
        {/* 4. Services */}
        <ServicesSection />
        
        {/* 5. How It Works */}
        <HowItWorksSection />
        
        {/* 6. Designed Around the Farmer */}
        <FarmerFirstSection />
        
        {/* 8. Kisan Sahayak */}
        <KisanSahayakSection />
        
        {/* 9 & 10. Centre & Government Sections */}
        <CentreAndGovSections />
        
        {/* 11 & 12. Map & Demand */}
        <MapAndDemandSections />
        
        {/* 13. Schemes & Support */}
        <SchemesSupportSection />
        
        {/* 14. Resources */}
        <FarmerResourcesSection />
        
        {/* 15. Impact / Statistics */}
        <ImpactStatisticsSection />
        
        {/* 16. FAQ */}
        <FAQSection />
        
        {/* 17. Contact Us */}
        <ContactSection />

      </main>
      
      {/* 18. Footer */}
      <Footer onLoginClick={openLoginModal} />

      {/* Login Modal Overlay */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default LandingPage;
