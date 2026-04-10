"use client";

import React, { useCallback, useRef, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import { AppId } from './Desktop';
import { cn } from '@/lib/utils';

interface DockProps {
  onLaunch: (id: AppId, path?: string) => void;
  activeApp: AppId | null;
  minimizedApps: AppId[];
  openApps: AppId[];
}

interface DockIconProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
  mouseX: MotionValue<number>;
  isOpen: boolean;
  isMinimized: boolean;
  isActive: boolean;
  baseSize: number;
  maxSize: number;
  priority?: boolean;
}

const DOCK_APPS: { id: AppId; iconSrc: string; label: string; initialPath?: string }[] = [
  { id: 'finder', iconSrc: '/icons/finder.avif', label: 'Finder', initialPath: 'desktop' },
  { id: 'profile', iconSrc: '/icons/profile.avif', label: 'Perfil' },
  { id: 'browser', iconSrc: '/icons/safari.avif', label: 'Safari' },
  { id: 'notes', iconSrc: '/icons/notes.avif', label: 'Notas' },
  { id: 'terminal', iconSrc: '/icons/terminal.avif', label: 'Terminal' },
];

const DockIcon = memo(({
  iconSrc,
  label,
  onClick,
  mouseX,
  isOpen,
  isMinimized,
  isActive,
  baseSize,
  maxSize,
  priority = false,
}: DockIconProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (value) => {
    if (!ref.current || value === Infinity) {
      return Infinity;
    }

    const bounds = ref.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    return value - centerX;
  });

  const size = useTransform(distance, (dist) => {
    if (dist === Infinity) {
      return baseSize;
    }

    const absDist = Math.abs(dist);
    if (absDist > 150) {
      return baseSize;
    }

    const scale = Math.exp(-Math.pow(absDist / 60, 2));
    return baseSize + (maxSize - baseSize) * scale;
  });

  const sizeSpring = useSpring(size, {
    mass: 0.1,
    stiffness: 160,
    damping: 14,
  });

  return (
    <motion.button
      ref={ref}
      style={{ width: sizeSpring, height: sizeSpring }}
      onClick={onClick}
      title={label}
      aria-label={`Abrir ${label}`}
      className="relative cursor-pointer flex-shrink-0 group mx-[3px] outline-none w-[var(--dock-base)] h-[var(--dock-base)]"
    >
      <Image
        src={iconSrc}
        alt={label}
        fill
        className={cn(
          'object-cover transition-all duration-200',
          isMinimized ? 'opacity-55 scale-[0.96]' : 'opacity-100',
          isActive && 'drop-shadow-[0_10px_18px_rgba(255,255,255,0.18)]'
        )}
        draggable={false}
        sizes={`${maxSize}px`}
        priority={priority}
      />

      <div className="tahoe-dock-tooltip absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {label}
      </div>

      {isOpen && (
        <div className="tahoe-dock-indicator absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" />
      )}
    </motion.button>
  );
});

DockIcon.displayName = 'DockIcon';

const Dock: React.FC<DockProps> = ({ onLaunch, activeApp, minimizedApps, openApps }) => {
  const mouseX = useMotionValue(Infinity);
  const dockRef = useRef<HTMLDivElement>(null);
  const [iconSize, setIconSize] = React.useState({ base: 76, max: 132 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIconSize({ base: 56, max: 94 });
      } else {
        setIconSize({ base: 76, max: 132 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    mouseX.set(event.clientX);
  }, [mouseX]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Infinity);
  }, [mouseX]);

  const paddingX = useTransform(mouseX, (value) => {
    if (!dockRef.current || value === Infinity) {
      return 14;
    }

    const rect = dockRef.current.getBoundingClientRect();
    const distFromLeft = value - rect.left;
    const distFromRight = rect.right - value;
    const minDist = Math.min(distFromLeft, distFromRight);

    if (minDist < 0 || minDist > 100) {
      return 14;
    }

    const extra = 18 * Math.exp(-Math.pow(minDist / 40, 2));
    return 14 + extra;
  });

  const paddingSpring = useSpring(paddingX, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-[2000] dock-container">
      <div className="relative [--dock-base:56px] [--dock-max:94px] sm:[--dock-base:76px] sm:[--dock-max:132px]">
        <motion.div
          ref={dockRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            paddingLeft: paddingSpring,
            paddingRight: paddingSpring,
            height: 'calc(var(--dock-base) + 14px)',
          }}
          className="tahoe-dock absolute bottom-0 left-0 right-0 rounded-[1.75rem] pointer-events-auto transition-all duration-300"
        />
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            paddingLeft: paddingSpring,
            paddingRight: paddingSpring,
          }}
          className="relative flex items-end pb-3 pt-8"
        >
          {DOCK_APPS.map((app, index) => (
            <DockIcon
              key={`${app.id}-${index}`}
              iconSrc={app.iconSrc}
              label={app.label}
              onClick={() => onLaunch(app.id, app.initialPath)}
              mouseX={mouseX}
              isOpen={openApps.includes(app.id)}
              isMinimized={minimizedApps.includes(app.id)}
              isActive={activeApp === app.id}
              baseSize={iconSize.base}
              maxSize={iconSize.max}
              priority
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default memo(Dock);
