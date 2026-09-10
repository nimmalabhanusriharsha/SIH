import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Calendar, QrCode, Clock, IndianRupee, Mic } from 'lucide-react';

export const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">{t('about.title')}</h2>
            <p className="text-lg text-earth-700 mb-6 leading-relaxed">
              {t('about.p1')}
            </p>
            <p className="text-lg text-forest-700 font-medium leading-relaxed border-l-4 border-forest-500 pl-4">
              {t('about.p2')}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img 
              src="/images/bg2.jpg" 
              alt="Indian Farmer in Field" 
              className="w-full h-auto object-cover aspect-[4/3]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const PurposeSection = () => {
  const { t } = useTranslation();
  
  const points = [
    { icon: <MapPin className="w-8 h-8" />, title: t('purpose.where'), desc: t('purpose.whereDesc') },
    { icon: <Calendar className="w-8 h-8" />, title: t('purpose.when'), desc: t('purpose.whenDesc') },
    { icon: <QrCode className="w-8 h-8" />, title: t('purpose.token'), desc: t('purpose.tokenDesc') },
    { icon: <Clock className="w-8 h-8" />, title: t('purpose.wait'), desc: t('purpose.waitDesc') },
    { icon: <IndianRupee className="w-8 h-8" />, title: t('purpose.payment'), desc: t('purpose.paymentDesc') }
  ];

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/tractor.png')] bg-cover bg-center opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-forest-900 mb-4"
          >
            {t('purpose.title')}
          </motion.h2>
          <div className="w-24 h-1 bg-forest-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {points.map((point, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 flex flex-col items-center text-center hover:bg-white/20 transition-colors duration-300 group"
            >
              <div className="w-16 h-16 bg-white text-forest-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {point.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{point.title}</h3>
              <p className="text-forest-100 text-sm">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FarmerFirstSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-32 relative bg-black text-white">
      <div className="absolute inset-0 bg-[url('/images/sunset.png')] bg-cover bg-center opacity-40"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
        
        <div className="w-full md:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight drop-shadow-xl"
          >
            {t('farmerFirst.title')}
          </motion.h2>
          <div className="w-24 h-2 bg-amber-500 rounded-full mb-8"></div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {[t('farmerFirst.q1'), t('farmerFirst.q2'), t('farmerFirst.q3'), t('farmerFirst.q4'), t('farmerFirst.q5')].map((q, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 text-xl font-bold shadow-2xl hover:bg-white/20 transition-colors"
            >
              <span className="text-amber-400 mr-4 font-black">0{i+1}</span> {q}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const KisanSahayakSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-earth-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
             <img src="/images/robot.png" alt="Kisan Sahayak Robot" className="w-full max-w-md mx-auto relative z-10 drop-shadow-2xl hover:-translate-y-4 transition-transform duration-500" />
             
             {/* Floating AI Message 1 */}
             <div className="absolute top-10 -right-4 bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[200px] shadow-xl flex gap-3 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
               <div className="mt-1"><Mic className="w-4 h-4 text-forest-600" /></div>
               <div className="text-sm font-medium">{t('sahayak.ex1.a')}</div>
             </div>

             {/* Floating AI Message 2 */}
             <div className="absolute bottom-10 -left-4 bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-br-sm px-4 py-3 max-w-[200px] shadow-xl flex gap-3 z-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
               <div className="mt-1"><Mic className="w-4 h-4 text-forest-600" /></div>
               <div className="text-sm font-medium">{t('sahayak.ex2.a')}</div>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white shadow-sm text-forest-600 rounded-2xl flex items-center justify-center mb-6">
              <Mic className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{t('sahayak.title')}</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">{t('sahayak.subtitle')}</p>
            
            <div className="flex flex-wrap gap-3">
              {['English', 'తెలుగు', 'हिन्दी', 'தமிழ்', 'ಕನ್ನಡ', 'മലയാളം', 'मराठी', 'বাংলা'].map(lang => (
                <span key={lang} className="px-4 py-2 bg-white text-forest-700 font-bold rounded-xl border border-forest-100 shadow-sm hover:bg-forest-50 cursor-default transition-colors">
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
