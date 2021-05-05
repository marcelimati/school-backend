import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './model/task.model';

@Injectable()
export class TasksService {

    constructor(@InjectModel('Tasks') private taskModel: Model<Task>) {}

    async createTask(createTaskDto: CreateTaskDto): Promise<void> {
        const { name, teacher, subject, classroom, file } = createTaskDto;
        await this.taskModel.create({
            name, teacher, subject, classroom, file
        });
    }

    async getAllTasks(): Promise<Task[]> {
        const tasks = await this.taskModel.find().exec();
        return tasks;
    }

    async getAllTasksFromClassroom(classroomId) {
        const tasks = await this.taskModel.find( { classroom: classroomId});
        return tasks;
    }

    async getTask(taskId): Promise<Task> {
        const task = await this.taskModel.findById(taskId).exec();
        return task;
    }

    async updateTask(
        Id: string,
        Complete: Object,
        Grade: Object,
    ) {
        const task = await this.taskModel.findById(Id).exec();
        if (Complete) {
            task.complete = Complete;
        }
        if (Grade) {
            task.grade = Grade;
        }
        task.save();
    }

}
