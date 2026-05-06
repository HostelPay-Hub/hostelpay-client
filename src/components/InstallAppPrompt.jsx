import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallAppPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install button
      setShowPrompt(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl z-[100] flex items-center justify-between animate-bounce-subtle border border-indigo-400">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-2 rounded-xl">
          <Download size={24} />
        </div>
        <div>
          <h4 className="font-bold text-sm">Install HostelPay Hub</h4>
          <p className="text-xs text-indigo-100">Access your ledger faster from home screen</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={handleInstallClick}
          className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors"
        >
          Install
        </button>
        <button 
          onClick={() => setShowPrompt(false)}
          className="p-1 hover:bg-white/10 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default InstallAppPrompt;
