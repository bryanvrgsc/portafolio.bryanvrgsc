"use client";

import React, { useState } from 'react';
import { Folder, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinderFile {
  name: string;
  type: 'pdf' | 'archive' | 'text' | 'image' | 'folder';
  size: string;
}

const FinderApp = React.memo(() => {
  const [currentFolder, setCurrentFolder] = useState('Recientes');

  const folders = [
    { name: 'Recientes', icon: <LayoutGrid size={16} /> },
    { name: 'Documentos', icon: <Folder size={16} /> },
    { name: 'Proyectos', icon: <Folder size={16} /> },
    { name: 'Descargas', icon: <Folder size={16} /> },
  ];

  const files: Record<string, FinderFile[]> = {
    'Recientes': [
      { name: 'CV_Bryan_Vargas.pdf', type: 'pdf', size: '1.2 MB' },
      { name: 'Proyecto_Final.zip', type: 'archive', size: '45 MB' },
    ],
    'Documentos': [
      { name: 'Certificado_React.pdf', type: 'pdf', size: '800 KB' },
      { name: 'Notas_Reunion.txt', type: 'text', size: '12 KB' },
    ],
    'Proyectos': [
      { name: 'Portafolio_v2', type: 'folder', size: '--' },
      { name: 'E-commerce_API', type: 'folder', size: '--' },
    ],
    'Descargas': [
      { name: 'wallpaper_macos.jpg', type: 'image', size: '2.4 MB' },
    ]
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-44 bg-black/20 backdrop-blur-md border-r border-white/5 p-3 flex flex-col gap-1">
        <div className="text-[10px] font-bold text-white/30 px-2 mb-2 uppercase tracking-wider">Favoritos</div>
        {folders.map(folder => (
          <button
            key={folder.name}
            onClick={() => setCurrentFolder(folder.name)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors",
              currentFolder === folder.name ? "bg-white/10" : "hover:bg-white/5 text-white/70"
            )}
          >
            <span className="text-blue-400">{folder.icon}</span>
            {folder.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <ChevronLeft size={18} className="text-white/20" />
              <ChevronRight size={18} className="text-white/20" />
            </div>
            <span className="text-[13px] font-bold">{currentFolder}</span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <LayoutGrid size={16} />
            <List size={16} />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 p-4 grid grid-cols-4 content-start gap-4 overflow-auto">
          {files[currentFolder]?.map((file, i) => (
            <div key={i} className="flex flex-col items-center gap-1 group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
              <div className="text-4xl">
                {file.type === 'pdf' ? '📄' : file.type === 'folder' ? '📂' : file.type === 'image' ? '🖼️' : '📁'}
              </div>
              <span className="text-[11px] text-center break-all line-clamp-2">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default FinderApp;
