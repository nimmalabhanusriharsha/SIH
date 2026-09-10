const generateFarmers = () => {
  const farmers = [
    { 
      id: 'KIS-7F29A81C', 
      farmerId: 'KIS-7F29A81C',
      name: 'Ramesh Kumar', 
      mobile: '9876543210', 
      village: 'Bhimavaram', 
      district: 'West Godavari', 
      state: 'Andhra Pradesh', 
      landArea: 5.2, 
      primaryCrop: 'Paddy (Rice)', 
      expectedQuantity: 250,
      bankAccount: 'XXXX XXXX 4589',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
      aadhaar: 'XXXX-XXXX-8901'
    },
    { 
      id: 'KIS-E5F6A7B8', 
      farmerId: 'KIS-E5F6A7B8',
      name: 'Suresh Reddy', 
      mobile: '9876543211', 
      village: 'Palakollu', 
      district: 'West Godavari', 
      state: 'Andhra Pradesh', 
      landArea: 3.5, 
      primaryCrop: 'Paddy (Rice)', 
      expectedQuantity: 150,
      bankAccount: 'XXXX XXXX 3190',
      ifsc: 'APGV0002100',
      bankName: 'Andhra Pradesh Grameena Vikas Bank',
      aadhaar: 'XXXX-XXXX-4412'
    },
    { 
      id: 'KIS-F9A1B2C3', 
      farmerId: 'KIS-F9A1B2C3',
      name: 'Venkata Rao', 
      mobile: '9876543212', 
      village: 'Tadepalligudem', 
      district: 'West Godavari', 
      state: 'Andhra Pradesh', 
      landArea: 8.0, 
      primaryCrop: 'Paddy (Rice)', 
      expectedQuantity: 400,
      bankAccount: 'XXXX XXXX 9921',
      ifsc: 'UBIN0530012',
      bankName: 'Union Bank of India',
      aadhaar: 'XXXX-XXXX-1189'
    },
  ];
  
  const names = ['Appa Rao', 'Satyanarayana', 'Siva Prasad', 'Ramakrishna', 'Krishna Mohan', 'Srinivasulu', 'Subba Rao', 'Venkat', 'Babu Rao', 'Prasad', 'Ramu', 'Koteswara Rao', 'Narasimha', 'Govind', 'Anand', 'Nageswara Rao', 'Ravi', 'Kiran', 'Sankar', 'Hari', 'Balu', 'Gopi', 'Chandu', 'Murali', 'Nani', 'Srinu', 'Lakshmana'];
  const villages = ['Narsapur', 'Tanuku', 'Kovvur', 'Eluru', 'Jangareddygudem', 'Chintalapudi'];
  
  for (let i = 4; i <= 30; i++) {
    const fid = `F${i.toString().padStart(3, '0')}`;
    farmers.push({
      id: fid,
      farmerId: fid,
      name: names[i % names.length],
      mobile: `9876543${(200+i).toString().padStart(3, '0')}`,
      village: villages[i % villages.length],
      district: 'West Godavari',
      state: 'Andhra Pradesh',
      landArea: (Math.random() * 8 + 2).toFixed(1),
      primaryCrop: 'Paddy',
      expectedQuantity: Math.floor(Math.random() * 300) + 50,
      bankAccount: `XXXX XXXX ${(1000 + i * 37).toString().slice(-4)}`,
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
      aadhaar: `XXXX XXXX ${(3000 + i * 43).toString().slice(-4)}`
    });
  }
  return farmers;
};

const generateQueueAndBookings = () => {
  const queue = [];
  const bookings = [];
  
  // Today's active booking for KIS-7F29A81C (Ramesh Kumar) with Token A104
  bookings.push({
    id: 'BK20260908041',
    farmerId: 'KIS-7F29A81C',
    centreId: 'C001',
    date: '2026-09-08',
    slot: '10:00 AM – 11:00 AM',
    crop: 'Paddy',
    expectedQuantity: 25,
    token: 'A104',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  });

  // Serving tokens at counters
  queue.push({ token: 'A098', farmerId: 'KIS-E5F6A7B8', centreId: 'C001', status: 'Serving', counter: 1 });
  queue.push({ token: 'A096', farmerId: 'KIS-F9A1B2C3', centreId: 'C001', status: 'Serving', counter: 2 });
  queue.push({ token: 'A097', farmerId: 'F004', centreId: 'C001', status: 'Serving', counter: 3 });

  // Waiting farmers ahead of KIS-7F29A81C (A099 to A103)
  for (let i = 99; i <= 103; i++) {
    queue.push({
      token: `A${i.toString().padStart(3, '0')}`,
      farmerId: `F${(i-90).toString().padStart(3, '0')}`,
      centreId: 'C001',
      status: 'Waiting',
      position: i - 97,
      waitTime: (104 - i) * 6 
    });
  }
  
  // KIS-7F29A81C's entry (A104) - 6 farmers ahead, ~35 min wait
  queue.push({ token: 'A104', farmerId: 'KIS-7F29A81C', centreId: 'C001', status: 'Waiting', position: 6, waitTime: 35 });
  
  // Additional bookings for other centres
  for(let i=105; i<120; i++) {
     bookings.push({
      id: `BK202609080${i}`,
      farmerId: `F${(i-90).toString().padStart(3, '0')}`,
      centreId: 'C002',
      date: '2026-09-08',
      slot: '11:00 AM – 12:00 PM',
      crop: 'Paddy',
      expectedQuantity: 30,
      token: `A${i}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    });
    queue.push({ token: `A${i}`, farmerId: `F${(i-90).toString().padStart(3, '0')}`, centreId: 'C002', status: 'Waiting', position: i-104, waitTime: (i-104)*5 });
  }

  return { queue, bookings };
};

const { queue, bookings } = generateQueueAndBookings();

export const initialData = {
  farmers: generateFarmers(),
  staff: [
    { id: 'STAFF001', name: 'Staff User', password: '1234', centreId: 'C001' }
  ],
  admin: [
    { id: 'ADMIN001', name: 'Admin User', password: '1234' }
  ],
  centres: [
    { id: 'C001', name: 'Sri Lakshmi Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Maize'], capacity: 150, activeCounters: 3, lat: 16.5449, lng: 81.5212, operatingHours: '08:00 AM – 05:00 PM', status: 'Normal', distance: 5.2 },
    { id: 'C002', name: 'Krishna Agro Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Wheat'], capacity: 100, activeCounters: 2, lat: 16.5276, lng: 81.7288, operatingHours: '08:00 AM – 05:00 PM', status: 'Busy', distance: 7.8 },
    { id: 'C003', name: 'Rythu Seva Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Cotton'], capacity: 120, activeCounters: 4, lat: 16.8073, lng: 81.5316, operatingHours: '08:00 AM – 05:00 PM', status: 'Normal', distance: 8.5 },
    { id: 'C004', name: 'Godavari Procurement Centre', district: 'East Godavari', crops: ['Paddy'], capacity: 200, activeCounters: 5, lat: 16.9930, lng: 81.7778, operatingHours: '08:00 AM – 06:00 PM', status: 'Normal', distance: 12.2 },
    { id: 'C005', name: 'Green Harvest Centre', district: 'West Godavari', crops: ['Paddy', 'Groundnut'], capacity: 80, activeCounters: 2, lat: 16.6355, lng: 81.3323, operatingHours: '09:00 AM – 05:00 PM', status: 'Critical', distance: 15.6 },
  ],
  bookings,
  queue,
  procurements: [
    { 
      id: 'PRC-5912', 
      farmerId: 'KIS-7F29A81C', 
      centreId: 'C001', 
      date: '2026-08-15', 
      crop: 'Paddy', 
      grossWeight: 540,
      tareWeight: 20,
      netWeightKg: 520,
      actualQuantity: 22, 
      quality: 'Grade A', 
      moisture: '14.0%',
      foreignMatter: '0.8%',
      rate: 2300, 
      totalAmount: 50600, 
      bookingId: 'BK2026081501',
      status: 'Completed'
    },
    { 
      id: 'PRC-5913', 
      farmerId: 'KIS-7F29A81C', 
      centreId: 'C001', 
      date: '2026-04-10', 
      crop: 'Maize', 
      grossWeight: 320,
      tareWeight: 20,
      netWeightKg: 300,
      actualQuantity: 15, 
      quality: 'Grade B', 
      moisture: '13.5%',
      foreignMatter: '1.2%',
      rate: 1800, 
      totalAmount: 27000, 
      bookingId: 'BK2026041001',
      status: 'Completed'
    }
  ],
  payments: [
    { 
      id: 'PAY-8821', 
      procurementId: 'PRC-5912', 
      farmerId: 'KIS-7F29A81C', 
      amount: 50600, 
      status: 'Paid', 
      date: '2026-08-18', 
      transactionId: 'TXN90820261234',
      bankAccount: 'XXXX XXXX 4589',
      ifsc: 'SBIN0001234'
    },
    { 
      id: 'PAY-8822', 
      procurementId: 'PRC-5913', 
      farmerId: 'KIS-7F29A81C', 
      amount: 27000, 
      status: 'Paid', 
      date: '2026-04-12', 
      transactionId: 'TXN882299055',
      bankAccount: 'XXXX XXXX 4589',
      ifsc: 'SBIN0001234'
    }
  ],
  notifications: [
    { id: 'N001', userId: 'KIS-7F29A81C', category: 'Booking', message: 'Your procurement slot is confirmed for 08 September 2026, 10:00 AM.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false },
    { id: 'N002', userId: 'KIS-7F29A81C', category: 'System', message: 'Digital Token A104 generated successfully for Sri Lakshmi Procurement Centre.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: 'N003', userId: 'KIS-7F29A81C', category: 'Queue', message: 'Your turn is approaching. 6 farmers ahead. Please reach the centre by 10:20 AM.', timestamp: new Date(Date.now() - 900000).toISOString(), read: false },
    { id: 'N004', userId: 'KIS-7F29A81C', category: 'Payment', message: 'Payment of ₹50,600 has been credited to account XXXX XXXX 4589.', timestamp: '2026-08-18T10:00:00Z', read: true }
  ],
  complaints: [
    { id: 'CMP1042', farmerId: 'KIS-7F29A81C', type: 'Long waiting time', description: 'Counter #2 experienced a temporary scale calibration delay.', status: 'Under Review', date: '2026-08-15T14:30:00Z' }
  ]
};

