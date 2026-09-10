import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown, Phone, Mail, FileText, Info, ArrowRight, Building } from 'lucide-react';

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
    <section id="contact" className="py-32 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-forest-100/50 rounded-l-full blur-3xl opacity-50 -z-10 translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Support Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Need help? <br/><span className="text-forest-600">We are here.</span>
              </h2>
              <p className="text-xl text-gray-600">Reach out to our dedicated support teams for any assistance regarding procurement, payments, or centre operations.</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                  <Phone className="w-8 h-8 text-forest-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contact.farmerSupport')}</h3>
                  <p className="text-gray-500 mb-2">Available 24/7 in 8 regional languages.</p>
                  <p className="text-2xl font-black text-forest-700">1800-XXX-XXXX</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contact.centreSupport')}</h3>
                  <p className="text-gray-500 mb-2">For PACS / Society Staff only.</p>
                  <p className="text-xl font-bold text-blue-700">1800-XXX-XXXY</p>
                  <p className="text-gray-600 font-medium">centresupport@kisanqueue.gov.in</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Realistic Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 relative"
          >
            <div className="absolute top-0 right-0 bg-forest-600 text-white px-6 py-2 rounded-bl-3xl rounded-tr-3xl font-bold text-sm tracking-widest shadow-md">
              OFFICIAL HELP DESK
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-8 mt-4">Send a Message</h3>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">{t('contact.name')}</label>
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">{t('contact.userType')}</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all appearance-none cursor-pointer">
                    <option>Select User Type</option>
                    <option>Farmer</option>
                    <option>Centre Staff</option>
                    <option>Transporter</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">{t('contact.mobile')}</label>
                  <input type="tel" placeholder="10-digit mobile number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">{t('contact.email')}</label>
                  <input type="email" placeholder="Optional" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('contact.subject')}</label>
                <input type="text" placeholder="Briefly describe your issue" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('contact.message')}</label>
                <textarea rows={4} placeholder="Detailed explanation..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all resize-none"></textarea>
              </div>
              
              <button type="button" className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-forest-600/30 active:scale-[0.98] mt-4 flex justify-center items-center gap-2">
                {t('contact.submit')} <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> Average response time: 24-48 hours
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
