import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import mongoose from 'mongoose';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {//bỏ đi trường password
    _id: mongoose.Schema.Types.ObjectId;//nhận vào trường id để lấy ra dữ liệu cần update
}
