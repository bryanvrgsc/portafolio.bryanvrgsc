"use client";

import React, { useState, useMemo, useContext, useCallback } from 'react';
import {
  Folder, ChevronLeft, ChevronRight, LayoutGrid, List, Search,
  Share, Tag, MoreHorizontal, Clock, Users, Airplay, Monitor,
  FileText, Download, Video, Music, ImageIcon, Cloud, ChevronDown, Plus, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFileSystem, VFile } from '@/context/FileSystemContext';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ContextMenu from './ContextMenu';
import { WindowContext } from './Window';

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
  onOpenFile?: (file: VFile) => void;
}

const FinderApp = React.memo(({ initialPath, onOpenFile }: FinderProps) => {
  const { fs, addFolder, deleteFile } = useFileSystem();
  const windowContext = useContext(WindowContext);
  const dragControls = windowContext?.dragControls;

  // Helper to resolve initial folder
  const resolveInitialFolder = (path?: string | null) => {
    if (!path || path === 'root') return { id: null, name: 'Escritorio' }; // Default to root
    if (path === 'desktop') return { id: 'desktop', name: 'Escritorio' }; // Explicit desktop folder
    if (path === 'trash') return { id: 'trash', name: 'Papelera' };

    const folder = fs.find(f => f.id === path);
    return folder ? { id: folder.id, name: folder.name } : { id: null, name: 'Escritorio' };
  };

  // Navigation State
  const [history, setHistory] = useState<Array<{ id: string | null; name: string }>>([resolveInitialFolder(initialPath)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = useCallback((folderId: string | null, folderName: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ id: folderId, name: folderName });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedIds([]);
    setSearchQuery('');
  }, [history, historyIndex]);


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
        { id: 'app-safari', name: 'Safari', type: 'app', parentId: 'applications', icon: '/icons/safari.avif' },
        { id: 'app-terminal', name: 'Terminal', type: 'app', parentId: 'applications', icon: '/icons/terminal.avif' },
        { id: 'app-finder', name: 'Finder', type: 'app', parentId: 'applications', icon: '/icons/finder.avif' },
        { id: 'app-notes', name: 'Notas', type: 'app', parentId: 'applications', icon: '/icons/notes.avif' },
        { id: 'app-profile', name: 'Perfil', type: 'app', parentId: 'applications', icon: '/icons/profile.avif' },
      ] as unknown as typeof fs;
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
      const folder = fs.find(f => f.id === currId);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currId = folder.parentId;
      } else {
        // Stop if we hit a virtual root or missing parent
        break;
      }
      depth++;
    }

    // Explicitly handle the case where we are at 'desktop' but the recursive loop might have missed adding it 
    // if parentId was null (which it is for desktop in fs).
    // Actually, 'desktop' has parentId: null. So the loop finds 'desktop', adds it, then sets currId = null and breaks.
    // So path should be [{id: 'desktop', name: 'Escritorio'}].
    // Then we prepend [{id: null, name: 'bryanvargas'}].
    // Result: bryanvargas > Escritorio.
    // If it's missing, maybe fs.find failed?

    // Fallback: If path is empty but we are at a known ID that is NOT root/null, verify we added it.
    if (path.length === 0 && currentFolder.id && currentFolder.id !== 'recents') {
      // It implies currentFolder is a direct child of root (like 'desktop' or 'documents')
      path.push({ id: currentFolder.id, name: currentFolder.name });
    }

    // Base path always starts at User Home
    return [{ id: null, name: 'bryanvargas' }, ...path];
  }, [fs, currentFolder]);

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
    // 1. Handle Virtual Views that don't correspond to physical folders
    if (['recents', 'applications', 'airdrop', 'icloud'].includes(item.id)) {
      navigateTo(item.id, item.name);
      return;
    }

    // 2. Handle Standard Folders (Desktop, Documents, etc.)
    // We strictly look for the folder with this ID in the file system.
    const target = fs.find(f => f.id === item.id);

    if (target) {
      // Found physical folder -> Navigate to it
      navigateTo(target.id, target.name);
    } else {
      // Folder should exist but doesn't (data sync issue?). 
      // Force navigation to this ID anyway so the UI updates to the correct "View",
      // even if it appears empty. This corrects the breadcrumbs.
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
      { label: 'Obtener información', onClick: () => { } },
    ];

    if (contextMenu.targetId) {
      const target = fs.find(f => f.id === contextMenu.targetId);
      const fileItems = [
        {
          label: 'Abrir', onClick: () => {
            if (target?.type === 'folder') {
              navigateTo(target.id, target.name);
            }
          }
        },
        { label: 'Renombrar', onClick: () => { } }, // TODO: Implement rename trigger
        { label: 'Mover a la papelera', onClick: () => deleteFile(contextMenu.targetId!) },
        { label: 'Obtener información', onClick: () => { }, divider: true },
      ];

      // If protected, remove delete/rename
      if (target?.isProtected) {
        return [{
          label: 'Abrir', onClick: () => {
            if (target?.type === 'folder') {
              navigateTo(target.id, target.name);
            }
          }
        }, { label: 'Obtener información', onClick: () => { } }];
      }

      return fileItems;
    }

    return baseItems;
  }, [contextMenu, fs, currentFolder.id, addFolder, deleteFile, navigateTo]);

  const isSidebarItemActive = (item: SidebarItem) =>
    currentFolder.id === item.id || (item.id === 'desktop' && currentFolder.id === null);

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
        { id: 'trash', name: 'Papelera', icon: <Trash2 size={16} /> },
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
      <div className="absolute top-0 right-0 w-3 h-3 bg-gray-200" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }} />
    </div>
  );

  return (
    <div className="tahoe-app-surface flex h-full flex-col overflow-hidden select-none" onClick={() => setContextMenu(null)}>
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
      <div
        className="tahoe-app-toolbar flex h-12 shrink-0 items-center justify-between px-4 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => dragControls?.start(e)}
      >
        <div className="flex items-center gap-4 md:gap-20 ml-2">
          <div className="tahoe-control-cluster flex items-center gap-0.5 rounded-full p-0.5 ml-0 md:ml-16">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={goBack}
              disabled={historyIndex === 0}
              className="tahoe-control-button flex h-7 w-7 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Retroceder"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className="tahoe-control-button flex h-7 w-7 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Avanzar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="text-[13px] font-semibold tracking-tight text-[color:var(--tahoe-text-primary)]">
            {currentFolder.name}
          </span>
        </div>

        <div className="flex items-center gap-2 transform scale-95 origin-right mr-1" onPointerDown={(e) => e.stopPropagation()}>
          <div className="tahoe-control-cluster hidden sm:flex items-center gap-0.5 rounded-full p-0.5">
            <button
              type="button"
              className="tahoe-control-button flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium"
              aria-label="Opciones de visualización cuadrícula"
            >
              <LayoutGrid size={14} />
              <ChevronDown size={10} className="opacity-60" />
            </button>
            <button
              type="button"
              className="tahoe-control-button flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium"
              aria-label="Opciones de visualización lista"
            >
              <List size={14} />
              <ChevronDown size={10} className="opacity-60" />
            </button>
          </div>
          <div className="tahoe-control-cluster hidden md:flex items-center gap-0.5 rounded-full p-0.5">
            <button type="button" className="tahoe-control-button flex h-7 w-7 items-center justify-center rounded-full" aria-label="Compartir">
              <Share size={16} />
            </button>
            <button type="button" className="tahoe-control-button flex h-7 w-7 items-center justify-center rounded-full" aria-label="Editar etiquetas">
              <Tag size={16} />
            </button>
            <button type="button" className="tahoe-control-button flex h-7 w-7 items-center justify-center rounded-full" aria-label="Más opciones">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="relative ml-1 group/search">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--tahoe-text-tertiary)] transition-colors group-focus-within/search:text-[color:var(--tahoe-text-primary)]" />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tahoe-search-field h-8 w-28 rounded-full py-1 pl-8 pr-3 text-[12px] outline-none transition-all focus:w-48 sm:w-32"
              aria-label="Buscar archivos"
            />
          </div>
        </div>
      </div>

      {/* Secondary Tab Bar (Pill) */}
      <div className="tahoe-app-toolbar flex h-10 shrink-0 items-center px-4">
        <div className="tahoe-control-cluster relative flex h-8 flex-1 items-center justify-center rounded-full px-4">
          <span className="max-w-[70%] truncate text-[11px] font-medium tracking-tight text-[color:var(--tahoe-text-secondary)]">
            {currentFolder.name}
          </span>
          <button
            type="button"
            onClick={handleCreateFolder}
            className="tahoe-control-button absolute right-1 flex h-6 w-6 items-center justify-center rounded-full"
            aria-label="Nueva carpeta"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="tahoe-app-sidebar hidden w-[220px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-[color:var(--tahoe-hairline)] p-3 pt-4 text-[13px] md:flex">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              {!section.hideTitle && (
                <div className="tahoe-sidebar-section-title px-3 mb-1.5 text-[11px] font-semibold">
                  {section.title}
                </div>
              )}
              {section.items.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSidebarClick(item)}
                  data-active={isSidebarItemActive(item) ? 'true' : undefined}
                  className={cn(
                    "tahoe-sidebar-row flex items-center justify-between rounded-[8px] px-3 py-1.5 group transition-all",
                    isSidebarItemActive(item) ? "font-medium" : "font-normal"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn(
                      "transition-colors",
                      isSidebarItemActive(item)
                        ? "text-[color:var(--tahoe-text-primary)]"
                        : "text-[color:var(--tahoe-accent)]"
                    )}>{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {/* Status/Badge */}
                  <div className="flex items-center gap-1.5">
                    {item.cloud && (
                      <Cloud
                        size={12}
                        className={cn(
                          isSidebarItemActive(item)
                            ? "text-[color:var(--tahoe-text-tertiary)]"
                            : "text-[color:var(--tahoe-text-tertiary)] opacity-80"
                        )}
                      />
                    )}
                    {item.badge && (
                      <span className="text-[10px] font-semibold text-[color:var(--tahoe-text-tertiary)]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div
          className="tahoe-app-panel relative flex flex-1 flex-col"
          onClick={() => setSelectedIds([])}
          onContextMenu={(e) => handleContextMenu(e)}
        >
          {/* Grid Area */}
          <div className="flex-1 p-4 md:p-8 pt-4 overflow-auto scrollbar-hide">
            {currentFiles.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="tahoe-content-card flex flex-col items-center justify-center gap-4 rounded-3xl px-8 py-10 text-center">
                  <Folder size={64} strokeWidth={1.25} className="text-[color:var(--tahoe-text-tertiary)]" />
                  <span className="text-sm font-medium text-[color:var(--tahoe-text-secondary)]">
                    Esta carpeta está vacía
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-x-4 md:gap-x-6 gap-y-6 md:gap-y-10 content-start">
                {currentFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIds([file.id]); }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (file.type === 'folder') {
                        navigateTo(file.id, file.name);
                      } else if (file.type === 'file') {
                        if ((file.name.endsWith('.pdf') || file.name.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) && file.content) {
                          onOpenFile?.(file);
                        } else {
                          console.log('Opening file:', file.name);
                        }
                      }
                    }}
                    onContextMenu={(e) => handleContextMenu(e, file.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 group cursor-default rounded-2xl p-2.5 transition-all",
                      selectedIds.includes(file.id)
                        ? "tahoe-content-card"
                        : "hover:bg-[color:var(--tahoe-control-surface)]"
                    )}
                  >
                    <div className="mb-1 transform scale-105">
                      {file.icon ? (
                        <Image src={file.icon} alt={file.name} width={56} height={56} className="object-contain" draggable={false} />
                      ) : (
                        file.type === 'folder' ? <FolderIcon /> : (
                          file.name.toLowerCase().endsWith('.pdf') ? (
                            <div className="relative flex flex-col items-center justify-center scale-90">
                              <div className="w-10 h-12 bg-white rounded-sm shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">
                                <div className="h-3 w-full bg-red-600 flex items-center justify-center">
                                  <span className="text-[6px] text-white font-bold">PDF</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center text-red-500 opacity-80">
                                  <FileText size={16} />
                                </div>
                              </div>
                            </div>
                          ) : <FileIcon />
                        )
                      )}
                    </div>
                    <div className="flex items-center gap-1 max-w-[100px] mt-0.5">
                      <span className={cn(
                        "text-[11.5px] text-center leading-[1.2] line-clamp-2 font-medium tracking-tight px-1.5 py-0.5 rounded",
                        selectedIds.includes(file.id)
                          ? "text-[color:var(--tahoe-text-primary)]"
                          : "text-[color:var(--tahoe-text-secondary)]"
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
          <div className="tahoe-app-statusbar flex h-7 shrink-0 items-center gap-2 overflow-hidden border-t border-[color:var(--tahoe-hairline)] px-4 text-[10px] font-medium text-[color:var(--tahoe-text-tertiary)]">
            <div className="hidden sm:flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-default">
              <span className="text-[12px]">💾</span> Macintosh HD
            </div>
            <span className="hidden sm:inline tahoe-status-separator font-light">›</span>
            <div className="hidden sm:flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-default">
              <span className="text-[12px]">📂</span> Usuarios
            </div>

            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className="tahoe-status-separator font-light">›</span>
                <button
                  type="button"
                  onClick={() => navigateTo(crumb.id, crumb.name)}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-1.5 py-0.5 outline-none transition-colors",
                    idx === breadcrumbs.length - 1
                      ? "font-semibold text-[color:var(--tahoe-text-primary)]"
                      : "text-[color:var(--tahoe-text-secondary)] hover:bg-[color:var(--tahoe-control-surface)]"
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
          <div className="tahoe-app-statusbar relative flex h-9 shrink-0 items-center justify-center border-t border-[color:var(--tahoe-hairline)] px-4">
            <span className="truncate px-2 text-[11.5px] font-medium tracking-tight text-[color:var(--tahoe-text-secondary)]">
              {currentFiles.length} elementos, 34.49 GB disponible(s)
            </span>
            <div className="hidden sm:flex absolute right-5 items-center gap-4 group">
              <div className="relative w-28 h-5 flex items-center">
                <div className="absolute left-0 w-[4px] h-[1px] bg-[color:var(--tahoe-hairline)]" />
                <div className="w-full h-[1.5px] bg-[color:var(--tahoe-stroke-soft)] mx-2 relative overflow-hidden rounded-full border border-[color:var(--tahoe-hairline)] shadow-inner">
                  <div className="absolute left-0 top-0 bottom-0 w-[85%] bg-[color:var(--tahoe-accent)] opacity-80" />
                </div>
                <div className="absolute right-[12px] top-[14%] w-3.5 h-3.5 rounded-full border border-[color:var(--tahoe-hairline)] bg-[color:var(--tahoe-window-content-surface)] shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform active:scale-90" />
                <div className="absolute right-0 w-[4px] h-[1px] bg-[color:var(--tahoe-text-tertiary)] opacity-70" />
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
