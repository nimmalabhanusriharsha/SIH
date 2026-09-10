import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Download, CheckCircle2, CreditCard, ShieldCheck, IndianRupee } from 'lucide-react';

const Payments = () => {
  const { state, currentUser } = useAppContext();
  const { t } = useTranslation();
  
  // Filter payments strictly for the current authenticated farmer
  const userPayments = (state.payments || []).filter(p => p.farmerId === currentUser?.id);
  const latestPayment = userPayments[0] || null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-farmer-text">
          {t('payment.title', 'Payment Tracking')}
        </h1>
        <p className="text-xs md:text-sm text-farmer-secondary mt-1 font-medium">
          {t('payment.secureMaskedNote', 'Funds are credited directly to your Aadhaar-linked bank account via Direct Benefit Transfer (DBT).')}
        </p>
      </div>

      {/* 1. PRIMARY SETTLEMENT HERO CARD OR EMPTY STATE */}
      {latestPayment ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-bold text-farmer-secondary uppercase tracking-wider">
              {t('payment.totalAmount', 'Total Procured Amount')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-farmer-success-light text-farmer-success border border-farmer-success/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t('payment.statusCompleted', 'Payment Completed')}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-farmer-text mb-2">
            ₹{Number(latestPayment.amount).toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-farmer-secondary mb-6 font-medium">
            {t('procurement.mathExplanation', { netKg: 520, quintals: '5.2', rate: '2,369', total: latestPayment.amount })}
          </p>

          {/* Payment Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-farmer-bg p-4 rounded-2xl border border-farmer-border mb-6 text-xs font-medium">
            <div>
              <span className="text-[10px] text-farmer-secondary uppercase font-bold block">
                {t('payment.txnId', 'Transaction ID')}
              </span>
              <p className="font-mono font-bold text-farmer-text mt-0.5 text-sm">
                {latestPayment.transactionId}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-farmer-secondary uppercase font-bold block">
                {t('payment.bank', 'Bank Account')}
              </span>
              <p className="font-mono font-bold text-farmer-text mt-0.5 text-sm">
                {latestPayment.bankAccount || currentUser?.bankAccount || 'XXXX XXXX 4589'}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-farmer-secondary uppercase font-bold block">
                {t('payment.paymentDate', 'Payment Date')}
              </span>
              <p className="font-bold text-farmer-text mt-0.5 text-sm">
                {latestPayment.date}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-start">
            <button 
              onClick={() => alert(t('payment.settlementSlip', 'Download Settlement Slip') + ' - PDF')}
              className="min-h-[48px] px-6 py-3 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center gap-2 text-xs md:text-sm transition-colors"
            >
              <Download className="w-4 h-4 text-farmer-accent" />
              <span>{t('payment.settlementSlip', 'Download Settlement Slip')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-farmer-border shadow-farmer-card text-center">
          <div className="w-16 h-16 bg-farmer-primary-light text-farmer-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-farmer-primary/20">
            <IndianRupee className="w-8 h-8" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-farmer-text mb-2">
            {t('dashboard.noPaymentYet', 'No Payment Transactions Yet')}
          </h2>
          <p className="text-xs text-farmer-secondary max-w-md mx-auto font-medium leading-relaxed">
            {t('dashboard.noPaymentYetDesc', 'Your payment settlements will be displayed here once your grain is procured.')}
          </p>
        </div>
      )}

      {/* 2. LINKED BANK & DBT STATUS */}
      <div className="bg-white rounded-3xl p-6 border border-farmer-border shadow-farmer-card">
        <h3 className="text-sm font-bold text-farmer-text mb-3">
          {t('payment.bank', 'Direct Benefit Transfer (DBT) Bank Account')}
        </h3>

        <div className="flex items-center gap-3 p-4 bg-farmer-bg rounded-2xl border border-farmer-border">
          <div className="w-10 h-10 rounded-xl bg-farmer-primary-light text-farmer-primary flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-farmer-text">
              {currentUser?.bankName || 'State Bank of India (SBI)'}
            </p>
            <p className="text-xs text-farmer-secondary mt-0.5 font-mono font-medium">
              A/C: {currentUser?.bankAccount || 'XXXX XXXX 4589'} · IFSC: {currentUser?.ifsc || 'SBIN0001234'}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-farmer-success bg-farmer-success-light px-2.5 py-1 rounded-full border border-farmer-success/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Aadhaar Verified
          </span>
        </div>
      </div>

    </div>
  );
};

export default Payments;
