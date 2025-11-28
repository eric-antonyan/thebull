export type ChatMessage = {
  _id: string;
  taskId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachments: string[];
  createdAt: string;
};

export type OnlineUser = {
  userId: string;
  fullName: string;
};
