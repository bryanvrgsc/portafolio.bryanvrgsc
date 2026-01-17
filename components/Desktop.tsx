"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Search } from 'lucide-react';
import MenuBar from './MenuBar';
import Dock from './Dock';
import Window from './Window';
import BrowserApp from './BrowserApp';
import ProfileApp from './ProfileApp';
import FinderApp from './FinderApp';
import TerminalApp from './TerminalApp';
import AboutThisMac from './AboutThisMac';
import ContextMenu from './ContextMenu';
import ControlCenter from './ControlCenter';
import NotificationCenter from './NotificationCenter';
import { useFileSystem } from '@/context/FileSystemContext';
import { cn } from '@/lib/utils';

export type AppId = 'profile' | 'browser' | 'finder' | 'settings' | 'spotlight' | 'terminal' | 'about';

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPath?: string | null;
}

import { useSystem } from '@/context/SystemContext';

const Desktop = React.memo(() => {
  const { fs, addFolder, deleteFile, renameFile } = useFileSystem();
  const { brightness } = useSystem();
  const [booting, setBooting] = useState(true);
  const [isShutDown, setIsShutDown] = useState(false);

  const [selection, setSelection] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [windows, setWindows] = useState<Record<AppId, WindowState>>({
    profile: { id: 'profile', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    browser: { id: 'browser', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    finder: { id: 'finder', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    settings: { id: 'settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    terminal: { id: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    spotlight: { id: 'spotlight', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1000000 },
  });

  const minimizedAppIds = React.useMemo(() =>
    Object.values(windows).filter(w => w.isMinimized).map(w => w.id),
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
    const timer = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(timer);
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

  const toggleApp = useCallback((id: AppId, path?: string) => {
    setWindows((prev) => {
      const newZIndex = maxZIndex + 1;
      setMaxZIndex(newZIndex);
      return { ...prev, [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: newZIndex, initialPath: path } };
    });
    setActiveApp(id);

    // Cascade window positioning
    setWindowPositionOffset(offset => (offset + 30) % 150);
  }, [maxZIndex]);

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
        <Apple size={80} className="fill-current" />
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden macos-wallpaper select-none flex flex-col" onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="h-8 w-full shrink-0 z-[800000]">
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
      <AnimatePresence>{spotlightOpen && <div className="fixed inset-0 z-[1000000] flex items-center justify-center pointer-events-none"><motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} className="spotlight-container w-[600px] h-14 bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl flex items-center px-4 gap-3 z-[1000001] pointer-events-auto" onClick={(e) => e.stopPropagation()}><Search size={24} className="text-white/40" /><input autoFocus placeholder="Spotlight Search" className="bg-transparent border-none outline-none text-xl w-full text-white font-light" /></motion.div></div>}</AnimatePresence>
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
                  } else {
                    // Open file logic (preview, etc) - for now just finder in parent? Or nothing.
                    // Let's open finder in desktop for now if it's a file
                    toggleApp('finder', 'desktop');
                  }
                }}
                className="w-14 h-14 flex items-center justify-center text-5xl transition-colors cursor-default"
              >
                {file.type === 'folder' ? '📂' : '📄'}
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
        {Object.entries(windows).map(([id, state]) => {
          if (!state.isOpen || state.isMinimized) return null;
          let Content; let title; let it = 60; let il = 120; let w = "800px"; let h = "500px";
          if (id === 'profile') { Content = <ProfileApp />; title = "Perfil"; it = 60 + windowPositionOffset; il = 120 + windowPositionOffset; w = "1000px"; h = "650px"; }
          else if (id === 'browser') { Content = <BrowserApp />; title = "Safari"; it = 80 + windowPositionOffset; il = 150 + windowPositionOffset; w = "1200px"; h = "700px"; }
          else if (id === 'finder') { Content = <FinderApp initialPath={state.initialPath} />; title = "Finder"; it = 60 + windowPositionOffset; il = 100 + windowPositionOffset; w = "800px"; h = "500px"; }
          else if (id === 'terminal') { Content = <TerminalApp />; title = "bryanvargas@MacBookProdeBryan:~"; it = 150 + windowPositionOffset; il = 300 + windowPositionOffset; w = "800px"; h = "500px"; }
          else if (id === 'about') { Content = <AboutThisMac />; title = ""; it = 100; il = (typeof window !== 'undefined' ? (window.innerWidth - 412) / 2 : 400); w = "412px"; h = "628px"; }
          else return null;
          return <Window key={id} title={title} onClose={() => closeWindow(id as AppId)} onMinimize={() => setWindows(p => ({ ...p, [id]: { ...p[id], isMinimized: true } }))} onMaximize={() => setWindows(p => ({ ...p, [id]: { ...p[id], isMaximized: !p[id].isMaximized } }))} onFocus={() => { const nz = maxZIndex + 1; setMaxZIndex(nz); setWindows(p => ({ ...p, [id]: { ...p[id], zIndex: nz } })); setActiveApp(id as AppId); }} zIndex={state.zIndex} active={activeApp === id} isMaximized={state.isMaximized} initialTop={it} initialLeft={il} hideTitleBarStyling={id === 'about'} integratedTitleBar={id === 'browser' || id === 'finder'} isResizable={id !== 'about'} width={w} height={h}>{Content}</Window>;
        })}
      </main>
      <Dock 
        onLaunch={(id) => {
          if (id === 'finder') {
            toggleApp(id, 'desktop');
          } else {
            toggleApp(id);
          }
        }} 
        activeApp={activeApp} 
        minimizedApps={minimizedAppIds} 
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
