import React, { useState, useEffect } from 'react';

const CloudinaryUploadWidget = ({ onUploadSuccess, folder = 'hostelpay_docs' }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Cloudinary script if not already loaded
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, []);

  const openWidget = () => {
    if (!loaded) return;

    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'demo', // USER: Replace with your Cloudinary Cloud Name
        uploadPreset: 'ml_default', // USER: Replace with your Unsigned Upload Preset
        folder: folder,
        sources: ['local', 'camera', 'url'],
        multiple: false,
        theme: 'minimal',
        colors: {
          action: '#4F46E5',
          active: '#4F46E5'
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log('Done! Here is the image info: ', result.info);
          onUploadSuccess(result.info.secure_url);
        }
      }
    );
    myWidget.open();
  };

  return (
    <button
      type="button"
      onClick={openWidget}
      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all border border-gray-200 font-medium"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Upload Document
    </button>
  );
};

export default CloudinaryUploadWidget;
