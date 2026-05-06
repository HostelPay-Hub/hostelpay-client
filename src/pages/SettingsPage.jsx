import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Home, Link, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hostelAPI } from '../api/endpoints';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hostelData, setHostelData] = useState({
    name: '',
    address: '',
    whatsappGroupUrl: ''
  });

  useEffect(() => {
    fetchHostel();
  }, []);

  const fetchHostel = async () => {
    try {
      const res = await hostelAPI.getMe();
      setHostelData({
        name: res.data.name || '',
        address: res.data.address || '',
        whatsappGroupUrl: res.data.whatsappGroupUrl || ''
      });
    } catch (err) {
      toast.error('Failed to load hostel settings');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hostelAPI.updateMe(hostelData);
      toast.success('Settings updated successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (fetching) return <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing Cloud Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
          <p className="text-slate-400 mt-1">Manage your account and hostel community.</p>
        </div>
      </div>

      <div className="glass-dark rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl">
        {/* User Header */}
        <div className="p-8 flex items-center gap-6 bg-gradient-to-r from-blue-600/10 to-transparent border-b border-slate-800/50">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user.email}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-2">
              {user.role === 'STUDENT' ? 'Hostel Resident' : 'Hostel Owner'}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Hostel Configuration (Only for Owners) */}
          {user.role !== 'STUDENT' && (
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hostel Configuration</h4>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">Hostel Name</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={hostelData.name}
                      onChange={(e) => setHostelData({...hostelData, name: e.target.value})}
                      className="input-field pl-12" 
                      placeholder="e.g. Royal Residency"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">Hostel Community Link (WhatsApp)</label>
                  <div className="relative">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="url" 
                      value={hostelData.whatsappGroupUrl}
                      onChange={(e) => setHostelData({...hostelData, whatsappGroupUrl: e.target.value})}
                      className="input-field pl-12" 
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">Physical Address</label>
                  <textarea 
                    value={hostelData.address}
                    onChange={(e) => setHostelData({...hostelData, address: e.target.value})}
                    className="input-field min-h-[100px] py-4"
                    placeholder="Enter full address..."
                  />
                </div>

                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 px-8"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="h-px bg-slate-800" />

          {/* Preferences Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Account & Security</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 rounded-2xl transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Security</div>
                    <div className="text-xs text-slate-500">Change password & 2FA</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all" />
              </button>

              <button className="flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 rounded-2xl transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400">
                    <Bell size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Notifications</div>
                    <div className="text-xs text-slate-500">Email & push alerts</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all" />
              </button>
            </div>
          </div>

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
        HostelPay Hub v1.5.0 • Build 2026.05.06-REDPLOY-SYNC
      </div>
    </div>
  );
};

export default SettingsPage;
