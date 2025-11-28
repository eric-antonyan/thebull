// src/components/ProDropdown.tsx
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

interface ProDropdownProps {
  x: number;
  y: number;
  items: DropdownItem[];
  onClose: () => void;
}

const ProDropdown: React.FC<ProDropdownProps> = ({
  x,
  y,
  items,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -6 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -6 }}
        transition={{ duration: 0.12 }}
        style={{ top: y, left: x }}
        ref={ref}
        className="fixed z-[99999] bg-gray-900 text-white rounded-xl shadow-xl min-w-[180px] p-2 border border-gray-800"
      >
        {/* arrow */}
        <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-900"></div>

        <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition ${
                item.danger ? "text-red-400 hover:bg-red-900" : ""
              }`}
            >
              {item.icon && <span className="opacity-80">{item.icon}</span>}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProDropdown;
