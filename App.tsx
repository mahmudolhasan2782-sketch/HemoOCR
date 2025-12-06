import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { extractTextFromImage } from './services/geminiService';
import { ProcessingStatus } from './types';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus(ProcessingStatus.IDLE);
    setExtractedText('');
    setErrorMsg('');
  };

  const clearFile = () => {
    setFile(null);
    setExtractedText('');
    setStatus(ProcessingStatus.IDLE);
    setErrorMsg('');
  };

  const handleProcess = async () => {
    if (!file) return;

    setStatus(ProcessingStatus.PROCESSING);
    setErrorMsg('');

    try {
      const text = await extractTextFromImage(file);
      setExtractedText(text);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(ProcessingStatus.ERROR);
      setErrorMsg('দুঃখিত, টেক্সট উদ্ধার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন। (Failed to process file)');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-slate-100 flex flex-col font-sans overflow-x-hidden">
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
          
          <div className="w-full text-center mb-8">
            <h2 className="text-3xl md:text-4xl text-white font-bold mb-3 bengali-text drop-shadow-md">
              বাংলা হাতের লেখার নির্ভুল সমাধান
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-light">
              Specialized for High-Accuracy Bengali Handwriting OCR
            </p>
          </div>

          <FileUpload 
            onFileSelect={handleFileSelect} 
            selectedFile={file} 
            clearFile={clearFile}
            disabled={status === ProcessingStatus.PROCESSING}
          />

          {errorMsg && (
            <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-400/50 rounded-2xl flex items-center gap-3 text-white max-w-2xl animate-shake">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p className="font-medium bengali-text">{errorMsg}</p>
            </div>
          )}

          {file && status !== ProcessingStatus.SUCCESS && status !== ProcessingStatus.PROCESSING && (
            <button
              onClick={handleProcess}
              className="mt-8 group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-bold text-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 bengali-text">
                <Sparkles className="w-6 h-6" />
                টেক্সট রূপান্তর করুন
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          )}

          {status === ProcessingStatus.PROCESSING && (
            <div className="mt-12 flex flex-col items-center animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full"></div>
                <Loader2 className="w-16 h-16 text-purple-400 animate-spin relative z-10" />
              </div>
              <p className="mt-6 text-xl text-white font-medium bengali-text tracking-wide">
                অক্ষরবিদ বাংলা লেখা বিশ্লেষণ করছেন...
              </p>
            </div>
          )}

          {status === ProcessingStatus.SUCCESS && extractedText && (
            <ResultDisplay text={extractedText} />
          )}

        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
