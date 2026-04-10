import React from 'react';
import { Wifi, Bluetooth, Airplay, Moon, Sun, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSystem } from '@/context/SystemContext';

const ControlCenter = () => {
  const { brightness, setBrightness, volume, setVolume } = useSystem();

  return (
    <motion.div
      initial={{ opacity: 0, y: -18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="tahoe-glass-panel-strong absolute top-10 right-2 w-[22rem] rounded-[1.75rem] p-4 z-[60000] grid grid-cols-2 gap-3 system-panel control-center-panel"
    >
      <div className="tahoe-card col-span-1 rounded-2xl p-3 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--tahoe-accent)] flex items-center justify-center text-white">
            <Wifi size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold">Wi-Fi</span>
            <span className="text-[10px]" style={{ color: 'var(--tahoe-text-secondary)' }}>Tu_Red_5G</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--tahoe-accent)] flex items-center justify-center text-white">
            <Bluetooth size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold">Bluetooth</span>
            <span className="text-[10px]" style={{ color: 'var(--tahoe-text-secondary)' }}>Activado</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--tahoe-accent)] flex items-center justify-center text-white">
            <Airplay size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold">AirDrop</span>
            <span className="text-[10px]" style={{ color: 'var(--tahoe-text-secondary)' }}>Solo contactos</span>
          </div>
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-3">
        <div className="tahoe-card rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Moon size={14} />
          </div>
          <span className="text-[12px] font-semibold">Concentración</span>
        </div>
        <div className="tahoe-card rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Sun size={18} className="mb-1" />
          <span className="text-[10px]" style={{ color: 'var(--tahoe-text-secondary)' }}>
            Brillo de pantalla
          </span>
        </div>
      </div>

      <div className="tahoe-card col-span-2 rounded-[1.35rem] p-3 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-semibold">
            <span>Brillo</span>
          </div>
          <div className="tahoe-slider-track h-5 rounded-full relative overflow-hidden flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Brillo de pantalla"
            />
            <div className="tahoe-slider-fill h-full transition-all duration-75" style={{ width: `${brightness}%` }} />
            <Sun size={12} className="absolute left-2 opacity-60 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-semibold">
            <span>Sonido</span>
          </div>
          <div className="tahoe-slider-track h-5 rounded-full relative overflow-hidden flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value, 10))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Volumen del sistema"
            />
            <div className="tahoe-slider-fill h-full transition-all duration-75" style={{ width: `${volume}%` }} />
            <Volume2 size={12} className="absolute left-2 opacity-60 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ControlCenter;
