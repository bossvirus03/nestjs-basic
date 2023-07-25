import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//
export const IS_PUBLIC_KEY = 'isPublic';

//tạo ra decorator @Public()
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

//tạo ra decorator @User() chứa các thông tin của user có trong request mà jwt trả về 
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);