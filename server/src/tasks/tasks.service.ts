import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Task } from '../schemas/task.schema';
import { Upload } from '../schemas/uploads.schema';
import { CreateTask } from '../dto/CreateTask.dto';
import { UpdateTaskDto } from '../dto/UpdateTask.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private tasksModel: Model<Task>,
        @InjectModel(Upload.name) private uploadModel: Model<Upload>
    ) {}

    public async create(dto: CreateTask) {
        const { title, description, images, priority, owner } = dto;

        // Create the task with provided data
        const task = new this.tasksModel({
            title,
            description,
            images,
            priority,
            owner
        });

        await task.save();
        return task;
    }

    public async getTaskById(taskId: string) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new BadRequestException({
                message: 'Please enter a valid task ID.',
                errors: true,
            });
        }

        const task = await this.tasksModel.findById(taskId);
        if (!task) {
            throw new NotFoundException({
                message: `Task with ID ${taskId} not found.`,
                errors: true,
            });
        }

        return task;
    }

    public async update(taskId: string, dto: UpdateTaskDto) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new BadRequestException({
                message: 'Please enter a valid task ID.',
                errors: true,
            });
        }

        const task = await this.tasksModel.findById(taskId);
        if (!task) {
            throw new NotFoundException({
                message: 'Task not found for updating.',
                errors: true,
            });
        }

        const updatedTask = await this.tasksModel.findByIdAndUpdate(
            taskId,
            { $set: dto },
            { new: true }
        );

        return updatedTask;
    }

    public async getAll() {
        const tasks = await this.tasksModel.find();
        return tasks;
    }

    public async delete(taskId: string) {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new BadRequestException({
                message: 'Please enter a valid task ID.',
                errors: true,
            });
        }

        const task = await this.tasksModel.findById(taskId);
        if (!task) {
            throw new NotFoundException({
                message: 'Task not found for deletion.',
            });
        }

        // Delete associated images from the upload collection
        const deletePromises = task.images.map(async (hash) => {
            await this.uploadModel.deleteOne({ hash });
        });

        // Wait for all image deletions to complete
        await Promise.all(deletePromises);

        // Delete the task itself
        const deleted = await this.tasksModel.deleteOne({ _id: taskId });

        return task;
    }
}
