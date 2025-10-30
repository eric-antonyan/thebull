import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {CreateTask} from "../dto/CreateTask.dto";
import {TasksService} from "./tasks.service";
import {UpdateTaskDto} from "../dto/UpdateTask.dto";

@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService
    ) { }

    @Post()
    public create(@Body() body: CreateTask) {
        return this.taskService.create(body);
    }

    @Get(":taskId")
    public getTaskById(@Param("taskId") taskId: string) {
        return this.taskService.getTaskById(taskId)
    }

    @Patch(":taskId")
    public updateTask(
        @Param("taskId") taskId: string,
        @Body() dto: UpdateTaskDto
    ) {
        return this.taskService.update(taskId, dto);
    }

    @Delete(":taskId")
    public delete(
        @Param("taskId") taskId: string
    ) {
        return this.taskService.delete(taskId)
    }

    @Get("")
    public getAll() {
        return this.taskService.getAll();
    }
}
