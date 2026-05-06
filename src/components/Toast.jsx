import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20';
  const textColor = type === 'success' ? 'text-emerald-400' : 'text-red-400';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center w-full max-w-sm p-4 rounded-xl glass-dark border shadow-2xl ${bgColor}`}>
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${bgColor} ${textColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-medium text-white">{message}</div>
      <button
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
