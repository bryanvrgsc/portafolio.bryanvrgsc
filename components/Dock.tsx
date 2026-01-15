"use client";

import React, { useCallback, useRef, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { AppId } from './Desktop';
import Image from 'next/image';

interface DockProps {
  onLaunch: (id: AppId) => void;
  activeApp: AppId | null;
  minimizedApps: AppId[];
}

interface DockIconProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
  mouseX: MotionValue<number>;
  isActive: boolean;
  isMinimized: boolean;
}

const DOCK_APPS: { id: AppId; iconSrc: string; label: string }[] = [
  { id: 'finder', iconSrc: '/icons/finder.png', label: 'Finder' },
  { id: 'profile', iconSrc: '/icons/profile.png', label: 'Perfil' },
  { id: 'browser', iconSrc: '/icons/safari.png', label: 'Safari' },
  { id: 'terminal', iconSrc: '/icons/terminal.png', label: 'Terminal' },
];

const DockIcon = memo(({
  iconSrc,
  label,
  onClick,
  mouseX,
  isActive,
  isMinimized
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Calcular distancia al cursor
  const distance = useTransform(mouseX, (val) => {
    if (!ref.current || val === Infinity) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    return val - centerX;
  });

  // Tamaño del icono basado en distancia (efecto gaussiano)
  const baseSize = 64;
  const maxSize = 120;

  const size = useTransform(distance, (dist) => {
    if (dist === Infinity) return baseSize;
    const absDist = Math.abs(dist);
    // Rango de influencia de 150px
    if (absDist > 150) return baseSize;
    // Curva gaussiana suave
    const scale = Math.exp(-Math.pow(absDist / 60, 2));
    return baseSize + (maxSize - baseSize) * scale;
  });

  const sizeSpring = useSpring(size, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });

  return (
    <motion.div
      ref={ref}
      style={{
        width: sizeSpring,
        height: sizeSpring,
      }}
      onClick={onClick}
      className="relative cursor-pointer flex-shrink-0 group mx-1"
    >
      {/* Icono */}
      <Image
        src={iconSrc}
        alt={label}
        fill
        className={`object-cover transition-opacity ${isMinimized ? 'opacity-50' : 'opacity-100'}`}
        draggable={false}
        sizes="120px"
      />

      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {label}
      </div>

      {/* Indicador de app activa */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
      )}
    </motion.div>
  );
});

DockIcon.displayName = 'DockIcon';

const Dock: React.FC<DockProps> = ({ onLaunch, activeApp, minimizedApps }) => {
  const mouseX = useMotionValue(Infinity);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
  }, [mouseX]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Infinity);
  }, [mouseX]);

  // Padding dinámico para las esquinas
  const paddingX = useTransform(mouseX, (x) => {
    if (!dockRef.current || x === Infinity) return 12;
    const rect = dockRef.current.getBoundingClientRect();
    const distFromLeft = x - rect.left;
    const distFromRight = rect.right - x;
    const minDist = Math.min(distFromLeft, distFromRight);

    if (minDist < 0 || minDist > 100) return 12;
    // Expandir padding cuando está cerca de los bordes
    const extra = 24 * Math.exp(-Math.pow(minDist / 40, 2));
    return 12 + extra;
  });

  const paddingSpring = useSpring(paddingX, {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  });

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[2000] dock-container">
      {/* Contenedor exterior para permitir overflow de iconos */}
      <div className="relative">
        {/* Fondo del dock con altura FIJA */}
        <motion.div
          ref={dockRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            paddingLeft: paddingSpring,
            paddingRight: paddingSpring
          }}
          className="absolute bottom-0 left-0 right-0 h-[72px] bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl pointer-events-auto"
        />
        {/* Contenedor de iconos (pueden sobresalir del fondo) */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            paddingLeft: paddingSpring,
            paddingRight: paddingSpring
          }}
          className="relative flex items-end pb-2 pt-10"
        >
          {DOCK_APPS.map((app) => (
            <DockIcon
              key={app.id}
              iconSrc={app.iconSrc}
              label={app.label}
              onClick={() => onLaunch(app.id)}
              mouseX={mouseX}
              isActive={activeApp === app.id}
              isMinimized={minimizedApps.includes(app.id)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default memo(Dock);
