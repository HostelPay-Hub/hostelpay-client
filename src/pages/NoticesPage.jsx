import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import { Plus, Trash2, Megaphone, Calendar, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const NoticesPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    expiryDate: ''
  });

  const { data: notices, isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: () => api.get('/api/notices').then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (newNotice) => api.post('/api/notices', newNotice),
    onSuccess: () => {
      queryClient.invalidateQueries(['notices']);
      toast.success('Notice published successfully');
      setIsModalOpen(false);
      setFormData({ title: '', content: '', expiryDate: '' });
    },
    onError: () => toast.error('Failed to publish notice')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/notices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['notices']);
      toast.success('Notice removed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-center">Loading notices...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Megaphone className="text-indigo-600" /> Digital Notice Board
          </h1>
          <p className="text-gray-500">Broadcast announcements to all residents instantly</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          <Plus size={20} /> Create Notice
        </button>
      </div>

      {notices?.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Notices</h3>
          <p className="text-gray-500">Post your first announcement to reach your residents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices?.map((notice) => (
            <div key={notice.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{notice.title}</h3>
                <button 
                  onClick={() => deleteMutation.mutate(notice.id)}
                  className="text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                {notice.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} />
                  <span>Posted {new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
                {notice.expiryDate && (
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                    <Clock size={14} />
                    <span>Expires {new Date(notice.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Notice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. Water Maintenance, Holiday Notice"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea 
                  required
                  placeholder="Describe the announcement in detail..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  rows="4"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-lg shadow-indigo-100"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesPage;
