import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Header,
    Post, 
    Param,
    Request,
    Response,
    UseInterceptors, 
    UploadedFile, 
    UseGuards, 
    ValidationPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleGuard } from '../auth/guards/role.guard';

import { Access } from '../auth/decorators/access.decorator';
import { UserGuard } from '../auth/guards/user.guard';

import { CreateFileDto } from './dto/create-file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    constructor(private readonly filesService: FilesService) {}

    //Upload 
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post("upload")
    @UseInterceptors(FileInterceptor("file", { dest: "/home/files/uploads" }))
    async uploadSingle(@UploadedFile() file,
    ) {
        return file;
    }
    //Insert to database
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post("insert")
    async insertData(
        @Body(ValidationPipe) createFileDto: CreateFileDto,
    ) {
        await this.filesService.createFile(createFileDto);
    }
    //Check all files for user in subject - secured for current user only
    @UseGuards(JwtAuthGuard, UserGuard)
    @Get('/:subject/:user')
    async getData(@Param('subject') subject: string, @Param('user') user: string, @Request() req) {
        const files = await this.filesService.getFiles(subject, user);
        if (files.length != 0)
        {
            if (files[0].userid == req.user._id)
            {
                return files;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return files;
        }
    }
    //Check all files from task only -- secured for current user only
    @UseGuards(JwtAuthGuard, UserGuard)
    @Get('/task/:task/:subject/:user')
    async getDataByTask(@Param('subject') subject: string, @Param('user') user: string, @Param('task') task: string, @Request() req) {
        const files = await this.filesService.getFilesByTask(subject, user, task);
        if (files.length != 0)
        {
            if (files[0].userid == req.user._id)
            {
                return files;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return files;
        }
    }
    //Check all files by classroom for teachers/admin
    @UseGuards(JwtAuthGuard, UserGuard)
    @Get('/classroom/:subject/:classroom')
    async getDataByClassroomSubject(@Param('subject') subject: string, @Param('classroom') classroom: string, @Request() req) {
        const files = await this.filesService.getFilesByClassroomSubject(subject, classroom);
        if (files.length != 0)
        {
            if (req.user.role == "TEACHER" || req.user.role == "ADMIN")
            {
                return files;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return files;
        }
    }
    //Check all files by classroom
    @UseGuards(JwtAuthGuard, UserGuard)
    @Get('/classrooms/classroom/:classroom/:teacher')
    async getDataByClassroom(@Param('classroom') classroom: string, @Param('teacher') teacher: string, @Request() req) {
        const files = await this.filesService.getFilesByClassroom(classroom, teacher);
        if (files.length != 0)
        {
            if (req.user.role == "USER")
            {
                return files;
            }
            else
            {
                return [];
            }
        }
        else
        {
            return [];
        }
    }
    //Admin get all files 
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('all')
    async getAllFiles() {
        const files = await this.filesService.getAllFiles();
        return files;
    }
    //Delete file from database and from server
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    async removeFile(@Param('id') fileId: string, @Request() req) {
        var file = await this.filesService.getFileById(fileId);
        if (file)
        {
            if (file.userid == req.user._id)
            {
                await this.filesService.deleteFile(fileId);
                return null;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return "file not found";
        }
        
    }

    //Admin delete file from database and server
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, UserGuard)
    @Delete('admin/:id')
    async adminRemoveFile(@Param('id') fileId: string) {
        var file = await this.filesService.getFileById(fileId);
        if (file)
        {
            await this.filesService.deleteFile(fileId);
            return null;
        }
        else
        {
            return "file not found";
        }
    }
    //Get one file by id - secured for current user only
    @UseGuards(JwtAuthGuard, UserGuard)
    @Get('/:id')
    async getFile(@Param('id') fileId: string, @Request() req): Promise<any>{
        const file = await this.filesService.downloadFile(fileId);
        if (file)
        {
            if (file.userid == req.user._id)
            {
                return file;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return "file not found";
        }
    }
    //Get one file by id from classroom
    @UseGuards(JwtAuthGuard, UserGuard)
    @Post('/classroom/')
    async getFileFromClassroom(@Request() req): Promise<any>{
        const file = await this.filesService.downloadFile(req.body.fileid);
        if (file)
        {
            if (file.classroom == req.body.classroom)
            {
                return file;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return "file not found";
        }
    }
    //Get file by filename for teacher
    @Roles('TEACHER')
    @UseGuards(JwtAuthGuard, UserGuard)
    @Get('/teacher/by-name/:name')
    async getFileByName(@Param('name') filename: string) {
        const file = await this.filesService.getFileByName(filename);
        if (file)
        {
            return file;
        }
        else
        {
            "file not found";
        }
    }
    //Get files by date - secured for current user only
    @UseGuards(JwtAuthGuard, UserGuard)
    @Post('/date')
    async getByDate(@Request() req): Promise<any>{
        const files = await this.filesService.getByDate(req.body.year, req.body.month, req.body.day, req.user._id);
        if (files.length != 0)
        {
            if (files[0].userid == req.user._id)
            {
                return files;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return files;
        }
    }
    //Admin get all files by date
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, UserGuard)
    @Post('/date/all')
    async getByDateAll(@Request() req): Promise<any>{
        const files = await this.filesService.getByDateAll(req.body.year, req.body.month, req.body.day);
        return files;
    }


    //Download file - secured by current user only
    @UseGuards(JwtAuthGuard, UserGuard)
    @Post('/download')
    @Header('Content-type', 'application/octet-stream')
    async downloadFile(@Request() req, @Response() res): Promise<any> {
        const file = await this.filesService.downloadFile(req.body.fileid);
        
        if (file)
        {
            if (file.userid == req.user._id)
            {
                res.download(file.file.path, file.file.originalname);
                return file;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return null;
        }
    }

    //Download file from classroom 
    @UseGuards(JwtAuthGuard, UserGuard)
    @Post('/classroom/download')
    @Header('Content-type', 'application/octet-stream')
    async downloadFileFromClassroom(@Request() req, @Response() res): Promise<any> {
        const file = await this.filesService.downloadFile(req.body.fileid);        
        if (file)
        {
            if (file.classroom == req.body.classroom)
            {
                res.download(file.file.path, file.file.originalname);
                return file;
            }
            else
            {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
        else
        {
            return null;
        }
    }
}
