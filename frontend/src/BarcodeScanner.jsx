import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';

const BarcodeScanner = ({ onScanResult, onClose }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        qrbox: { width: 250, height: 100 }, 
        fps: 10,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText, decodedResult) => {
        // Handle on success
        scanner.clear();
        onScanResult(decodedText);
      },
      (err) => {
        // Handle on error
        // setError(err?.message || 'Scanning...');
      }
    );

    return () => {
      // Cleanup on unmount
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScanResult]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="leather-card relative w-full max-w-md p-6 border-red-500/40">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 transition-colors z-10"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 uppercase tracking-widest text-red-500/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          <Camera size={20} /> VOUCHER BARCODE SCAN
        </h2>
        
        <div className="w-full bg-[#0a0a0a] rounded overflow-hidden border border-red-500/10">
          <div id="reader" className="w-full"></div>
        </div>
        
        {error && (
          <p className="text-red-400 text-xs text-center mt-4 tracking-widest uppercase">{error}</p>
        )}
        <p className="gold-label text-center text-[10px] opacity-40 mt-6 tracking-[0.2em] uppercase">
          ALIGN BARCODE WITH THE FRAME
        </p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
