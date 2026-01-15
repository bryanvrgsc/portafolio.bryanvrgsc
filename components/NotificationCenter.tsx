"use client";

import React from 'react';
import { motion } from 'framer-motion';

const NotificationCenter = () => {
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const date = new Date();
  
  // Calcular datos del mes actual
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Dom) a 6 (Sab)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Crear array con espacios vacíos para el inicio del mes
  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 350 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 350 }}
      className="fixed top-10 right-2 w-80 h-[calc(100vh-100px)] bg-black/20 backdrop-blur-3xl border-l border-white/5 p-4 z-[60000] flex flex-col gap-4 overflow-y-auto system-panel notif-center-panel"
    >
      <div className="bg-white/10 rounded-2xl p-4">
        <h3 className="text-red-400 font-bold text-xs uppercase mb-2">Calendario</h3>
        <div className="text-2xl font-light mb-4 capitalize">
          {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
          {days.map((d, i) => (
            <div key={`${d}-${i}`} className="opacity-40 font-bold">{d}</div>
          ))}
          {calendarDays.map((day, i) => (
            <div 
              key={i} 
              className={`p-1 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                day === today ? 'bg-blue-500 text-white font-bold' : 
                day ? 'hover:bg-white/10' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-inner border border-white/5">
        <h3 className="text-blue-400 font-bold text-xs uppercase mb-2 w-full text-left">Clima</h3>
        <div className="text-4xl mb-1">☀️</div>
        <div className="text-2xl font-bold">24°</div>
        <div className="text-[11px] opacity-60">Despejado • San José, CR</div>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
        <h3 className="text-orange-400 font-bold text-xs uppercase mb-2">Notas</h3>
        <p className="text-[13px] opacity-80 leading-relaxed">
          Recordatorio: Revisar la arquitectura del portafolio y optimizar animaciones de Framer Motion.
        </p>
      </div>
    </motion.div>
  );
};

export default NotificationCenter;