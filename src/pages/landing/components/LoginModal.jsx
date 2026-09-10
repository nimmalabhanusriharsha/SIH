import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../data/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Landmark, X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-2xl font-bold text-forest-900">{t('loginModal.title')}</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-6">
            {/* Farmer Login Card */}
            <div 
              onClick={() => navigate('/farmer/login')}
              className="group cursor-pointer flex flex-col p-6 rounded-xl border border-gray-200 hover:border-forest-500 hover:shadow-lg hover:shadow-forest-500/10 transition-all duration-300 bg-white"
            >
              <div className="w-14 h-14 bg-forest-50 text-forest-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('loginModal.farmer')}</h3>
              <p className="text-gray-500 text-sm flex-grow mb-6">
                {t('loginModal.farmerDesc')}
              </p>
              <div className="flex items-center text-forest-600 font-semibold group-hover:translate-x-1 transition-transform">
                {t('loginModal.continue')}
              </div>
            </div>

            {/* Centre Login Card */}
            <div 
              onClick={() => navigate('/staff/login')}
              className="group cursor-pointer flex flex-col p-6 rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 bg-white"
            >
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('loginModal.centre')}</h3>
              <p className="text-gray-500 text-sm flex-grow mb-6">
                {t('loginModal.centreDesc')}
              </p>
              <div className="flex items-center text-amber-600 font-semibold group-hover:translate-x-1 transition-transform">
                {t('loginModal.continue')}
              </div>
            </div>

            {/* Gov Login Card */}
            <div 
              onClick={() => navigate('/admin/login')}
              className="group cursor-pointer flex flex-col p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 bg-white"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Landmark className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('loginModal.gov')}</h3>
              <p className="text-gray-500 text-sm flex-grow mb-6">
                {t('loginModal.govDesc')}
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                {t('loginModal.continue')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
