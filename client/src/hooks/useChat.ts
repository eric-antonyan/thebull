// src/hooks/useChat.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  _id: string;
  taskId: string;
  senderId: string;
  senderName: string;
  text: string;
  type?: string;
  deleted?: boolean;
  edited?: boolean;
  replyTo?: string | null;
  createdAt: string | Date;
}

interface UseTaskChatReturn {
  messages: ChatMessage[];
  onlineUsers: string[];
  typingUsers: string[];
  sendMessage: (text: string) => void;
  sendImage: (dataUrl: string) => void;
  editMessage: (id: string, newText: string) => void;
  deleteMessage: (id: string) => void;
  replyMessage: (text: string, replyToId: string) => void;
  notifyTyping: () => void;
}

export const useTaskChat = (
  taskId: string,
  userId: string,
  senderName: string
): UseTaskChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(
      `http://exp.thebull.ru/ws-chat`,
      {
        transports: ["websocket"],
      }
    );

    socketRef.current = socket;

    // join room
    socket.emit("join", { taskId, userId, senderName });

    // history from server
    socket.on("chat_history", (history: ChatMessage[]) => {
      setMessages(history);
    });

    // new message
    socket.on("new_message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    // edited message
    socket.on("message_edited", (msg: ChatMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? msg : m))
      );
    });

    // deleted message (soft delete)
    socket.on("message_deleted", (msg: ChatMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? msg : m))
      );
    });

    // online users
    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    // typing users (может быть массив имён или айдишников)
    socket.on("typing_users", (users: string[]) => {
      setTypingUsers(users);
    });

    socket.on("task_users", (users) => {
    setParticipants(users);
  });

    return () => {
      socket.disconnect();
    };
  }, [taskId, userId, senderName]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    socketRef.current?.emit("message", {
      taskId,
      senderId: userId,
      senderName,
      text,
      type: "text",
    });
  };

  const sendImage = (dataUrl: string) => {
    socketRef.current?.emit("message", {
      taskId,
      senderId: userId,
      senderName,
      text: dataUrl,
      type: "image",
    });
  };

  const editMessage = (id: string, newText: string) => {
    if (!newText.trim()) return;
    socketRef.current?.emit("edit_message", {
      id,
      text: newText,
      taskId,
    });
  };

  const deleteMessage = (id: string) => {
    socketRef.current?.emit("delete_message", {
      id,
      taskId,
    });
  };

  const replyMessage = (text: string, replyToId: string) => {
    if (!text.trim()) return;
    socketRef.current?.emit("reply_message", {
      taskId,
      senderId: userId,
      senderName,
      text,
      replyTo: replyToId,
      type: "text",
    });
  };

  const notifyTyping = () => {
    socketRef.current?.emit("typing", {
      taskId,
      userId,
      senderName,
    });
  };
  
  

  return {
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    sendImage,
    editMessage,
    deleteMessage,
    replyMessage,
    notifyTyping,
  };
};
