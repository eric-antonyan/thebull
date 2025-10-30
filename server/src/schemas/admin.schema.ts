import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

type AdminDocument = HydratedDocument<User>;

@Schema()
class User {
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
    accepted: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

export { AdminDocument, User, UserSchema };