import React, { FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface FullscreenImageViewerProps {
  src: string;
  onClose: () => void;
}

const FullscreenImageViewer: FC<FullscreenImageViewerProps> = ({ src, onClose }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[99999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          className="absolute top-5 right-5 text-white text-3xl p-2 bg-black/40 rounded-full"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <motion.img
          src={src}
          className="max-w-[95vw] max-h-[90vh] rounded-xl object-contain"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default FullscreenImageViewer;
