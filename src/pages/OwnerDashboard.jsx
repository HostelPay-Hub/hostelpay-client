import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/endpoints';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { IndianRupee, Users, Home, AlertCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await dashboardAPI.getMetrics();
      setMetrics(res.data);
    } catch (err) {
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Financial Overview</h2>
          <p className="text-slate-400 mt-1">Real-time metrics for this month.</p>
        </div>
        <div className="px-4 py-2 rounded-lg glass border border-slate-700/50 flex items-center text-sm text-slate-300">
          <Calendar className="w-4 h-4 mr-2 text-blue-400" />
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <StatsCard
            title="Revenue (This Month)"
            value={`₹${metrics.totalRevenueThisMonth?.toLocaleString() || 0}`}
            icon={<IndianRupee className="w-6 h-6" />}
            color="emerald"
          />
          <StatsCard
            title="Pending Dues"
            value={`₹${metrics.totalPendingDues?.toLocaleString() || 0}`}
            icon={<AlertCircle className="w-6 h-6" />}
            color="rose"
          />
          <StatsCard
            title="Active Students"
            value={metrics.activeStudents}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Active Leases"
            value={metrics.activeLeases}
            icon={<Calendar className="w-6 h-6" />}
            color="indigo"
          />
          <StatsCard
            title="Total Rooms"
            value={metrics.totalRooms}
            icon={<Home className="w-6 h-6" />}
            color="amber"
          />
        </div>
      )}

      {/* Quick Actions or charts can go here later */}
      <div className="mt-8 rounded-2xl glass-dark border border-slate-800 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          <IndianRupee className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Ready to collect payments?</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-6">
          Check your pending dues and send automated WhatsApp reminders to students to clear their balances.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
