"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import { Apple, Wifi, Battery, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuBarProps {
  activeApp: string | null;
  onAction: (action: string) => void;
  toggleSpotlight: () => void;
  closeSpotlight: () => void; // Nueva prop
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: (val: boolean) => void;
  isNotifOpen: boolean;
  setIsNotifOpen: (val: boolean) => void;
}

const DropdownItem = ({ label, shortcut, onClick }: { label: string, shortcut?: string, onClick?: () => void }) => (
  <button onClick={onClick} className="w-full px-4 py-1.5 text-left hover:bg-blue-600 flex justify-between items-center group transition-colors first:rounded-t-lg last:rounded-b-lg">
    <span className="text-[13px] text-white">{label}</span>
    {shortcut && <span className="text-[11px] opacity-40 group-hover:opacity-100 text-white">{shortcut}</span>}
  </button>
);

const MenuItem = ({ id, label, children, isApple = false, align = 'left', isOpen, onToggle }: { id: string, label: React.ReactNode, children: React.ReactNode, isApple?: boolean, align?: 'left' | 'right', isOpen: boolean, onToggle: (id: string) => void }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [adjustedAlign, setAdjustedAlign] = useState<'left' | 'right'>(align);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const padding = 8;

      if (align === 'left' && rect.right > window.innerWidth - padding) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAdjustedAlign('right');
      } else if (align === 'right' && rect.left < padding) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAdjustedAlign('left');
      }
    }
  }, [isOpen, align]);

  return (
    <div className="relative h-full flex items-center">
      <button onClick={() => onToggle(id)} className={`px-2 h-full flex items-center transition-colors rounded-md ${isOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}>
        {isApple ? <Apple size={16} className="fill-current" /> : label}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`absolute top-8 ${adjustedAlign === 'left' ? 'left-0' : 'right-0'} w-64 bg-[#1c1c1e]/90 backdrop-blur-3xl border border-white/10 rounded-lg shadow-2xl py-1 z-[900000]`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuBar: React.FC<MenuBarProps> = ({ activeApp, onAction, toggleSpotlight, closeSpotlight, isControlCenterOpen, setIsControlCenterOpen, isNotifOpen, setIsNotifOpen }) => {
  const [time, setTime] = useState(new Date());
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-bar-container')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleMenu = (id: string) => {
    const isNowOpening = openMenu !== id;
    setOpenMenu(isNowOpening ? id : null);
    if (isNowOpening) {
      setIsControlCenterOpen(false);
      setIsNotifOpen(false);
      closeSpotlight(); // Cerrar spotlight si abrimos un menú
    }
  };

  const formattedTime = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = time.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div ref={menuRef} className="h-8 w-full bg-white/10 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-2 text-white text-[13px] font-medium select-none h-full menu-bar-container">
      <div className="flex items-center h-full">
        <MenuItem id="apple" label="apple" isApple isOpen={openMenu === 'apple'} onToggle={handleToggleMenu}>
          <DropdownItem label="Acerca de este Mac" onClick={() => onAction('about')} />
          <div className="h-[1px] bg-white/10 my-1" />
          <DropdownItem label="Reiniciar..." onClick={() => onAction('restart')} />
          <DropdownItem label="Apagar Equipo..." onClick={() => onAction('shutdown')} />
        </MenuItem>
        <span className="px-3 font-bold">{activeApp ? activeApp.charAt(0).toUpperCase() + activeApp.slice(1) : 'Finder'}</span>
        <div className="hidden md:flex items-center h-full">
          <MenuItem id="archivo" label="Archivo" isOpen={openMenu === 'archivo'} onToggle={handleToggleMenu}><DropdownItem label="Nueva Ventana" shortcut="⌘N" /></MenuItem>
          <MenuItem id="edicion" label="Edición" isOpen={openMenu === 'edicion'} onToggle={handleToggleMenu}><DropdownItem label="Copiar" shortcut="⌘C" /></MenuItem>
        </div>
      </div>

      <div className="flex items-center gap-1 h-full">
        <MenuItem id="wifi" label={<Wifi size={14} />} align="right" isOpen={openMenu === 'wifi'} onToggle={handleToggleMenu}>
          <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center"><span className="font-bold text-white">Wi-Fi</span><div className="w-8 h-4 bg-blue-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div></div>
          <DropdownItem label="Tu_Red_5G" shortcut="✔" />
        </MenuItem>
        <MenuItem id="battery" label={<Battery size={14} className="rotate-90" />} align="right" isOpen={openMenu === 'battery'} onToggle={handleToggleMenu}>
          <div className="px-4 py-2 flex flex-col gap-1"><span className="font-bold text-white">Batería</span><span className="text-white/40 text-[11px]">85%</span></div>
        </MenuItem>
        <button onClick={() => { toggleSpotlight(); setOpenMenu(null); setIsControlCenterOpen(false); setIsNotifOpen(false); }} className="p-1.5 hover:bg-white/10 rounded-md transition-colors search-toggle"><Search size={14} /></button>
        <button onClick={() => { setIsControlCenterOpen(!isControlCenterOpen); setIsNotifOpen(false); setOpenMenu(null); }} className={`p-1.5 rounded-md transition-colors control-center-toggle ${isControlCenterOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}><SlidersHorizontal size={14} /></button>
        <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsControlCenterOpen(false); setOpenMenu(null); }} className={`flex items-center gap-2 px-2 rounded-md h-[80%] transition-colors notif-center-toggle ${isNotifOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}><span>{formattedDate}</span><span>{formattedTime}</span></button>
      </div>
    </div>
  );
};

export default memo(MenuBar);
