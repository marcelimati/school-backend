import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { FilesModule } from './files/files.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { TasksModule } from './tasks/tasks.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.mongo, { 
      useCreateIndex: true, 
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    FilesModule,
    ClassroomsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
