import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/shared/LoginPage';
import FarmerLayout from './layouts/FarmerLayout';
import FarmerDashboard from './pages/farmer/Dashboard';
import FindCentre from './pages/farmer/FindCentre';
import BookSlot from './pages/farmer/BookSlot';
import LiveQueue from './pages/farmer/LiveQueue';
import Payments from './pages/farmer/Payments';

import MyBooking from './pages/farmer/MyBooking';
import DigitalToken from './pages/farmer/DigitalToken';
import Procurement from './pages/farmer/Procurement';
import History from './pages/farmer/History';
import Notifications from './pages/farmer/Notifications';
import Feedback from './pages/farmer/Feedback';
import Profile from './pages/farmer/Profile';

import StaffLayout from './layouts/StaffLayout';
import StaffDashboard from './pages/staff/Dashboard';
import StaffLiveQueue from './pages/staff/LiveQueue';
import StaffBookings from './pages/staff/Bookings';
import StaffVerification from './pages/staff/Verification';
import StaffQualityCheck from './pages/staff/QualityCheck';
import StaffWeighing from './pages/staff/Weighing';
import StaffProcurement from './pages/staff/Procurement';
import StaffPayments from './pages/staff/Payments';
import StaffComplaints from './pages/staff/Complaints';
import StaffReports from './pages/staff/Reports';
import StaffActivity from './pages/staff/ActivityLog';
import StaffSettings from './pages/staff/Settings';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCentres from './pages/admin/Centres';
import AdminFarmers from './pages/admin/Farmers';
import AdminBookings from './pages/admin/Bookings';
import AdminProcurement from './pages/admin/Procurement';
import AdminPayments from './pages/admin/Payments';
import AdminCongestion from './pages/admin/Congestion';
import AdminInsights from './pages/admin/Insights';
import AdminDemand from './pages/admin/Demand';
import AdminReports from './pages/admin/Reports';
import AdminComplaints from './pages/admin/Complaints';
import AdminStaff from './pages/admin/Staff';
import AdminActivity from './pages/admin/ActivityLog';
import AdminSettings from './pages/admin/Settings';

// Protected Route Wrapper
const ProtectedRoute = ({ role, children }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to={`/${role.toLowerCase()}/login`} replace />;
  }
  
  if (currentUser.role !== role) {
    // Redirect to their actual role dashboard if they try to access wrong portal
    return <Navigate to={`/${currentUser.role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Farmer Routes */}
      <Route path="/farmer/login" element={<LoginPage role="FARMER" />} />
      <Route path="/farmer/*" element={
        <ProtectedRoute role="FARMER">
          <FarmerLayout>
            <Routes>
              <Route path="dashboard" element={<FarmerDashboard />} />
              <Route path="find-centre" element={<FindCentre />} />
              <Route path="book-slot" element={<BookSlot />} />
              <Route path="my-booking" element={<MyBooking />} />
              <Route path="token" element={<DigitalToken />} />
              <Route path="live-queue" element={<LiveQueue />} />
              <Route path="procurement" element={<Procurement />} />
              <Route path="payments" element={<Payments />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="history" element={<History />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </FarmerLayout>
        </ProtectedRoute>
      } />

      {/* Staff Routes */}
      <Route path="/staff/login" element={<LoginPage role="STAFF" />} />
      <Route path="/staff/*" element={
        <ProtectedRoute role="STAFF">
          <StaffLayout>
            <Routes>
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="live-queue" element={<StaffLiveQueue />} />
              <Route path="bookings" element={<StaffBookings />} />
              <Route path="verification" element={<StaffVerification />} />
              <Route path="quality-check" element={<StaffQualityCheck />} />
              <Route path="weighing" element={<StaffWeighing />} />
              <Route path="procurement" element={<StaffProcurement />} />
              <Route path="payments" element={<StaffPayments />} />
              <Route path="complaints" element={<StaffComplaints />} />
              <Route path="reports" element={<StaffReports />} />
              <Route path="activity" element={<StaffActivity />} />
              <Route path="settings" element={<StaffSettings />} />
            </Routes>
          </StaffLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage role="ADMIN" />} />
      <Route path="/admin/*" element={
        <ProtectedRoute role="ADMIN">
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="centres" element={<AdminCentres />} />
              <Route path="farmers" element={<AdminFarmers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="procurement" element={<AdminProcurement />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="congestion" element={<AdminCongestion />} />
              <Route path="insights" element={<AdminInsights />} />
              <Route path="demand" element={<AdminDemand />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="activity" element={<AdminActivity />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
