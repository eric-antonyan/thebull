// src/components/MessageActions.tsx
import React, { FC, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoReturnDownBack } from "react-icons/io5";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

interface MessageActionsProps {
  isMe: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const MessageActions: FC<MessageActionsProps> = ({
  isMe,
  onReply,
  onEdit,
  onDelete,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // закрытие по клику вне
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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -6 }}
      transition={{ duration: 0.12 }}
      className="bg-gray-900 text-white rounded-xl shadow-xl border border-gray-800 min-w-[190px] p-2 relative"
    >
      {/* стрелочка вверх */}
      <div className="absolute -top-2 left-5 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-900" />

      <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto">
        {/* Reply */}
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm"
          onClick={onReply}
        >
          <span className="opacity-80">
            <IoReturnDownBack />
          </span>
          <span>Ответить</span>
        </button>

        {/* Edit (only for owner) */}
        {isMe && (
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm"
            onClick={onEdit}
          >
            <span className="opacity-80">
              <FiEdit3 />
            </span>
            <span>Редактировать</span>
          </button>
        )}

        {/* Delete (only for owner) */}
        {isMe && (
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/70 text-sm text-red-400"
            onClick={onDelete}
          >
            <span className="opacity-80">
              <FiTrash2 />
            </span>
            <span>Удалить</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MessageActions;
