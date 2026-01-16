import React, { createContext, useState, useRef, useCallback } from 'react';
import { motion, useDragControls, DragControls, PanInfo } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

// Constants for safe area
const MENU_BAR_HEIGHT = 32;
const DOCK_SPACE = 100;
const MIN_WIDTH = 300; // Reduced for better mobile support
const MIN_HEIGHT = 200; // Reduced for better mobile support

const Window: React.FC<WindowProps> = ({
  title, children, onClose, onMinimize, onMaximize, onFocus, zIndex, active, isMaximized,
  initialTop = 100, initialLeft = 200, hideTitleBarStyling = false,
  isResizable = true, width = '800px', height = '500px', integratedTitleBar = false
}) => {
  const dragControls = useDragControls();

  // Calculate initial dimensions and position once on mount to ensure valid bounds
  const getInitialState = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        width: width,
        height: height,
        top: initialTop,
        left: initialLeft
      };
    }

    // 1. Clamp dimensions
    const maxW = window.innerWidth - 20; // 10px padding
    const maxH = window.innerHeight - MENU_BAR_HEIGHT - DOCK_SPACE - 20;
    const w = Math.max(MIN_WIDTH, Math.min(parseInt(width), maxW));
    const h = Math.max(MIN_HEIGHT, Math.min(parseInt(height), maxH));

    // 2. Clamp position to ensure visibility
    // Ensure top doesn't go below Dock or above Menu Bar
    const maxTop = window.innerHeight - DOCK_SPACE - h - 10;
    const t = Math.max(MENU_BAR_HEIGHT + 10, Math.min(initialTop, maxTop));

    // Ensure left doesn't push window off-screen
    const maxLeft = window.innerWidth - w - 10;
    const l = Math.max(10, Math.min(initialLeft, maxLeft));

    return {
      width: `${w}px`,
      height: `${h}px`,
      top: t,
      left: l
    };
  }, [width, height, initialTop, initialLeft]);

  // Use lazy initialization for state
  const [size, setSize] = useState(() => {
    const init = getInitialState();
    return { width: init.width, height: init.height };
  });
  
  const [position, setPosition] = useState(() => {
    const init = getInitialState();
    return { top: init.top, left: init.left };
  });

  const [isResizing, setIsResizing] = useState(false);
  const [showSnapIndicator, setShowSnapIndicator] = useState<'left' | 'right' | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle browser window resize to keep window in bounds
  React.useEffect(() => {
    const handleWindowResize = () => {
      if (isMaximized) return;

      setSize(prev => {
        const currentWidth = parseInt(prev.width);
        const currentHeight = parseInt(prev.height);
        const maxWidth = window.innerWidth - 20; // 10px padding each side
        const maxHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_SPACE - 20;

        const newWidth = Math.min(currentWidth, maxWidth);
        const newHeight = Math.min(currentHeight, maxHeight);

        return {
          width: `${Math.max(MIN_WIDTH, newWidth)}px`,
          height: `${Math.max(MIN_HEIGHT, newHeight)}px`
        };
      });

      setPosition(prev => {
        const currentWidth = parseInt(size.width); // Use current size state might be stale in closure, but sufficient for boundary check
        const currentHeight = parseInt(size.height);
        
        const maxLeft = window.innerWidth - currentWidth - 10;
        const maxTop = window.innerHeight - DOCK_SPACE - currentHeight - 10;
        
        return {
          left: Math.max(0, Math.min(prev.left, maxLeft)),
          top: Math.max(MENU_BAR_HEIGHT, Math.min(prev.top, maxTop))
        };
      });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isMaximized, size.width, size.height]); // Add dependencies to keep boundaries fresh

  // Calculate drag constraints dynamically
  const getDragConstraints = useCallback(() => {
    if (typeof window === 'undefined') return { top: 0, left: 0, right: 0, bottom: 0 };

    const currentWidth = parseInt(size.width.replace('px', ''));
    const currentHeight = isMaximized
      ? window.innerHeight - MENU_BAR_HEIGHT - DOCK_SPACE
      : parseInt(size.height.replace('px', ''));

    const minTop = 0;
    const maxTop = window.innerHeight - DOCK_SPACE - MENU_BAR_HEIGHT - currentHeight;

    return {
      top: minTop - position.top,
      left: -currentWidth + 100 - position.left,
      right: window.innerWidth - 100 - position.left,
      bottom: Math.max(minTop, maxTop) - position.top,
    };
  }, [size, isMaximized, position]);

  // Handle Resize
  const handleResize = useCallback((handle: string, info: PanInfo) => {
    if (!isResizable || isMaximized) return;

    setSize(prev => {
      let newWidth = parseInt(prev.width);
      let newHeight = parseInt(prev.height);
      let newTop = position.top;
      let newLeft = position.left;

      const deltaX = info.delta.x;
      const deltaY = info.delta.y;

      if (handle.includes('right')) newWidth += deltaX;
      if (handle.includes('left')) {
        const potentialWidth = newWidth - deltaX;
        if (potentialWidth >= MIN_WIDTH) {
          newWidth = potentialWidth;
          newLeft += deltaX;
        }
      }
      if (handle.includes('bottom')) {
        const potentialHeight = newHeight + deltaY;
        // Ensure bottom doesn't exceed dock
        if (newTop + potentialHeight <= window.innerHeight - DOCK_SPACE - MENU_BAR_HEIGHT) {
          newHeight = potentialHeight;
        }
      }
      if (handle.includes('top')) {
        const potentialHeight = newHeight - deltaY;
        const potentialTop = newTop + deltaY;
        // Ensure top doesn't exceed menu bar (0 relative) and height is valid
        if (potentialTop >= 0 && potentialHeight >= MIN_HEIGHT) {
          newHeight = potentialHeight;
          newTop = potentialTop;
        }
      }

      // Final constraints
      newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, window.innerWidth - 40));
      newHeight = Math.max(MIN_HEIGHT, Math.min(newHeight, window.innerHeight - newTop - DOCK_SPACE - MENU_BAR_HEIGHT));

      setPosition({ top: newTop, left: newLeft });
      return { width: `${newWidth}px`, height: `${newHeight}px` };
    });
  }, [isResizable, isMaximized, position]);

  // Handle drag end to update position state
  const handleDragEnd = useCallback(() => {
    if (!windowRef.current || isMaximized) return;

    const rect = windowRef.current.getBoundingClientRect();
    const snapThreshold = 20;

    if (rect.left < snapThreshold) {
      setShowSnapIndicator('left');
      setTimeout(() => {
        onMaximize();
        setShowSnapIndicator(null);
      }, 200);
    } else if (window.innerWidth - rect.right < snapThreshold) {
      setShowSnapIndicator('right');
      setTimeout(() => {
        onMaximize();
        setShowSnapIndicator(null);
      }, 200);
    }

    // Adjust top position relative to main container (subtract MenuBar height)
    setPosition({ top: rect.top - MENU_BAR_HEIGHT, left: rect.left });
  }, [isMaximized, onMaximize]);

  const handleTitleBarDoubleClick = useCallback(() => {
    if (isResizable) onMaximize();
  }, [isResizable, onMaximize]);

  const ResizeHandle = ({ pos }: { pos: string }) => {
    if (!isResizable || isMaximized) return null;

    const cursorMap: Record<string, string> = {
      'top-left': 'nw-resize', 'top': 'n-resize', 'top-right': 'ne-resize',
      'right': 'e-resize', 'bottom-right': 'se-resize', 'bottom': 's-resize',
      'bottom-left': 'sw-resize', 'left': 'w-resize'
    };

    const styleMap: Record<string, string> = {
      'top-left': 'top-0 left-0 w-3 h-3',
      'top': 'top-0 left-3 right-3 h-1',
      'top-right': 'top-0 right-0 w-3 h-3',
      'right': 'right-0 top-3 bottom-3 w-1',
      'bottom-right': 'bottom-0 right-0 w-5 h-5',
      'bottom': 'bottom-0 left-3 right-3 h-1',
      'bottom-left': 'bottom-0 left-0 w-3 h-3',
      'left': 'left-0 top-3 bottom-3 w-1'
    };

    return (
      <motion.div
        className={cn("absolute z-[60] hover:bg-orange-500/10", styleMap[pos])}
        style={{ cursor: cursorMap[pos] }}
        onPanStart={() => setIsResizing(true)}
        onPan={(_, info) => handleResize(pos, info)}
        onPanEnd={() => setIsResizing(false)}
      />
    );
  };

  return (
    <>
      {showSnapIndicator && (
        <div className={cn(
          "fixed top-8 bottom-[108px] w-1/2 bg-orange-500/10 border-2 border-orange-500/30 backdrop-blur-sm pointer-events-none z-[999999] transition-all rounded-xl m-2",
          showSnapIndicator === 'left' ? 'left-0' : 'right-0'
        )} />
      )}

      <motion.div
        ref={windowRef}
        drag={!isMaximized && !isResizing}
        dragControls={dragControls}
        dragMomentum={false}
        dragListener={false}
        dragConstraints={getDragConstraints()}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.9, opacity: 0, y: 20, top: position.top, left: position.left }}
        animate={{
          scale: 1, opacity: 1, y: 0,
          top: isMaximized ? 0 : position.top,
          left: isMaximized ? 0 : position.left,
          width: isMaximized ? '100%' : size.width,
          height: isMaximized ? `calc(100vh - ${MENU_BAR_HEIGHT + DOCK_SPACE}px)` : size.height,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        onPointerDown={onFocus}
        style={{
          zIndex,
          position: 'absolute',
          willChange: 'transform',
        }}
        className={cn(
          "window-container bg-[#1c1c1e]/85 backdrop-blur-3xl overflow-hidden flex flex-col transition-shadow duration-300",
          "rounded-xl border border-white/10",
          active
            ? "ring-1 ring-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
            : "opacity-95 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]"
        )}
      >
        {['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'].map(p => (
          <ResizeHandle key={p} pos={p} />
        ))}

        <div
          onPointerDown={(e) => !integratedTitleBar && dragControls.start(e)}
          onDoubleClick={handleTitleBarDoubleClick}
          className={cn(
            "h-10 flex items-center px-4 cursor-default relative shrink-0 z-50 select-none",
            !hideTitleBarStyling && !integratedTitleBar && "bg-white/5 border-b border-white/10",
            integratedTitleBar && "absolute top-0 left-0 right-0 bg-transparent h-12 pointer-events-none"
          )}
        >
          <div className={cn("flex gap-2 group z-50 pointer-events-auto", integratedTitleBar && "pl-1")}>
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
          {title && !integratedTitleBar && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white/40 text-[13px] font-medium">{title}</span>
            </div>
          )}
        </div>

        <div className={cn("flex-1 overflow-auto bg-black/20", integratedTitleBar && "pt-0")}>
          <WindowContext.Provider value={{ dragControls }}>
            {children}
          </WindowContext.Provider>
        </div>
      </motion.div>
    </>
  );
};

export default Window;