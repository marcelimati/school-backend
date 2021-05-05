import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4, { message: 'Username is too short (4 characters min)' })
  @MaxLength(20, { message: 'Username is too long (20 characters max)' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password is too short (8 characters min)' })
  @MaxLength(32, { message: 'Password is too long (32 characters max)' })
  password: string;

}