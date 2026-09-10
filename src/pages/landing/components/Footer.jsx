import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react';

const Footer = ({ onLoginClick }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-forest-900 text-forest-100 py-16 border-t-[8px] border-forest-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Leaf className="w-6 h-6 text-forest-700" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">{t('app.name')}</span>
            </div>
            <p className="text-forest-200 text-sm mb-6 max-w-sm leading-relaxed">
              {t('app.subtitle')}. Connecting farmers, procurement centres, and government administration.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">{t('app.name')}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{t('footer.services')}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('footer.howItWorks')}</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors">{t('footer.resources')}</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">{t('footer.faqs')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#contact" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.help')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.accessibility')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Portal Access</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={onLoginClick} className="hover:text-white transition-colors text-left">{t('footer.farmerLogin')}</button></li>
              <li><button onClick={onLoginClick} className="hover:text-white transition-colors text-left">{t('footer.centreLogin')}</button></li>
              <li><button onClick={onLoginClick} className="hover:text-white transition-colors text-left">{t('footer.govLogin')}</button></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-forest-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-forest-300">
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.dataProtection')}</a>
          </div>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
