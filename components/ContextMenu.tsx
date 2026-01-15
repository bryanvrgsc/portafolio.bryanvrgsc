"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: { label: string; onClick: () => void; divider?: boolean }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x: initialX, y: initialY, onClose, items }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: initialX, y: initialY });

  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [onClose]);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 8;
      let newX = initialX;
      let newY = initialY;

      if (initialX + rect.width > window.innerWidth - padding) {
        newX = window.innerWidth - rect.width - padding;
      }
      if (initialY + rect.height > window.innerHeight - padding) {
        newY = window.innerHeight - rect.height - padding;
      }

      // Ensure it doesn't go off the top/left edges either
      newX = Math.max(padding, newX);
      newY = Math.max(padding, newY);

      setPos({ x: newX, y: newY });
    }
  }, [initialX, initialY]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ top: pos.y, left: pos.x }}
      className="fixed w-56 bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl py-1.5 z-[5000] select-none"
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              onClose();
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-blue-600 text-white text-[13px] flex items-center transition-colors"
          >
            {item.label}
          </button>
          {item.divider && <div className="h-[1px] bg-white/10 my-1 mx-1" />}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default ContextMenu;
