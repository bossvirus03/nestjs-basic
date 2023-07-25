import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  getHardPassword = (password: string) => {
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);
    return hash
  }
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { } //connect to mongoschema
  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHardPassword(createUserDto.password);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    })
    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id })
  
  }
  findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email })
  }
checkUserPassword(password: string, hash : string) {
  return compareSync(password, hash)
}
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  async remove(id: string) {
      return await this.userModel.softDelete({ _id: id })
  }
}
