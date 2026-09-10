import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import { AboutSection, PurposeSection, FarmerFirstSection, KisanSahayakSection } from './components/InfoSections';
import { ServicesSection, HowItWorksSection } from './components/FeatureSections';
import { CentreAndGovSections } from './components/GovCentreSections';
import { SchemesSupportSection, FarmerResourcesSection } from './components/ResourcesSection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-forest-200 selection:text-forest-900 overflow-x-hidden">
      {/* Navigation (TopBar + MainNavbar) */}
      <Navigation onLoginClick={openLoginModal} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-grow flex flex-col w-full outline-none pt-16">
        
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
        
        {/* 13. Schemes & Support */}
        <SchemesSupportSection />
        
        {/* 14. Resources */}
        <FarmerResourcesSection />

      </main>
      
      {/* 18. Footer */}
      <Footer onLoginClick={openLoginModal} />

      {/* Login Modal Overlay */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default LandingPage;
