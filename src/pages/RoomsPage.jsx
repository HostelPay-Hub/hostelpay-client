import React, { useState, useEffect } from 'react';
import { roomAPI } from '../api/endpoints';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Edit2, Trash2, Key } from 'lucide-react';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: '',
    defaultPrice: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await roomAPI.getAll();
      setRooms(res.data);
    } catch (err) {
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await roomAPI.update(editingId, formData);
      } else {
        await roomAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchRooms();
      setFormData({ roomNumber: '', capacity: '', defaultPrice: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.details || err.response?.data?.message || 'Operation failed');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this room?')) {
      try {
        await roomAPI.delete(id);
        fetchRooms();
      } catch (err) {
        setError('Failed to delete room');
      }
    }
  };

  const openEditModal = (room) => {
    setFormData({
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      defaultPrice: room.defaultPrice
    });
    setEditingId(room.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Rooms</h2>
          <p className="text-slate-400 mt-1">Manage your hostel rooms and capacities.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ roomNumber: '', capacity: '', defaultPrice: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Room
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="glass-dark rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Key className="w-6 h-6" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => openEditModal(room)} className="text-slate-400 hover:text-emerald-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(room.id)} className="text-slate-400 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Room {room.roomNumber}</h3>
                <div className="flex justify-between text-sm text-slate-400 mt-4 pt-4 border-t border-slate-800">
                  <span>Capacity: {room.capacity}</span>
                  <span className="font-semibold text-emerald-400">₹{room.defaultPrice}/mo</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center glass-dark rounded-2xl border border-slate-800">
              <Key className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No rooms added yet. Create your first room to get started.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Room' : 'Add New Room'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Room Number</label>
            <input required type="text" value={formData.roomNumber} onChange={(e) => setFormData({...formData, roomNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Capacity (Beds)</label>
            <input required type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Default Rent Price (₹)</label>
            <input required type="number" min="0" value={formData.defaultPrice} onChange={(e) => setFormData({...formData, defaultPrice: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <button type="submit" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors">
            {editingId ? 'Update Room' : 'Save Room'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default RoomsPage;
