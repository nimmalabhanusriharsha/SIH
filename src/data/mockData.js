const generateFarmers = () => {
  const farmers = [
    { id: 'F001', name: 'Ramesh Kumar', mobile: '9876543210', village: 'Bhimavaram', district: 'West Godavari', state: 'Andhra Pradesh', landArea: 5, primaryCrop: 'Paddy', expectedQuantity: 250 },
    { id: 'F002', name: 'Suresh Reddy', mobile: '9876543211', village: 'Palakollu', district: 'West Godavari', state: 'Andhra Pradesh', landArea: 3, primaryCrop: 'Paddy', expectedQuantity: 150 },
    { id: 'F003', name: 'Venkata Rao', mobile: '9876543212', village: 'Tadepalligudem', district: 'West Godavari', state: 'Andhra Pradesh', landArea: 8, primaryCrop: 'Paddy', expectedQuantity: 400 },
  ];
  
  const names = ['Appa Rao', 'Satyanarayana', 'Siva Prasad', 'Ramakrishna', 'Krishna Mohan', 'Srinivasulu', 'Subba Rao', 'Venkat', 'Babu Rao', 'Prasad', 'Ramu', 'Koteswara Rao', 'Narasimha', 'Govind', 'Anand', 'Nageswara Rao', 'Ravi', 'Kiran', 'Sankar', 'Hari', 'Balu', 'Gopi', 'Chandu', 'Murali', 'Nani', 'Srinu', 'Lakshmana'];
  const villages = ['Narsapur', 'Tanuku', 'Kovvur', 'Eluru', 'Jangareddygudem', 'Chintalapudi'];
  
  for (let i = 4; i <= 30; i++) {
    farmers.push({
      id: `F${i.toString().padStart(3, '0')}`,
      name: names[i % names.length],
      mobile: `9876543${(200+i).toString().padStart(3, '0')}`,
      village: villages[i % villages.length],
      district: 'West Godavari',
      state: 'Andhra Pradesh',
      landArea: (Math.random() * 8 + 2).toFixed(1),
      primaryCrop: 'Paddy',
      expectedQuantity: Math.floor(Math.random() * 300) + 50
    });
  }
  return farmers;
};

const generateQueueAndBookings = () => {
  const queue = [];
  const bookings = [];
  
  // Specific active booking for F001 (Ramesh) to match requirements
  bookings.push({
    id: 'BK20260912041',
    farmerId: 'F001',
    centreId: 'C001',
    date: '2026-09-12',
    slot: '10:30 AM - 11:00 AM',
    crop: 'Paddy',
    expectedQuantity: 25,
    token: 'P-104',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  });

  queue.push({ token: 'P-096', farmerId: 'F002', centreId: 'C001', status: 'Serving', counter: 1 });
  queue.push({ token: 'P-097', farmerId: 'F003', centreId: 'C001', status: 'Serving', counter: 2 });
  queue.push({ token: 'P-098', farmerId: 'F004', centreId: 'C001', status: 'Serving', counter: 3 });

  // Waiting farmers ahead of F001 (P-104)
  for (let i = 99; i <= 103; i++) {
    queue.push({
      token: `P-${i.toString().padStart(3, '0')}`,
      farmerId: `F${(i-90).toString().padStart(3, '0')}`,
      centreId: 'C001',
      status: 'Waiting',
      position: i - 98,
      waitTime: (104 - i) * 6 
    });
  }
  
  // F001's entry
  queue.push({ token: 'P-104', farmerId: 'F001', centreId: 'C001', status: 'Waiting', position: 6, waitTime: 36 });
  
  // Some bookings for other centres
  for(let i=105; i<120; i++) {
     bookings.push({
      id: `BK202609120${i}`,
      farmerId: `F${(i-90).toString().padStart(3, '0')}`,
      centreId: 'C002',
      date: '2026-09-12',
      slot: '11:00 AM - 11:30 AM',
      crop: 'Paddy',
      expectedQuantity: 30,
      token: `P-${i}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    });
    queue.push({ token: `P-${i}`, farmerId: `F${(i-90).toString().padStart(3, '0')}`, centreId: 'C002', status: 'Waiting', position: i-104, waitTime: (i-104)*5 });
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
    { id: 'C001', name: 'Sri Lakshmi Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Maize'], capacity: 150, activeCounters: 3, lat: 16.5449, lng: 81.5212, operatingHours: '08:00 AM - 05:00 PM', status: 'Normal', distance: 2.4 },
    { id: 'C002', name: 'Krishna Agro Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Wheat'], capacity: 100, activeCounters: 2, lat: 16.5276, lng: 81.7288, operatingHours: '08:00 AM - 05:00 PM', status: 'Busy', distance: 3.1 },
    { id: 'C003', name: 'Rythu Seva Procurement Centre', district: 'West Godavari', crops: ['Paddy', 'Cotton'], capacity: 120, activeCounters: 4, lat: 16.8073, lng: 81.5316, operatingHours: '08:00 AM - 05:00 PM', status: 'Normal', distance: 8.5 },
    { id: 'C004', name: 'Godavari Procurement Centre', district: 'East Godavari', crops: ['Paddy'], capacity: 200, activeCounters: 5, lat: 16.9930, lng: 81.7778, operatingHours: '08:00 AM - 06:00 PM', status: 'Normal', distance: 12.2 },
    { id: 'C005', name: 'Green Harvest Centre', district: 'West Godavari', crops: ['Paddy', 'Groundnut'], capacity: 80, activeCounters: 2, lat: 16.6355, lng: 81.3323, operatingHours: '09:00 AM - 05:00 PM', status: 'Critical', distance: 15.6 },
  ],
  bookings,
  queue,
  procurements: [
    { id: 'PRC-5912', farmerId: 'F001', centreId: 'C001', date: '2026-08-15', crop: 'Paddy', actualQuantity: 22, quality: 'Grade A', rate: 2300, totalAmount: 50600, bookingId: 'BK2026081501' },
    { id: 'PRC-5913', farmerId: 'F001', centreId: 'C001', date: '2026-04-10', crop: 'Maize', actualQuantity: 15, quality: 'Grade B', rate: 1800, totalAmount: 27000, bookingId: 'BK2026041001' }
  ],
  payments: [
    { id: 'PAY-8821', procurementId: 'PRC-5912', farmerId: 'F001', amount: 50600, status: 'Paid', date: '2026-08-18', transactionId: 'TXN882199042' },
    { id: 'PAY-8822', procurementId: 'PRC-5913', farmerId: 'F001', amount: 27000, status: 'Paid', date: '2026-04-12', transactionId: 'TXN882299055' }
  ],
  notifications: [
    { id: 'N001', userId: 'F001', category: 'Booking', message: 'Your booking at Sri Lakshmi Procurement Centre is confirmed.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: 'N002', userId: 'F001', category: 'System', message: 'Token P-104 generated successfully.', timestamp: new Date(Date.now() - 3500000).toISOString(), read: true },
    { id: 'N003', userId: 'F001', category: 'Queue', message: 'Your token P-104 is 6 positions away.', timestamp: new Date(Date.now() - 1000000).toISOString(), read: false },
    { id: 'N004', userId: 'F001', category: 'Payment', message: 'Payment of ₹50,600 has been credited successfully.', timestamp: '2026-08-18T10:00:00Z', read: true }
  ],
  complaints: []
};
