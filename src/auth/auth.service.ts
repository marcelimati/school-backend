import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/model/user.model';
import { UsersService } from 'src/users/users.service';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ id: string, login: string, role: string, token: string; }> {
    const { username, password } = loginDto;

    const user = await this.usersService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateAccessToken(user);
    var id = user.id;
    var login = user.username;
    var role = user.role;

    return { id, login, role, token};
  }

  async getProfile(id: string) : Promise<User> {

    const user = await this.usersService.getUser(id);
    //console.log(user);
    return user;
    
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private generateAccessToken(user: User): string {
    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
      username: user.username,
    });
    return token;
  }
}
