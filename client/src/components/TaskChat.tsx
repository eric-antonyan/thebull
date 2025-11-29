// src/components/TaskChat.tsx
import React, {
  useState,
  useRef,
  useEffect,
  FC,
  MouseEvent,
  TouchEvent,
} from "react";
import { IoSend, IoAttach, IoClose } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { AnimatePresence } from "framer-motion";
import { useTaskChat, ChatMessage } from "../hooks/useChat";
import MessageActions from "./MessageActions";

interface TaskChatProps {
  taskId: string;
  user: any;
}

const TaskChat: FC<TaskChatProps> = ({ taskId, user }) => {
  const {
    messages,
    sendMessage,
    sendImage,
    notifyTyping,
    typingUsers,
    onlineUsers,
    editMessage,
    deleteMessage,
    replyMessage,
  } = useTaskChat(taskId, user._id, user.fullName);

  const [text, setText] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(
    null
  );

  // состояние для dropdown меню
  const [contextMessage, setContextMessage] = useState<ChatMessage | null>(
    null
  );
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // авто-скролл вниз
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, fullscreen]);

  const handleSend = () => {
    if (!text.trim() && !previewImg) return;

    // отправка картинки
    if (previewImg) {
      sendImage(previewImg);
      setPreviewImg(null);
      setText("");
      setReplyTarget(null);
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    // редактирование
    if (editingMessage) {
      editMessage(editingMessage._id, trimmed);
      setEditingMessage(null);
      setText("");
      return;
    }

    // ответ
    if (replyTarget) {
      replyMessage(trimmed, replyTarget._id);
      setReplyTarget(null);
      setText("");
      return;
    }

    // обычное сообщение
    sendMessage(trimmed);
    setText("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result as string);
    reader.readAsDataURL(file);
  };

  // открыть dropdown около сообщения
  const openMenuAtRect = (msg: ChatMessage, rect: DOMRect) => {
    const padding = 10;
    const menuWidth = 220;
    const menuHeight = 160;

    let x = rect.right + padding;
    let y = rect.top;

    // если вылазит за правый край — сдвигаем влево
    if (x + menuWidth > window.innerWidth) {
      x = rect.left - menuWidth - padding;
    }

    // если низ вылазит — поднимаем вверх
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - padding;
    }

    setContextMessage(msg);
    setMenuPos({ x, y });
  };

  const closeMenu = () => {
    setContextMessage(null);
  };

  const handleReplyFromMenu = () => {
    if (!contextMessage) return;
    setReplyTarget(contextMessage);
    closeMenu();
  };

  const handleEditFromMenu = () => {
    if (!contextMessage) return;
    setEditingMessage(contextMessage);
    setText(contextMessage.text || "");
    closeMenu();
  };

  const handleDeleteFromMenu = () => {
    if (!contextMessage) return;
    deleteMessage(contextMessage._id);
    closeMenu();
  };

  const renderTypingLabel = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return (
        <p className="text-xs text-gray-500 italic">
          {typingUsers[0]} печатает...
        </p>
      );
    }
    if (typingUsers.length === 2) {
      return (
        <p className="text-xs text-gray-500 italic">
          {typingUsers[0]} и {typingUsers[1]} печатают...
        </p>
      );
    }
    return (
      <p className="text-xs text-gray-500 italic">
        Несколько людей печатают...
      </p>
    );
  };

  return (
    <div
    style={{height: fullscreen ? window.innerHeight : 480}}
      className={`
        bg-black text-white p-4 flex flex-col overflow-hidden transition-all duration-300
        ${
          fullscreen
            ? "fixed inset-0 z-[9999] w-screen rounded-none"
            : "rounded-2xl mt-6 max-w-[450px]"
        }
      `}
    >
      {/* top bar */}
      <div className="flex justify-between items-center mb-3 gap-3">
        <h2 className="font-bold text-lg">Чат задачи</h2>
        <span className="text-sm text-gray-400">
          Онлайн: {onlineUsers.length}
        </span>

        {!fullscreen ? (
          <button
            onClick={() => setFullscreen(true)}
            className="bg-gray-800 text-white px-3 py-1 rounded-lg"
          >
            ⛶
          </button>
        ) : (
          <button
            onClick={() => setFullscreen(false)}
            className="bg-gray-900 px-4 py-2 rounded-xl z-[10000]"
          >
            <FaXmark size={18} />
          </button>
        )}
      </div>

      {/* reply bar */}
      {replyTarget && (
        <div className="mb-2 p-2 bg-gray-900 rounded-xl flex items-center justify-between gap-3">
          <div className="text-xs opacity-80">
            <div className="font-semibold mb-1">
              Ответ на: {replyTarget.senderName}
            </div>
            <div className="line-clamp-2">
              {replyTarget.text?.slice(0, 80) || "Сообщение"}
            </div>
          </div>
          <button
            onClick={() => setReplyTarget(null)}
            className="text-gray-400 hover:text-white"
          >
            <FaXmark />
          </button>
        </div>
      )}

      {/* messages */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-thin">
        {messages.map((msg) => {
          const isMe = msg.senderId === user._id;
          const repliedTo = msg.replyTo
            ? messages.find((m) => m._id === msg.replyTo)
            : undefined;

          return (
            <ChatMessageBubble
              key={msg._id}
              msg={msg}
              isMe={isMe}
              repliedTo={repliedTo}
              onOpenMenu={openMenuAtRect}
            />
          );
        })}

        {renderTypingLabel()}

        <div ref={bottomRef} />
      </div>

      {/* image preview */}
      {previewImg && (
        <div className="relative bg-gray-900 p-3 rounded-xl mb-2 mt-2">
          <img
            src={previewImg}
            className="rounded-md max-h-48 mx-auto"
            alt="preview"
          />
          <button
            className="absolute top-2 right-2 text-white bg-red-600 p-1 rounded-full"
            onClick={() => setPreviewImg(null)}
          >
            <IoClose size={18} />
          </button>
        </div>
      )}

      {/* input */}
      <div className="flex items-center gap-3 mt-3">
        <button
          className="bg-gray-800 p-3 rounded-xl"
          onClick={() => fileRef.current?.click()}
        >
          <IoAttach size={22} />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            notifyTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 w-full bg-gray-900 p-3 rounded-xl outline-none"
          placeholder={
            editingMessage
              ? "Редактировать сообщение..."
              : "Введите сообщение..."
          }
        />

        <button
          onClick={handleSend}
          className="bg-primary p-3 rounded-xl text-white disabled:opacity-50"
          disabled={!text.trim() && !previewImg}
        >
          <IoSend size={20} />
        </button>
      </div>

      {/* floating actions menu */}
      <AnimatePresence>
        {contextMessage && (
          <div
            className="fixed z-[10001]"
            style={{ top: menuPos.y, left: menuPos.x }}
          >
            <MessageActions
              isMe={contextMessage.senderId === user._id}
              onReply={handleReplyFromMenu}
              onEdit={handleEditFromMenu}
              onDelete={handleDeleteFromMenu}
              onClose={closeMenu}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ChatMessageBubbleProps {
  msg: ChatMessage;
  isMe: boolean;
  repliedTo?: ChatMessage;
  onOpenMenu: (msg: ChatMessage, rect: DOMRect) => void;
}

const ChatMessageBubble: FC<ChatMessageBubbleProps> = ({
  msg,
  isMe,
  repliedTo,
  onOpenMenu,
}) => {
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const pressTimerRef = useRef<number | null>(null);

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!bubbleRef.current) return;
    const rect = bubbleRef.current.getBoundingClientRect();
    onOpenMenu(msg, rect);
  };

  const startPress = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (!bubbleRef.current) return;
    e.stopPropagation();
    pressTimerRef.current = window.setTimeout(() => {
      const rect = bubbleRef.current!.getBoundingClientRect();
      onOpenMenu(msg, rect);
    }, 400);
  };

  const endPress = () => {
    if (pressTimerRef.current !== null) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const isImage =
    msg.type === "image" ||
    (typeof msg.text === "string" && msg.text.startsWith("data:image"));

  const createdAt =
    typeof msg.createdAt === "string" ? new Date(msg.createdAt) : msg.createdAt;

  return (
    <div
      className={`flex flex-col max-w-[75%] ${
        isMe ? "self-end items-end" : "self-start items-start"
      }`}
    >
      {!isMe && <p className="text-xs mb-1 opacity-60">{msg.senderName}</p>}

      <div
        ref={bubbleRef}
        onContextMenu={handleContextMenu}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        className={`relative p-3 rounded-2xl shadow-md cursor-pointer ${
          isMe ? "bg-primary text-white" : "bg-gray-800 text-gray-200"
        }`}
        style={{
          borderBottomRightRadius: isMe ? 6 : 16,
          borderBottomLeftRadius: !isMe ? 6 : 16,
        }}
      >
        {/* reply preview */}
        {repliedTo && (
          <div className={`mb-2  bg-gray-900/70 rounded-lg text-xs opacity-80`}>
            <div className="font-semibold mb-1">↩ {repliedTo.senderName}</div>
            <div className="line-clamp-2">
              {repliedTo.text?.startsWith("data") ? (
                <img
                  src={repliedTo.text}
                  className="w-[30px] h-[30px] rounded-md object-cover"
                  alt=""
                />
              ) : (
                repliedTo.text?.slice(0, 80)
              )}
            </div>
          </div>
        )}

        {/* content */}
        {msg.deleted ? (
          <p className="italic opacity-50">Сообщение удалено</p>
        ) : isImage ? (
          <img
            src={msg.text}
            alt="chat-img"
            className="rounded-xl max-h-56 object-cover"
          />
        ) : (
          <p className="text-[15px] break-words">{msg.text}</p>
        )}

        {/* edited tag */}
        {msg.edited && !msg.deleted && (
          <span className="text-[10px] opacity-60 ml-1 italic">(изменено)</span>
        )}

        {/* menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!bubbleRef.current) return;
            const rect = bubbleRef.current.getBoundingClientRect();
            onOpenMenu(msg, rect);
          }}
          className="absolute top-1 right-1 text-xs text-white/40 hover:text-white"
        >
          ⋯
        </button>
      </div>

      <span className="text-[10px] opacity-50 mt-1 flex items-center gap-1">
        {createdAt.toLocaleTimeString().slice(0, 5)}
        {isMe && !msg.deleted && <span>✓</span>}
      </span>
    </div>
  );
};

export default TaskChat;
