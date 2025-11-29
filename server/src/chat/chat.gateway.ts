import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  namespace: "ws-chat",
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  private onlineUsers = new Map<string, Set<string>>();

  @SubscribeMessage("join")
  async joinRoom(
    @MessageBody() data: { taskId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { taskId, userId } = data;
    client.join(data.taskId);

    const history = await this.chatService.getMessages(data.taskId);
    client.emit("chat_history", history);

    if (!this.onlineUsers.has(taskId)) {
      this.onlineUsers.set(taskId, new Set());
    }

    this.onlineUsers.get(taskId)!.add(userId);

    // Broadcast updated count
    this.server
      .to(taskId)
      .emit("online_users", [...this.onlineUsers.get(taskId)!]);
  }

  @SubscribeMessage("message")
  async handleMessage(
    @MessageBody()
    data: {
      taskId: string;
      senderId: string;
      senderName: string;
      text: string;
    }
  ) {
    const msg = await this.chatService.createMessage(data);
    this.server.to(data.taskId).emit("new_message", msg);
  }

  @SubscribeMessage("delete_message")
  async deleteMsg(@MessageBody() data: { id: string; taskId: string }) {
    const deleted = await this.chatService.softDelete(data.id);
    this.server.to(data.taskId).emit("message_deleted", deleted);
  }

  @SubscribeMessage("reply_message")
  async reply(@MessageBody() data: any) {
    const msg = await this.chatService.replyMessage(data);
    this.server.to(data.taskId).emit("new_message", msg);
  }

  @SubscribeMessage("read")
  async read(@MessageBody() data: { taskId: string; userId: string }) {
    const receipt = await this.chatService.markRead(data.taskId, data.userId);
    this.server.to(data.taskId).emit("read_receipt", receipt);
  }

  handleDisconnect(client: Socket) {
    for (const [taskId, users] of this.onlineUsers.entries()) {
      if (users.has(client.data.userId)) {
        users.delete(client.data.userId);
        this.server.to(taskId).emit("online_users", [...users]);
      }
    }
  }

  @SubscribeMessage("typing")
  typing(
    @MessageBody()
    data: {
      taskId: string;
      senderId: string;
      senderName: string;
    }
  ) {
    this.server.to(data.taskId).emit("typing", {
      senderId: data.senderId,
      senderName: data.senderName,
    });
  }

  @SubscribeMessage("stop_typing")
  stopTyping(@MessageBody() data: { taskId: string; senderId: string }) {
    this.server
      .to(data.taskId)
      .emit("stop_typing", { senderId: data.senderId });
  }
}
