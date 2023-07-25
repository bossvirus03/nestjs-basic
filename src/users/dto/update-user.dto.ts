import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {//bỏ đi trường password
    _id: string//nhận vào trường id để lấy ra dữ liệu cần update
}
