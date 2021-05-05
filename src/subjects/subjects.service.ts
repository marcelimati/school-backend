import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from './model/subject.model';

@Injectable()
export class SubjectsService {

    constructor(@InjectModel('Subjects') private readonly subjectModel: Model<Subject>) {}

    async createSubject(createSubjectDto: CreateSubjectDto): Promise<void> {
        const { name } = createSubjectDto;
        if (await this.subjectModel.exists({ name: name })) {
          throw new ConflictException('Subject already exists');
        }
        await this.subjectModel.create({
          name,
        });
      }

      async getAllSubjects(): Promise<Subject[]> {
        const subjects = await this.subjectModel.find().exec();
        return subjects;
      }
    
      async getSubject(subjectID): Promise<Subject> {
        const subject = await this.subjectModel.findById(subjectID).exec();
        return subject;
      }

      async deleteSubject(subject): Promise<any> {
        const deletedSubject = await this.subjectModel.findByIdAndRemove(subject);
        return deletedSubject;
      }
}
