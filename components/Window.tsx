"use client";

import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import { motion, useDragControls, DragControls, PanInfo } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clamp, computeResizeFrame, detectSnapZone, getDockReserveSpace, getMaximizedFrame, getViewportBounds } from '@/lib/window-geometry.mjs';

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
  className?: string;
}

const MENU_BAR_HEIGHT = 32;
const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;
const WINDOW_GAP = 10;
const SNAP_THRESHOLD = 20;

type SnapMode = 'left' | 'right' | null;
type WindowFrame = { width: number; height: number; top: number; left: number };

const getCurrentViewportBounds = () => getViewportBounds({
  width: window.innerWidth,
  height: window.innerHeight,
  menuBarHeight: MENU_BAR_HEIGHT,
  dockSpace: getDockReserveSpace(window.innerWidth),
  windowGap: WINDOW_GAP,
});

const getCurrentMaximizedFrame = () => getMaximizedFrame({
  width: window.innerWidth,
  height: window.innerHeight,
  menuBarHeight: MENU_BAR_HEIGHT,
  dockSpace: getDockReserveSpace(window.innerWidth),
  windowGap: WINDOW_GAP,
});

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
  className,
}) => {
  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  const createInitialFrame = useCallback((): WindowFrame => {
    const initialWidth = parseInt(width, 10);
    const initialHeight = parseInt(height, 10);

    if (typeof window === 'undefined') {
      return {
        width: initialWidth,
        height: initialHeight,
        top: initialTop,
        left: initialLeft,
      };
    }

    const bounds = getCurrentViewportBounds();
    const nextWidth = clamp(initialWidth, MIN_WIDTH, bounds.maxWidth);
    const nextHeight = clamp(initialHeight, MIN_HEIGHT, bounds.maxHeight);
    const nextTop = clamp(initialTop, bounds.minTop, bounds.maxTop(nextHeight));
    const nextLeft = clamp(initialLeft, bounds.minLeft, bounds.maxLeft(nextWidth));

    return {
      width: nextWidth,
      height: nextHeight,
      top: nextTop,
      left: nextLeft,
    };
  }, [height, initialLeft, initialTop, width]);

  const [size, setSize] = useState(() => ({
    width: createInitialFrame().width,
    height: createInitialFrame().height,
  }));
  const [position, setPosition] = useState(() => ({
    top: createInitialFrame().top,
    left: createInitialFrame().left,
  }));
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [snapIndicator, setSnapIndicator] = useState<'left' | 'right' | 'top' | null>(null);
  const [snapMode, setSnapMode] = useState<SnapMode>(null);
  const [dragKey, setDragKey] = useState(0);

  const preSnapState = useRef<WindowFrame | null>(null);
  const frameRef = useRef<WindowFrame>({
    width: parseInt(width, 10),
    height: parseInt(height, 10),
    top: initialTop,
    left: initialLeft,
  });
  const draftFrameRef = useRef<WindowFrame | null>(null);
  const resizeStartData = useRef<{
    handle: string;
    startPointer: { x: number; y: number };
    startFrame: WindowFrame;
  } | null>(null);
  const resizeRafRef = useRef<number | null>(null);

  const syncFrameRef = useCallback((frame: WindowFrame) => {
    frameRef.current = frame;
    draftFrameRef.current = null;
  }, []);

  const applyFrameToElement = useCallback((frame: WindowFrame) => {
    if (!windowRef.current) {
      return;
    }

    windowRef.current.style.top = `${frame.top}px`;
    windowRef.current.style.left = `${frame.left}px`;
    windowRef.current.style.width = `${frame.width}px`;
    windowRef.current.style.height = `${frame.height}px`;
  }, []);

  const scheduleFrameWrite = useCallback((frame: WindowFrame) => {
    draftFrameRef.current = frame;
    if (resizeRafRef.current !== null) {
      return;
    }

    resizeRafRef.current = requestAnimationFrame(() => {
      resizeRafRef.current = null;
      if (draftFrameRef.current) {
        applyFrameToElement(draftFrameRef.current);
      }
    });
  }, [applyFrameToElement]);

  useEffect(() => {
    syncFrameRef({
      width: size.width,
      height: size.height,
      top: position.top,
      left: position.left,
    });
  }, [position.left, position.top, size.height, size.width, syncFrameRef]);

  useEffect(() => {
    return () => {
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      if (isMaximized || snapMode) {
        return;
      }

      const bounds = getCurrentViewportBounds();
      const currentFrame = frameRef.current;
      const nextWidth = clamp(currentFrame.width, MIN_WIDTH, bounds.maxWidth);
      const nextHeight = clamp(currentFrame.height, MIN_HEIGHT, bounds.maxHeight);
      const nextTop = clamp(currentFrame.top, bounds.minTop, bounds.maxTop(nextHeight));
      const nextLeft = clamp(currentFrame.left, bounds.minLeft, bounds.maxLeft(nextWidth));

      setSize({ width: nextWidth, height: nextHeight });
      setPosition({ top: nextTop, left: nextLeft });
      syncFrameRef({ width: nextWidth, height: nextHeight, top: nextTop, left: nextLeft });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isMaximized, snapMode, syncFrameRef]);

  const snapToLeft = useCallback(() => {
    if (!preSnapState.current && !snapMode && !isMaximized) {
      preSnapState.current = frameRef.current;
    }
    setSnapMode('left');
    setDragKey((key) => key + 1);
  }, [isMaximized, snapMode]);

  const snapToRight = useCallback(() => {
    if (!preSnapState.current && !snapMode && !isMaximized) {
      preSnapState.current = frameRef.current;
    }
    setSnapMode('right');
    setDragKey((key) => key + 1);
  }, [isMaximized, snapMode]);

  const unsnap = useCallback(() => {
    if (preSnapState.current) {
      setSize({ width: preSnapState.current.width, height: preSnapState.current.height });
      setPosition({ top: preSnapState.current.top, left: preSnapState.current.left });
      syncFrameRef(preSnapState.current);
      preSnapState.current = null;
    }
    setSnapMode(null);
  }, [syncFrameRef]);

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isMaximized || isResizing) {
        return;
      }

      if (snapMode && Math.abs(info.offset.x) > 10) {
        unsnap();
      }

      setSnapIndicator(detectSnapZone(info.point, {
        width: window.innerWidth,
        menuBarHeight: MENU_BAR_HEIGHT,
        snapThreshold: SNAP_THRESHOLD,
      }));
    },
    [isMaximized, isResizing, snapMode, unsnap]
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isMaximized || isResizing) {
        return;
      }

      setIsDraggingWindow(false);
      setSnapIndicator(null);

      const snapZone = detectSnapZone(info.point, {
        width: window.innerWidth,
        menuBarHeight: MENU_BAR_HEIGHT,
        snapThreshold: SNAP_THRESHOLD,
      });

      if (snapZone === 'top') {
        onMaximize();
        setSnapMode(null);
        preSnapState.current = null;
        setDragKey((key) => key + 1);
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

      const bounds = getCurrentViewportBounds();
      const nextTop = clamp(position.top + info.offset.y, bounds.minTop, bounds.maxTop(size.height));
      const nextLeft = clamp(position.left + info.offset.x, bounds.minLeft, bounds.maxLeft(size.width));
      const nextFrame = { width: size.width, height: size.height, top: nextTop, left: nextLeft };

      setPosition({ top: nextTop, left: nextLeft });
      syncFrameRef(nextFrame);
      setDragKey((key) => key + 1);
    },
    [isMaximized, isResizing, onMaximize, position.left, position.top, size.height, size.width, snapToLeft, snapToRight, syncFrameRef]
  );

  const handleTitleBarDoubleClick = useCallback(() => {
    if (!isResizable) {
      return;
    }

    if (snapMode) {
      unsnap();
      return;
    }

    onMaximize();
  }, [isResizable, onMaximize, snapMode, unsnap]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!resizeStartData.current) {
        return;
      }

      const nextFrame = computeResizeFrame({
        handle: resizeStartData.current.handle,
        pointer: { x: event.clientX, y: event.clientY },
        startPointer: resizeStartData.current.startPointer,
        startFrame: resizeStartData.current.startFrame,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          menuBarHeight: MENU_BAR_HEIGHT,
          dockSpace: getDockReserveSpace(window.innerWidth),
          windowGap: WINDOW_GAP,
          minWidth: MIN_WIDTH,
          minHeight: MIN_HEIGHT,
        },
      });

      scheduleFrameWrite(nextFrame);
    };

    const handlePointerUp = () => {
      if (!resizeStartData.current) {
        return;
      }

      const finalFrame = draftFrameRef.current ?? frameRef.current;

      resizeStartData.current = null;
      syncFrameRef(finalFrame);
      setSize({ width: finalFrame.width, height: finalFrame.height });
      setPosition({ top: finalFrame.top, left: finalFrame.left });
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [scheduleFrameWrite, syncFrameRef]);

  const startResize = useCallback((handle: string, event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (snapMode) {
      unsnap();
    }

    resizeStartData.current = {
      handle,
      startPointer: { x: event.clientX, y: event.clientY },
      startFrame: frameRef.current,
    };
    setIsResizing(true);
    setIsDraggingWindow(false);

    const cursorMap: Record<string, string> = {
      'top-left': 'nw-resize',
      top: 'n-resize',
      'top-right': 'ne-resize',
      right: 'e-resize',
      'bottom-right': 'se-resize',
      bottom: 's-resize',
      'bottom-left': 'sw-resize',
      left: 'w-resize',
    };

    document.body.style.cursor = cursorMap[handle];
    document.body.style.userSelect = 'none';
  }, [snapMode, unsnap]);

  const ResizeHandle = ({ pos }: { pos: string }) => {
    if (!isResizable || isMaximized || snapMode) {
      return null;
    }

    const cursorMap: Record<string, string> = {
      'top-left': 'nw-resize',
      top: 'n-resize',
      'top-right': 'ne-resize',
      right: 'e-resize',
      'bottom-right': 'se-resize',
      bottom: 's-resize',
      'bottom-left': 'sw-resize',
      left: 'w-resize',
    };

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
        onPointerDown={(event) => startResize(pos, event)}
      />
    );
  };

  const getAnimatedStyle = () => {
    const dockSpace = typeof window !== 'undefined' ? getDockReserveSpace(window.innerWidth) : 130;

    if (snapMode === 'left') {
      return {
        top: MENU_BAR_HEIGHT + WINDOW_GAP,
        left: WINDOW_GAP,
        width: `calc(50vw - ${WINDOW_GAP * 1.5}px)`,
        height: `calc(100vh - ${MENU_BAR_HEIGHT + dockSpace + WINDOW_GAP * 2}px)`,
      };
    }

    if (snapMode === 'right') {
      return {
        top: MENU_BAR_HEIGHT + WINDOW_GAP,
        left: `calc(50vw + ${WINDOW_GAP * 0.5}px)`,
        width: `calc(50vw - ${WINDOW_GAP * 1.5}px)`,
        height: `calc(100vh - ${MENU_BAR_HEIGHT + dockSpace + WINDOW_GAP * 2}px)`,
      };
    }

    if (isMaximized) {
      return getCurrentMaximizedFrame();
    }

    return {
      top: position.top,
      left: position.left,
      width: size.width,
      height: size.height,
    };
  };

  const animatedStyle = getAnimatedStyle();
  const isInteracting = isResizing || isDraggingWindow;
  const topSnapPreviewStyle = typeof window !== 'undefined' ? getCurrentMaximizedFrame() : undefined;

  return (
    <>
      {snapIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={snapIndicator === 'top' ? topSnapPreviewStyle : undefined}
          className={cn(
            'tahoe-snap-indicator fixed pointer-events-none z-[700000] transition-all m-0',
            snapIndicator === 'left' && 'top-[42px] left-[10px] bottom-[94px] w-[calc(50%-15px)] rounded-xl',
            snapIndicator === 'right' && 'top-[42px] right-[10px] bottom-[94px] w-[calc(50%-15px)] rounded-xl',
            snapIndicator === 'top' && 'rounded-xl'
          )}
        />
      )}

      <motion.div
        key={dragKey}
        ref={windowRef}
        drag={!isMaximized && !isResizing}
        dragControls={dragControls}
        dragMomentum={false}
        dragListener={false}
        dragElastic={0}
        onDragStart={() => setIsDraggingWindow(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, ...animatedStyle }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        onPointerDown={onFocus}
        style={{ zIndex, position: 'absolute' }}
        className={cn(
          'window-container tahoe-window pointer-events-auto overflow-hidden flex flex-col rounded-[1.35rem]',
          (isMaximized || snapMode) && 'rounded-[1.1rem] shadow-none',
          !active && 'opacity-[0.97]',
          className
        )}
        data-active={active}
        data-interacting={isInteracting}
      >
        {['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'].map((pos) => (
          <ResizeHandle key={pos} pos={pos} />
        ))}

        <div
          onPointerDown={(event) => {
            if (!integratedTitleBar) {
              dragControls.start(event);
            }
          }}
          onDoubleClick={handleTitleBarDoubleClick}
          className={cn(
            'h-11 flex items-center px-4 cursor-default relative shrink-0 z-50 select-none',
            !hideTitleBarStyling && !integratedTitleBar && 'tahoe-titlebar',
            integratedTitleBar && 'tahoe-titlebar-integrated absolute top-0 left-0 right-0 h-12 pointer-events-none',
            !integratedTitleBar && !isMaximized && !snapMode && 'cursor-grab active:cursor-grabbing'
          )}
        >
          <div className={cn('flex gap-2 group z-50 pointer-events-auto', integratedTitleBar && 'pl-1')}>
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              aria-label="Cerrar"
              className="tahoe-traffic-light w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center text-black/50 hover:text-black transition-colors"
            >
              <X size={8} className="opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onMinimize();
              }}
              aria-label="Minimizar"
              className="tahoe-traffic-light w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center text-black/50 hover:text-black transition-colors"
            >
              <Minus size={8} className="opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                if (isResizable) {
                  if (snapMode) {
                    unsnap();
                  } else {
                    onMaximize();
                  }
                }
              }}
              disabled={!isResizable}
              aria-label="Maximizar"
              className={cn(
                'tahoe-traffic-light w-3 h-3 rounded-full flex items-center justify-center text-black/50 transition-colors',
                isResizable ? 'bg-[#28c840] hover:text-black' : 'bg-white/10 cursor-default'
              )}
            >
              {isResizable && <Maximize2 size={8} className="opacity-0 group-hover:opacity-100" />}
            </button>
          </div>
          {title && !integratedTitleBar && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="tahoe-title text-[13px] font-medium">{title}</span>
            </div>
          )}
          {headerActions && (
            <div className="ml-auto flex items-center gap-2 pointer-events-auto">
              {headerActions}
            </div>
          )}
        </div>

        <div className={cn('tahoe-window-content flex-1 overflow-auto', integratedTitleBar && 'pt-0')}>
          <WindowContext.Provider value={{ dragControls }}>{children}</WindowContext.Provider>
        </div>
      </motion.div>
    </>
  );
};

export default Window;
