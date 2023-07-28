import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  getHardPassword = (password: string) => {
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);
    return hash
  }
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) { } //connect to mongoschema
  async create(createUserDto: CreateUserDto, @User() User: IUser) {
    const hashPassword = this.getHardPassword(createUserDto.password);
    //check email 
    const isEmail = await this.userModel.findOne({ email: createUserDto.email })
    if (isEmail) {
      throw new BadRequestException("email da ton tai")
    }
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: User._id,
        email: User.email
      }
    })
    return user;
  }
  async register(registerUserDto: RegisterUserDto) {
    const hashPassword = this.getHardPassword(registerUserDto.password);
    //check email 
    const isEmail = await this.userModel.findOne({ email: registerUserDto.email })
    if (isEmail) {
      throw new BadRequestException("email da ton tai")
    }
    const user = await this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
      rule: "USER"
    })
    return user;
  }

  async findAll(limit: number, currentPage: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    console.log(filter)
    const skip = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;//nếu không truyền vào limit thì sẽ để mặc định là 10
    const totalItems = (await this.userModel.find(filter)).length;//tổng số bản ghi
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel.find(filter)
      .skip(skip)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select("-password")
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id }).select("-password")

  }
  findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email })
  }
  checkUserPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }
  async update(updateUserDto: UpdateUserDto, user: IUser) {
    //check email 
    const isEmail = await this.userModel.findOne({ email: updateUserDto.email })
    if (isEmail) {
      throw new BadRequestException("email da ton tai")
    }
    let updateUser = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto, updatedBy:
        {
          _id: user._id,
          email: user.email
        }
      })
    return updateUser
  }

  async remove(id: string, user: IUser) {
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return await this.userModel.softDelete({ _id: id })
  }
  updateUserToken = async (refreshToken: string, _id:string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken })
  }
  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
  }
}
