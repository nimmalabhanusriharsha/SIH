/**
 * AI Smart Recommendation Service for KisanQueue
 * Calculates optimal centres, optimal booking slots, and arrival times.
 * Designed with realistic rule-based heuristics easily extensible with ML models.
 */

export const getCentreCongestion = (centre, queue = [], bookings = []) => {
  const activeInQueue = queue.filter(q => q.centreId === centre.id && q.status === 'Waiting');
  const queueLength = activeInQueue.length;
  const activeCounters = centre.activeCounters || 3;
  const capacity = centre.capacity || 100;
  
  // Average service time per farmer is ~5 minutes per counter
  const throughputPerMin = activeCounters / 5;
  const expectedWait = Math.round(queueLength / (throughputPerMin || 0.6));
  
  // Congestion categorization
  let congestionLevel = 'Low'; // 🟢
  let congestionBadge = 'success';
  let congestionColor = 'text-green-600';
  let congestionBg = 'bg-green-100 text-green-800 border-green-200';
  let congestionIcon = '🟢';

  if (expectedWait > 45 || queueLength > capacity * 0.7) {
    congestionLevel = 'High'; // 🔴
    congestionBadge = 'danger';
    congestionColor = 'text-red-600';
    congestionBg = 'bg-red-100 text-red-800 border-red-200';
    congestionIcon = '🔴';
  } else if (expectedWait > 20 || queueLength > capacity * 0.35) {
    congestionLevel = 'Medium'; // 🟡
    congestionBadge = 'warning';
    congestionColor = 'text-amber-600';
    congestionBg = 'bg-amber-100 text-amber-800 border-amber-200';
    congestionIcon = '🟡';
  }

  const bookedCount = bookings.filter(b => b.centreId === centre.id).length;
  const availableSlots = Math.max(2, capacity - bookedCount);

  // Recommendation score: lower distance + lower wait + higher capacity
  const score = (100 - (centre.distance || 5) * 3) - (expectedWait * 1.5) + (activeCounters * 5);

  return {
    ...centre,
    queueLength,
    expectedWait,
    congestionLevel,
    congestionBadge,
    congestionColor,
    congestionBg,
    congestionIcon,
    availableSlots,
    score
  };
};

export const getRecommendedCentre = (centres = [], queue = [], bookings = [], selectedCrop = 'All') => {
  const enhanced = centres
    .filter(c => selectedCrop === 'All' || c.crops.includes(selectedCrop))
    .map(c => getCentreCongestion(c, queue, bookings));

  if (enhanced.length === 0) return null;

  // Sort by highest AI score
  const sorted = [...enhanced].sort((a, b) => b.score - a.score);
  return sorted[0];
};

export const getSlotRecommendations = (centre, date, crop, quantity = 25) => {
  // Generate realistic time slots from 08:00 AM to 04:00 PM
  const baseSlots = [
    { time: '08:00 AM – 09:00 AM', booked: 18, capacity: 25, wait: 20, congestion: 'Low', icon: '🟢', counters: 3 },
    { time: '09:00 AM – 10:00 AM', booked: 28, capacity: 30, wait: 60, congestion: 'High', icon: '🔴', counters: 3 },
    { time: '10:00 AM – 11:00 AM', booked: 22, capacity: 30, wait: 35, congestion: 'Medium', icon: '🟡', counters: 4 },
    { time: '11:00 AM – 12:00 PM', booked: 10, capacity: 30, wait: 15, congestion: 'Low', icon: '🟢', counters: 4, recommended: true },
    { time: '12:00 PM – 01:00 PM', booked: 8, capacity: 25, wait: 10, congestion: 'Low', icon: '🟢', counters: 3 },
    { time: '01:00 PM – 02:00 PM', booked: 12, capacity: 20, wait: 15, congestion: 'Low', icon: '🟢', counters: 2 },
    { time: '02:00 PM – 03:00 PM', booked: 24, capacity: 25, wait: 40, congestion: 'High', icon: '🔴', counters: 3 },
    { time: '03:00 PM – 04:00 PM', booked: 14, capacity: 20, wait: 18, congestion: 'Low', icon: '🟢', counters: 3 },
  ];

  const recommendedSlot = baseSlots.find(s => s.recommended) || baseSlots[3];

  return {
    slots: baseSlots,
    recommendedSlot,
    aiReason: 'Lower expected crowd at this time and 4 dedicated weighing counters active.'
  };
};

export const calculateSmartArrivalTime = (centreDistanceKm = 5.2, farmersAhead = 6, averageWaitPerFarmerMin = 5) => {
  const estimatedQueueWaitMin = Math.max(5, farmersAhead * averageWaitPerFarmerMin);
  // Estimate travel time assuming 30 km/h rural road average
  const travelTimeMin = Math.max(10, Math.round((centreDistanceKm / 30) * 60));
  
  // Calculate recommended times relative to a nominal target or current time
  const now = new Date();
  const departureDate = new Date(now.getTime() + (Math.max(0, estimatedQueueWaitMin - travelTimeMin - 10)) * 60000);
  const targetArrivalDate = new Date(now.getTime() + (Math.max(10, estimatedQueueWaitMin - 10)) * 60000);
  const expectedCallDate = new Date(now.getTime() + estimatedQueueWaitMin * 60000);

  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    distanceKm: centreDistanceKm,
    travelTimeMin,
    estimatedQueueWaitMin,
    recommendedDepartureTime: formatTime(departureDate),
    recommendedArrivalTime: formatTime(targetArrivalDate),
    estimatedCallTime: formatTime(expectedCallDate)
  };
};
