import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { UploadsModule } from './uploads/uploads.module';
import { RequestsModule } from './requests/requests.module';

const MONGO_URI = "mongodb+srv://antonyaneric:Erik$2008@cluster0.hfvu6sp.mongodb.net/thebull";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(MONGO_URI),
    TasksModule,
    UploadsModule,
    RequestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
