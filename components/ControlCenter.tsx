import React from 'react';
import { Wifi, Bluetooth, Airplay, Moon, Sun, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSystem } from '@/context/SystemContext';

const ControlCenter = () => {
  const { brightness, setBrightness, volume, setVolume } = useSystem();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute top-10 right-2 w-80 bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 z-[60000] grid grid-cols-2 gap-3 system-panel control-center-panel"
    >
      {/* Conectividad */}
      <div className="col-span-1 bg-white/10 rounded-xl p-3 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center"><Wifi size={14} /></div>
          <div className="flex flex-col"><span className="text-[12px] font-bold">Wi-Fi</span><span className="text-[10px] opacity-50">Tu_Red_5G</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center"><Bluetooth size={14} /></div>
          <div className="flex flex-col"><span className="text-[12px] font-bold">Bluetooth</span><span className="text-[10px] opacity-50">Activado</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center"><Airplay size={14} /></div>
          <div className="flex flex-col"><span className="text-[12px] font-bold">AirDrop</span><span className="text-[10px] opacity-50">Solo contactos</span></div>
        </div>
      </div>

      {/* Modos */}
      <div className="col-span-1 flex flex-col gap-3">
        <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
          <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center"><Moon size={14} /></div>
          <span className="text-[12px] font-bold">Concentración</span>
        </div>
        <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <Sun size={18} className="mb-1" />
          <span className="text-[10px]">Brillo de pantalla</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="col-span-2 bg-white/10 rounded-xl p-3 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-bold"><span>Brillo</span></div>
          <div className="h-5 bg-white/10 rounded-full relative overflow-hidden flex items-center group/slider">
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Brillo de pantalla"
            />
            <div
              className="h-full bg-white/40 transition-all duration-75"
              style={{ width: `${brightness}%` }}
            />
            <Sun size={12} className="absolute left-2 opacity-50 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-bold"><span>Sonido</span></div>
          <div className="h-5 bg-white/10 rounded-full relative overflow-hidden flex items-center group/slider">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="Volumen del sistema"
            />
            <div
              className="h-full bg-white/40 transition-all duration-75"
              style={{ width: `${volume}%` }}
            />
            <Volume2 size={12} className="absolute left-2 opacity-50 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ControlCenter;
