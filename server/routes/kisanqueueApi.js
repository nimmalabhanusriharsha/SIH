import express from 'express';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND IN-MEMORY / PERSISTENT DATA STORE SEED
// ─────────────────────────────────────────────────────────────────────────────

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

  const banks = [
    { name: 'State Bank of India', ifsc: 'SBIN0001234' },
    { name: 'HDFC Bank', ifsc: 'HDFC0000123' },
    { name: 'ICICI Bank', ifsc: 'ICIC0000441' },
    { name: 'Canara Bank', ifsc: 'CNRB0001092' },
    { name: 'Union Bank of India', ifsc: 'UBIN0532101' },
    { name: 'Andhra Pradesh Grameena Vikas Bank', ifsc: 'APGV0002100' }
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
    const bank = banks[i % banks.length];
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
      bankName: bank.name,
      accountNumber: `XXXX XXXX ${(1000 + i * 87).toString().slice(-4)}`,
      ifsc: bank.ifsc,
      upi: `${name.toLowerCase().replace(/\s+/g, '.')}@upi`,
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
      const bank = banks[idx % banks.length];
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
        bankName: bank.name,
        accountNumber: `XXXX XXXX ${(2000 + idx * 53).toString().slice(-4)}`,
        ifsc: bank.ifsc,
        upi: `${name.toLowerCase().replace(/\s+/g, '.')}@upi`,
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
    const bank = banks[i % banks.length];
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
      bankName: bank.name,
      accountNumber: `XXXX XXXX ${(3000 + i * 67).toString().slice(-4)}`,
      ifsc: bank.ifsc,
      upi: `${name.toLowerCase().replace(/\s+/g, '.')}@upi`,
      transactionRef: `UTR-908234${300 + i}`
    });
  }

  return records;
};

const store = {
  farmers: [
    { id: 'KIS-7F29A81C', farmerId: 'KIS-7F29A81C', name: 'Ramesh Kumar', mobile: '9876543210', village: 'Bhimavaram', district: 'West Godavari', state: 'Andhra Pradesh', landArea: 5.2, primaryCrop: 'Paddy', expectedQuantity: 250, bankAccount: 'XXXX XXXX 4589', ifsc: 'SBIN0001234', bankName: 'State Bank of India', aadhaar: 'XXXX-XXXX-8901' },
    { id: 'KIS-E5F6A7B8', farmerId: 'KIS-E5F6A7B8', name: 'Suresh Reddy', mobile: '9876543211', village: 'Palakollu', district: 'West Godavari', state: 'Andhra Pradesh', landArea: 3.5, primaryCrop: 'Paddy', expectedQuantity: 150, bankAccount: 'XXXX XXXX 3190', ifsc: 'APGV0002100', bankName: 'Andhra Pradesh Grameena Vikas Bank', aadhaar: 'XXXX-XXXX-4412' }
  ],
  centres: [
    { id: 'C001', name: 'Sri Lakshmi Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Maize'], capacity: 150, activeCounters: 3, totalCounters: 4, status: 'Normal' },
    { id: 'C002', name: 'Krishna Agro Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Wheat'], capacity: 100, activeCounters: 2, totalCounters: 4, status: 'Busy' }
  ],
  bookings: [
    { id: 'BK20260908041', farmerId: 'KIS-7F29A81C', centreId: 'C001', date: '2026-09-10', slot: '10:00 AM – 11:00 AM', crop: 'Paddy', expectedQuantity: 25, token: 'A104', status: 'Confirmed', createdAt: new Date().toISOString() }
  ],
  queue: [
    { token: 'A098', farmerId: 'KIS-E5F6A7B8', centreId: 'C001', status: 'Serving', counter: 1 },
    { token: 'A096', farmerId: 'KIS-F9A1B2C3', centreId: 'C001', status: 'Serving', counter: 2 },
    { token: 'A097', farmerId: 'F004', centreId: 'C001', status: 'Serving', counter: 3 },
    { token: 'A104', farmerId: 'KIS-7F29A81C', centreId: 'C001', status: 'Waiting', position: 1, waitTime: 10 }
  ],
  procurements: generateBaselineRecords(),
  payments: [],
  complaints: [],
  notifications: [],
  activity: []
};

// Populate initial payments from procurements
store.payments = store.procurements.map((p, i) => ({
  id: `PAY-${8800 + i}`,
  procurementId: p.id,
  farmerId: p.farmerId,
  amount: p.amount,
  status: p.paymentStatus,
  date: p.date,
  transactionId: p.transactionRef || `TXN${900000 + i}`,
  bankAccount: p.accountNumber,
  ifsc: p.ifsc
}));

// ─────────────────────────────────────────────────────────────────────────────
// API ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
router.post('/auth/login', (req, res) => {
  const { role, mobile, id } = req.body;
  if (role === 'FARMER') {
    const farmer = store.farmers.find(f => f.mobile === mobile) || store.farmers[0];
    return res.json({ success: true, user: { ...farmer, role: 'FARMER' } });
  } else if (role === 'STAFF') {
    return res.json({ success: true, user: { id: id || 'STAFF001', name: 'Staff User', role: 'STAFF', centreId: 'C001', counterId: 'Counter 1' } });
  } else {
    return res.json({ success: true, user: { id: id || 'ADMIN001', name: 'Government Admin', role: 'ADMIN' } });
  }
});

router.post('/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({ success: true, message: `OTP sent to +91 ${phone}`, otp: otpCode });
});

router.post('/auth/verify-otp', (req, res) => {
  res.json({ success: true, verified: true });
});

// Farmers API
router.get('/farmers', (req, res) => {
  res.json({ success: true, data: store.farmers });
});

router.get('/farmers/:id', (req, res) => {
  const farmer = store.farmers.find(f => f.id === req.params.id || f.farmerId === req.params.id);
  res.json({ success: true, data: farmer || store.farmers[0] });
});

// Centres API
router.get('/centres', (req, res) => {
  res.json({ success: true, data: store.centres });
});

// Bookings API
router.get('/bookings', (req, res) => {
  res.json({ success: true, data: store.bookings });
});

router.post('/bookings', (req, res) => {
  const booking = req.body;
  const newBooking = {
    id: `BK${Date.now()}`,
    token: `A${Math.floor(100 + Math.random() * 900)}`,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    ...booking
  };
  store.bookings.unshift(newBooking);
  store.queue.push({ token: newBooking.token, farmerId: newBooking.farmerId, centreId: newBooking.centreId || 'C001', status: 'Waiting', position: store.queue.length + 1 });
  res.json({ success: true, data: newBooking });
});

// Queue API & QR Verification
router.get('/queue', (req, res) => {
  res.json({ success: true, data: store.queue });
});

router.post('/queue/verify-qr', (req, res) => {
  const { token, farmerId, bookingId } = req.body;
  const matchingBooking = store.bookings.find(b => b.token === token || b.id === bookingId) || store.bookings[0];
  const matchingFarmer = store.farmers.find(f => f.id === farmerId || f.farmerId === matchingBooking?.farmerId) || store.farmers[0];

  res.json({
    success: true,
    verified: true,
    data: {
      token: token || matchingBooking?.token || 'A104',
      bookingId: matchingBooking?.id || 'BK20260908041',
      farmerId: matchingFarmer?.id || 'KIS-7F29A81C',
      farmerName: matchingFarmer?.name || 'Ramesh Kumar',
      mobile: matchingFarmer?.mobile || '9876543210',
      location: `${matchingFarmer?.village || 'Bhimavaram'}, ${matchingFarmer?.district || 'West Godavari'}`,
      crop: matchingBooking?.crop || matchingFarmer?.primaryCrop || 'Paddy',
      variety: 'MTU 1010',
      expectedQuantity: matchingBooking?.expectedQuantity || 250,
      status: 'Verified'
    }
  });
});

// Procurements API
router.get('/procurements', (req, res) => {
  res.json({ success: true, data: store.procurements });
});

router.post('/procurements', (req, res) => {
  const record = req.body;
  const newProcurement = {
    id: `PRC-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    status: 'Completed',
    statusKey: 'completed',
    paymentStatus: 'Pending',
    paymentStatusKey: 'pending',
    ...record
  };
  store.procurements.unshift(newProcurement);

  // Auto-create payment entry
  const newPayment = {
    id: `PAY-${Date.now()}`,
    procurementId: newProcurement.id,
    farmerId: newProcurement.farmerId,
    amount: newProcurement.amount || newProcurement.totalAmount || 10000,
    status: 'Pending',
    date: newProcurement.date,
    bankAccount: newProcurement.accountNumber || 'XXXX XXXX 3210',
    ifsc: newProcurement.ifsc || 'SBIN0001234'
  };
  store.payments.unshift(newPayment);

  // Add activity log
  store.activity.unshift({
    id: `ACT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: `Completed procurement for ${newProcurement.farmerName} (${newProcurement.farmerId}) - Qty: ${newProcurement.quantity}kg, Amount: ₹${newProcurement.amount}`
  });

  res.json({ success: true, data: newProcurement, payment: newPayment });
});

// Payments API
router.get('/payments', (req, res) => {
  res.json({ success: true, data: store.payments });
});

router.post('/payments/initiate', (req, res) => {
  const payReq = req.body;
  const newPayment = {
    id: `PAY-${Date.now()}`,
    status: 'Processing',
    initiatedAt: new Date().toISOString(),
    ...payReq
  };
  store.payments.unshift(newPayment);
  res.json({ success: true, data: newPayment });
});

// Complaints API
router.get('/complaints', (req, res) => {
  res.json({ success: true, data: store.complaints });
});

router.post('/complaints', (req, res) => {
  const complaint = req.body;
  const newComplaint = {
    id: `CMP-${Date.now()}`,
    status: 'Under Review',
    date: new Date().toISOString(),
    ...complaint
  };
  store.complaints.unshift(newComplaint);
  res.json({ success: true, data: newComplaint });
});

// Notifications API
router.get('/notifications', (req, res) => {
  res.json({ success: true, data: store.notifications });
});

// Activity Log API
router.get('/activity-log', (req, res) => {
  res.json({ success: true, data: store.activity });
});

export default router;
