import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';
import { Subject } from '../subjects/model/subject.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async createUser(createUserDto: CreateUserDto): Promise<void> {
      const { username, password } = createUserDto;
      if (await this.userModel.exists({ username: username })) {
        throw new ConflictException('Username is already taken.');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userModel.create({
        username,
        password: hashedPassword,
      });
    }

    async validateUser(username: string, password: string): Promise<User> {
      const user = await this.userModel.findOne({ username });
      if (!user) {
        return null;
      }
      const valid = await bcrypt.compare(password, user.password);
      return valid ? user : null;
    }

    async updateRefreshToken(userId: string, token: string): Promise<void> {
      const user = await this.userModel.findById(userId);
      user.refreshToken = token;
      await user.save();
    }

    async getAllUsers(): Promise<User[]> {
      const users = await this.userModel.find().exec();
      return users;
    }

    async deleteUser(userID): Promise<any> {
        const deletedUser = await this.userModel.findByIdAndRemove(userID);
        return deletedUser;
    }

    async getUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    return user;
    }

    async updateUser(
        Id: string,
        userName: string,
        Role: string,
        Subjects: Subject[],
        Classroom: string,
    ) {
        const user = await this.userModel.findById(Id).exec();
        if (userName) {
        user.name = userName;
        }
        if (Role) {
            user.role = Role;
            }
        if (Subjects) {
        user.subjects = Subjects;
        }
        if (Classroom) {
          user.classroom = Classroom;
        }
        user.save();
    }
}