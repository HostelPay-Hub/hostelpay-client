import React from 'react';
import OwnerDashboard from './OwnerDashboard';
import StudentDashboard from './StudentDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (role === 'STUDENT') {
    return <StudentDashboard />;
  }

  // Default to Owner Dashboard
  return <OwnerDashboard />;
};

export default Dashboard;
