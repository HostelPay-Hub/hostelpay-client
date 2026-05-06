import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import { ShieldCheck, Building2, User, Power, Ban, Search, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const queryClient = useQueryClient();

  const { data: hostels, isLoading } = useQuery({
    queryKey: ['admin-hostels'],
    queryFn: () => api.get('/api/admin/hostels').then(res => res.data)
  });

  const toggleSubscriptionMutation = useMutation({
    mutationFn: ({ id, active }) => api.put(`/api/admin/hostels/${id}/subscription?active=${active}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-hostels']);
      toast.success('Subscription status updated');
    },
    onError: () => toast.error('Action failed')
  });

  if (isLoading) return <div className="p-8 text-center font-medium">Loading control center...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 w-10 h-10" /> Super Admin
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Manage all hostels and SaaS subscriptions</p>
          </div>
          
          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-200 w-full md:w-96">
            <Search className="text-gray-400 m-2" />
            <input 
              type="text" 
              placeholder="Search hostels or owners..."
              className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Hostels', value: hostels?.length || 0, icon: <Building2 className="text-blue-600" />, bg: 'bg-blue-50' },
            { label: 'Active Subscriptions', value: hostels?.filter(h => h.subscriptionActive).length || 0, icon: <CheckCircle2 className="text-green-600" />, bg: 'bg-green-50' },
            { label: 'Pending Payments', value: hostels?.filter(h => !h.subscriptionActive).length || 0, icon: <Ban className="text-red-600" />, bg: 'bg-red-50' },
            { label: 'System Health', value: '100%', icon: <Power className="text-indigo-600" />, bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${stat.bg} p-4 rounded-2xl`}>{stat.icon}</div>
              <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Hostel Name</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Owner Details</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {hostels?.map((hostel) => (
                <tr key={hostel.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {hostel.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{hostel.name}</div>
                        <div className="text-gray-400 text-sm">{hostel.address || 'No address provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700 flex items-center gap-2">
                        <User size={14} className="text-gray-400" /> {hostel.ownerName || 'Unknown Owner'}
                      </span>
                      <span className="text-gray-400 text-sm">{hostel.ownerEmail}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {hostel.subscriptionActive ? (
                      <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-black uppercase tracking-tight">Active</span>
                    ) : (
                      <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-tight">Suspended</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => toggleSubscriptionMutation.mutate({ id: hostel.id, active: !hostel.subscriptionActive })}
                      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                        hostel.subscriptionActive 
                          ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                          : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                      }`}
                    >
                      {hostel.subscriptionActive ? 'Suspend Account' : 'Activate Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
