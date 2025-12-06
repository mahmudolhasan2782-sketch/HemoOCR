import React, { useCallback } from 'react';
import { Upload, FileText, Image as ImageIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  clearFile: () => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, clearFile, disabled }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect, disabled]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (selectedFile) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 shadow-xl flex items-center justify-between animate-fade-in">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-lg">
            {selectedFile.type.includes('image') ? (
              <ImageIcon className="text-white w-8 h-8" />
            ) : (
              <FileText className="text-white w-8 h-8" />
            )}
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-lg truncate max-w-[200px] md:max-w-xs">
              {selectedFile.name}
            </p>
            <p className="text-white/70 text-sm">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            onClick={clearFile}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="text-white w-6 h-6" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-2xl mx-auto mt-8 p-10 border-4 border-dashed border-white/30 rounded-3xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDragLeave={preventDefaults}
      onDrop={handleDrop}
      onClick={() => !disabled && document.getElementById('fileInput')?.click()}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleChange}
        accept="image/png, image/jpeg, image/jpg, application/pdf"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 bengali-text">
          ফাইল আপলোড করুন
        </h3>
        <p className="text-white/80 text-lg mb-4">
          Click to browse or drag & drop
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {['JPG', 'PNG', 'PDF'].map((ext) => (
            <span key={ext} className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white border border-white/20">
              {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;