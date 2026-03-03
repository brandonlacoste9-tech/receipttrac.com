import React, { useState } from 'react';

function ReceiptEngine() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    // Mock file processing - in production would call backend API
    const processedFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'processing'
    }));
    
    setUploadedFiles([...uploadedFiles, ...processedFiles]);
    
    // Simulate processing
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => ({
        ...f,
        status: 'complete',
        data: {
          vendor: 'Sample Vendor',
          total: '$' + (Math.random() * 500).toFixed(2),
          date: new Date().toLocaleDateString(),
          items: ['Item 1', 'Item 2', 'Item 3']
        }
      })));
    }, 2000);
  };

  return (
    <div className="leather-card animate-slide-up">
      <h2 className="text-3xl font-cormorant mb-6 text-ferrari-red">Receipt Engine</h2>
      
      <div
        className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="text-ferrari-red text-5xl mb-4">📄</div>
        <h3 className="text-2xl font-cormorant mb-2">Drop receipts here</h3>
        <p className="text-off-white/60 font-inter">or click to browse</p>
        <p className="text-off-white/40 text-sm mt-2 font-inter">Supports: JPG, PNG, PDF</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-xl font-outfit text-off-white">Processed Receipts</h3>
          {uploadedFiles.map((file, idx) => (
            <div key={idx} className="bg-leather-grey/50 p-4 rounded border border-ferrari-red/30 stitched-border">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-outfit text-off-white">{file.name}</div>
                  <div className="text-sm text-off-white/60 font-inter mt-1">
                    Status: <span className={file.status === 'complete' ? 'text-green-500' : 'text-ferrari-red'}>{file.status}</span>
                  </div>
                  {file.data && (
                    <div className="mt-3 text-sm font-inter">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-off-white/60">Vendor:</span> <span className="text-off-white">{file.data.vendor}</span></div>
                        <div><span className="text-off-white/60">Total:</span> <span className="text-ferrari-red font-bold">{file.data.total}</span></div>
                        <div><span className="text-off-white/60">Date:</span> <span className="text-off-white">{file.data.date}</span></div>
                        <div><span className="text-off-white/60">Items:</span> <span className="text-off-white">{file.data.items.length}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReceiptEngine;
