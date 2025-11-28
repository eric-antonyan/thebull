import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatMessage } from "../schemas/chat.schema";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatModel: Model<ChatMessage>
  ) {}

  async createMessage(dto: any) {
    const msg = await this.chatModel.create(dto);
    return msg;
  }

  async editMessage(id: string, text: string) {
    return this.chatModel.findByIdAndUpdate(
      id,
      { text, edited: true },
      { new: true }
    );
  }

  async softDelete(id: string) {
    return this.chatModel.findByIdAndUpdate(
      id,
      { deleted: true, text: "" },
      { new: true }
    );
  }

  async replyMessage(dto: any) {
    return this.chatModel.create(dto);
  }

  async markRead(taskId: string, userId: string) {
    return {
      taskId,
      userId,
      readAt: new Date(),
    };
  }

  async getMessages(taskId: string) {
    return this.chatModel.find({ taskId }).sort({ createdAt: 1 });
  }
}
