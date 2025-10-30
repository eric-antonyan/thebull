import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { TasksService } from '../tasks/tasks.service';
import { CreateTask } from '../dto/CreateTask.dto';
import { UpdateTaskDto } from '../dto/UpdateTask.dto';

@WebSocketGateway({ port: 8080 }) // Define WebSocket port
export class TasksGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly tasksService: TasksService) {}

    async handleConnection(client: WebSocket) {
        // Send all tasks when a client connects
        const tasks = await this.tasksService.getAll();
        client.send(JSON.stringify({ event: 'tasks', data: tasks }));
    }

    @SubscribeMessage('createTask')
    async handleCreateTask(@MessageBody() createTaskDto: CreateTask) {
        const task = await this.tasksService.create(createTaskDto);
        // Broadcast the new task to all connected clients
        this.server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: 'taskCreated', data: task }));
            }
        });
    }

    @SubscribeMessage('updateTask')
    async handleUpdateTask(@MessageBody() data: { id: string; updateTaskDto: UpdateTaskDto }) {
        const updatedTask = await this.tasksService.update(data.id, data.updateTaskDto);
        // Broadcast the updated task to all connected clients
        this.server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: 'taskUpdated', data: updatedTask }));
            }
        });
    }

    @SubscribeMessage('deleteTask')
    async handleDeleteTask(@MessageBody() id: string) {
        await this.tasksService.delete(id);
        // Broadcast the deletion event to all connected clients
        this.server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: 'taskDeleted', data: id }));
            }
        });
    }
}
