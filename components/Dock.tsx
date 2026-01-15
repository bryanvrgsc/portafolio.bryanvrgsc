"use client";

import React, { useCallback, useRef, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { AppId } from './Desktop';
import { cn } from '@/lib/utils';

interface DockProps {
  onLaunch: (id: AppId) => void;
  activeApp: AppId | null;
  minimizedApps: AppId[];
}

interface DockIconProps {
  emoji?: string;
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  mouseX: MotionValue<number>;
  isActive: boolean;
  isMinimized: boolean;
}

const TerminalIcon = () => (
  <div className="w-full h-full bg-black/90 flex flex-col items-start p-[20%] relative overflow-hidden">
    <div className="flex items-center gap-[4px]">
      <span className="text-green-500 font-bold text-[1.4rem] leading-none">$</span>
      <div className="w-[8px] h-[1.2rem] bg-green-500 animate-pulse mt-[2px]" />
    </div>
    {/* Reflejo sutil superior */}
    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
  </div>
);

const DockIcon = memo(({
  emoji,
  icon,
  label,
  onClick,
  mouseX,
  isActive,
  isMinimized
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const centerX = useMotionValue(0);

  // Update center position on mount and resize without triggering re-renders
  useEffect(() => {
    const updateCenter = () => {
      if (ref.current) {
        const bounds = ref.current.getBoundingClientRect();
        centerX.set(bounds.left + bounds.width / 2);
      }
    };

    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, [centerX]);

  const distance = useTransform(mouseX, (val: number) => {
    return val !== Infinity ? val - centerX.get() : Infinity;
  });

  const scaleSync = useTransform(distance, [-200, 0, 200], [1, 2.3, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 180, damping: 15 });

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = React.useState<React.CSSProperties>({ left: '50%', transform: 'translateX(-50%)' });

  useEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const padding = 12;
      let offset = 0;

      if (rect.left < padding) {
        offset = padding - rect.left;
      } else if (rect.right > window.innerWidth - padding) {
        offset = window.innerWidth - padding - rect.right;
      }

      if (offset !== 0) {
        setTooltipStyle({ left: '50%', transform: `translateX(calc(-50% + ${offset}px))` });
      } else {
        setTooltipStyle({ left: '50%', transform: 'translateX(-50%)' });
      }
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{ scale, willChange: 'transform' }}
      onClick={onClick}
      className={cn(
        "w-12 aspect-square rounded-[1.2rem] bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer relative group transition-all overflow-hidden",
        isMinimized ? "opacity-50" : "opacity-100",
        "hover:bg-white/30"
      )}
    >
      {icon ? (
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>
      ) : (
        <span className="text-3xl select-none">{emoji}</span>
      )}
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        className="absolute -top-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
      >
        {label}
      </div>
      {(isActive || isMinimized) && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-white shadow-sm" />
      )}
    </motion.div>
  );
});

DockIcon.displayName = 'DockIcon';

const DOCK_APPS: { id: AppId; emoji?: string; icon?: React.ReactNode; label: string }[] = [
  { id: 'finder', emoji: '📂', label: 'Finder' },
  { id: 'profile', emoji: '👤', label: 'Perfil' },
  { id: 'browser', emoji: '🌐', label: 'Safari' },
  { id: 'terminal', icon: <TerminalIcon />, label: 'iTerm' },
];

const Dock: React.FC<DockProps> = ({ onLaunch, activeApp, minimizedApps }) => {
  const mouseX = useMotionValue(Infinity);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
  }, [mouseX]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Infinity);
  }, [mouseX]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[2000] dock-container">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex items-end gap-3 px-4 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] shadow-2xl"
      >
        {DOCK_APPS.map((app) => (
          <DockIcon
            key={app.id}
            emoji={app.emoji}
            icon={app.icon}
            label={app.label}
            onClick={() => onLaunch(app.id)}
            mouseX={mouseX}
            isActive={activeApp === app.id}
            isMinimized={minimizedApps.includes(app.id)}
          />
        ))}

      </motion.div>
    </div>
  );
};

export default memo(Dock);
