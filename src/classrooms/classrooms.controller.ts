import { 
    Body, 
    Controller,
    Get,
    Post,
    Request,
    Param,
    Delete,
    UseGuards,
    ValidationPipe,
    NotFoundException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleGuard } from '../auth/guards/role.guard';

import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ClassroomsService } from './classrooms.service';

@Controller('classrooms')
export class ClassroomsController {

    constructor(private classroomsService: ClassroomsService) {}

    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create')
    async createClassroom(
        @Body(ValidationPipe) createClassroomDto: CreateClassroomDto,
    ): Promise<void> {
        await this.classroomsService.createClassroom(createClassroomDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    async getAllClassrooms() {
        const classrooms = await this.classroomsService.getAllClassrooms();
        return classrooms;
    }

    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    async deleteClassroom(@Param('id') classroom: string) {
        await this.classroomsService.deleteClassroom(classroom);
        return null;
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    async getClassroom(@Param('id') classroomId) {
        const classroom = await this.classroomsService.getClassroom(classroomId);
        if (!classroom) throw new NotFoundException('Classroom does not exist!');
        return classroom;
    }
}
