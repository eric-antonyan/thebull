import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Task {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    active: boolean;

    @Prop()
    images: string[]

    @Prop()
    priority: string;

    @Prop()
    owner: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);