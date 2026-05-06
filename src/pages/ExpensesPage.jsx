import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import { Plus, Trash2, IndianRupee, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const ExpensesPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Maintenance',
    expenseDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => api.get('/api/expenses').then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (newExpense) => api.post('/api/expenses', newExpense),
    onMutate: async (newExpense) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] });
      const previousExpenses = queryClient.getQueryData(['expenses']);
      
      const optimisticExpense = { 
        ...newExpense, 
        id: Math.random().toString(), 
        amount: parseFloat(newExpense.amount),
        isOptimistic: true 
      };

      queryClient.setQueryData(['expenses'], (old) => [optimisticExpense, ...(old || [])]);
      return { previousExpenses };
    },
    onError: (err, newExpense, context) => {
      queryClient.setQueryData(['expenses'], context.previousExpenses);
      toast.error('Failed to log expense');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
    onSuccess: () => {
      toast.success('Expense logged successfully');
      setIsModalOpen(false);
      setFormData({ title: '', amount: '', category: 'Maintenance', expenseDate: new Date().toISOString().split('T')[0], description: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      queryClient.invalidateQueries(['dashboard-metrics']);
      toast.success('Expense deleted');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-center">Loading expenses...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Expenses</h1>
          <p className="text-gray-500">Track your maintenance, utility, and grocery costs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Total Expenses (Month)</div>
          <div className="text-2xl font-bold text-red-600 flex items-center">
            <IndianRupee size={20} />
            {expenses?.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses?.map((expense) => (
              <tr key={expense.id} className={`hover:bg-gray-50 transition-colors ${expense.isOptimistic ? 'opacity-50 italic' : ''}`}>
                <td className="px-6 py-4 text-sm text-gray-600">{expense.expenseDate}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{expense.title}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{expense.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => deleteMutation.mutate(expense.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Log New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expense Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. Electricity Bill"
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Maintenance</option>
                    <option>Utilities</option>
                    <option>Groceries</option>
                    <option>Salary</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={formData.expenseDate}
                  onChange={e => setFormData({...formData, expenseDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
