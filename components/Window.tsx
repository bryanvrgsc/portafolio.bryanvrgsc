"use client";

import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import { motion, useDragControls, DragControls, PanInfo } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types & Context
// ============================================================================

interface WindowContextType {
  dragControls: DragControls;
}

export const WindowContext = createContext<WindowContextType | null>(null);

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
  integratedTitleBar?: boolean;
  headerActions?: React.ReactNode;
}

// ============================================================================
// Constants - Must match actual component sizes
// ============================================================================

// MenuBar: h-8 = 2rem = 32px
const MENU_BAR_HEIGHT = 32;

// Dock: bottom-2 (8px) + dock height (72px) + icon expansion margin = 90px
const DOCK_SPACE = 90;

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;
const WINDOW_GAP = 10;
const SNAP_THRESHOLD = 20;

// Snap modes: null = free, 'left' = left half, 'right' = right half
type SnapMode = 'left' | 'right' | null;

// ============================================================================
// Utility Functions
// ============================================================================

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max));

const getViewportBounds = () => ({
  maxWidth: window.innerWidth - WINDOW_GAP * 2,
  maxHeight: window.innerHeight - MENU_BAR_HEIGHT - DOCK_SPACE - WINDOW_GAP * 2,
  minTop: WINDOW_GAP,
  maxTop: (windowHeight: number) => window.innerHeight - DOCK_SPACE - windowHeight - WINDOW_GAP,
  minLeft: WINDOW_GAP,
  maxLeft: (windowWidth: number) => window.innerWidth - windowWidth - WINDOW_GAP,
});

const detectSnapZone = (point: { x: number; y: number }): 'left' | 'right' | 'top' | null => {
  if (point.y < MENU_BAR_HEIGHT + SNAP_THRESHOLD) return 'top';
  if (point.x < SNAP_THRESHOLD) return 'left';
  if (point.x > window.innerWidth - SNAP_THRESHOLD) return 'right';
  return null;
};

// ============================================================================
// Main Component
// ============================================================================

const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex,
  active,
  isMaximized,
  initialTop = 100,
  initialLeft = 200,
  hideTitleBarStyling = false,
  isResizable = true,
  width = '800px',
  height = '500px',
  integratedTitleBar = false,
  headerActions,
}) => {
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // State Initialization
  // ============================================================================

  const getInitialState = useCallback(() => {
    if (typeof window === 'undefined') {
      return { width, height, top: initialTop, left: initialLeft };
    }

    const bounds = getViewportBounds();
    const w = clamp(parseInt(width), MIN_WIDTH, bounds.maxWidth);
    const h = clamp(parseInt(height), MIN_HEIGHT, bounds.maxHeight);
    const t = clamp(initialTop, bounds.minTop, bounds.maxTop(h));
    const l = clamp(initialLeft, bounds.minLeft, bounds.maxLeft(w));

    return { width: `${w}px`, height: `${h}px`, top: t, left: l };
  }, [width, height, initialTop, initialLeft]);

  const [size, setSize] = useState(() => {
    const init = getInitialState();
    return { width: init.width, height: init.height };
  });

  const [position, setPosition] = useState(() => {
    const init = getInitialState();
    return { top: init.top, left: init.left };
  });

  const [isResizing, setIsResizing] = useState(false);
  const [snapIndicator, setSnapIndicator] = useState<'left' | 'right' | 'top' | null>(null);
  const [snapMode, setSnapMode] = useState<SnapMode>(null);

  // Store size/position before snap to restore when unsnapping
  const preSnapState = useRef<{ width: string; height: string; top: number; left: number } | null>(null);

  // Key to force remount of motion.div after drag to reset internal transform
  const [dragKey, setDragKey] = useState(0);

  // ============================================================================
  // Browser Resize Handler
  // ============================================================================

  useEffect(() => {
    const handleWindowResize = () => {
      if (isMaximized || snapMode) return;

      const bounds = getViewportBounds();

      setSize((prev) => ({
        width: `${clamp(parseInt(prev.width), MIN_WIDTH, bounds.maxWidth)}px`,
        height: `${clamp(parseInt(prev.height), MIN_HEIGHT, bounds.maxHeight)}px`,
      }));

      setPosition((prev) => ({
        top: clamp(prev.top, bounds.minTop, bounds.maxTop(parseInt(size.height))),
        left: clamp(prev.left, bounds.minLeft, bounds.maxLeft(parseInt(size.width))),
      }));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isMaximized, snapMode, size.width, size.height]);

  // ============================================================================
  // Snap Logic
  // ============================================================================

  const snapToLeft = useCallback(() => {
    // Save current state before snapping
    if (!preSnapState.current && !snapMode && !isMaximized) {
      preSnapState.current = { ...size, ...position };
    }
    setSnapMode('left');
    setDragKey((k) => k + 1);
  }, [size, position, snapMode, isMaximized]);

  const snapToRight = useCallback(() => {
    // Save current state before snapping
    if (!preSnapState.current && !snapMode && !isMaximized) {
      preSnapState.current = { ...size, ...position };
    }
    setSnapMode('right');
    setDragKey((k) => k + 1);
  }, [size, position, snapMode, isMaximized]);

  const unsnap = useCallback(() => {
    if (preSnapState.current) {
      setSize({ width: preSnapState.current.width, height: preSnapState.current.height });
      setPosition({ top: preSnapState.current.top, left: preSnapState.current.left });
      preSnapState.current = null;
    }
    setSnapMode(null);
  }, []);

  // ============================================================================
  // Drag Handlers
  // ============================================================================

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Don't process snap during resize
      if (isMaximized || isResizing) return;

      // If currently snapped and user starts dragging, unsnap first
      if (snapMode && Math.abs(info.offset.x) > 10) {
        unsnap();
      }

      setSnapIndicator(detectSnapZone(info.point));
    },
    [isMaximized, isResizing, snapMode, unsnap]
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Don't process snap if resizing or maximized
      if (isMaximized || isResizing) return;

      setSnapIndicator(null);

      // Check for snap zones
      const snapZone = detectSnapZone(info.point);

      if (snapZone === 'top') {
        onMaximize();
        setSnapMode(null);
        preSnapState.current = null;
        setDragKey((k) => k + 1);
        return;
      }

      if (snapZone === 'left') {
        snapToLeft();
        return;
      }

      if (snapZone === 'right') {
        snapToRight();
        return;
      }

      // No snap - calculate new position from drag offset
      const bounds = getViewportBounds();
      const windowWidth = parseInt(size.width);
      const windowHeight = parseInt(size.height);

      const newTop = clamp(
        position.top + info.offset.y,
        bounds.minTop,
        bounds.maxTop(windowHeight)
      );
      const newLeft = clamp(
        position.left + info.offset.x,
        bounds.minLeft,
        bounds.maxLeft(windowWidth)
      );

      // Update position state
      setPosition({ top: newTop, left: newLeft });

      // Force remount to reset the internal transform of motion.div
      setDragKey((k) => k + 1);
    },
    [isMaximized, isResizing, onMaximize, position.top, position.left, size.width, size.height, snapToLeft, snapToRight]
  );

  // ============================================================================
  // Resize Handler - Using refs for smooth, direct cursor following
  // ============================================================================

  const handleTitleBarDoubleClick = useCallback(() => {
    if (isResizable) {
      if (snapMode) {
        unsnap();
      } else {
        onMaximize();
      }
    }
  }, [isResizable, onMaximize, snapMode, unsnap]);

  // ============================================================================
  // Resize Handles Component - Using native pointer events for fluid resizing
  // ============================================================================

  const activeResizeHandle = useRef<string | null>(null);
  const resizeStartData = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startTop: number;
    startLeft: number;
  } | null>(null);

  // Global pointer move handler for resize
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!activeResizeHandle.current || !resizeStartData.current) return;

      const handle = activeResizeHandle.current;
      const start = resizeStartData.current;

      const deltaX = e.clientX - start.startX;
      const deltaY = e.clientY - start.startY;

      let newWidth = start.startWidth;
      let newHeight = start.startHeight;
      let newTop = start.startTop;
      let newLeft = start.startLeft;

      // Right edge - can go to screen edge
      if (handle.includes('right')) {
        const maxW = window.innerWidth - newLeft;
        newWidth = clamp(start.startWidth + deltaX, MIN_WIDTH, maxW);
      }

      // Left edge - can go to screen edge
      if (handle.includes('left')) {
        const potentialWidth = start.startWidth - deltaX;
        const potentialLeft = start.startLeft + deltaX;
        if (potentialWidth >= MIN_WIDTH && potentialLeft >= 0) {
          newWidth = potentialWidth;
          newLeft = potentialLeft;
        }
      }

      // Bottom edge - respects dock only
      if (handle.includes('bottom')) {
        const maxH = window.innerHeight - DOCK_SPACE - newTop;
        newHeight = clamp(start.startHeight + deltaY, MIN_HEIGHT, maxH);
      }

      // Top edge - can go right below menu bar
      if (handle.includes('top')) {
        const potentialHeight = start.startHeight - deltaY;
        const potentialTop = start.startTop + deltaY;
        const minTop = MENU_BAR_HEIGHT; // Exactly below menu bar
        if (potentialHeight >= MIN_HEIGHT && potentialTop >= minTop) {
          newHeight = potentialHeight;
          newTop = potentialTop;
        }
      }

      setSize({ width: `${newWidth}px`, height: `${newHeight}px` });
      setPosition({ top: newTop, left: newLeft });
    };

    const handlePointerUp = () => {
      if (activeResizeHandle.current) {
        activeResizeHandle.current = null;
        resizeStartData.current = null;
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const startResize = useCallback((handle: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Unsnap if needed
    if (snapMode) {
      unsnap();
    }

    activeResizeHandle.current = handle;
    resizeStartData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: parseInt(size.width),
      startHeight: parseInt(size.height),
      startTop: position.top,
      startLeft: position.left,
    };
    setIsResizing(true);

    // Set cursor globally while resizing
    const cursorMap: Record<string, string> = {
      'top-left': 'nw-resize', top: 'n-resize', 'top-right': 'ne-resize',
      right: 'e-resize', 'bottom-right': 'se-resize', bottom: 's-resize',
      'bottom-left': 'sw-resize', left: 'w-resize',
    };
    document.body.style.cursor = cursorMap[handle];
    document.body.style.userSelect = 'none';
  }, [snapMode, unsnap, size.width, size.height, position.top, position.left]);

  const ResizeHandle = ({ pos }: { pos: string }) => {
    if (!isResizable || isMaximized || snapMode) return null;

    const cursorMap: Record<string, string> = {
      'top-left': 'nw-resize', top: 'n-resize', 'top-right': 'ne-resize',
      right: 'e-resize', 'bottom-right': 'se-resize', bottom: 's-resize',
      'bottom-left': 'sw-resize', left: 'w-resize',
    };

    // Larger hit areas for easy grabbing - top handle extends above window edge
    const styleMap: Record<string, string> = {
      'top-left': '-top-1 -left-1 w-6 h-6',
      top: '-top-1 left-5 right-5 h-4',
      'top-right': '-top-1 -right-1 w-6 h-6',
      right: 'right-0 top-5 bottom-5 w-3',
      'bottom-right': 'bottom-0 right-0 w-8 h-8',
      bottom: 'bottom-0 left-5 right-5 h-3',
      'bottom-left': 'bottom-0 left-0 w-5 h-5',
      left: 'left-0 top-5 bottom-5 w-3',
    };

    return (
      <div
        className={cn('absolute z-[100] hover:bg-blue-500/30', styleMap[pos])}
        style={{ cursor: cursorMap[pos], touchAction: 'none' }}
        onPointerDown={(e) => startResize(pos, e)}
      />
    );
  };

  // ============================================================================
  // Computed Styles
  // ============================================================================

  const getAnimatedStyle = () => {
    // Snapped to left half
    if (snapMode === 'left') {
      return {
        top: MENU_BAR_HEIGHT + WINDOW_GAP,
        left: WINDOW_GAP,
        width: `calc(50vw - ${WINDOW_GAP * 1.5}px)`,
        height: `calc(100vh - ${MENU_BAR_HEIGHT + DOCK_SPACE + WINDOW_GAP * 2}px)`,
      };
    }

    // Snapped to right half
    if (snapMode === 'right') {
      return {
        top: MENU_BAR_HEIGHT + WINDOW_GAP,
        left: `calc(50vw + ${WINDOW_GAP * 0.5}px)`,
        width: `calc(50vw - ${WINDOW_GAP * 1.5}px)`,
        height: `calc(100vh - ${MENU_BAR_HEIGHT + DOCK_SPACE + WINDOW_GAP * 2}px)`,
      };
    }

    // Maximized (full screen) - exactly below menu bar and above dock
    if (isMaximized) {
      return {
        top: MENU_BAR_HEIGHT,
        left: 0,
        width: '100vw',
        height: `calc(100vh - ${MENU_BAR_HEIGHT + DOCK_SPACE}px)`,
      };
    }

    // Normal floating window
    return {
      top: position.top,
      left: position.left,
      width: size.width,
      height: size.height,
    };
  };

  const animatedStyle = getAnimatedStyle();

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <>
      {/* Snap Indicator Overlay */}
      {snapIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'fixed bg-white/10 border-2 border-white/20 backdrop-blur-md pointer-events-none z-[700000] transition-all m-0',
            snapIndicator === 'left' && 'top-[42px] left-[10px] bottom-[94px] w-[calc(50%-15px)] rounded-xl',
            snapIndicator === 'right' && 'top-[42px] right-[10px] bottom-[94px] w-[calc(50%-15px)] rounded-xl',
            snapIndicator === 'top' && 'top-[42px] left-[10px] right-[10px] bottom-[94px] rounded-xl'
          )}
        />
      )}

      {/* Window Container - key forces remount after drag to reset transform */}
      <motion.div
        key={dragKey}
        ref={windowRef}
        drag={!isMaximized && !isResizing}
        dragControls={dragControls}
        dragMomentum={false}
        dragListener={false}
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          ...animatedStyle,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        onPointerDown={onFocus}
        style={{
          zIndex,
          position: 'absolute',
        }}
        className={cn(
          'window-container bg-[#1c1c1e]/85 backdrop-blur-3xl overflow-hidden flex flex-col',
          (isMaximized || snapMode)
            ? 'rounded-xl border border-white/10 shadow-none'
            : 'rounded-xl border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]',
          active && !isMaximized && !snapMode && 'ring-1 ring-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]',
          !active && !isMaximized && !snapMode && 'opacity-95'
        )}
      >
        {/* Resize Handles */}
        {['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'].map((p) => (
          <ResizeHandle key={p} pos={p} />
        ))}

        {/* Title Bar */}
        <div
          onPointerDown={(e) => {
            if (!integratedTitleBar) {
              dragControls.start(e);
            }
          }}
          onDoubleClick={handleTitleBarDoubleClick}
          className={cn(
            'h-10 flex items-center px-4 cursor-default relative shrink-0 z-50 select-none',
            !hideTitleBarStyling && !integratedTitleBar && 'bg-white/5 border-b border-white/10',
            integratedTitleBar && 'absolute top-0 left-0 right-0 bg-transparent h-12 pointer-events-none',
            !integratedTitleBar && !isMaximized && !snapMode && 'cursor-grab active:cursor-grabbing'
          )}
        >
          <div className={cn('flex gap-2 group z-50 pointer-events-auto', integratedTitleBar && 'pl-1')}>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center text-black/50 hover:text-black transition-colors"
            >
              <X size={8} className="opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center text-black/50 hover:text-black transition-colors"
            >
              <Minus size={8} className="opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (isResizable) {
                  if (snapMode) {
                    unsnap();
                  } else {
                    onMaximize();
                  }
                }
              }}
              disabled={!isResizable}
              className={cn(
                'w-3 h-3 rounded-full flex items-center justify-center text-black/50 transition-colors',
                isResizable ? 'bg-[#28c840] hover:text-black' : 'bg-white/10 cursor-default'
              )}
            >
              {isResizable && <Maximize2 size={8} className="opacity-0 group-hover:opacity-100" />}
            </button>
          </div>
          {title && !integratedTitleBar && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white/40 text-[13px] font-medium">{title}</span>
            </div>
          )}
          {headerActions && (
            <div className="ml-auto flex items-center gap-2 pointer-events-auto">
              {headerActions}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn('flex-1 overflow-auto bg-black/20', integratedTitleBar && 'pt-0')}>
          <WindowContext.Provider value={{ dragControls }}>{children}</WindowContext.Provider>
        </div>
      </motion.div>
    </>
  );
};

export default Window;