import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, X, AlertCircle, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'upload'
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let scannerInstance = null;

    if (activeTab === 'camera') {
      setCameraError('');
      setIsScanning(true);

      const elementId = 'html5qr-code-full-region';
      const qrScanner = new Html5Qrcode(elementId);
      html5QrcodeRef.current = qrScanner;
      scannerInstance = qrScanner;

      const config = {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1.0
      };

      qrScanner.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // Success callback
          stopScanner(qrScanner);
          if (onScanSuccess) {
            onScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          // Scanning in progress... silent ignore per frame
        }
      ).catch((err) => {
        setIsScanning(false);
        setCameraError(
          err?.message || 'Unable to access device camera. Please grant camera permission or use the file upload option.'
        );
      });
    }

    return () => {
      if (scannerInstance) {
        stopScanner(scannerInstance);
      }
    };
  }, [isOpen, activeTab]);

  const stopScanner = (instance) => {
    const scanner = instance || html5QrcodeRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) {
          scanner.stop().then(() => {
            scanner.clear();
          }).catch(() => {
            scanner.clear();
          });
        } else {
          scanner.clear();
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      html5QrcodeRef.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadError('');
    setUploadedFileName(file.name);
    setIsProcessingFile(true);

    try {
      const html5Qrcode = new Html5Qrcode('html5qr-code-file-region');
      const decodedText = await html5Qrcode.scanFile(file, true);
      html5Qrcode.clear();
      setIsProcessingFile(false);
      
      handleClose();
      if (onScanSuccess) {
        onScanSuccess(decodedText);
      }
    } catch (err) {
      setIsProcessingFile(false);
      setUploadError('Could not decode QR from image. Please ensure the QR code is clear or try another file.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden font-sans border border-slate-200">
        
        {/* MODAL HEADER */}
        <div className="bg-[#046a38] p-4 px-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">Scan Farmer QR Token</h3>
          </div>
          <button 
            type="button" 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 p-1.5 gap-1">
          <button
            onClick={() => {
              stopScanner();
              setActiveTab('camera');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'camera' 
                ? 'bg-white text-[#046a38] shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Live Camera Scanner
          </button>
          
          <button
            onClick={() => {
              stopScanner();
              setActiveTab('upload');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload' 
                ? 'bg-white text-[#046a38] shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload QR File
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 space-y-4">
          
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-4 text-center">
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden min-h-[260px] flex items-center justify-center border-2 border-slate-800 shadow-inner">
                <div id="html5qr-code-full-region" className="w-full max-w-[280px]"></div>
                
                {cameraError && (
                  <div className="p-4 text-center text-white space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                    <p className="text-xs font-medium text-slate-200 leading-relaxed">{cameraError}</p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs backdrop-blur-xs transition-colors"
                    >
                      Switch to File Upload
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Position the farmer's digital QR token within the square viewport.
              </p>
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div id="html5qr-code-file-region" className="hidden"></div>

              <div className="border-2 border-dashed border-slate-300 hover:border-[#046a38] rounded-2xl p-6 text-center bg-slate-50/50 transition-all flex flex-col items-center justify-center">
                <input
                  type="file"
                  id="modal-qr-file-input"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-[#046a38] flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">Select QR Image File</h4>
                <p className="text-xs text-slate-500 mb-4 font-medium max-w-xs">
                  Upload a PNG, JPG, JPEG, or WebP screenshot of the farmer's token.
                </p>

                <label
                  htmlFor="modal-qr-file-input"
                  className="cursor-pointer px-5 py-2.5 bg-[#046a38] hover:bg-[#03522c] text-white font-bold rounded-xl text-xs shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" /> Choose File
                </label>

                {uploadedFileName && (
                  <p className="mt-3 text-xs font-mono text-[#046a38] bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                    Selected: {uploadedFileName}
                  </p>
                )}
              </div>

              {isProcessingFile && (
                <div className="text-center py-2 text-xs font-bold text-[#046a38] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Decoding QR Code...
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* FOOTER BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default QrScannerModal;
