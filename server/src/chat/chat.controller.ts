import { Controller, Get, Param } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(":taskId")
  async getMessages(@Param("taskId") taskId: string) {
    return this.chatService.getMessages(taskId);
  }
}
