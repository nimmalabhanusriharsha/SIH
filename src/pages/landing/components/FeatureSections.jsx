import React from 'react';
import { useTranslation } from '../../../data/translations';
import { motion } from 'framer-motion';
import { CalendarCheck, Users, Clock, QrCode, ClipboardCheck, Wallet, HeadphonesIcon, Building, Activity, ArrowRight } from 'lucide-react';

export const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    { icon: <CalendarCheck />, title: t('services.smartSlot.title'), desc: t('services.smartSlot.desc') },
    { icon: <Users />, title: t('services.liveQueue.title'), desc: t('services.liveQueue.desc') },
    { icon: <Clock />, title: t('services.smartArrival.title'), desc: t('services.smartArrival.desc') },
    { icon: <QrCode />, title: t('services.qrCheckin.title'), desc: t('services.qrCheckin.desc') },
    { icon: <ClipboardCheck />, title: t('services.procurementTracking.title'), desc: t('services.procurementTracking.desc') },
    { icon: <Wallet />, title: t('services.paymentTracking.title'), desc: t('services.paymentTracking.desc') },
  ];

  return (
    <section id="services" className="py-24 relative bg-gradient-to-r from-[#9effaf] via-[#cbfba4] to-[#fbf793] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-black mb-4"
          >
            {t('services.title')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
          {services.map((srv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center text-center px-2 group cursor-pointer"
            >
              <div className="mb-6 text-black group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(srv.icon, { className: 'w-16 h-16 stroke-[1.2]' })}
              </div>
              <h3 className="text-lg font-bold text-black mb-3 leading-snug">{srv.title}</h3>
              <p className="text-sm font-medium text-black/80 leading-relaxed">{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    t('how.s1'), t('how.s2'), t('how.s3'), t('how.s4'), 
    t('how.s5'), t('how.s6'), t('how.s7'), t('how.s8'), 
    t('how.s9'), t('how.s10'), t('how.s11'), t('how.s12')
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-forest-900 text-center mb-16"
        >
          {t('how.title')}
        </motion.h2>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden lg:flex justify-between relative pt-8 pb-12 overflow-x-auto no-scrollbar">
          <div className="absolute top-12 left-0 right-0 h-1 bg-gray-100 -z-10"></div>
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center w-28 flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-white border-4 border-forest-500 flex items-center justify-center text-xs font-bold text-forest-600 mb-4 bg-white z-10 shadow-sm">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <p className="text-xs font-medium text-center text-gray-700 leading-tight px-1">
                {step}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden flex flex-col relative py-4">
          <div className="absolute top-0 bottom-0 left-6 w-1 bg-gray-100 -z-10"></div>
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-12 rounded-full bg-white border-4 border-forest-500 flex items-center justify-center text-sm font-bold text-forest-600 z-10 shadow-sm flex-shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <p className="text-sm font-medium text-gray-800">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


