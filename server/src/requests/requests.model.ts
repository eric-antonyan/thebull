import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {IsNotEmpty} from "class-validator";

@Schema({timestamps: true})
export class Request {
    @Prop()
    fullName: string;

    @Prop()
    company: string;

    @Prop()
    email: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    country: string;

    @Prop()
    address: string;

    @Prop()
    accepted: boolean;
}

export const RequestSchema = SchemaFactory.createForClass(Request);