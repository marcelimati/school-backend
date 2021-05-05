import { 
    Body, 
    Controller,
    Get,
    Post,
    Request,
    Param,
    Patch,
    Delete,
    UseGuards,
    ValidationPipe,
    NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleGuard } from '../auth/guards/role.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Subject } from '../subjects/model/subject.model';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  //Register user
  @Post('register')
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    await this.usersService.createUser(createUserDto);
  }

  //Admin - get all users
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async getAllUsers() {
      const users = await this.usersService.getAllUsers();
      return users;
  }
  //Admin - delete user
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async removeUser(@Param('id') userId: string) {
      await this.usersService.deleteUser(userId);
      return null;
  }
  //Admin - get one user
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async getUser(@Param('id') userId) {
      const user = await this.usersService.getUser(userId);
      if (!user) throw new NotFoundException('User does not exist!');
      return user;
  }
  //Teacher - get one user
  @Roles('TEACHER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/teacher/:id')
  async getUserTeacher(@Param('id') userId) {
    const user = await this.usersService.getUser(userId);
    if (!user) throw new NotFoundException('User does not exist!');
    return user;
  }
  //Admin - update user
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body('username') username: string,
    @Body('role') role: string,
    @Body('subjects') subjects: Subject[],
    @Body('classroom') classroom: string,
  ) {
    await this.usersService.updateUser(userId, username, role, subjects, classroom);
    return null;
  }
  //User - get user data
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('user/:id')
  async getOwnUser(@Request() req) {
    const user = await this.usersService.getUser(req.user._id);
      if (!user) throw new NotFoundException('User does not exist!');
      return user;
  }
}