import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);//tạo ra decorator @Public()

export const IS_PUBLIC_PREMISSION = 'isPublicPermission';
export const PublicPermission = () => SetMetadata(IS_PUBLIC_PREMISSION, true);//tạo ra decorator @Public()

///tạo ra decorator @ResponseMessage()
export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
      SetMetadata(RESPONSE_MESSAGE, message);

//tạo ra decorator @User() chứa các thông tin của user có trong request mà jwt trả về 
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  });
  
export const Company = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.company;
  });