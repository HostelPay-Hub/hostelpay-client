import React from 'react';
import { Ban, IndianRupee, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionExpiredPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full glass-dark p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl text-center relative overflow-hidden">
        {/* Abstract background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-600/20 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
            <Ban size={48} className="text-rose-500" />
          </div>

          <h1 className="text-3xl font-black mb-4 tracking-tight">Plan Expired</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your monthly subscription for <span className="text-white font-bold">HostelPay Hub</span> has ended. Access to your ledger and student data is temporarily locked.
          </p>

          <div className="space-y-4 mb-10 text-left">
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <IndianRupee className="text-emerald-500" />
              <div>
                <div className="text-sm font-bold">₹499 / Month</div>
                <div className="text-xs text-slate-500">Unlimited students & rooms</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <MessageCircle className="text-blue-500" />
              <div>
                <div className="text-sm font-bold">Priority Support</div>
                <div className="text-xs text-slate-500">Direct WhatsApp support line</div>
              </div>
            </div>
          </div>

          <a 
            href="https://wa.me/91XXXXXXXXXX?text=Hi!%20I%20want%20to%20renew%20my%20HostelPay%20Hub%20subscription." 
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 mb-4"
          >
            Renew via WhatsApp
          </a>

          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold mx-auto"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredPage;
