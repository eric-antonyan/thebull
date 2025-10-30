import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Upload, UploadSchema} from "../schemas/uploads.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
        {
          name: Upload.name,
          schema: UploadSchema
        }
      ])
  ],
  providers: [UploadsService],
  controllers: [UploadsController]
})
export class UploadsModule {}
