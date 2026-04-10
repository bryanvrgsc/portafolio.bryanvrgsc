"use client";

import React from 'react';
import { motion } from 'framer-motion';

const NotificationCenter = () => {
  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 350 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 350 }}
      className="tahoe-glass-panel-strong fixed top-10 right-2 w-80 h-[calc(100vh-100px)] rounded-[1.9rem] p-4 z-[60000] flex flex-col gap-4 overflow-y-auto system-panel notif-center-panel"
    >
      <div className="tahoe-card rounded-[1.4rem] p-4">
        <h3 className="font-semibold text-[11px] uppercase tracking-[0.22em] mb-2" style={{ color: 'var(--tahoe-text-tertiary)' }}>
          Calendario
        </h3>
        <div className="text-[1.9rem] font-light mb-4 capitalize">
          {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
          {days.map((day, index) => (
            <div key={`${day}-${index}`} className="font-semibold" style={{ color: 'var(--tahoe-text-tertiary)' }}>
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={day ? 'p-1 w-7 h-7 flex items-center justify-center rounded-full transition-colors' : 'p-1 w-7 h-7'}
              style={day === today
                ? { background: 'var(--tahoe-accent)', color: 'white', fontWeight: 700 }
                : { color: 'var(--tahoe-text-secondary)' }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="tahoe-card rounded-[1.4rem] p-4 flex flex-col items-center justify-center text-center">
        <h3 className="font-semibold text-[11px] uppercase tracking-[0.22em] mb-2 w-full text-left" style={{ color: 'var(--tahoe-text-tertiary)' }}>
          Clima
        </h3>
        <div className="text-4xl mb-1">☀️</div>
        <div className="text-2xl font-semibold">24°</div>
        <div className="text-[11px]" style={{ color: 'var(--tahoe-text-secondary)' }}>
          Despejado • San José, CR
        </div>
      </div>

      <div className="tahoe-card rounded-[1.4rem] p-4">
        <h3 className="font-semibold text-[11px] uppercase tracking-[0.22em] mb-2" style={{ color: 'var(--tahoe-text-tertiary)' }}>
          Notas
        </h3>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--tahoe-text-secondary)' }}>
          Recordatorio: revisar la arquitectura del portafolio y pulir las animaciones de Framer Motion.
        </p>
      </div>
    </motion.div>
  );
};

export default NotificationCenter;
