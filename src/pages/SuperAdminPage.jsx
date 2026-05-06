import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/endpoints';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';

const SuperAdminPage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const res = await adminAPI.getAllHostels();
      setHostels(res.data);
    } catch (err) {
      setError('Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (id, currentStatus) => {
    try {
      await adminAPI.toggleSubscription(id, !currentStatus);
      fetchHostels(); // Refresh data
    } catch (err) {
      setError('Failed to update subscription status');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mr-4">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Platform Administration</h2>
            <p className="text-slate-400 mt-1">Super Admin control panel for SaaS subscriptions.</p>
          </div>
        </div>
      </div>

      <div className="glass-dark rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Hostel Name</th>
                  <th className="p-4 font-medium">Owner Email</th>
                  <th className="p-4 font-medium">Created On</th>
                  <th className="p-4 font-medium">Subscription Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {hostels.map((hostel) => (
                  <tr key={hostel.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-medium text-white">{hostel.name}</td>
                    <td className="p-4 text-slate-400">{hostel.ownerEmail}</td>
                    <td className="p-4 text-sm">{new Date(hostel.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {hostel.subscriptionActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3 h-3 mr-1" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleSubscription(hostel.id, hostel.subscriptionActive)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          hostel.subscriptionActive 
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {hostel.subscriptionActive ? 'Suspend SaaS' : 'Reactivate SaaS'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPage;
