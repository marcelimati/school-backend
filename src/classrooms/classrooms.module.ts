import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClassroomSchema } from './model/classroom.model';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Classrooms', schema: ClassroomSchema }]),
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
