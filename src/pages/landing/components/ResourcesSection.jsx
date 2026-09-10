import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown, Phone, Mail, FileText, Info, ArrowRight, Building, MessageCircle, MessageSquare, PlayCircle, Smartphone } from 'lucide-react';

export const SchemesSupportSection = () => {
  const { t } = useTranslation();
  const schemes = [
    t('schemes.c1'), t('schemes.c2'), t('schemes.c3'),
    t('schemes.c4'), t('schemes.c5'), t('schemes.c6')
  ];

  return (
    <section id="schemes" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-forest-900 mb-12 border-l-4 border-forest-500 pl-4"
        >
          {t('schemes.title')}
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group border border-gray-200 rounded-xl p-6 hover:border-forest-400 hover:shadow-md transition-all cursor-pointer bg-white"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-forest-700 transition-colors">{scheme}</h3>
              <p className="text-sm text-gray-600 mb-4">Official resources and detailed guides regarding {scheme.toLowerCase()}.</p>
              <div className="text-forest-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">
                {t('learnMore')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FarmerResourcesSection = () => {
  const { t } = useTranslation();
  const resources = [
    { title: t('resources.c1'), icon: <FileText className="w-6 h-6" /> },
    { title: t('resources.c2'), icon: <Info className="w-6 h-6" /> },
    { title: t('resources.c3'), icon: <Info className="w-6 h-6" /> },
    { title: t('resources.c4'), icon: <Info className="w-6 h-6" /> },
    { title: t('resources.c5'), icon: <Info className="w-6 h-6" /> },
    { title: t('resources.c6'), icon: <Info className="w-6 h-6" /> }
  ];

  return (
    <section id="resources" className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/cotton.png')] bg-cover bg-center opacity-40"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{t('resources.title')}</h2>
            <div className="w-24 h-1 bg-amber-500 rounded-full"></div>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors backdrop-blur-sm font-semibold"
          >
            View All Resources
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
              
              <div className="bg-forest-800/80 p-4 rounded-xl text-amber-400 w-max mb-6 shadow-inner group-hover:bg-amber-500 group-hover:text-forest-900 transition-colors">
                {res.icon}
              </div>
              <h3 className="font-bold text-xl text-white mb-3 group-hover:text-amber-400 transition-colors">{res.title}</h3>
              <p className="text-forest-100 text-sm leading-relaxed mb-6">
                Access official guidelines, forms, and instructional materials to help you with {res.title.toLowerCase()}.
              </p>
              <div className="text-amber-400 font-semibold text-sm flex items-center group-hover:translate-x-2 transition-transform">
                Read Document <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const ImpactStatisticsSection = () => {
  const { t } = useTranslation();
  
  const stats = [
    { label: t('stats.registered'), value: 1250000, suffix: "+" },
    { label: t('stats.centres'), value: 840, suffix: "" },
    { label: t('stats.completed'), value: 5200000, suffix: "+" },
    { label: t('stats.quantity'), value: 18500000, suffix: "" },
    { label: t('stats.waiting'), value: 45, suffix: "m" },
    { label: t('stats.payments'), value: 4800000, suffix: "+" }
  ];

  return (
    <section className="py-24 bg-earth-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-earth-500 uppercase tracking-widest mb-2">Platform Scale</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{t('stats.title')}</h3>
          <p className="text-xs text-gray-500 mt-4">*Demonstration Data</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              <span className="text-4xl md:text-5xl font-black text-forest-600 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm md:text-base font-semibold text-gray-700">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') },
    { q: t('faq.q9'), a: t('faq.a9') },
    { q: t('faq.q10'), a: t('faq.a10') },
    { q: t('faq.q11'), a: t('faq.a11') }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-forest-900 mb-12"
        >
          {t('faq.title')}
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button 
                className="w-full px-6 py-4 text-left font-semibold text-gray-900 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 py-4 bg-white text-gray-600 border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 relative overflow-hidden text-white">
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 bg-[url('/images/bg1.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-forest-900/80 mix-blend-multiply"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-16">
          Connect with us
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Social Media Icons */}
          <div className="grid grid-cols-2 gap-12 pt-8">
            <div className="flex flex-col items-center">
              <MessageCircle className="w-16 h-16 text-amber-400 mb-4 hover:scale-110 transition-transform cursor-pointer" />
              <span className="font-bold text-lg">Facebook</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageSquare className="w-16 h-16 text-amber-400 mb-4 hover:scale-110 transition-transform cursor-pointer" />
              <span className="font-bold text-lg">Twitter</span>
            </div>
            <div className="flex flex-col items-center">
              <PlayCircle className="w-16 h-16 text-amber-400 mb-4 hover:scale-110 transition-transform cursor-pointer" />
              <span className="font-bold text-lg">Youtube</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-16 h-16 text-amber-400 mb-4 hover:scale-110 transition-transform cursor-pointer" />
              <span className="font-bold text-lg text-center">Android<br/>App</span>
            </div>
            <div className="col-span-2 flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mb-4 hover:scale-110 transition-transform cursor-pointer">
                <span className="font-black text-forest-900 text-3xl">A</span>
              </div>
              <span className="font-bold text-lg">IOS App</span>
            </div>
          </div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-8 rounded-xl shadow-2xl relative text-gray-900"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-forest-700 italic">Name*</label>
                  <input type="text" className="w-full px-4 py-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-forest-700 italic">Mobile*</label>
                  <input type="tel" className="w-full px-4 py-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-forest-700 italic">Email*</label>
                  <input type="email" className="w-full px-4 py-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-forest-700 italic">Message*</label>
                <textarea rows={4} className="w-full px-4 py-2 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none resize-none"></textarea>
              </div>
              
              <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between w-64 shadow-sm">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-6 h-6 border-gray-300 rounded text-forest-600 focus:ring-forest-500" />
                  <span className="text-gray-700 text-sm font-medium">I'm not a robot</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                  <span className="text-[10px] text-gray-400 mt-1">reCAPTCHA</span>
                </div>
              </div>
              
              <button type="button" className="bg-forest-800 hover:bg-forest-900 text-amber-400 font-bold py-3 px-8 rounded transition-all shadow-md mt-4">
                SUBMIT
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
