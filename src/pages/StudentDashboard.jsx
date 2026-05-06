import React, { useState, useEffect } from 'react';
import { studentAPI } from '../api/endpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import { IndianRupee, Home, Users, CheckCircle, AlertCircle, ArrowUpRight, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await studentAPI.getDashboard();
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const isOverdue = data?.pendingBalance > 0;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      {/* Financial Hero Card */}
      <div className={`hero-card relative group p-8 overflow-hidden animate-glow ${isOverdue ? 'border-rose-500/30' : 'border-emerald-500/30'}`}>
        <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl opacity-20 ${isOverdue ? 'bg-rose-500' : 'bg-emerald-500'}`} />
        
        <div className="relative z-10">
          <p className="text-slate-400 font-medium mb-1">Your Rent Status</p>
          <div className="flex items-baseline gap-2 mb-6">
            <h2 className="text-5xl font-bold text-white tracking-tighter">
              ₹{data?.pendingBalance?.toLocaleString() || 0}
            </h2>
            <span className="text-slate-500 text-lg">Pending</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
            isOverdue ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {isOverdue ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {data?.status}
          </div>
        </div>

        <button className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all group-hover:scale-110">
          <ArrowUpRight size={24} />
        </button>
      </div>

      {/* Room Details Card */}
      <div className="premium-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Home size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Room {data?.roomNumber}</h3>
            <p className="text-sm text-slate-400">{data?.hostelName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-500 mb-1">Monthly Rent</p>
            <p className="font-bold text-white">₹{data?.monthlyRent?.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-500 mb-1">Roommates</p>
            <p className="font-bold text-white">{data?.roommates?.length || 0} Active</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center p-6 premium-card border-slate-800 hover:border-blue-500/50 group">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <IndianRupee size={24} />
          </div>
          <span className="font-semibold text-sm">Pay Rent</span>
        </button>

        <button className="flex flex-col items-center justify-center p-6 premium-card border-slate-800 hover:border-amber-500/50 group">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <MessageSquare size={24} />
          </div>
          <span className="font-semibold text-sm">Raise Issue</span>
        </button>
      </div>

      {/* Notice Board Preview */}
      <div className="premium-card">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Latest Notices</h4>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-white font-medium mb-1">WiFi Maintenance</p>
            <p className="text-xs text-slate-400">Scheduled for 2:00 PM today. Please expect a 30-min downtime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
