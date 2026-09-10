import React from 'react';
import { useTranslation } from 'react-i18next';
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
    { icon: <HeadphonesIcon />, title: t('services.kisanSahayak.title'), desc: t('services.kisanSahayak.desc') },
    { icon: <Building />, title: t('services.centreCapacity.title'), desc: t('services.centreCapacity.desc') },
    { icon: <Activity />, title: t('services.govDemand.title'), desc: t('services.govDemand.desc') },
  ];

  return (
    <section id="services" className="py-24 relative bg-gray-50 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-forest-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-forest-900 mb-4"
          >
            {t('services.title')}
          </motion.h2>
          <div className="w-24 h-1 bg-forest-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-forest-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Subtle accent line on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-400 to-forest-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="w-14 h-14 bg-forest-50 text-forest-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-forest-600 group-hover:text-white shadow-sm">
                {React.cloneElement(srv.icon, { className: 'w-7 h-7' })}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-forest-700 transition-colors">{srv.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{srv.desc}</p>
              
              <div className="text-forest-600 font-semibold text-sm flex items-center mt-auto group-hover:text-forest-800 transition-colors cursor-pointer w-max">
                {t('learnMore')} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
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


