import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SubjectSchema } from './model/subject.model';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subjects', schema: SubjectSchema }]),
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {

}
