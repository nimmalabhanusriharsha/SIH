import React, { useState } from 'react';
import Navigation from '../pages/landing/components/Navigation';
import HeroSection from '../pages/landing/components/HeroSection';
import { AboutSection, PurposeSection, FarmerFirstSection, KisanSahayakSection } from '../pages/landing/components/InfoSections';
import { ServicesSection, HowItWorksSection } from '../pages/landing/components/FeatureSections';
import { CentreAndGovSections } from '../pages/landing/components/GovCentreSections';
import { SchemesSupportSection } from '../pages/landing/components/ResourcesSection';
import Footer from '../pages/landing/components/Footer';
import LoginModal from '../pages/landing/components/LoginModal';

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







          </main>

          {/* 18. Footer */}
          <Footer onLoginClick={openLoginModal} />

          {/* Login Modal Overlay */}
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
          </div>
        );
};

      export default LandingPage;
