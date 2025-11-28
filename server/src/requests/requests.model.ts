import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document } from "mongoose";

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
    city: string;

    @Prop()
    address: string;

    @Prop()
    profession: string;

    @Prop()
    password: string;

    @Prop()
    accepted: boolean;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

// ⭐ THIS IS IMPORTANT
export type RequestDocument = Request & Document;
