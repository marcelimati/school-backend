import { IsString } from 'class-validator';
import { File } from '../model/file.model';

export class CreateFileDto {

    file: File;
    @IsString()
    subject: string;
    @IsString()
    userid: string;
    @IsString()
    classroom: string;
    date: Date;
    task: string;
}