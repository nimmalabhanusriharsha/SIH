import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components/Button';

const HeroSection = ({ onLoginClick }) => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/images/bg1.jpg")', // Using uploaded fields image
        }}
      >
        {/* Soft green gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/60 to-transparent"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-white"
          >
            <motion.div variants={itemVariants} className="mb-4 inline-block bg-forest-800/80 backdrop-blur border border-forest-600/50 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-forest-100 shadow-sm">
              {t('app.subtitle')}
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-md">
              {t('hero.title').split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-forest-50 mb-10 max-w-xl leading-relaxed drop-shadow">
              {t('hero.desc')}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Button 
                onClick={onLoginClick}
                size="lg" 
                className="bg-forest-500 hover:bg-forest-600 text-white font-bold px-8 shadow-lg shadow-forest-900/20"
              >
                {t('nav.login')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8"
              >
                {t('hero.explore')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative subtle curve at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C52.16,93.4,103.9,86.2,154.5,75.92,210.14,64.64,265.46,67.33,321.39,56.44Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
