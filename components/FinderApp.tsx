"use client";

import React, { useState, useMemo } from 'react';
import {
  Folder, ChevronLeft, ChevronRight, LayoutGrid, List, Search,
  Share, Tag, MoreHorizontal, Clock, Users, Airplay, Monitor,
  FileText, Download, Video, Music, ImageIcon, Cloud, ChevronDown, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFileSystem } from '@/context/FileSystemContext';
import { AnimatePresence } from 'framer-motion';
import ContextMenu from './ContextMenu';

interface SidebarItem {
  id: string; // internal id or special key
  name: string;
  icon: React.ReactNode;
  cloud?: boolean;
  badge?: string;
  specialPath?: string | null; // null for root, or specific ID
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  hideTitle?: boolean;
}

interface FinderProps {
  initialPath?: string | null;
}

const FinderApp = React.memo(({ initialPath }: FinderProps) => {
  const { fs, addFolder, deleteFile } = useFileSystem();
  
  // Helper to resolve initial folder
  const resolveInitialFolder = (path?: string | null) => {
    if (!path || path === 'root') return { id: null, name: 'Escritorio' }; // Default to root
    if (path === 'desktop') return { id: 'desktop', name: 'Escritorio' }; // Explicit desktop folder
    
    const folder = fs.find(f => f.id === path);
    return folder ? { id: folder.id, name: folder.name } : { id: null, name: 'Escritorio' };
  };

  // Navigation State
  const [history, setHistory] = useState<Array<{ id: string | null; name: string }>>([resolveInitialFolder(initialPath)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // React to external navigation requests (e.g. from Desktop double-click)
  React.useEffect(() => {
    if (initialPath) {
      const target = resolveInitialFolder(initialPath);
      // Avoid duplicate navigation if already there
      const current = history[historyIndex];
      if (current.id !== target.id) {
        navigateTo(target.id, target.name);
      }
    }
  }, [initialPath]); // eslint-disable-line react-hooks/exhaustive-deps

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetId?: string } | null>(null);

  const currentFolder = history[historyIndex];

  // Derived state: Files in current folder (filtered by search)
  const currentFiles = useMemo(() => {
    let filtered: typeof fs = [];

    // Handle Virtual Folders & Special Views
    if (currentFolder.id === 'recents') {
      // Show all files (excluding folders for simplicity, or all items)
      filtered = fs.filter(f => f.type !== 'folder'); 
    } else if (currentFolder.id === 'applications') {
      // Mock applications
      filtered = [
        { id: 'app-safari', name: 'Safari', type: 'app', parentId: 'applications' },
        { id: 'app-terminal', name: 'Terminal', type: 'app', parentId: 'applications' },
        { id: 'app-mail', name: 'Mail', type: 'app', parentId: 'applications' },
      ] as any;
    } else if (currentFolder.id === 'desktop') {
      // Desktop Folder: STRICTLY show files inside the 'desktop' folder
      filtered = fs.filter(f => f.parentId === 'desktop');
    } else if (currentFolder.id === null) {
      // User Root (bryanvargas): Show system folders (Documents, Downloads, Desktop folder itself)
      filtered = fs.filter(f => f.parentId === null);
    } else {
      // Standard Folder Navigation
      filtered = fs.filter(f => f.parentId === currentFolder.id);
    }

    if (searchQuery) {
      filtered = filtered.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [fs, currentFolder, searchQuery]);

  // Dynamic path building
  const breadcrumbs = useMemo(() => {
    // Handle Virtual Folders first (Recents, Apps, AirDrop don't have a path)
    if (['recents', 'applications', 'airdrop'].includes(currentFolder.id || '')) {
        return [{ id: currentFolder.id, name: currentFolder.name }];
    }

    const path = [];
    
    // If we are explicitly at the 'desktop' folder (ID 'desktop'), add it to the path.
    // If we are at root (ID null), we treat it as Desktop in this specific view logic if desired,
    // BUT our new file system has a real 'desktop' folder ID.
    // So 'null' is technically the User Home ('bryanvargas').
    
    let currId: string | null = currentFolder.id;
    
    // If current is NULL, we are at User Home.
    // If current is 'desktop', we are at Desktop.
    
    // Build path upwards
    let depth = 0;
    while (currId !== null && depth < 10) {
      // eslint-disable-next-line no-loop-func
      const folder = fs.find(f => f.id === currId);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currId = folder.parentId;
      } else {
        break;
      }
      depth++;
    }

    // Base path always starts at User Home
    return [{ id: null, name: 'bryanvargas' }, ...path];
  }, [fs, currentFolder]);

  const navigateTo = (folderId: string | null, folderName: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ id: folderId, name: folderName });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedIds([]);
    setSearchQuery('');
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedIds([]);
      setSearchQuery('');
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedIds([]);
      setSearchQuery('');
    }
  };

  const handleSidebarClick = (item: SidebarItem) => {
    // Navigate directly to the item's ID
    // If it's a "real" folder in fs, it works.
    // If it's a "virtual" folder (recents, applications), currentFiles logic handles it.
    // If it's 'desktop', logic handles it.
    
    if (item.id === 'desktop') {
      navigateTo(null, 'Escritorio');
    } else {
      navigateTo(item.id, item.name);
    }
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    addFolder(currentFolder.id);
  };

  const handleContextMenu = (e: React.MouseEvent, fileId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, targetId: fileId });
    if (fileId) {
      setSelectedIds([fileId]);
    } else {
      setSelectedIds([]);
    }
  };

  const contextMenuItems = useMemo(() => {
    if (!contextMenu) return [];
    
    const baseItems = [
      { label: 'Nueva Carpeta', onClick: () => addFolder(currentFolder.id) },
      { label: 'Obtener información', onClick: () => {} },
    ];

    if (contextMenu.targetId) {
      const target = fs.find(f => f.id === contextMenu.targetId);
      const fileItems = [
        { label: 'Abrir', onClick: () => {
            if (target?.type === 'folder') {
              navigateTo(target.id, target.name);
            }
          } 
        },
        { label: 'Renombrar', onClick: () => {} }, // TODO: Implement rename trigger
        { label: 'Mover a la papelera', onClick: () => deleteFile(contextMenu.targetId!) },
        { label: 'Obtener información', onClick: () => {}, divider: true },
      ];
      
      // If protected, remove delete/rename
      if (target?.isProtected) {
        return [{ label: 'Abrir', onClick: () => {
            if (target?.type === 'folder') {
              navigateTo(target.id, target.name);
            }
          } 
        }, { label: 'Obtener información', onClick: () => {} }];
      }

      return fileItems;
    }

    return baseItems;
  }, [contextMenu, fs, currentFolder.id, addFolder, deleteFile]);

  const sidebarSections: SidebarSection[] = [
    {
      title: 'Recientes',
      items: [
        { id: 'recents', name: 'Recientes', icon: <Clock size={16} /> },
        { id: 'shared', name: 'Compartido', icon: <Users size={16} />, badge: '0' },
      ],
      hideTitle: true
    },
    {
      title: 'Favoritos',
      items: [
        { id: 'airdrop', name: 'AirDrop', icon: <Airplay size={16} /> },
        { id: 'applications', name: 'Aplicaciones', icon: <LayoutGrid size={16} /> },
        { id: 'desktop', name: 'Escritorio', icon: <Monitor size={16} />, cloud: true },
        { id: 'documents', name: 'Documentos', icon: <FileText size={16} />, cloud: true },
        { id: 'downloads', name: 'Descargas', icon: <Download size={16} /> },
        { id: 'videos', name: 'Videos', icon: <Video size={16} /> },
        { id: 'music', name: 'Música', icon: <Music size={16} /> },
        { id: 'images', name: 'Imágenes', icon: <ImageIcon size={16} /> },
        { id: 'projects', name: 'Proyectos', icon: <Folder size={16} /> },
      ]
    },
    {
      title: 'Ubicaciones',
      items: [
        { id: 'icloud', name: 'iCloud Drive', icon: <Cloud size={16} /> },
      ]
    }
  ];

  const FolderIcon = () => (
    <div className="relative w-16 h-12 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-6 h-2 bg-[#f9cf48] rounded-t-sm" />
      <div className="w-full h-11 bg-[#f9cf48] rounded-[4px] shadow-sm flex items-center justify-center">
        <div className="w-[90%] h-[75%] bg-[#ffde6d] rounded-[2px] opacity-40 border-t border-white/20" />
      </div>
    </div>
  );

  const FileIcon = () => (
    <div className="relative w-12 h-14 bg-white rounded-[3px] shadow-sm flex items-center justify-center">
        <span className="text-gray-500 text-xs font-bold">DOC</span>
        <div className="absolute top-0 right-0 w-3 h-3 bg-gray-200" style={{clipPath: 'polygon(0 0, 0% 100%, 100% 0)'}}/>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-white overflow-hidden select-none" onClick={() => setContextMenu(null)}>
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            items={contextMenuItems}
          />
        )}
      </AnimatePresence>

      {/* Integrated Title Bar Area */}
      <div className="h-12 flex items-center justify-between px-4 shrink-0 [WebkitAppRegion:drag]">
        <div className="flex items-center gap-20 ml-2">
          <div className="flex gap-1 ml-16 transform scale-90">
            <button onClick={goBack} disabled={historyIndex === 0} className={`p-1 rounded transition-colors ${historyIndex === 0 ? 'text-white/20' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}><ChevronLeft size={20} /></button>
            <button onClick={goForward} disabled={historyIndex === history.length - 1} className={`p-1 rounded transition-colors ${historyIndex === history.length - 1 ? 'text-white/20' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}><ChevronRight size={20} /></button>
          </div>
          <span className="text-[13px] font-bold text-white/90">{currentFolder.name}</span>
        </div>

        <div className="flex items-center gap-1.5 transform scale-95 origin-right mr-1 [WebkitAppRegion:no-drag]">
          <div className="flex items-center bg-white/[0.08] rounded-md px-2 py-1 gap-1 border border-white/5 hover:bg-white/[0.12] cursor-default transition-colors">
            <LayoutGrid size={15} className="text-white/70" />
            <ChevronDown size={10} className="text-white/40" />
          </div>
          <div className="flex items-center bg-white/[0.08] rounded-md px-2 py-1 gap-1 border border-white/5 hover:bg-white/[0.12] cursor-default transition-colors">
            <List size={15} className="text-white/70" />
            <ChevronDown size={10} className="text-white/40" />
          </div>
          <button className="p-2 hover:bg-white/[0.08] rounded text-white/70"><Share size={18} /></button>
          <button className="p-2 hover:bg-white/[0.08] rounded text-white/70"><Tag size={18} /></button>
          <button className="p-2 hover:bg-white/[0.08] rounded text-white/70"><MoreHorizontal size={18} /></button>
          <div className="relative ml-1 group/search">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/search:text-white/60 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.05] border border-white/5 rounded-md py-1 pl-8 pr-2 text-[12px] outline-none focus:bg-white/[0.1] transition-all w-32 focus:w-48"
            />
          </div>
        </div>
      </div>

      {/* Secondary Tab Bar (Pill) */}
      <div className="h-10 px-4 flex items-center shrink-0">
        <div className="flex-1 bg-black/30 rounded-lg border border-white/[0.08] h-7 flex items-center justify-center relative group">
          <span className="text-[11px] font-medium text-white/70">{currentFolder.name}</span>
          <button 
            onClick={handleCreateFolder}
            className="absolute right-1 w-5 h-5 flex items-center justify-center rounded-md hover:bg-white/10 text-white/40 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[220px] bg-white/[0.03] backdrop-blur-3xl border-r border-black/20 p-3 pt-4 flex flex-col gap-4 overflow-y-auto shrink-0 text-[13px]">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              {!section.hideTitle && (
                <div className="text-[11px] font-semibold text-white/30 px-3 mb-1.5">{section.title}</div>
              )}
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSidebarClick(item)}
                  className={cn(
                    "flex items-center justify-between px-3 py-1 rounded-[6px] group transition-all",
                    (currentFolder.id === item.id || (item.id === 'desktop' && currentFolder.id === null))
                      ? "bg-[#fabd2e] text-black shadow-sm font-medium"
                      : "hover:bg-white/[0.05] text-white/80"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn(
                      "transition-colors",
                      (currentFolder.id === item.id || (item.id === 'desktop' && currentFolder.id === null)) ? "text-black/80" : "text-[#0096ff]"
                    )}>{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {/* Status/Badge */}
                  <div className="flex items-center gap-1.5">
                    {item.cloud && <Cloud size={12} className={cn((currentFolder.id === item.id || (item.id === 'desktop' && currentFolder.id === null)) ? "text-black/40" : "text-white/20")} />}
                    {item.badge && <span className="text-[10px] opacity-40 font-bold">{item.badge}</span>}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div 
          className="flex-1 flex flex-col bg-[#1c1c1c]/95 relative" 
          onClick={() => setSelectedIds([])}
          onContextMenu={(e) => handleContextMenu(e)}
        >
          {/* Grid Area */}
          <div className="flex-1 p-8 pt-4 overflow-auto scrollbar-hide">
            {currentFiles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                <Folder size={64} strokeWidth={1} />
                <span className="text-sm font-medium">Esta carpeta está vacía</span>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-x-6 gap-y-10 content-start">
                {currentFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIds([file.id]); }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (file.type === 'folder') {
                        navigateTo(file.id, file.name);
                      }
                    }}
                    onContextMenu={(e) => handleContextMenu(e, file.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 group cursor-default p-2 rounded-md transition-all border border-transparent",
                      selectedIds.includes(file.id) ? "bg-white/10 border-white/5" : "hover:bg-white/5"
                    )}
                  >
                    <div className="mb-1 transform scale-105">
                      {file.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                    </div>
                    <div className="flex items-center gap-1 max-w-[100px] mt-0.5">
                      <span className={cn(
                        "text-[11.5px] text-center leading-[1.2] line-clamp-2 drop-shadow-sm font-medium tracking-tight px-1.5 py-0.5 rounded",
                        selectedIds.includes(file.id) ? "bg-blue-600 text-white" : "text-white/95"
                      )}>
                        {file.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Breadcrumbs */}
          <div className="h-7 border-t border-white/[0.08] flex items-center px-4 gap-2 text-[10px] text-white/40 bg-[#252528] shrink-0 font-medium overflow-hidden">
             <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
              <span className="text-[12px]">💾</span> Macintosh HD
            </div>
            <span className="text-white/10 font-light">›</span>
            <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
              <span className="text-[12px]">📂</span> Usuarios
            </div>
            
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className="text-white/10 font-light">›</span>
                <button 
                  onClick={() => navigateTo(crumb.id, crumb.name)}
                  className={cn(
                    "flex items-center px-1.5 py-0.5 rounded transition-colors gap-1.5 outline-none",
                    idx === breadcrumbs.length - 1 
                      ? "text-[#fabd2e] font-bold"
                      : "hover:bg-white/5 text-white/50"
                  )}
                >
                  <span className="text-[12px] opacity-80">
                    {crumb.id === null ? '🏠' : (['recents', 'applications', 'airdrop'].includes(crumb.id || '') ? '🧭' : '📂')}
                  </span>
                  <span className="truncate max-w-[100px]">{crumb.name === 'Escritorio' ? 'Escritorio' : crumb.name}</span>
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Status Bar */}
          <div className="h-9 border-t border-black/40 flex items-center justify-center px-4 relative bg-[#252528] shrink-0">
            <span className="text-[11.5px] text-white/50 font-medium tracking-tight">{currentFiles.length} elementos, 34.49 GB disponible(s) en iCloud</span>
            <div className="absolute right-5 flex items-center gap-4 group">
              <div className="relative w-28 h-5 flex items-center">
                <div className="absolute left-0 w-[4px] h-[1px] bg-white/20" />
                <div className="w-full h-[1.5px] bg-[#1c1c1e] mx-2 relative overflow-hidden rounded-full border border-white/5 shadow-inner">
                  <div className="absolute left-0 top-0 bottom-0 w-[85%] bg-[#fabd2e]/80" />
                </div>
                <div className="absolute right-[12px] top-[14%] w-3.5 h-3.5 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.5)] border border-black/10 transition-transform active:scale-90" />
                <div className="absolute right-0 w-[4px] h-[1px] bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

FinderApp.displayName = 'FinderApp';

export default FinderApp;
