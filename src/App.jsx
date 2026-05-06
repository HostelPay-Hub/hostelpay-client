import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import RoomsPage from './pages/RoomsPage';
import LeasesPage from './pages/LeasesPage';
import PaymentsPage from './pages/PaymentsPage';
import PendingDuesPage from './pages/PendingDuesPage';
import SuperAdminPage from './pages/SuperAdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes for Owner */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/leases" element={<LeasesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/pending-dues" element={<PendingDuesPage />} />
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
  );
}

export default App;
