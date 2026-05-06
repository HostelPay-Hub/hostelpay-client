import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import RoomsPage from './pages/RoomsPage';
import LeasesPage from './pages/LeasesPage';
import PaymentsPage from './pages/PaymentsPage';
import PendingDuesPage from './pages/PendingDuesPage';
import ExpensesPage from './pages/ExpensesPage';
import NoticesPage from './pages/NoticesPage';
import SettingsPage from './pages/SettingsPage';
import ClaimAccount from './pages/ClaimAccount';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminPage from './pages/SuperAdminPage';
import SubscriptionExpiredPage from './pages/SubscriptionExpiredPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/claim" element={<ClaimAccount />} />
          
          <Route path="/subscription-expired" element={<SubscriptionExpiredPage />} />
          
          {/* Protected Routes for Owner */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/leases" element={<LeasesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/pending-dues" element={<PendingDuesPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<SuperAdminDashboard />} />
            </Route>
          </Route>

          {/* Protected Route for Super Admin */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<SuperAdminPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
