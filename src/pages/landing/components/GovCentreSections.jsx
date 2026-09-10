import React from 'react';
import { useTranslation } from '../../../data/translations';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Markers
const createIcon = (color, pulse) => L.divIcon({
  className: 'custom-icon',
  html: `<div class="w-4 h-4 bg-${color}-500 rounded-full border-2 border-white shadow-lg ${pulse ? 'animate-pulse' : ''}"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const amberIcon = createIcon('amber', true);
const greenIcon = createIcon('green', false);
const redIcon = createIcon('red', false);

export const CentreAndGovSections = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Centre Section */}
      <section className="py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">{t('centre.title')}</h2>
              <div className="flex flex-wrap gap-3">
                {t('centre.items').split(' • ').map((item, i) => (
                  <span key={i} className="bg-forest-50 text-forest-700 px-4 py-2 rounded-full font-medium border border-forest-100 shadow-sm hover:bg-forest-600 hover:text-white transition-colors cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <img 
                src="/images/fci.jpg" 
                alt="Procurement Centre Operations" 
                className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gov Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200 relative"
            >
              <img 
                src="/images/bg4.jpg" 
                alt="Government Intelligence" 
                className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent z-10"></div>
              <div className="absolute bottom-6 left-6 z-20 text-white font-bold text-xl drop-shadow-md">
                Centralized Procurement Monitoring
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{t('gov.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {t('gov.desc')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Demand', 'Capacity', 'Congestion', 'Performance', 'Procurement', 'Payments', 'Complaints', 'Trends'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const MapAndDemandSections = () => {
  const { t } = useTranslation();

  // AP Map Center
  const apCenter = [16.5062, 80.6480]; // Vijayawada approx center for view
  
  return (
    <div className="bg-white">
      {/* Map Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-forest-900 mb-12"
          >
            {t('map.title')}
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500 shadow-md"></div> <span className="font-bold text-gray-700">{t('map.normal')}</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-500 shadow-md"></div> <span className="font-bold text-gray-700">{t('map.highDemand')}</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div> <span className="font-bold text-gray-700">{t('map.congested')}</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gray-400 shadow-md"></div> <span className="font-bold text-gray-700">{t('map.inactive')}</span></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl border-4 border-white shadow-2xl aspect-[1.5/1] md:aspect-[21/9] relative overflow-hidden flex items-center justify-center z-0"
          >
            <MapContainer center={apCenter} zoom={7} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Vijayawada Area - High Demand */}
              <Marker position={[16.5062, 80.6480]} icon={amberIcon}>
                <Popup className="custom-popup">
                  <div className="p-2 w-48">
                    <p className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">Vijayawada APMC</p>
                    <div className="text-sm space-y-1 text-gray-600">
                      <div className="flex justify-between"><span>Utilization:</span><span className="font-bold text-amber-600">91%</span></div>
                      <div className="flex justify-between"><span>Live Queue:</span><span className="font-bold text-red-600">24 Farmers</span></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Visakhapatnam - Normal */}
              <Marker position={[17.6868, 83.2185]} icon={greenIcon}>
                 <Popup><span className="font-bold">Visakhapatnam APMC</span><br/>Utilization: 65%</Popup>
              </Marker>

              {/* Tirupati - Congested */}
              <Marker position={[13.6288, 79.4192]} icon={redIcon}>
                 <Popup><span className="font-bold">Tirupati APMC</span><br/>Utilization: 98%<br/>Queue: 45 Farmers</Popup>
              </Marker>

              {/* Rajahmundry - Normal */}
              <Marker position={[17.0005, 81.8040]} icon={greenIcon}>
                 <Popup><span className="font-bold">Rajahmundry APMC</span><br/>Utilization: 45%</Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
