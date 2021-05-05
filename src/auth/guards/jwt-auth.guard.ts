import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus, } from '@nestjs/common';
// var jwt = require('jsonwebtoken');
// //import { Reflector } from '@nestjs/core';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   //constructor(private readonly reflector: Reflector) {}
//   constructor() {}

//   canActivate(context: ExecutionContext) : any {
//       const request = context.switchToHttp().getRequest();
//       const user = request.accessToken;
//       //console.log(user);
//       console.log(request);
//       //console.log(user);
//     //   var decoded = jwt.decode(user.token)
//     //   console.log(decoded);
//     //   if (decoded.admin) {
//     //     return true;
//     //   }

//       //throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
//   }
// }