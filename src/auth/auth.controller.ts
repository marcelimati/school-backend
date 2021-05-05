import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Profile } from './dto/profile.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<{ id: string, login: string, role: string, token: string; }> {
    return this.authService.login(loginDto);
  }

  // @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('profile')
  async profile(@Request() req): Promise<Profile> {
    //console.log(req.user);
    return this.authService.getProfile(req.user._id)
    
    //return req.user;
    //await this.authService.logout(req.user.id);
  }
  
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Get('test')
  // async test(@Request() req): Promise<void> {
  //   console.log(req);
  // }

}