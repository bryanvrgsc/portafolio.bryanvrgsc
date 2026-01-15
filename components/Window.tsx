"use client";

import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  zIndex: number;
  active: boolean;
  isMaximized?: boolean;
  initialTop?: number;
  initialLeft?: number;
  hideTitleBarStyling?: boolean;
  isResizable?: boolean;
  width?: string;
  height?: string;
}

const Window: React.FC<WindowProps> = ({
  title, children, onClose, onMinimize, onMaximize, onFocus, zIndex, active, isMaximized,
  initialTop = 100, initialLeft = 200, hideTitleBarStyling = false,
  isResizable = true, width = '800px', height = '500px'
}) => {
  const dragControls = useDragControls();

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragListener={false}
      initial={{ scale: 0.9, opacity: 0, y: 20, top: initialTop, left: initialLeft }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        top: isMaximized ? 32 : undefined, // Dejar que drag maneje la posición si no está maximizado
        left: isMaximized ? 0 : undefined,
        width: isMaximized ? '100%' : width,
        height: isMaximized ? 'calc(100vh - 110px)' : height,
      }}
      onPointerDown={onFocus}
      style={{ zIndex, position: 'absolute', willChange: 'transform' }}
      className={cn(
        "window-container bg-[#1c1c1e]/85 backdrop-blur-3xl overflow-hidden flex flex-col transition-all duration-300",
        isMaximized ? "rounded-none" : "rounded-[12px] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]",
        active ? "ring-1 ring-white/20 shadow-black/60" : "opacity-95"
      )}
    >
      {/* Title Bar - Drag Handle */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className={cn(
          "h-10 flex items-center px-4 cursor-default relative shrink-0",
          !hideTitleBarStyling && "bg-white/5 border-b border-white/10"
        )}
      >
        <div className="flex gap-2 group z-50">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center text-black/50 hover:text-black transition-colors"
          >
            <X size={8} className="opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center text-black/50 hover:text-black transition-colors"
          >
            <Minus size={8} className="opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); if (isResizable) onMaximize(); }}
            disabled={!isResizable}
            className={cn(
              "w-3 h-3 rounded-full flex items-center justify-center text-black/50 transition-colors",
              isResizable ? "bg-[#28c840] hover:text-black" : "bg-white/10 cursor-default"
            )}
          >
            {isResizable && <Maximize2 size={8} className="opacity-0 group-hover:opacity-100" />}
          </button>
        </div>
        {title && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white/40 text-[13px] font-medium">{title}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-black/20">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;