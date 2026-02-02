import React from 'react';
import { VFile } from '@/context/FileSystemContext';
import { ExternalLink, Download } from 'lucide-react';

interface PreviewAppProps {
  file?: VFile | null;
}

export const PreviewToolbar: React.FC<{ file: VFile }> = ({ file }) => {
  const handleDownload = () => {
    if (!file.content) return;
    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    if (!file.content) return;
    window.open(file.content, '_blank');
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleOpenExternal}
        title="Abrir en otra pestaña"
        className="p-1.5 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] font-medium"
      >
        <ExternalLink size={14} />
        <span>Abrir</span>
      </button>
      <button
        onClick={handleDownload}
        title="Descargar archivo"
        className="p-1.5 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] font-medium"
      >
        <Download size={14} />
        <span>Descargar</span>
      </button>
    </div>
  );
};

const PreviewApp: React.FC<PreviewAppProps> = ({ file }) => {
  if (!file || !file.content) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#1e1e1e] text-gray-500 flex-col gap-2">
        <span className="text-4xl">📄</span>
        <p>No file selected</p>
      </div>
    );
  }

  const isPdf = file.name.toLowerCase().endsWith('.pdf');
  const isImage = /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(file.name);

  return (
    <div className="h-full w-full bg-[#1e1e1e] flex flex-col">
      <div className="flex-1 overflow-hidden relative flex items-center justify-center">
        {isPdf && (
          <iframe
            src={`${file.content}#toolbar=0`}
            className="w-full h-full border-none bg-white"
            title={file.name}
          />
        )}
        {isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.content}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
          />
        )}
        {!isPdf && !isImage && (
          <div className="text-center text-gray-400">
            <p className="mb-2">Preview not available for this file type.</p>
            <p className="text-xs font-mono">{file.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewApp;
