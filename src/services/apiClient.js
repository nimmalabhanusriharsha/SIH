/**
 * KisanQueue Centralized Frontend API Client
 * Single Source of Truth Service for Farmer, Staff, and Government Portals.
 */

const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || `API error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[apiClient] Request to ${endpoint} failed, using local context state:`, err.message);
    return null;
  }
}

export const apiClient = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  sendOtp: (phone) => request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ otp }) }),

  // Farmers
  getFarmers: () => request('/farmers'),
  getFarmerById: (id) => request(`/farmers/${id}`),

  // Centres
  getCentres: () => request('/centres'),

  // Bookings
  getBookings: () => request('/bookings'),
  createBooking: (bookingData) => request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),

  // Queue & QR Verification
  getQueue: () => request('/queue'),
  verifyQrToken: (qrData) => request('/queue/verify-qr', { method: 'POST', body: JSON.stringify(qrData) }),

  // Procurements
  getProcurements: () => request('/procurements'),
  createProcurement: (recordData) => request('/procurements', { method: 'POST', body: JSON.stringify(recordData) }),

  // Payments
  getPayments: () => request('/payments'),
  initiatePayment: (paymentData) => request('/payments/initiate', { method: 'POST', body: JSON.stringify(paymentData) }),

  // Complaints
  getComplaints: () => request('/complaints'),
  createComplaint: (complaintData) => request('/complaints', { method: 'POST', body: JSON.stringify(complaintData) }),

  // Notifications
  getNotifications: () => request('/notifications'),

  // Activity Log
  getActivityLog: () => request('/activity-log')
};

export default apiClient;
