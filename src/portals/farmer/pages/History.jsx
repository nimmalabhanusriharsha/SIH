import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { History as HistoryIcon, Search, MapPin, FileText } from 'lucide-react';

const History = () => {
  const { state, currentUser } = useAppContext();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Strictly scoped to authenticated farmer's procurements
  const userProcurements = (state.procurements || []).filter(p => p.farmerId === currentUser?.id);

  const filtered = userProcurements.filter(p => 
    (p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.crop || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-farmer-text">
          {t('history', 'Procurement & Grain History')}
        </h1>
        <p className="text-xs md:text-sm text-farmer-secondary mt-0.5 font-medium">
          {t('payment.secureMaskedNote', 'Historical records of all your past grain drop-offs, quality checks, and settlements.')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 md:p-4 rounded-2xl border border-farmer-border shadow-farmer-card flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmer-secondary" />
          <input 
            type="text"
            placeholder={t('centre.searchPlaceholder', 'Search by ID or Crop...')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-farmer-border bg-farmer-bg text-xs md:text-sm font-semibold text-farmer-text placeholder:text-farmer-secondary focus:outline-none focus:ring-2 focus:ring-farmer-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-farmer-border shadow-farmer-card rounded-3xl overflow-hidden">
        <div className="p-4 md:p-5 border-b border-farmer-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-farmer-text flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-farmer-primary" />
            <span>Verified Procurement Records ({filtered.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-farmer-bg border-b border-farmer-border text-farmer-secondary uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">{t('date', 'Date')}</th>
                <th className="p-4">{t('crop', 'Crop')} & {t('procurement.grade', 'Quality')}</th>
                <th className="p-4">{t('quantity', 'Quantity')}</th>
                <th className="p-4">{t('procurement.totalAmount', 'Total Amount')}</th>
                <th className="p-4 pr-6 text-right">{t('procurement.receipt', 'Slip')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-farmer-border font-medium">
              {filtered.length > 0 ? filtered.map((record) => {
                const centre = (state.centres || []).find(c => c.id === record.centreId) || { name: 'Procurement Centre' };
                return (
                  <tr key={record.id} className="hover:bg-farmer-bg/60 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-mono font-bold text-farmer-text text-xs">{record.id}</p>
                      <span className="text-[10px] font-mono text-farmer-secondary">{record.bookingId}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-farmer-text font-bold">{record.date}</p>
                      <p className="text-[11px] text-farmer-secondary flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-farmer-primary"/> {centre?.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-farmer-text">{record.crop}</p>
                      <span className="inline-block mt-0.5 text-[10px] bg-farmer-primary-light text-farmer-primary px-2 py-0.5 rounded font-bold border border-farmer-primary/20">
                        {record.quality} (Moisture: {record.moisture || '13.2%'})
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-farmer-text">{record.actualQuantity} Q ({record.netWeightKg} kg)</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-farmer-primary text-sm">₹{Number(record.totalAmount).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-farmer-secondary">@ ₹{record.rate}/Q</p>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        className="text-farmer-primary hover:text-farmer-primary-dark font-bold text-xs inline-flex items-center gap-1 p-2 rounded-xl hover:bg-farmer-primary-light transition-colors"
                        onClick={() => alert(`Certificate #${record.id} downloaded.`)}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-farmer-secondary font-medium">
                    {t('emptyStateGeneral', 'No records found.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default History;
