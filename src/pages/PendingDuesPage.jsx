import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/endpoints';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { MessageCircle, AlertCircle } from 'lucide-react';

const PendingDuesPage = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDues();
  }, []);

  const fetchDues = async () => {
    try {
      const res = await dashboardAPI.getPendingDues();
      setDues(res.data);
    } catch (err) {
      setError('Failed to fetch pending dues');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppReminder = (due) => {
    const message = `Hello ${due.studentName},\n\nThis is a gentle reminder regarding your hostel rent for Room ${due.roomNumber}.\n\nTotal Rent: ₹${due.monthlyRent}\nPaid This Month: ₹${due.paidThisMonth}\n*Pending Due: ₹${due.pendingAmount}*\n\nPlease clear the pending amount at your earliest convenience.\n\nThank you,\nHostel Management`;
    
    // Format phone number (remove spaces, ensure country code)
    let phone = due.phoneNumber.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Pending Dues</h2>
          <p className="text-slate-400 mt-1">Students with outstanding balances this month.</p>
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
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Room</th>
                  <th className="p-4 font-medium">Rent</th>
                  <th className="p-4 font-medium">Paid</th>
                  <th className="p-4 font-medium">Pending</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {dues.length > 0 ? (
                  dues.map((due) => (
                    <tr key={due.studentId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-white">{due.studentName}</div>
                        <div className="text-xs text-slate-500 mt-1">{due.phoneNumber}</div>
                      </td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-800 rounded-md text-xs font-bold text-slate-300">Room {due.roomNumber}</span></td>
                      <td className="p-4 text-slate-400">₹{due.monthlyRent}</td>
                      <td className="p-4 text-emerald-400">₹{due.paidThisMonth}</td>
                      <td className="p-4 text-rose-400 font-bold">₹{due.pendingAmount}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => sendWhatsAppReminder(due)}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Remind
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20 text-emerald-500" />
                      <p className="text-lg font-medium text-slate-300">All clear!</p>
                      <p className="text-sm mt-1">No pending dues found for active leases this month.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDuesPage;
