import { 
    Body, 
    Controller,
    Get,
    Post,
    Request,
    Param,
    Delete,
    Patch,
    UseGuards,
    ValidationPipe,
    NotFoundException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleGuard } from '../auth/guards/role.guard';

import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Roles('TEACHER')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create')
    async createTask(
        @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    ): Promise<void> {
        await this.tasksService.createTask(createTaskDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    async getAllTasks() {
        const tasks = await this.tasksService.getAllTasks();
        return tasks;
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('classroom/:id')
    async getAllTasksFromClassroom(@Param('id') classroomId) {
        const tasks = await this.tasksService.getAllTasksFromClassroom(classroomId);
        return tasks;
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    async getTask(@Param('id') taskId) {
        const task = await this.tasksService.getTask(taskId);
        return task;
    }

    @Roles('TEACHER')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Patch(':id')
    async updateTask(
        @Param('id') taskId: string,
        @Body('complete') complete: Object,
        @Body('grade') grade: Object,
    ) {
        await this.tasksService.updateTask(taskId, complete, grade);
        return null;
    }

}
