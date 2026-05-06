import React from 'react';
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: User, label: 'Profile Information', sub: 'Update your email and contact details', color: 'text-blue-400' },
        { icon: Shield, label: 'Security', sub: 'Password and authentication', color: 'text-emerald-400' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', sub: 'Manage your alerts and sounds', color: 'text-amber-400' },
        { icon: HelpCircle, label: 'Support', sub: 'Contact our 24/7 help desk', color: 'text-indigo-400' }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
          <p className="text-slate-400 mt-1">Manage your account and app preferences.</p>
        </div>
      </div>

      <div className="glass-dark rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl">
        <div className="p-8 flex items-center gap-6 bg-gradient-to-r from-blue-600/10 to-transparent">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user.email}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-2">
              Hostel Owner
            </span>
          </div>
        </div>

        <div className="p-8 pt-0 space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{section.title}</h4>
              <div className="grid grid-cols-1 gap-3">
                {section.items.map((item, i) => (
                  <button key={i} className="flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl bg-slate-800 ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.label}</div>
                        <div className="text-xs text-slate-500">{item.sub}</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 p-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black transition-all"
            >
              <LogOut size={18} /> Logout from Account
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
        HostelPay Hub v1.4.2 • Enterprise Edition
      </div>
    </div>
  );
};

export default SettingsPage;
