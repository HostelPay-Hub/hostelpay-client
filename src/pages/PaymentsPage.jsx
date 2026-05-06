import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, IndianRupee, Trash2 } from 'lucide-react';

const PaymentsPage = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    referenceNotes: ''
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments'],
    queryFn: () => api.get('/api/payments').then(res => res.data)
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/api/students').then(res => res.data)
  });

  const recordMutation = useMutation({
    mutationFn: (newPayment) => api.post('/api/payments', newPayment),
    onMutate: async (newPayment) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['payments'] });
      const previousPayments = queryClient.getQueryData(['payments']);
      
      const student = students?.find(s => s.id === newPayment.studentId);
      const optimisticPayment = { 
        ...newPayment, 
        id: Math.random().toString(), 
        studentName: student?.fullName || 'Processing...',
        isOptimistic: true 
      };

      queryClient.setQueryData(['payments'], (old) => [optimisticPayment, ...(old || [])]);
      return { previousPayments };
    },
    onError: (err, newPayment, context) => {
      queryClient.setQueryData(['payments'], context.previousPayments);
      setError('Failed to record payment. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
    onSuccess: () => {
      setIsModalOpen(false);
      setFormData({ ...formData, amount: '', referenceNotes: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/payments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    recordMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this payment record? This action will be audited.')) {
      deleteMutation.mutate(id);
    }
  };

  const getMethodBadge = (method) => {
    const styles = {
      UPI: 'bg-purple-500/20 text-purple-400',
      CASH: 'bg-emerald-500/20 text-emerald-400',
      BANK_TRANSFER: 'bg-blue-500/20 text-blue-400'
    };
    return <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${styles[method]}`}>{method.replace('_', ' ')}</span>;
  };

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Payments Ledger</h2>
          <p className="text-slate-400 mt-1">Track all incoming rent and fees.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Record Payment
        </button>
      </div>

      <div className="glass-dark rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {isLoadingPayments ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Notes</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {payments?.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className={`hover:bg-slate-800/30 transition-colors ${payment.isOptimistic ? 'opacity-50 grayscale' : ''}`}>
                      <td className="p-4 text-sm">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="p-4 font-medium text-white">{payment.studentName}</td>
                      <td className="p-4 text-emerald-400 font-bold">₹{payment.amount}</td>
                      <td className="p-4">{getMethodBadge(payment.paymentMethod)}</td>
                      <td className="p-4 text-sm text-slate-500">{payment.referenceNotes || '-'}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(payment.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      <IndianRupee className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      No payments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Payment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Student</label>
            <select required value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
              <option value="">-- Select Student --</option>
              {students?.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Amount (₹)</label>
            <input required type="number" min="1" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
              <input required type="date" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Method</label>
              <select required value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Reference / Notes</label>
            <input type="text" placeholder="e.g. UTR Number, Rent for May" value={formData.referenceNotes} onChange={(e) => setFormData({...formData, referenceNotes: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <button type="submit" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors">
            Record Payment
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
