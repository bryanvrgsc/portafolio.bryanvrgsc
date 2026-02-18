"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText } from 'lucide-react';
import AppleLogo from './AppleLogo';
import dynamic from 'next/dynamic';

const Spotlight = dynamic(() => import('./Spotlight'), { ssr: false });
const MenuBar = dynamic(() => import('./MenuBar'), { ssr: false });
const Dock = dynamic(() => import('./Dock'), { ssr: false });
const Window = dynamic(() => import('./Window'), { ssr: false });
const BrowserApp = dynamic(() => import('./BrowserApp'), { ssr: false });
const ProfileApp = dynamic(() => import('./ProfileApp'), { ssr: false });
const FinderApp = dynamic(() => import('./FinderApp'), { ssr: false });
const TerminalApp = dynamic(() => import('./TerminalApp'), { ssr: false });
const NotesApp = dynamic(() => import('./NotesApp'), { ssr: false });
const AboutThisMac = dynamic(() => import('./AboutThisMac'), { ssr: false });
const ContextMenu = dynamic(() => import('./ContextMenu'), { ssr: false });
const ControlCenter = dynamic(() => import('./ControlCenter'), { ssr: false });
const NotificationCenter = dynamic(() => import('./NotificationCenter'), { ssr: false });
import Image from 'next/image';
const PreviewApp = dynamic(() => import('./PreviewApp'), { ssr: false });
import { PreviewToolbar } from './PreviewApp';
import { useFileSystem, VFile } from '@/context/FileSystemContext';
import { cn } from '@/lib/utils';

export type AppId = 'profile' | 'browser' | 'finder' | 'settings' | 'spotlight' | 'terminal' | 'about' | 'notes' | 'preview';

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPath?: string | null;
  previewFile?: VFile;
}

import { useSystem } from '@/context/SystemContext';

const Desktop = React.memo(() => {
  const { fs, addFolder, deleteFile, renameFile } = useFileSystem();
  const { brightness } = useSystem();
  const [booting, setBooting] = useState(true);
  const [isShutDown, setIsShutDown] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selection, setSelection] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [windows, setWindows] = useState<Record<AppId, WindowState>>({
    profile: { id: 'profile', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    browser: { id: 'browser', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    finder: { id: 'finder', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    settings: { id: 'settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    terminal: { id: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    notes: { id: 'notes', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    spotlight: { id: 'spotlight', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1000000 },
    preview: { id: 'preview', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
  });

  const minimizedAppIds = React.useMemo(() =>
    Object.values(windows).filter(w => w.isMinimized).map(w => w.id),
    [windows]
  );

  const openAppIds = React.useMemo(() =>
    Object.values(windows).filter(w => w.isOpen).map(w => w.id),
    [windows]
  );

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetId?: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const [windowPositionOffset, setWindowPositionOffset] = useState(0);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const bootTime = window.innerWidth < 768 ? 1200 : 2000;
    const timer = setTimeout(() => setBooting(false), bootTime);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);



  const toggleSpotlight = useCallback(() => {
    setSpotlightOpen(prev => !prev);
    setIsControlCenterOpen(false);
    setIsNotifOpen(false);
  }, []);

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: false, isMaximized: false } }));
    setActiveApp(prev => prev === id ? null : prev);
  }, []);

  const toggleApp = useCallback((id: AppId, path?: string, file?: VFile) => {
    setWindows((prev) => {
      const newZIndex = maxZIndex + 1;
      setMaxZIndex(newZIndex);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: true,
          isMinimized: false,
          zIndex: newZIndex,
          initialPath: path,
          previewFile: file || prev[id].previewFile
        }
      };
    });
    setActiveApp(id);

    // Cascade window positioning
    setWindowPositionOffset(offset => (offset + 30) % 150);
  }, [maxZIndex]);

  // Auto-open Notes app on first visit (per session, not on reload)
  useEffect(() => {
    if (typeof window === 'undefined' || booting) return;

    const hasSeenWelcome = sessionStorage.getItem('macos_seen_welcome');
    if (!hasSeenWelcome) {
      // Wait a bit after boot animation
      const timer = setTimeout(() => {
        toggleApp('notes');
        sessionStorage.setItem('macos_seen_welcome', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [booting, toggleApp]);

  const handleSystemAction = useCallback((action: string) => {
    if (action === 'shutdown') { setIsShutDown(true); setTimeout(() => window.location.reload(), 3000); }
    if (action === 'restart') { setBooting(true); setTimeout(() => setBooting(false), 2000); }
    if (action === 'about') { toggleApp('about'); }
  }, [toggleApp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') { e.preventDefault(); toggleSpotlight(); }
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyW' && activeApp) { e.preventDefault(); closeWindow(activeApp); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeApp, toggleSpotlight, closeWindow]);

  const [iconRects, setIconRects] = useState<Record<string, DOMRect>>({});

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (spotlightOpen && !target.closest('.spotlight-container') && !target.closest('.search-toggle')) setSpotlightOpen(false);
    if (isControlCenterOpen && !target.closest('.control-center-panel') && !target.closest('.control-center-toggle')) setIsControlCenterOpen(false);
    if (isNotifOpen && !target.closest('.notif-center-panel') && !target.closest('.notif-center-toggle')) setIsNotifOpen(false);
    if (!target.closest('.context-menu')) setContextMenu(null);
    if (!target.closest('.desktop-icon') && editingId) setEditingId(null);

    const isWindow = target.closest('.window-container');
    const isDock = target.closest('.dock-container');
    const isIcon = target.closest('.desktop-icon');
    const isMenuBar = target.closest('.menu-bar-container');
    const isPanel = target.closest('.system-panel');

    if (!isWindow && !isDock && !isIcon && !isMenuBar && !isPanel) {
      setIsDragging(true);
      setSelection({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY });
      setSelectedIds([]);

      // Cache icon rectangles for faster selection during mouseMove
      const icons = document.querySelectorAll('.desktop-icon');
      const rects: Record<string, DOMRect> = {};
      icons.forEach((icon) => {
        const id = icon.getAttribute('data-id');
        if (id) rects[id] = icon.getBoundingClientRect();
      });
      setIconRects(rects);
    }
  }, [spotlightOpen, isControlCenterOpen, isNotifOpen, editingId]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selection) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    setSelection(prev => prev ? { ...prev, endX: currentX, endY: currentY } : null);

    const selectionRect = {
      left: Math.min(selection.startX, currentX),
      top: Math.min(selection.startY, currentY),
      right: Math.max(selection.startX, currentX),
      bottom: Math.max(selection.startY, currentY)
    };

    const newlySelected: string[] = [];
    Object.entries(iconRects).forEach(([id, rect]) => {
      if (!(rect.left > selectionRect.right ||
        rect.right < selectionRect.left ||
        rect.top > selectionRect.bottom ||
        rect.bottom < selectionRect.top)) {
        newlySelected.push(id);
      }
    });

    // Solo actualizar si la selección ha cambiado para evitar re-renders innecesarios
    setSelectedIds(prev => {
      if (prev.length === newlySelected.length && prev.every(id => newlySelected.includes(id))) {
        return prev;
      }
      return newlySelected;
    });
  }, [isDragging, selection, iconRects]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelection(null);
    setIconRects({});
  }, []);

  const contextMenuItems = React.useMemo(() => {
    if (!contextMenu) return [];
    if (contextMenu.targetId) {
      const target = fs.find(f => f.id === contextMenu.targetId);
      const items = [
        { label: 'Obtener información', onClick: () => { } },
      ];
      if (target && !target.isProtected) {
        items.push(
          { label: 'Renombrar', onClick: () => setEditingId(target.id) },
          { label: 'Trasladar a la papelera', onClick: () => deleteFile(contextMenu.targetId!) }
        );
      }
      return items;
    }
    return [
      { label: 'Nueva Carpeta', onClick: () => addFolder(null) },
      { label: 'Obtener información', onClick: () => { } },
      { label: 'Cambiar fondo...', onClick: () => { }, divider: true }
    ];
  }, [contextMenu, fs, addFolder, deleteFile]);

  if (isShutDown) return <div className="h-screen w-full bg-black transition-opacity duration-1000" />;
  if (booting) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-12 text-white">
        <AppleLogo size={80} className="md:w-[100px] md:h-[100px]" />
        <div className="w-32 md:w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-white"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden select-none flex flex-col" onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Optimized Background Image */}
      <Image
        src={"/wallpaper.avif"}
        alt="Wallpaper"
        fill
        priority
        quality={60}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
        className="object-cover pointer-events-none z-0"
        sizes="100vw"
      />

      <div className="h-8 w-full shrink-0 z-[800000] mobile-menu-bar">
        <MenuBar activeApp={activeApp} onAction={handleSystemAction} toggleSpotlight={toggleSpotlight} closeSpotlight={() => setSpotlightOpen(false)} isControlCenterOpen={isControlCenterOpen} setIsControlCenterOpen={setIsControlCenterOpen} isNotifOpen={isNotifOpen} setIsNotifOpen={setIsNotifOpen} />
      </div>
      <AnimatePresence>{isControlCenterOpen && <ControlCenter />}</AnimatePresence>
      <AnimatePresence>{isNotifOpen && <NotificationCenter />}</AnimatePresence>
      {selection && <div className="absolute border border-white/50 bg-white/20 z-[50000] pointer-events-none" style={{ left: Math.min(selection.startX, selection.endX), top: Math.min(selection.startY, selection.endY), width: Math.abs(selection.endX - selection.startX), height: Math.abs(selection.endY - selection.startY) }} />}
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
      <Spotlight
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onLaunchApp={(id) => {
          if (id === 'finder') {
            toggleApp(id, 'desktop');
          } else {
            toggleApp(id);
          }
        }}
      />
      <main className="relative flex-1 w-full p-6 z-[10]">
        <div className="flex flex-col gap-6 items-end flex-wrap h-full content-end">
          {fs.filter(f => f.parentId === 'desktop' && !f.isHiddenFromDesktop).map(file => (
            <div
              key={file.id}
              data-id={file.id}
              className={cn("desktop-icon flex flex-col items-center gap-1 group w-20 p-1 rounded-md transition-colors relative", selectedIds.includes(file.id) ? "bg-white/20 ring-1 ring-white/30" : "hover:bg-white/10")}
              onClick={() => setSelectedIds([file.id])}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenu({ x: e.clientX, y: e.clientY, targetId: file.id });
              }}
            >
              <div
                onDoubleClick={() => {
                  if (file.type === 'folder') {
                    toggleApp('finder', file.id);
                  } else if ((file.name.endsWith('.pdf') || file.name.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) && file.content) {
                    toggleApp('preview', undefined, file);
                  } else {
                    // Open file in Finder
                    toggleApp('finder', 'desktop');
                  }
                }}
                className="w-14 h-14 flex items-center justify-center transition-colors cursor-default"
              >
                {file.icon ? (
                  <Image src={file.icon} alt={file.name} width={56} height={56} className="object-contain" draggable={false} priority />
                ) : (
                  file.type === 'folder' ? (
                    <span className="text-5xl">📂</span>
                  ) : file.name.toLowerCase().endsWith('.pdf') ? (
                    <div className="relative flex flex-col items-center justify-center">
                      <div className="w-12 h-14 bg-white rounded-sm shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">
                        <div className="h-4 w-full bg-red-600 flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">PDF</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-red-500 opacity-80">
                          <FileText size={24} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-5xl">📄</span>
                  )
                )}
              </div>
              <input
                className={cn(
                  "bg-transparent text-white text-[11px] font-medium drop-shadow-md text-center w-full outline-none border-none rounded-sm",
                  editingId === file.id ? "bg-blue-600 ring-1 ring-blue-400" : "pointer-events-none"
                )}
                value={file.name}
                autoFocus={editingId === file.id}
                onChange={(e) => renameFile(file.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setEditingId(null);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onBlur={() => setEditingId(null)}
                readOnly={editingId !== file.id}
              />
            </div>
          ))}
        </div>
        {/* Defer window rendering until mounted to prevent CLS from isMobile flip */}
        {mounted && Object.entries(windows).map(([id, state]) => {
          if (!state.isOpen || state.isMinimized) return null;
          let Content; let title; let it = 60; let il = 120; let w = "800px"; let h = "500px"; let actions = null;
          if (id === 'profile') {
            Content = <ProfileApp />;
            title = "Perfil";
            it = isMobile ? 40 : 60 + windowPositionOffset;
            il = isMobile ? 10 : 120 + windowPositionOffset;
            w = isMobile ? `${window.innerWidth - 20}px` : "1000px";
            h = isMobile ? `${window.innerHeight - 140}px` : "650px";
          }
          else if (id === 'browser') {
            Content = <BrowserApp />;
            title = "Safari";
            it = isMobile ? 40 : 80 + windowPositionOffset;
            il = isMobile ? 10 : 150 + windowPositionOffset;
            w = isMobile ? `${window.innerWidth - 20}px` : "1200px";
            h = isMobile ? `${window.innerHeight - 140}px` : "700px";
          }
          else if (id === 'finder') {
            Content = <FinderApp
              initialPath={state.initialPath}
              onOpenFile={(file) => toggleApp('preview', undefined, file)}
            />;
            title = "Finder";
            it = isMobile ? 40 : 60 + windowPositionOffset;
            il = isMobile ? 10 : 100 + windowPositionOffset;
            w = isMobile ? `${window.innerWidth - 20}px` : "800px";
            h = isMobile ? `${window.innerHeight - 140}px` : "500px";
          }
          else if (id === 'terminal') {
            Content = <TerminalApp
              onOpenFile={(file) => toggleApp('preview', undefined, file)}
              onOpenFolder={(path) => toggleApp('finder', path)}
            />;
            title = "bryanvargas@MacBookProdeBryan:~";
            it = isMobile ? 40 : 150 + windowPositionOffset;
            il = isMobile ? 10 : 300 + windowPositionOffset;
            w = isMobile ? `${window.innerWidth - 20}px` : "800px";
            h = isMobile ? `${window.innerHeight - 140}px` : "500px";
          }
          else if (id === 'notes') {
            Content = <NotesApp />;
            title = "Mi Portafolio";
            it = isMobile ? 40 : 80 + windowPositionOffset;
            il = isMobile ? 10 : 200 + windowPositionOffset;
            w = isMobile ? `${window.innerWidth - 20}px` : "900px";
            h = isMobile ? `${window.innerHeight - 140}px` : "600px";
          }
          else if (id === 'preview') {
            Content = <PreviewApp file={state.previewFile} />;
            title = state.previewFile?.name || "Vista Previa";
            it = isMobile ? 40 : 50 + windowPositionOffset;
            il = isMobile ? 10 : 200 + windowPositionOffset;
            w = isMobile ? `${window.innerWidth - 20}px` : "700px";
            h = isMobile ? `${window.innerHeight - 140}px` : "800px";
            actions = state.previewFile ? <PreviewToolbar file={state.previewFile} /> : null;
          }
          else if (id === 'about') {
            Content = <AboutThisMac />;
            title = "";
            it = isMobile ? 40 : 100;
            il = mounted ? (window.innerWidth - (isMobile ? window.innerWidth - 40 : 412)) / 2 : 400;
            w = isMobile ? `${window.innerWidth - 40}px` : "412px";
            h = isMobile ? "auto" : "628px";
          }
          else return null;
          return <Window key={id} title={title} headerActions={actions} onClose={() => closeWindow(id as AppId)} onMinimize={() => setWindows(p => ({ ...p, [id]: { ...p[id], isMinimized: true } }))} onMaximize={() => setWindows(p => ({ ...p, [id]: { ...p[id], isMaximized: !p[id].isMaximized } }))} onFocus={() => { const nz = maxZIndex + 1; setMaxZIndex(nz); setWindows(p => ({ ...p, [id]: { ...p[id], zIndex: nz } })); setActiveApp(id as AppId); }} zIndex={state.zIndex} active={activeApp === id} isMaximized={state.isMaximized} initialTop={it} initialLeft={il} hideTitleBarStyling={id === 'about'} integratedTitleBar={id === 'browser' || id === 'finder' || id === 'notes'} isResizable={id !== 'about'} width={w} height={h} className="mobile-window">{Content}</Window>;
        })}
      </main>
      <Dock
        onLaunch={(id, path) => {
          toggleApp(id, path);
        }}
        activeApp={activeApp}
        minimizedApps={minimizedAppIds}
        openApps={openAppIds}
      />

      {/* Brightness Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[999999] bg-black"
        style={{ opacity: (100 - brightness) / 100 }}
      />
    </div>
  );
});

Desktop.displayName = 'Desktop';

export default Desktop;
