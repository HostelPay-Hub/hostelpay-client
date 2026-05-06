import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import { Plus, Trash2, Megaphone, Calendar, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

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

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Megaphone className="text-blue-500" /> Digital Notice Board
          </h2>
          <p className="text-slate-400 mt-1">Broadcast announcements to all residents instantly.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] font-bold"
        >
          <Plus size={20} /> Create Notice
        </button>
      </div>

      {notices?.length === 0 ? (
        <div className="glass-dark rounded-[2.5rem] border-2 border-dashed border-slate-800 p-20 text-center">
          <AlertCircle size={64} className="mx-auto text-slate-700 mb-6" />
          <h3 className="text-2xl font-black text-white mb-2">Silence is Golden?</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Post your first announcement to keep your residents informed and engaged.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices?.map((notice) => (
            <div key={notice.id} className="glass-dark rounded-3xl border border-slate-800 p-8 flex flex-col h-full hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600/50"></div>
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-black text-white leading-tight group-hover:text-blue-400 transition-colors">{notice.title}</h3>
                <button 
                  onClick={() => deleteMutation.mutate(notice.id)}
                  className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed">
                {notice.content}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 mt-auto">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Calendar size={14} className="text-blue-500" />
                  <span>Posted {new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
                {notice.expiryDate && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    <Clock size={12} />
                    <span>Expires {new Date(notice.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-dark border border-slate-800 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
            
            <h2 className="text-3xl font-black text-white mb-8 relative z-10">New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                <input 
                  type="text" required
                  placeholder="e.g. Water Maintenance, Holiday Notice"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Details</label>
                <textarea 
                  required
                  placeholder="Describe the announcement in detail..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  rows="4"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Expiry Date</label>
                <input 
                  type="date"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-900 text-slate-400 rounded-2xl hover:bg-slate-800 transition-colors font-bold"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all font-black shadow-lg shadow-blue-500/20"
                >
                  Publish
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
