import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Upload {
    @Prop()
    hash: string;

    @Prop()
    filename: string;

    @Prop()
    extension: string;

    @Prop() 
    path: string;

    @Prop()
    storedFilename: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
