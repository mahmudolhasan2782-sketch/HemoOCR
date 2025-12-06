import React from 'react';
import { Download, Copy, Check, FileText, File as FileIcon } from 'lucide-react';

interface ResultDisplayProps {
  text: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadDocx = () => {
    // Simple HTML based word export for client-side compatibility
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'> " +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + `<div style="font-family: 'Hind Siliguri', sans-serif; white-space: pre-wrap;">${text.replace(/\n/g, "<br>")}</div>` + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'extracted_text.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const downloadPDF = () => {
    // Use window.print approach for robust PDF saving without large libraries
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Extracted Text - The Foremost Paleographer</title>
            <style>
              body { font-family: 'Hind Siliguri', sans-serif; padding: 40px; line-height: 1.6; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          </head>
          <body>
            <h1>Extracted Text</h1>
            <pre>${text}</pre>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-slide-up">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-gray-700 font-bold text-lg flex items-center gap-2 bengali-text">
             <Check className="text-green-500 w-5 h-5" />
             শনাক্তকৃত টেক্সট (Detected Text)
          </h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors px-3 py-1 rounded-lg hover:bg-gray-200"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        
        <div className="p-6 md:p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
          <pre className="whitespace-pre-wrap text-gray-800 text-lg leading-relaxed font-medium bengali-text">
            {text}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 md:p-6 flex flex-wrap gap-4 justify-center md:justify-end border-t">
          <button
            onClick={() => downloadText('extracted.txt', text)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm"
          >
            <FileText className="w-5 h-5" />
            TXT
          </button>
          <button
            onClick={downloadDocx}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
          >
            <FileIcon className="w-5 h-5" />
            DOCX
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 rounded-xl text-white font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30"
          >
            <Download className="w-5 h-5" />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;