import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import {MongooseModule} from "@nestjs/mongoose";
import {RequestSchema} from "./requests.model";
import {User, UserSchema} from "../schemas/admin.schema";

@Module({
  imports: [
      MongooseModule.forFeature([
          {
              name: User.name,
              schema: UserSchema
          },
          {
              name: Request.name,
              schema: RequestSchema
          }
      ])
  ],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule {}
