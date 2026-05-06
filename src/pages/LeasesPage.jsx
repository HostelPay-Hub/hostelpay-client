import React, { useState, useEffect } from 'react';
import { leaseAPI, studentAPI, roomAPI } from '../api/endpoints';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Trash2, FileText } from 'lucide-react';

const LeasesPage = () => {
  const [leases, setLeases] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    roomId: '',
    startDate: '',
    agreedMonthlyRent: '',
    billingAnchorDate: '1',
    paymentTerm: 'ADVANCE'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leasesRes, studentsRes, roomsRes] = await Promise.all([
        leaseAPI.getAll(),
        studentAPI.getAll(),
        roomAPI.getAll()
      ]);
      setLeases(leasesRes.data);
      setStudents(studentsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (e) => {
    const roomId = e.target.value;
    const room = rooms.find(r => r.id === roomId);
    setFormData({
      ...formData,
      roomId,
      agreedMonthlyRent: room ? room.defaultPrice : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leaseAPI.create(formData);
      setIsModalOpen(false);
      fetchData();
      setFormData({ studentId: '', roomId: '', startDate: '', agreedMonthlyRent: '', billingAnchorDate: '1', paymentTerm: 'ADVANCE' });
    } catch (err) {
      setError(err.response?.data?.details || err.response?.data?.message || 'Failed to create lease');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('End this lease? This will soft delete the lease.')) {
      try {
        await leaseAPI.delete(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete lease');
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Active Leases</h2>
          <p className="text-slate-400 mt-1">Assign students to rooms and set their rent.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Lease
        </button>
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
                  <th className="p-4 font-medium">Started</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {leases.length > 0 ? (
                  leases.map((lease) => (
                    <tr key={lease.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-medium text-white">{lease.studentName}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-md text-xs font-bold">Room {lease.roomNumber}</span></td>
                      <td className="p-4 text-emerald-400 font-medium">₹{lease.agreedMonthlyRent}</td>
                      <td className="p-4 text-sm">{new Date(lease.startDate).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(lease.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      No active leases found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lease">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Student</label>
            <select required value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500">
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.phoneNumber})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Room</label>
            <select required value={formData.roomId} onChange={handleRoomSelect} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500">
              <option value="">-- Select Room --</option>
              {rooms.map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} (Capacity: {r.capacity})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Agreed Monthly Rent (₹)</label>
            <input required type="number" min="1" value={formData.agreedMonthlyRent} onChange={(e) => setFormData({...formData, agreedMonthlyRent: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
            <input required type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors">
            Create Lease Contract
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default LeasesPage;
