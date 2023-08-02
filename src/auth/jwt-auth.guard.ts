import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/customize';
import {Reflector} from '@nestjs/core';
import { Request } from 'express'
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
      }
      canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        return super.canActivate(context);
      }
      handleRequest(err, user, info, context: ExecutionContext) {
        const request : Request = context.switchToHttp().getRequest()
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw err || new UnauthorizedException("token khong hop le or khong co token o baerer token ");
        }
        //check permissions
        const targetMethod = request.method;
        const targetPath = request.route.path as string;
        const permissions = user?.permissions??[];//lấy ra toàn bộ permission (array)
        let isExit = permissions.find(permission => (
          targetMethod === permission.method && 
          targetPath === permission.apiPath
          ))
        if(targetPath.startsWith("/api/v1/auth")){isExit = true}
        if(!isExit) {//khi find là false thì sẽ throw err
          throw new ForbiddenException("bạn không có quyền truy cập vào endpoint này")
        }
        return user;
      }
}
