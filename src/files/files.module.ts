import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileSchema } from './model/file.model';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Files', schema: FileSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {
  
}
