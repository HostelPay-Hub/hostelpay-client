import React, { useState, useEffect } from 'react';
import { dashboardAPI, paymentAPI } from '../api/endpoints';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { IndianRupee, Users, Home, AlertCircle, Calendar, MessageSquare, Check, X, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [pendingDues, setPendingDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, dRes] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getPendingDues()
      ]);
      setMetrics(mRes.data);
      setPendingDues(dRes.data);
    } catch (err) {
      toast.error('Failed to sync dashboard');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppReminder = (student) => {
    const message = `Hi ${student.studentName}, this is a reminder from HostelPay regarding your pending rent of ₹${student.pendingAmount}. Please clear it soon. Thank you!`;
    window.open(`https://wa.me/${student.phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-8 pb-10">
      {/* Financial Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenue (This Month)"
          value={`₹${metrics?.totalRevenueThisMonth?.toLocaleString() || 0}`}
          icon={<IndianRupee className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Pending Dues"
          value={`₹${metrics?.totalPendingDues?.toLocaleString() || 0}`}
          icon={<AlertCircle className="w-6 h-6" />}
          color="rose"
        />
        <StatsCard
          title="Active Students"
          value={metrics?.activeStudents || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Vacant Beds"
          value={(metrics?.totalRooms * 3) - (metrics?.activeStudents || 0)} // Mock capacity logic
          icon={<Home className="w-6 h-6" />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart (Phase 10) */}
        <div className="lg:col-span-2 premium-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
              <p className="text-sm text-slate-400">Monthly trend for current year</p>
            </div>
            <TrendingUp className="text-emerald-400" />
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[45, 60, 55, 80, 70, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all duration-500 group-hover:from-blue-400"
                  style={{ height: `${val}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded absolute -top-6">
                    {val}k
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2">Month {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention (Phase 7) */}
        <div className="premium-card">
          <h3 className="text-lg font-bold text-white mb-6">Needs Attention</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Aadhar Missing</p>
                  <p className="text-xs text-slate-400">3 students haven't uploaded IDs</p>
                </div>
                <AlertCircle className="text-rose-400 w-5 h-5" />
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Payment Unverified</p>
                  <p className="text-xs text-slate-400">Rahul (Room 102) sent UPI</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                    <Check size={14} />
                  </button>
                  <button className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Hit List (Phase 8) */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Pending Dues (The Hit List)</h3>
          <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs font-bold">
            {pendingDues.length} Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800">
                <th className="pb-4 font-medium">Student</th>
                <th className="pb-4 font-medium">Room</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium text-right">Remind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {pendingDues.map((item) => (
                <tr key={item.studentId} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium text-white">{item.studentName}</td>
                  <td className="py-4 text-slate-400">Room {item.roomNumber}</td>
                  <td className="py-4 font-bold text-rose-400">₹{item.pendingAmount}</td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => sendWhatsAppReminder(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-bold text-xs"
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
              {pendingDues.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-slate-500 italic">
                    Great! All students have cleared their dues.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
