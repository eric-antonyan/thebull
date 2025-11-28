import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop()
  taskId: string;

  @Prop()
  senderId: string;

  @Prop()
  senderName: string;

  @Prop()
  text: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ default: null })
  replyTo: string | null;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
