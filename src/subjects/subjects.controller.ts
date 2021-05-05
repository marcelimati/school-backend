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

import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {

    constructor(private readonly subjectsService: SubjectsService) {}

    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create')
    async createSubject(
        @Body(ValidationPipe) createSubjectDto: CreateSubjectDto,
    ): Promise<void> {
        await this.subjectsService.createSubject(createSubjectDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    async getAllSubjects() {
        const subjects = await this.subjectsService.getAllSubjects();
        return subjects;
    }

    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    async deleteSubject(@Param('id') subject: string) {
        await this.subjectsService.deleteSubject(subject);
        return null;
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    async getSubject(@Param('id') subjectId) {
        const subject = await this.subjectsService.getSubject(subjectId);
        if (!subject) throw new NotFoundException('Subject does not exist!');
        return subject;
    }

}
