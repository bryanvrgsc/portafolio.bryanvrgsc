"use client";

import React, { useState, useEffect, memo } from 'react';
import { Wifi, Battery, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppleLogo from './AppleLogo';
import { cn } from '@/lib/utils';
import { formatMenuBarDateTime } from '@/lib/menu-bar-time.mjs';

interface MenuBarProps {
  activeApp: string | null;
  onAction: (action: string) => void;
  toggleSpotlight: () => void;
  closeSpotlight: () => void;
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: (val: boolean) => void;
  isNotifOpen: boolean;
  setIsNotifOpen: (val: boolean) => void;
}

interface DropdownItemProps {
  label: string;
  shortcut?: string;
  onClick?: () => void;
}

const DropdownItem = ({ label, shortcut, onClick }: DropdownItemProps) => (
  <button
    onClick={onClick}
    className="tahoe-menu-item w-full px-4 py-2 text-left flex justify-between items-center rounded-xl transition-colors"
  >
    <span className="text-[13px]">{label}</span>
    {shortcut && (
      <span className="text-[11px]" style={{ color: 'var(--tahoe-text-tertiary)' }}>
        {shortcut}
      </span>
    )}
  </button>
);

interface MenuItemProps {
  id: string;
  label: React.ReactNode;
  children: React.ReactNode;
  isApple?: boolean;
  align?: 'left' | 'right';
  isOpen: boolean;
  onToggle: (id: string) => void;
  ariaLabel?: string;
}

const MenuItem = ({
  id,
  label,
  children,
  isApple = false,
  align = 'left',
  isOpen,
  onToggle,
  ariaLabel,
}: MenuItemProps) => {
  return (
    <div className="relative h-full flex items-center">
      <button
        onClick={() => onToggle(id)}
        data-open={isOpen}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : id)}
        className="tahoe-menubar-button px-2.5 h-full flex items-center transition-colors rounded-lg"
      >
        {isApple ? <AppleLogo size={16} /> : label}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={cn(
              'tahoe-menu absolute top-8 w-64 rounded-2xl p-1.5 z-[900000]',
              align === 'left' ? 'left-0' : 'right-0'
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuBar: React.FC<MenuBarProps> = ({
  activeApp,
  onAction,
  toggleSpotlight,
  closeSpotlight,
  isControlCenterOpen,
  setIsControlCenterOpen,
  isNotifOpen,
  setIsNotifOpen,
}) => {
  const [time, setTime] = useState(new Date());
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
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
      closeSpotlight();
    }
  };

  const formattedDateTime = formatMenuBarDateTime(time);

  return (
    <div className="tahoe-menubar menu-bar-container h-8 w-full flex items-center justify-between px-2.5 text-[13px] font-medium">
      <div className="flex items-center h-full gap-0.5">
        <MenuItem
          id="apple"
          label="apple"
          isApple
          isOpen={openMenu === 'apple'}
          onToggle={handleToggleMenu}
          ariaLabel="Menú Apple"
        >
          <DropdownItem label="Acerca de este Mac" onClick={() => onAction('about')} />
          <div className="tahoe-menu-separator h-px my-1 mx-2" />
          <DropdownItem label="Reiniciar..." onClick={() => onAction('restart')} />
          <DropdownItem label="Apagar Equipo..." onClick={() => onAction('shutdown')} />
        </MenuItem>
        <span className="px-2.5 text-[13px] font-semibold" style={{ color: 'var(--tahoe-text-primary)' }}>
          {activeApp ? activeApp.charAt(0).toUpperCase() + activeApp.slice(1) : 'Finder'}
        </span>
        <div className="hidden md:flex items-center h-full">
          <MenuItem id="archivo" label="Archivo" isOpen={openMenu === 'archivo'} onToggle={handleToggleMenu}>
            <DropdownItem label="Nueva Ventana" shortcut="⌘N" />
          </MenuItem>
          <MenuItem id="edicion" label="Edición" isOpen={openMenu === 'edicion'} onToggle={handleToggleMenu}>
            <DropdownItem label="Copiar" shortcut="⌘C" />
          </MenuItem>
        </div>
      </div>

      <div className="flex items-center gap-1 h-full">
        <MenuItem
          id="wifi"
          label={<Wifi size={14} />}
          align="right"
          isOpen={openMenu === 'wifi'}
          onToggle={handleToggleMenu}
        >
          <div className="px-4 py-3 flex justify-between items-center rounded-xl">
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold">Wi-Fi</span>
              <span className="text-[11px]" style={{ color: 'var(--tahoe-text-secondary)' }}>
                Tu_Red_5G
              </span>
            </div>
            <div className="w-9 h-5 rounded-full bg-[var(--tahoe-accent)]/90 relative">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <DropdownItem label="Wi-Fi activado" />
        </MenuItem>
        <MenuItem
          id="battery"
          label={<Battery size={14} className="rotate-90" />}
          align="right"
          isOpen={openMenu === 'battery'}
          onToggle={handleToggleMenu}
        >
          <div className="px-4 py-3 rounded-xl">
            <span className="text-[12px] font-semibold block">Batería</span>
            <span className="text-[11px]" style={{ color: 'var(--tahoe-text-secondary)' }}>
              85% disponible
            </span>
          </div>
        </MenuItem>
        <button
          onClick={() => {
            toggleSpotlight();
            setOpenMenu(null);
            setIsControlCenterOpen(false);
            setIsNotifOpen(false);
          }}
          className="tahoe-menubar-button search-toggle p-1.5 rounded-lg transition-colors"
          aria-label="Buscar"
        >
          <Search size={14} />
        </button>
        <button
          onClick={() => {
            setIsControlCenterOpen(!isControlCenterOpen);
            setIsNotifOpen(false);
            setOpenMenu(null);
          }}
          data-open={isControlCenterOpen}
          className="tahoe-menubar-button control-center-toggle p-1.5 rounded-lg transition-colors"
          aria-label="Centro de control"
        >
          <SlidersHorizontal size={14} />
        </button>
        <button
          onClick={() => {
            setIsNotifOpen(!isNotifOpen);
            setIsControlCenterOpen(false);
            setOpenMenu(null);
          }}
          data-open={isNotifOpen}
          className="tahoe-menubar-button notif-center-toggle flex items-center gap-2 px-2.5 rounded-lg h-[80%] transition-colors"
          aria-label="Notificaciones y fecha"
        >
          <span>{formattedDateTime}</span>
        </button>
      </div>
    </div>
  );
};

export default memo(MenuBar);
