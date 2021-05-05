import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateFileDto } from './dto/create-file.dto';
import { File } from './model/file.model';
import * as fs from 'fs';

@Injectable()
export class FilesService {

    constructor(@InjectModel('Files') private readonly fileModel: Model<File>) {}

    async createFile(createFileDto: CreateFileDto) {
        const { file, userid, subject, date, classroom, task } = createFileDto;
        await this.fileModel.create({
            file: file,
            subject: subject,
            userid: userid,
            date: date,
            classroom: classroom,
            task: task,
        });
    }

    async getFiles(subjectId, userId) {
        const files = await this.fileModel.find( {subject: subjectId, userid: userId});
        return files;
    }

    async getFilesByTask(subjectId, userId, taskId) {
        const files = await this.fileModel.find( {subject: subjectId, userid: userId, task: taskId});
        return files;
    }

    async getFilesByClassroomSubject(subjectId, classroomId) {
        const files = await this.fileModel.find( {subject: subjectId, classroom: classroomId});
        return files;
    }

    async getFilesByClassroom(classroomId, teacher) {
        const files = await this.fileModel.find( {classroom: classroomId, userid: teacher});
        return files;
    }

    async getFileById(fileid) {
        const file = await this.fileModel.findById(fileid);
        return file;
    }

    async getFileByName(Filename) {
        const file = await this.fileModel.find( {'file.filename': Filename });
        return file;
    }

    async getAllFiles() {
        const files = await this.fileModel.find();
        return files;
    }

    async getByDate(year, month, day, userId) {
        day = parseInt(day, 10);
        const dateFrom = new Date(year, month-1, day);
        dateFrom.setHours(dateFrom.getHours()+1);
        const dateTo = new Date(year, month-1, day+1);
        dateTo.setHours(dateTo.getHours()+1);

        const files = await this.fileModel.find( { date: { $gte: dateFrom, $lte: dateTo}, userid: userId });
        return files;
    }

    async getByDateAll(year, month, day) {
        day = parseInt(day, 10);
        const dateFrom = new Date(year, month-1, day);
        dateFrom.setHours(dateFrom.getHours()+1);
        const dateTo = new Date(year, month-1, day+1);
        dateTo.setHours(dateTo.getHours()+1);

        const files = await this.fileModel.find( { date: { $gte: dateFrom, $lte: dateTo} });
        return files;
    }

    async deleteFile(fileId): Promise<any> {
        const deletedFile = await this.fileModel.findById(fileId);
        try {
            fs.unlinkSync(deletedFile.file.path)
          } catch(err) {
            console.error(err)
          }
        deletedFile.delete();
        return deletedFile;
    }

    async downloadFile(fileId): Promise<any> {
        // var check = this.fileModel.Types.ObjectId.isValid(fileId);
        // console.log(check);
        const file = await this.fileModel.findById(fileId);
        return file;
    }

}
