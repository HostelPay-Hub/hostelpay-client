import React from 'react';

const StatsCard = ({ title, value, icon, subtitle, color = 'blue' }) => {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/20 text-rose-400',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className={`relative overflow-hidden rounded-2xl glass-dark border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${selectedColor.split(' ')[2]}`}>
      {/* Background Gradient Blob */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br opacity-50 blur-2xl ${selectedColor.split(' ')[0]} ${selectedColor.split(' ')[1]}`} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="mt-2 text-xs font-medium text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 ${selectedColor.split(' ')[3]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
