import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Globe, Menu, X } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

const Navigation = ({ onLoginClick }) => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="w-full flex flex-col fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Government Utility Bar */}
      <div className="bg-forest-900 text-white text-xs py-1 px-4 md:px-8 flex justify-between items-center border-b border-forest-800">
        <div className="flex items-center gap-2 opacity-90 hidden sm:flex">
          <Globe className="w-3 h-3" />
          <span className="font-semibold tracking-wider">KISANQUEUE</span>
          <span className="mx-2 opacity-50">|</span>
          <span className="font-light">{t('app.subtitle')}</span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <a href="#main-content" className="hover:underline hidden md:block">{t('accessibility.skip')}</a>
          <div className="flex items-center gap-2 font-medium">
          </div>
          <select 
            className="bg-transparent text-white border border-white/30 rounded px-1 py-0.5 outline-none focus:bg-forest-800 text-xs"
            onChange={changeLanguage}
            value={i18n.language}
            aria-label="Language selection"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex justify-between items-center py-3 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-forest-600 p-2 rounded-lg shadow-sm">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-forest-900 leading-none">{t('app.name')}</span>
            <span className="text-[0.65rem] font-medium text-earth-500 uppercase tracking-wide hidden sm:block">
              {t('app.digitalService')}
            </span>
          </div>
        </div>

        {/* Right/Centre: Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-earth-700">
          <a href="#home" className="hover:text-forest-600 transition-colors">{t('nav.home')}</a>
          <a href="#about" className="hover:text-forest-600 transition-colors">{t('nav.about')}</a>
          <a href="#services" className="hover:text-forest-600 transition-colors">{t('nav.services')}</a>
          <a href="#schemes" className="hover:text-forest-600 transition-colors">{t('nav.schemes')}</a>
          <a href="#how-it-works" className="hover:text-forest-600 transition-colors">{t('nav.howItWorks')}</a>

        </nav>

        {/* Far Right: Login */}
        <div className="hidden lg:block ml-4">
          <Button 
            onClick={onLoginClick}
            className="bg-forest-700 hover:bg-forest-800 text-white px-6 font-bold tracking-wider"
          >
            {t('nav.login')}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-earth-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden flex flex-col bg-white border-t border-gray-100 p-4 gap-4 shadow-lg absolute w-full top-full">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-earth-700 p-2 hover:bg-forest-50 rounded">{t('nav.home')}</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-earth-700 p-2 hover:bg-forest-50 rounded">{t('nav.about')}</a>
          <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-earth-700 p-2 hover:bg-forest-50 rounded">{t('nav.services')}</a>
          <a href="#schemes" onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-earth-700 p-2 hover:bg-forest-50 rounded">{t('nav.schemes')}</a>
          <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-earth-700 p-2 hover:bg-forest-50 rounded">{t('nav.howItWorks')}</a>
          <Button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onLoginClick();
            }}
            className="mt-2 bg-forest-700 text-white w-full"
          >
            {t('nav.login')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navigation;
