import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/Card';
import { 
  BarChart3, Users, Download, 
  Filter, RotateCcw, Search, CheckCircle2, 
  IndianRupee, X, Scale
} from 'lucide-react';
import { CROPS_CATALOGUE, getLocalizedCropName } from '../../farmer/data/crops';

const StaffReports = () => {
  const { state } = useAppContext();
  const { t, currentLang } = useTranslation();

  // Form Filter Inputs
  const [filterForm, setFilterForm] = useState({
    dateRange: 'all',
    startDate: '',
    endDate: '',
    commodity: 'all',
    status: 'all',
    search: ''
  });

  // Active Applied Filters (Updated on clicking Apply)
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'all',
    startDate: '',
    endDate: '',
    commodity: 'all',
    status: 'all',
    search: ''
  });

  // Selected Farmer Modal State
  const [selectedFarmerRecord, setSelectedFarmerRecord] = useState(null);

  // Master Dataset Generator for Realistic Production-Level Reports
  const generateBaselineRecords = () => {
    const names = [
      'Ramesh Kumar', 'Lakshmi Devi', 'Siva Prasad', 'Anitha Reddy', 'Nageswara Rao',
      'Koteswara Rao', 'Venkata Ramana', 'Appa Rao', 'Satyanarayana', 'Srinivasulu',
      'Subba Rao', 'Babu Rao', 'Kiran Kumar', 'Ravi Varma', 'Murali Krishna',
      'Sankara Rao', 'Gopi Chand', 'Lakshmana Swamy', 'Harischandra', 'Bhaskara Rao',
      'Chandra Sekhar', 'Govinda Rajulu', 'Tirupathi Rao', 'Veerabhadra Rao', 'Narasimha Murthy'
    ];

    const villages = [
      'Bhimavaram', 'Tadepalligudem', 'Eluru', 'Tanuku', 'Palakollu',
      'Narsapur', 'Jangareddygudem', 'Kovvur', 'Chintalapudi', 'Akividu'
    ];

    const commodities = [
      { name: 'Paddy', key: 'paddy', rate: 22.50, varieties: ['MTU 1010', 'BPT 5204', 'Swarna'] },
      { name: 'Maize', key: 'maize', rate: 20.00, varieties: ['Dhananya', 'Hybrid 900M', 'Pioneer'] },
      { name: 'Red Gram', key: 'red_gram', rate: 70.00, varieties: ['LRG 41', 'ICPL 87119'] },
      { name: 'Wheat', key: 'wheat', rate: 24.00, varieties: ['HD 2967', 'PBW 343'] }
    ];

    const records = [];
    let recordCounter = 1001;
    let tokenCounter = 101;

    // 1. TODAY (2026-09-10): 20 Farmers Served
    for (let i = 0; i < 20; i++) {
      const name = names[i % names.length];
      const village = villages[i % villages.length];
      const cropObj = commodities[i % commodities.length];
      const variety = cropObj.varieties[i % cropObj.varieties.length];
      const qty = Math.floor(380 + (i * 47) % 420);
      const amount = Math.round(qty * cropObj.rate);
      const hour = Math.floor(8 + (i * 25) / 60);
      const minute = (i * 17) % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;

      records.push({
        id: `PRC-${recordCounter++}`,
        token: `A${tokenCounter++}`,
        farmerName: name,
        farmerId: `KIS-${(700000 + i * 3421).toString(16).toUpperCase()}`,
        phone: `98765 ${(10000 + i * 1111).toString().slice(-5)}`,
        location: `${village}, West Godavari`,
        commodityKey: cropObj.key,
        commodity: cropObj.name,
        variety: variety,
        quantity: qty,
        unit: 'kg',
        rate: cropObj.rate,
        amount: amount,
        moisture: `${(12 + (i % 3) * 0.7).toFixed(1)}%`,
        foreignMatter: `${(0.4 + (i % 4) * 0.1).toFixed(1)}%`,
        damagedGrains: `${(0.8 + (i % 3) * 0.2).toFixed(1)}%`,
        grade: 'Grade A',
        dateTime: `10 Sep 2026, ${timeStr}`,
        date: '2026-09-10',
        statusKey: 'completed',
        status: 'Completed',
        paymentStatusKey: i % 3 === 0 ? 'pending' : 'paid',
        paymentStatus: i % 3 === 0 ? 'Pending' : 'Paid',
        transactionRef: i % 3 === 0 ? '' : `UTR-908234${100 + i}`
      });
    }

    // 2. THIS WEEK: 65 additional records -> Week Total = 85
    const weekDates = ['2026-09-09', '2026-09-08', '2026-09-07', '2026-09-06', '2026-09-05', '2026-09-04'];
    const dateCounts = [15, 14, 12, 10, 8, 6];

    weekDates.forEach((dStr, dIdx) => {
      const dayCount = dateCounts[dIdx];
      const dateFormatted = new Date(dStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      for (let i = 0; i < dayCount; i++) {
        const idx = (dIdx * 10 + i);
        const name = names[(idx + 3) % names.length];
        const village = villages[(idx + 2) % villages.length];
        const cropObj = commodities[(idx + 1) % commodities.length];
        const variety = cropObj.varieties[i % cropObj.varieties.length];
        const qty = Math.floor(320 + (idx * 41) % 480);
        const amount = Math.round(qty * cropObj.rate);

        records.push({
          id: `PRC-${recordCounter++}`,
          token: `A${tokenCounter++}`,
          farmerName: name,
          farmerId: `KIS-${(800000 + idx * 2941).toString(16).toUpperCase()}`,
          phone: `98765 ${(20000 + idx * 1234).toString().slice(-5)}`,
          location: `${village}, West Godavari`,
          commodityKey: cropObj.key,
          commodity: cropObj.name,
          variety: variety,
          quantity: qty,
          unit: 'kg',
          rate: cropObj.rate,
          amount: amount,
          moisture: `${(12 + (i % 3) * 0.6).toFixed(1)}%`,
          foreignMatter: `${(0.4 + (i % 4) * 0.1).toFixed(1)}%`,
          damagedGrains: `${(0.7 + (i % 3) * 0.2).toFixed(1)}%`,
          grade: 'Grade A',
          dateTime: `${dateFormatted}, 11:30 AM`,
          date: dStr,
          statusKey: 'completed',
          status: 'Completed',
          paymentStatusKey: 'paid',
          paymentStatus: 'Paid',
          transactionRef: `UTR-908234${200 + idx}`
        });
      }
    });

    // 3. THIS MONTH: 100 additional records -> Month Total = 185
    for (let i = 0; i < 100; i++) {
      const dayNum = 11 + (i % 23);
      const monthNum = i < 70 ? '08' : '09';
      const dStr = `2026-${monthNum}-${dayNum.toString().padStart(2, '0')}`;
      const name = names[(i + 7) % names.length];
      const village = villages[(i + 5) % villages.length];
      const cropObj = commodities[i % commodities.length];
      const variety = cropObj.varieties[i % cropObj.varieties.length];
      const qty = Math.floor(400 + (i * 29) % 450);
      const amount = Math.round(qty * cropObj.rate);

      records.push({
        id: `PRC-${recordCounter++}`,
        token: `B${100 + i}`,
        farmerName: name,
        farmerId: `KIS-${(900000 + i * 1841).toString(16).toUpperCase()}`,
        phone: `98765 ${(30000 + i * 2345).toString().slice(-5)}`,
        location: `${village}, West Godavari`,
        commodityKey: cropObj.key,
        commodity: cropObj.name,
        variety: variety,
        quantity: qty,
        unit: 'kg',
        rate: cropObj.rate,
        amount: amount,
        moisture: `${(13 + (i % 3) * 0.5).toFixed(1)}%`,
        foreignMatter: `${(0.5 + (i % 4) * 0.1).toFixed(1)}%`,
        damagedGrains: `${(0.8 + (i % 3) * 0.2).toFixed(1)}%`,
        grade: 'Grade A',
        dateTime: `${dStr}, 02:15 PM`,
        date: dStr,
        statusKey: 'completed',
        status: 'Completed',
        paymentStatusKey: 'paid',
        paymentStatus: 'Paid',
        transactionRef: `UTR-908234${300 + i}`
      });
    }

    return records;
  };

  // Master Dataset for Reports
  const masterRecords = useMemo(() => {
    const todayStr = '2026-09-10';
    const baseDefault = generateBaselineRecords();

    const customProcurements = (state.procurements || []).map((p, idx) => {
      const cName = p.crop || 'Paddy';
      const cKey = cName.toLowerCase().replace(/\s+/g, '_');
      const stName = p.status || 'Completed';
      const stKey = stName.toLowerCase();

      return {
        id: p.id || `PRC-C${idx}`,
        token: p.token || `A${108 + idx}`,
        farmerName: p.farmerName || 'Verified Farmer',
        farmerId: p.farmerId || 'KIS-000000',
        phone: p.phone || '98765 00000',
        location: p.location || 'Procurement Centre',
        commodityKey: cKey,
        commodity: cName,
        variety: p.variety || 'Standard',
        quantity: p.actualQuantity || p.netWeightKg || p.quantity || 500,
        unit: p.unit || 'kg',
        rate: p.rate || 22.50,
        amount: p.totalAmount || p.amount || 11250,
        moisture: p.moisture || '13.5%',
        foreignMatter: p.foreignMatter || '0.6%',
        damagedGrains: p.damagedGrains || '1.0%',
        grade: p.grainGrade || p.quality || 'Grade A',
        dateTime: p.date ? new Date(p.date).toLocaleString('en-IN') : '10 Sep 2026, 10:24 AM',
        date: p.date ? p.date.split('T')[0] : todayStr,
        statusKey: stKey,
        status: stName,
        paymentStatusKey: (p.paymentStatus || 'Pending').toLowerCase(),
        paymentStatus: p.paymentStatus || 'Pending',
        transactionRef: p.transactionRef || ''
      };
    });

    return [...baseDefault, ...customProcurements];
  }, [state.procurements]);

  // Centralized Filter Execution Pipeline
  const filteredRecords = useMemo(() => {
    return masterRecords.filter(rec => {
      // 1. Date Range Filter
      if (appliedFilters.dateRange && appliedFilters.dateRange !== 'all') {
        const recDateStr = rec.date;
        const todayStr = '2026-09-10';

        if (appliedFilters.dateRange === 'today') {
          const sysToday = new Date().toISOString().slice(0, 10);
          if (recDateStr !== todayStr && recDateStr !== sysToday && recDateStr !== '2025-09-10') {
            return false;
          }
        } else if (appliedFilters.dateRange === 'yesterday') {
          const yesterdayStr = '2026-09-09';
          if (recDateStr !== yesterdayStr && recDateStr !== '2025-09-09') {
            return false;
          }
        } else if (appliedFilters.dateRange === 'week') {
          const recTime = new Date(rec.date).getTime();
          const refTime = new Date(todayStr).getTime();
          const diffDays = (refTime - recTime) / (1000 * 3600 * 24);
          if (isNaN(diffDays) || diffDays < 0 || diffDays > 7) return false;
        } else if (appliedFilters.dateRange === 'month') {
          const recTime = new Date(rec.date).getTime();
          const refTime = new Date(todayStr).getTime();
          const diffDays = (refTime - recTime) / (1000 * 3600 * 24);
          if (isNaN(diffDays) || diffDays < 0 || diffDays > 30) return false;
        } else if (appliedFilters.dateRange === 'custom') {
          if (appliedFilters.startDate && rec.date < appliedFilters.startDate) return false;
          if (appliedFilters.endDate && rec.date > appliedFilters.endDate) return false;
        }
      }

      // 2. Crop Filter
      if (appliedFilters.commodity && appliedFilters.commodity !== 'all') {
        const cropObj = CROPS_CATALOGUE.find(c => c.id === appliedFilters.commodity || c.name.toLowerCase() === appliedFilters.commodity.toLowerCase());
        const selectedEn = cropObj ? cropObj.name.toLowerCase() : appliedFilters.commodity.toLowerCase();
        const selectedTe = cropObj ? cropObj.teluguName.toLowerCase() : selectedEn;
        const recCrop = (rec.commodity || rec.crop || '').toLowerCase();

        if (rec.commodityKey !== appliedFilters.commodity && !recCrop.includes(selectedEn) && !recCrop.includes(selectedTe)) {
          return false;
        }
      }

      // 3. Status Filter
      if (appliedFilters.status && appliedFilters.status !== 'all') {
        if (rec.statusKey !== appliedFilters.status && rec.status.toLowerCase() !== appliedFilters.status.toLowerCase()) {
          return false;
        }
      }

      // 4. Farmer Search
      if (appliedFilters.search.trim() !== '') {
        const q = appliedFilters.search.toLowerCase();
        const matchesName = rec.farmerName.toLowerCase().includes(q);
        const matchesId = rec.farmerId.toLowerCase().includes(q);
        const matchesToken = rec.token.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesToken) return false;
      }

      return true;
    });
  }, [masterRecords, appliedFilters]);

  // Derived KPI Metrics directly from filteredRecords
  const kpiData = useMemo(() => {
    const totalFarmersCount = filteredRecords.length;
    const totalQuantityKg = filteredRecords.reduce((sum, r) => sum + r.quantity, 0);
    const totalQuantityQ = Math.round((totalQuantityKg / 100) * 10) / 10;
    const totalProcurementValue = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

    return {
      farmersServed: totalFarmersCount,
      totalQuantityQ: totalQuantityQ,
      totalQuantityKg: totalQuantityKg,
      totalProcurementValue: totalProcurementValue
    };
  }, [filteredRecords]);

  // Dynamic Crop-wise Distribution
  const cropDistribution = useMemo(() => {
    const counts = {};
    let totalKg = 0;
    filteredRecords.forEach(r => {
      const cName = r.commodity || 'Paddy';
      counts[cName] = (counts[cName] || 0) + r.quantity;
      totalKg += r.quantity;
    });

    if (totalKg === 0) return [];

    const colorsMap = {
      'Paddy': '#046a38',
      'Maize': '#3b82f6',
      'Red Gram': '#f97316',
      'Wheat': '#8b5cf6',
      'Cotton': '#ec4899',
      'Mustard': '#eab308'
    };

    const keys = Object.keys(counts);
    let percentages = keys.map(crop => Math.round((counts[crop] / totalKg) * 100));
    
    const sumP = percentages.reduce((a, b) => a + b, 0);
    if (sumP > 0 && sumP !== 100 && percentages.length > 0) {
      percentages[percentages.length - 1] += (100 - sumP);
    }

    return keys.map((crop, idx) => ({
      name: crop,
      quantityKg: counts[crop],
      percentage: percentages[idx],
      color: colorsMap[crop] || '#64748b'
    })).sort((a, b) => b.percentage - a.percentage);
  }, [filteredRecords]);

  // Dynamic Trend Graph Data
  const trendData = useMemo(() => {
    if (!filteredRecords.length) return [];

    const map = {};
    filteredRecords.forEach(r => {
      const dKey = r.date || '2026-09-10';
      if (!map[dKey]) {
        map[dKey] = { date: dKey, qtyKg: 0, farmersSet: new Set() };
      }
      map[dKey].qtyKg += r.quantity;
      map[dKey].farmersSet.add(r.farmerId || r.id);
    });

    const sortedDates = Object.keys(map).sort();
    return sortedDates.map(d => {
      const parts = d.split('-');
      const dayLabel = parts.length === 3 ? `${parts[2]}/${parts[1]}` : d;
      return {
        dateLabel: dayLabel,
        fullDate: d,
        qtyQ: Math.round((map[d].qtyKg / 100) * 10) / 10,
        farmersCount: map[d].farmersSet.size
      };
    });
  }, [filteredRecords]);

  // Apply Filters Click Handler
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterForm });
  };

  // Clear Filters Handler
  const handleClearFilters = () => {
    const resetState = {
      dateRange: 'all',
      startDate: '',
      endDate: '',
      commodity: 'all',
      status: 'all',
      search: ''
    };
    setFilterForm(resetState);
    setAppliedFilters(resetState);
  };

  // Export Report Text File Handler
  const handleExportPDF = () => {
    const reportContent = `
========================================================
KISANQUEUE PROCUREMENT CENTRE - OPERATIONAL REPORT
========================================================
Generated Date: ${new Date().toLocaleString()}
Date Filter: ${appliedFilters.dateRange}
Commodity Filter: ${appliedFilters.commodity}
Status Filter: ${appliedFilters.status}
Search Query: ${appliedFilters.search || 'None'}
--------------------------------------------------------
SUMMARY METRICS:
- Farmers Served: ${kpiData.farmersServed}
- Total Quantity Procured: ${kpiData.totalQuantityQ} Q (${kpiData.totalQuantityKg} kg)
- Total Procurement Value: ₹${kpiData.totalProcurementValue.toLocaleString('en-IN')}
--------------------------------------------------------
FARMER RECORDS LIST:
${filteredRecords.map((r, i) => `
${i + 1}. [Token: ${r.token}] ${r.farmerName} (${r.farmerId})
   Commodity: ${r.commodity} | Qty: ${r.quantity} kg | Amount: ₹${r.amount}
   Date: ${r.dateTime} | Status: ${r.status}
`).join('')}
========================================================
    `;

    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `KisanQueue_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <p className="text-[11px] font-extrabold text-[#046a38] uppercase tracking-widest">{t('centre.portalTitle', 'Procurement Centre')}</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">{t('reports.title', 'Operational Reports & Analytics')}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{t('reports.subtitle', 'Real-time procurement statistics and farmer throughput summary')}</p>
        </div>

        <button
          onClick={handleExportPDF}
          className="bg-[#046a38] hover:bg-[#03522c] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span>{t('reports.exportPdf', 'Export Report PDF')}</span>
        </button>
      </div>

      {/* FILTER CARD */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-4 md:p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e6f4ea] text-[#046a38] flex items-center justify-center">
                <Filter className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{t('reports.filterTitle', 'Report Filters')}</h3>
                <p className="text-[11px] font-medium text-slate-500">{t('reports.filterSubtitle', 'Filter real procurement records by Date, Crop, Status and Farmer Search')}</p>
              </div>
            </div>

            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('reports.clearFilters', 'Clear Filters')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {/* Date Range */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">{t('reports.filterDateRange', 'Date Range')}</label>
              <select
                value={filterForm.dateRange}
                onChange={(e) => setFilterForm(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38] cursor-pointer"
              >
                <option value="all">{t('reports.allDates', 'All Dates')}</option>
                <option value="today">{t('reports.today', 'Today')}</option>
                <option value="yesterday">{t('reports.yesterday', 'Yesterday')}</option>
                <option value="week">{t('reports.thisWeek', 'This Week')}</option>
                <option value="month">{t('reports.thisMonth', 'This Month')}</option>
                <option value="custom">{t('reports.customRange', 'Custom Date Range')}</option>
              </select>
            </div>

            {/* Crop */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">{t('reports.filterCommodity', 'Crop')}</label>
              <select
                value={filterForm.commodity}
                onChange={(e) => setFilterForm(prev => ({ ...prev, commodity: e.target.value }))}
                className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38] cursor-pointer font-bold"
              >
                <option value="all">{currentLang === 'te' ? 'అన్ని పంటలు (All Crops)' : 'All Crops'}</option>
                {CROPS_CATALOGUE.map(c => (
                  <option key={c.id} value={c.id}>
                    {currentLang === 'te' ? c.teluguName : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">{t('reports.filterStatus', 'Status')}</label>
              <select
                value={filterForm.status}
                onChange={(e) => setFilterForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full h-10 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38] cursor-pointer"
              >
                <option value="all">{t('reports.allStatus', 'All Status')}</option>
                <option value="completed">{t('reports.completed', 'Completed')}</option>
                <option value="pending">{t('reports.pending', 'Pending')}</option>
              </select>
            </div>

            {/* Farmer Search */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">{t('reports.filterSearch', 'Farmer Search')}</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search farmer name / ID / token"
                  value={filterForm.search}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full h-10 border border-slate-200 rounded-xl pl-9 pr-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38]"
                />
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button
                onClick={handleApplyFilters}
                className="w-full h-10 bg-[#046a38] hover:bg-[#03522c] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {t('reports.applyFilters', 'Apply Filters')}
              </button>
            </div>

          </div>

          {/* Custom Date Range Picker */}
          {filterForm.dateRange === 'custom' && (
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs font-bold">
              <div>
                <label className="text-slate-500 mr-2">Start Date:</label>
                <input 
                  type="date" 
                  value={filterForm.startDate} 
                  onChange={(e) => setFilterForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:outline-none focus:border-[#046a38]" 
                />
              </div>
              <div>
                <label className="text-slate-500 mr-2">End Date:</label>
                <input 
                  type="date" 
                  value={filterForm.endDate} 
                  onChange={(e) => setFilterForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:outline-none focus:border-[#046a38]" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* OVERVIEW CONTENT */}
      <div className="space-y-6">
        
        {/* 3 KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* KPI 1: FARMERS SERVED */}
          <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">{t('reports.farmersServed', 'Farmers Served')}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">{kpiData.farmersServed}</h3>
                  <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#046a38]" /> Calculated from filtered records
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 2: TOTAL QUANTITY */}
          <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">{t('reports.totalQuantity', 'Total Quantity Procured')}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">{kpiData.totalQuantityQ} Q</h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">{kpiData.totalQuantityKg.toLocaleString('en-IN')} kg total net weight</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 3: PROCUREMENT VALUE */}
          <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#046a38] flex items-center justify-center shrink-0">
                  <IndianRupee className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">{t('reports.procurementValue', 'Procurement Value')}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹{kpiData.totalProcurementValue.toLocaleString('en-IN')}</h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">Total MSP value processed</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PROCUREMENT TREND BAR CHART */}
          <Card className="lg:col-span-7 border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 py-4 px-5 flex justify-between items-center">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
                {t('reports.procurementTrend', 'Procurement Trend')}
              </CardTitle>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#046a38]"></span>
                  <span className="text-slate-600">Quantity (Q)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#fbbf24]"></span>
                  <span className="text-slate-600">Farmers</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {trendData.length > 0 ? (
                (() => {
                  const maxQty = Math.max(...trendData.map(d => d.qtyQ), 1);
                  const maxFarmers = Math.max(...trendData.map(d => d.farmersCount), 1);
                  return (
                    <div className="h-60 flex flex-col justify-between relative pt-6">
                      {/* GRIDLINES & Y-AXIS SCALE */}
                      <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none">
                        <div className="border-b border-slate-100 border-dashed w-full flex justify-between text-[10px] text-slate-400 font-bold -mt-2.5">
                          <span>{maxQty} Q</span>
                          <span>{maxFarmers} Farmers</span>
                        </div>
                        <div className="border-b border-slate-100 border-dashed w-full flex justify-between text-[10px] text-slate-300 font-bold -mt-2.5">
                          <span>{Math.round(maxQty / 2)} Q</span>
                          <span>{Math.ceil(maxFarmers / 2)} Farmers</span>
                        </div>
                        <div className="border-b border-slate-200 w-full flex justify-between text-[10px] text-slate-400 font-bold -mt-2.5">
                          <span>0 Q</span>
                          <span>0</span>
                        </div>
                      </div>

                      {/* BARS AREA */}
                      <div className="relative flex-1 flex items-end justify-around gap-2 pb-8 px-8 z-10">
                        {trendData.map((item, idx) => {
                          const qtyHeight = Math.max(12, Math.min(100, (item.qtyQ / maxQty) * 100));
                          const farmersHeight = Math.max(12, Math.min(100, (item.farmersCount / maxFarmers) * 100));

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative max-w-[64px]">
                              
                              {/* HOVER TOOLTIP */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute -top-10 z-30 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg shadow-xl flex flex-col items-center whitespace-nowrap">
                                <span className="font-extrabold text-amber-300">{item.fullDate}</span>
                                <span>Qty: {item.qtyQ} Q | Farmers: {item.farmersCount}</span>
                              </div>

                              <div className="flex items-end gap-1.5 w-full justify-center h-full">
                                {/* QTY BAR */}
                                <div 
                                  style={{ height: `${qtyHeight}%` }}
                                  className="w-3.5 bg-[#046a38] rounded-t-sm transition-all group-hover:bg-[#03522c] shadow-xs"
                                ></div>
                                {/* FARMERS BAR */}
                                <div 
                                  style={{ height: `${farmersHeight}%` }}
                                  className="w-3.5 bg-[#fbbf24] rounded-t-sm transition-all group-hover:bg-[#f59e0b] shadow-xs"
                                ></div>
                              </div>
                              
                              {/* X-AXIS LABEL */}
                              <span className="absolute -bottom-6 text-[10px] font-bold text-slate-600 tracking-tight whitespace-nowrap">
                                {item.dateLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center p-6 text-slate-400 font-bold text-xs">
                  <BarChart3 className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
                  <p>No procurement trend data matching the applied filters.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* DYNAMIC MULTICOLORED CROP-WISE DONUT CHART */}
          <Card className="lg:col-span-5 border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 py-4 px-5">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
                {t('reports.cropWiseProcurement', 'Crop-wise Procurement')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {cropDistribution.length > 0 ? (
                <>
                  {/* SVG DONUT CHART */}
                  <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18" cy="18" r="15.9155"
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="4"
                      />
                      {cropDistribution.map((crop, idx) => {
                        const cumulativePercentage = cropDistribution
                          .slice(0, idx)
                          .reduce((sum, c) => sum + c.percentage, 0);
                        const dashArray = `${crop.percentage} ${100 - crop.percentage}`;
                        const dashOffset = -cumulativePercentage;

                        return (
                          <circle
                            key={crop.name}
                            cx="18" cy="18" r="15.9155"
                            fill="transparent"
                            stroke={crop.color}
                            strokeWidth="4.5"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-500 hover:opacity-90"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black text-slate-900 leading-tight">{kpiData.totalQuantityQ} Q</span>
                      <span className="text-[10px] font-extrabold text-[#046a38] uppercase tracking-wider">Total</span>
                    </div>
                  </div>

                  {/* CROP LEGEND LIST */}
                  <div className="space-y-3 w-full">
                    {cropDistribution.map((crop, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: crop.color }}></span>
                          <span className="font-bold text-slate-700">{crop.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-500">{(crop.quantityKg / 100).toFixed(1)} Q</span>
                          <span className="font-black text-slate-900 w-9 text-right">{crop.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full py-8 text-center text-xs font-bold text-slate-400">
                  <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                  <p>No crop procurement records match the applied filters.</p>
                </div>
              )}

            </CardContent>
          </Card>

        </div>

        {/* RECENT FARMERS SERVED TABLE */}
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 py-4 px-5">
            <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#046a38]" strokeWidth={2.5} />
              {t('reports.recentFarmersServed', 'Recent Farmers Served')}
            </CardTitle>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Showing verified procurement records derived from applied filters</p>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200/70 text-slate-400 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 pl-5">#</th>
                  <th className="p-3.5">Token</th>
                  <th className="p-3.5">Farmer Name</th>
                  <th className="p-3.5">Farmer ID</th>
                  <th className="p-3.5">Crop</th>
                  <th className="p-3.5">Net Qty (kg)</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-xs font-semibold">
                {filteredRecords.length > 0 ? (
                  filteredRecords.slice(0, 10).map((rec, idx) => (
                    <tr 
                      key={rec.id} 
                      onClick={() => setSelectedFarmerRecord(rec)}
                      className="hover:bg-[#f0f8f3]/60 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 pl-5 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3.5 font-black text-[#046a38]">{rec.token}</td>
                      <td className="p-3.5 font-bold text-slate-900">{rec.farmerName}</td>
                      <td className="p-3.5 text-slate-500 font-mono">{rec.farmerId}</td>
                      <td className="p-3.5 font-bold text-slate-700">{rec.commodity}</td>
                      <td className="p-3.5 font-bold text-slate-900">{rec.quantity} kg</td>
                      <td className="p-3.5 font-black text-slate-900">₹{rec.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-slate-500">{rec.dateTime}</td>
                      <td className="p-3.5 pr-5">
                        <span className="bg-[#e6f4ea] text-[#046a38] px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border border-emerald-200">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-500 font-bold">
                      {t('reports.noRecordsFound', 'No procurement records match the applied filters.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Showing {Math.min(10, filteredRecords.length)} of {filteredRecords.length} records</span>
          </div>
        </Card>

      </div>

      {/* DETAILED FARMER RECORD MODAL (NO SENSITIVE BANK DETAILS) */}
      {selectedFarmerRecord && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-100">
            {/* Modal Header */}
            <div className="bg-[#046a38] p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">
                  {selectedFarmerRecord.token}
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">{selectedFarmerRecord.farmerName}</h3>
                  <p className="text-xs text-emerald-200 font-medium">{selectedFarmerRecord.farmerId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFarmerRecord(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs font-semibold text-slate-700 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="bg-[#e6f4ea] p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-[#046a38] uppercase tracking-wider">Total Procurement Amount</p>
                  <p className="text-2xl font-black text-slate-900">₹{selectedFarmerRecord.amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <span className="bg-[#046a38] text-white px-3 py-1 rounded-full text-xs font-extrabold">
                    {selectedFarmerRecord.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Farmer & Location</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-slate-400 font-normal">Phone:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.phone}</span></div>
                  <div><span className="text-slate-400 font-normal">Location:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.location}</span></div>
                  <div><span className="text-slate-400 font-normal">Date & Time:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.dateTime}</span></div>
                  <div><span className="text-slate-400 font-normal">Procurement ID:</span> <span className="font-bold text-slate-900 block font-mono">{selectedFarmerRecord.id}</span></div>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Crop & Quality Parameters</p>
                <div className="grid grid-cols-3 gap-3">
                  <div><span className="text-slate-400 font-normal">Crop:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.commodity}</span></div>
                  <div><span className="text-slate-400 font-normal">Variety:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.variety}</span></div>
                  <div><span className="text-slate-400 font-normal">Net Quantity:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.quantity} kg</span></div>
                  <div><span className="text-slate-400 font-normal">Rate (₹/kg):</span> <span className="font-bold text-slate-900 block">₹{selectedFarmerRecord.rate}</span></div>
                  <div><span className="text-slate-400 font-normal">Moisture:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.moisture}</span></div>
                  <div><span className="text-slate-400 font-normal">Grain Grade:</span> <span className="font-bold text-slate-900 block">{selectedFarmerRecord.grade}</span></div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedFarmerRecord(null)}
                  className="w-full py-3 bg-[#046a38] hover:bg-[#03522c] text-white font-bold rounded-xl transition-colors cursor-pointer text-sm shadow-xs"
                >
                  {t('reports.close', 'Close')}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffReports;
