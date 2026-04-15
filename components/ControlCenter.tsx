import React from 'react';
import {
  Airplay,
  Bluetooth,
  Camera,
  Monitor,
  Moon,
  Sun,
  Volume2,
  Wifi,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSystem } from '@/context/SystemContext';

const THEME_MODE_LABELS = {
  system: 'Automático',
  dark: 'Oscuro',
  light: 'Claro',
} as const;

const CONNECTIVITY_TOGGLES = [
  { Icon: Wifi, label: 'Wi-Fi', value: 'Internet', active: true },
  { Icon: Bluetooth, label: 'Bluetooth', value: 'Activado', active: true },
  { Icon: Airplay, label: 'AirDrop', value: 'Sólo contactos', active: true },
] as const;

const ControlCenter = () => {
  const { themeMode, appearance, cycleThemeMode, brightness, setBrightness, volume, setVolume } = useSystem();

  const themeLabel = THEME_MODE_LABELS[themeMode];
  const themeDetail = themeMode === 'system'
    ? `Sistema · ${appearance === 'dark' ? 'Oscuro' : 'Claro'}`
    : `Manual · ${themeLabel}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="tahoe-glass-panel-strong absolute top-10 right-2 z-[60000] flex w-[22rem] flex-col gap-3 rounded-[1.75rem] p-3.5 system-panel control-center-panel"
    >
      <div className="control-center-top-grid grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-3">
        <div className="flex flex-col gap-3">
          {CONNECTIVITY_TOGGLES.map(({ Icon, label, value, active }) => (
            <button
              key={label}
              type="button"
              data-active={active}
              className="tahoe-card control-center-toggle-card flex min-h-[4.5rem] items-center gap-3 rounded-[1.75rem] px-3.5 py-3 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--tahoe-accent)]">
                <Icon size={18} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-semibold">{label}</span>
                <span className="text-[11px]" style={{ color: 'var(--tahoe-text-secondary)' }}>{value}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="tahoe-card control-center-media-card flex min-h-[5.75rem] flex-col justify-between rounded-[1.75rem] p-3">
            <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/12" />
            <div className="space-y-1">
              <p className="text-[12px] font-semibold">Sin reproducción</p>
              <div className="flex items-center gap-3 text-white/55">
                <span className="text-sm">◀◀</span>
                <span className="text-base">▶</span>
                <span className="text-sm">▶▶</span>
              </div>
            </div>
          </div>

          <div className="control-center-utility-row grid grid-cols-[3.4rem_minmax(0,1fr)] items-stretch gap-3">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={cycleThemeMode}
                data-mode={themeMode}
                data-active={themeMode !== 'system'}
                className="tahoe-card control-center-quick-button control-center-theme-button flex aspect-square w-[3.4rem] items-center justify-center rounded-full"
                aria-label={`Cambiar tema. Estado actual: ${themeLabel}`}
              >
                <Monitor size={18} />
              </button>

              <button
                type="button"
                className="tahoe-card control-center-quick-button flex aspect-square w-[3.4rem] items-center justify-center rounded-full"
                aria-label="Abrir control de cámara"
              >
                <Camera size={17} />
              </button>
            </div>

            <div className="tahoe-card control-center-theme-status flex h-full flex-col justify-center rounded-[1.75rem] px-3 py-3">
              <span className="text-[13px] font-semibold">Tema</span>
              <span className="text-[12px] font-semibold">{themeLabel}</span>
              <span className="text-[11px]" style={{ color: 'var(--tahoe-text-secondary)' }}>{themeDetail}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tahoe-card flex flex-col gap-2 rounded-[1.55rem] px-3.5 py-3">
        <div className="text-[12px] font-semibold">Pantalla</div>
        <div className="tahoe-slider-track relative flex h-5 items-center overflow-hidden rounded-full">
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(event) => setBrightness(parseInt(event.target.value, 10))}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            aria-label="Brillo de pantalla"
          />
          <div className="tahoe-slider-fill h-full transition-all duration-75" style={{ width: `${brightness}%` }} />
          <Sun size={12} className="pointer-events-none absolute left-2 opacity-60" />
        </div>
      </div>

      <div className="tahoe-card flex flex-col gap-2 rounded-[1.55rem] px-3.5 py-3">
        <div className="text-[12px] font-semibold">Sonido</div>
        <div className="tahoe-slider-track relative flex h-5 items-center overflow-hidden rounded-full">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => setVolume(parseInt(event.target.value, 10))}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            aria-label="Volumen del sistema"
          />
          <div className="tahoe-slider-fill h-full transition-all duration-75" style={{ width: `${volume}%` }} />
          <Volume2 size={12} className="pointer-events-none absolute left-2 opacity-60" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-3">
        <button
          type="button"
          className="tahoe-card control-center-secondary-card flex min-h-[8.75rem] flex-col justify-between rounded-[1.75rem] px-3.5 py-4 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
            <Moon size={18} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold">Enfoque</span>
            <span className="text-[11px]" style={{ color: 'var(--tahoe-text-secondary)' }}>Activado</span>
          </span>
        </button>

        <button
          type="button"
          className="tahoe-card control-center-secondary-card flex min-h-[8.75rem] items-end rounded-[1.75rem] px-3.5 py-4 text-left"
        >
          <span className="text-[13px] font-semibold">Iniciar protector de pantalla</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ControlCenter;
