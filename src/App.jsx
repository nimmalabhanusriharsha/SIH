import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Landing & Auth
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './auth/LoginPage';
import ProtectedRoute from './auth/ProtectedRoute';
import FarmerAuth from './portals/farmer/pages/FarmerAuth';

// Farmer Portal
import FarmerLayout from './portals/farmer/FarmerLayout';
import FarmerDashboard from './portals/farmer/pages/Dashboard';
import FindCentre from './portals/farmer/pages/FindCentre';
import BookSlot from './portals/farmer/pages/BookSlot';
import MyBooking from './portals/farmer/pages/MyBooking';
import DigitalToken from './portals/farmer/pages/DigitalToken';
import LiveQueue from './portals/farmer/pages/LiveQueue';
import Procurement from './portals/farmer/pages/Procurement';
import Payments from './portals/farmer/pages/Payments';
import Notifications from './portals/farmer/pages/Notifications';
import History from './portals/farmer/pages/History';
import Feedback from './portals/farmer/pages/Feedback';
import Profile from './portals/farmer/pages/Profile';

// Procurement Centre Portal
import CentreLayout from './portals/centre/CentreLayout';
import CentreDashboard from './portals/centre/pages/Dashboard';
import CentreLiveQueue from './portals/centre/pages/LiveQueue';
import CentreBookings from './portals/centre/pages/Bookings';
import CentreVerification from './portals/centre/pages/Verification';
import CentreQualityCheck from './portals/centre/pages/QualityCheck';
import CentreWeighing from './portals/centre/pages/Weighing';
import CentreProcurement from './portals/centre/pages/Procurement';
import CentrePayments from './portals/centre/pages/Payments';
import CentreComplaints from './portals/centre/pages/Complaints';
import CentreReports from './portals/centre/pages/Reports';
import CentreActivity from './portals/centre/pages/ActivityLog';
import CentreSettings from './portals/centre/pages/Settings';

// Government Admin Portal
import AdminLayout from './portals/admin/AdminLayout';
import AdminDashboard from './portals/admin/pages/Dashboard';
import AdminCentres from './portals/admin/pages/Centres';
import AdminFarmers from './portals/admin/pages/Farmers';
import AdminBookings from './portals/admin/pages/Bookings';
import AdminProcurement from './portals/admin/pages/Procurement';
import AdminPayments from './portals/admin/pages/Payments';
import AdminCongestion from './portals/admin/pages/Congestion';
import AdminDemand from './portals/admin/pages/Demand';
import AdminReports from './portals/admin/pages/Reports';
import AdminComplaints from './portals/admin/pages/Complaints';
import AdminStaff from './portals/admin/pages/Staff';
import AdminActivity from './portals/admin/pages/ActivityLog';
import AdminSettings from './portals/admin/pages/Settings';

function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 1. Farmer Portal Routes */}
      <Route path="/farmer/login" element={<LoginPage role="FARMER" />} />
      <Route path="/farmer/register" element={<FarmerAuth initialTab="register" />} />
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
              <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
            </Routes>
          </FarmerLayout>
        </ProtectedRoute>
      } />

      {/* 2. Procurement Centre Portal Routes */}
      <Route path="/centre/login" element={<LoginPage role="STAFF" />} />
      <Route path="/centre/*" element={
        <ProtectedRoute role="STAFF">
          <CentreLayout>
            <Routes>
              <Route path="dashboard" element={<CentreDashboard />} />
              <Route path="live-queue" element={<CentreLiveQueue />} />
              <Route path="bookings" element={<CentreBookings />} />
              <Route path="verification" element={<CentreVerification />} />
              <Route path="quality-check" element={<CentreQualityCheck />} />
              <Route path="weighing" element={<CentreWeighing />} />
              <Route path="procurement" element={<CentreProcurement />} />
              <Route path="payments" element={<CentrePayments />} />
              <Route path="complaints" element={<CentreComplaints />} />
              <Route path="reports" element={<CentreReports />} />
              <Route path="activity" element={<CentreActivity />} />
              <Route path="settings" element={<CentreSettings />} />
              <Route path="*" element={<Navigate to="/centre/dashboard" replace />} />
            </Routes>
          </CentreLayout>
        </ProtectedRoute>
      } />

      {/* Backward Compatibility for legacy /staff routes */}
      <Route path="/staff/login" element={<Navigate to="/centre/login" replace />} />
      <Route path="/staff" element={<Navigate to="/centre/dashboard" replace />} />
      <Route path="/staff/*" element={<Navigate to="/centre/dashboard" replace />} />

      {/* 3. Government Admin Portal Routes */}
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
              <Route path="demand" element={<AdminDemand />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="activity" element={<AdminActivity />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
