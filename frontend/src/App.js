import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import GuestBookingPage from './pages/GuestBookingPage';
import QuotePage from './pages/QuotePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminCalendar from './pages/AdminCalendar';
import AdminInvoices from './pages/AdminInvoices';
import AdminQuotes from './pages/AdminQuotes';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import AdminReports from './pages/AdminReports';

// Service Pages
import ResidentialCleaningPage from './pages/services/ResidentialCleaningPage';
import CommercialCleaningPage from './pages/services/CommercialCleaningPage';
import AirbnbCleaningPage from './pages/services/AirbnbCleaningPage';
import CustomCleaningPage from './pages/services/CustomCleaningPage';
import PostRenovationCleaningPage from './pages/services/PostRenovationCleaningPage';
import MoveInOutCleaningPage from './pages/services/MoveInOutCleaningPage';

// Info Pages
import AboutPage from './pages/AboutPage';
import AreasPage from './pages/AreasPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/guest-booking" element={<GuestBookingPage />} />
            <Route path="/quote" element={<QuotePage />} />
            
            {/* Service Pages */}
            <Route path="/services/residential" element={<ResidentialCleaningPage />} />
            <Route path="/services/commercial" element={<CommercialCleaningPage />} />
            <Route path="/services/airbnb" element={<AirbnbCleaningPage />} />
            <Route path="/services/custom" element={<CustomCleaningPage />} />
            <Route path="/services/post-renovation" element={<PostRenovationCleaningPage />} />
            <Route path="/services/move-in-out" element={<MoveInOutCleaningPage />} />
            
            {/* Info Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/areas" element={<AreasPage />} />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/bookings" 
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/calendar" 
              element={
                <AdminRoute>
                  <AdminCalendar />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/invoices" 
              element={
                <AdminRoute>
                  <AdminInvoices />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/quotes" 
              element={
                <AdminRoute>
                  <AdminQuotes />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/invoice/:id" 
              element={
                <AdminRoute>
                  <InvoiceDetailPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <AdminRoute>
                  <AdminReports />
                </AdminRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;