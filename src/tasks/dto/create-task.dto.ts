import { IsString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    name: string;
    @IsString()
    teacher: string;
    @IsString()
    subject: string;
    @IsString()
    classroom: string;
    @IsString()
    file: string;
    complete: Object;
    grade: Object;
    
}