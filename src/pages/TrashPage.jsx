import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosClient';
import { Trash2, RotateCcw, AlertCircle, User, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const TrashPage = () => {
  const queryClient = useQueryClient();

  // In a real implementation, you'd have an endpoint that returns ONLY deleted records
  // For this demo, we'll assume there's a param ?deleted=true
  const { data: deletedStudents, isLoading: loadingStudents } = useQuery({
    queryKey: ['deleted-students'],
    queryFn: () => api.get('/api/students?deleted=true').then(res => res.data)
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => api.put(`/api/students/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries(['deleted-students']);
      queryClient.invalidateQueries(['students']);
      toast.success('Record restored successfully');
    }
  });

  if (loadingStudents) return <div className="p-8 text-center">Loading trash...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trash2 className="text-rose-500" /> Recovery Vault
        </h1>
        <p className="text-slate-400 mt-1">Restore records that were recently deleted.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-dark rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Deleted Students</h3>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-500 text-xs uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Deleted On</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {deletedStudents?.length > 0 ? (
                deletedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                        {student.fullName.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{student.fullName}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(student.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => restoreMutation.mutate(student.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-all text-xs font-bold border border-indigo-500/30"
                      >
                        <RotateCcw size={14} /> Restore
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-12 text-center text-slate-600 italic">
                    No deleted records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-4 items-start">
        <AlertCircle className="text-amber-500 shrink-0" />
        <p className="text-xs text-amber-200/70 leading-relaxed">
          Records in the recovery vault are kept for 30 days before being permanently purged from the system. Audit logs of all deletions and restorations are maintained for security compliance.
        </p>
      </div>
    </div>
  );
};

export default TrashPage;
