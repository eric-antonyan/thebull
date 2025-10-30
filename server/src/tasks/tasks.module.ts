import {Module} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {TasksController} from './tasks.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Task, TaskSchema} from "../schemas/task.schema";
import {TasksGateway} from "../gateway/TasksGateway";
import {Upload, UploadSchema} from "../schemas/uploads.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Task.name,
                schema: TaskSchema
            },
            {
                name: Upload.name,
                schema: UploadSchema
            }
        ])
    ],
    providers: [TasksService, TasksGateway],
    controllers: [TasksController]
})
export class TasksModule {
}
