import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Classroom } from './model/classroom.model';

@Injectable()
export class ClassroomsService {

    constructor(@InjectModel('Classrooms') private readonly classroomModel: Model<Classroom>) {}

    async createClassroom(createClassroomDto: CreateClassroomDto): Promise<void> {
        const { name } = createClassroomDto;
        if (await this.classroomModel.exists({ name: name })) {
          throw new ConflictException('Classroom already exists');
        }
        await this.classroomModel.create({
          name,
        });
      }

      async getAllClassrooms(): Promise<Classroom[]> {
        const classrooms = await this.classroomModel.find().exec();
        return classrooms;
      }
    
      async getClassroom(subjectID): Promise<Classroom> {
        const classroom = await this.classroomModel.findById(subjectID).exec();
        return classroom;
      }

      async deleteClassroom(classroom): Promise<any> {
        const deletedClassroom = await this.classroomModel.findByIdAndRemove(classroom);
        return deletedClassroom;
      }

}
