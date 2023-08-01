import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>) { }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const checkName = await this.RoleModel.findOne({ name: createRoleDto.name })
    if (checkName) {
      throw new BadRequestException("role này đã tồn tại")
    }
    return await this.RoleModel.create(
      {
        ...createRoleDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      });
  }
  async findAll(limit: number, currentPage: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);//số bản ghi đã hiển thị ra
    let defaultLimit = +limit ? +limit : 10;//nếu không truyền vào limit thì sẽ để mặc định là 10
    const totalItems = (await this.RoleModel.find(filter)).length;//tổng số bản ghi
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.RoleModel.find(filter)
      .skip(offset)//bỏ qua những bản ghi đã hiện thị ra
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec()
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

  async findOne(id: string) {
    return (await this.RoleModel.findOne({ _id: id }))
    .populate({path: "permissions", select: { _id: 1,apiPath: 1, name: 1, method: 1, module: 1}})
  }
  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const checkName = await this.RoleModel.findOne({ name: updateRoleDto.name })
    // if (checkName) {
    //   throw new BadRequestException("role này đã tồn tại")
    // }
    return await this.RoleModel.updateOne({ _id: id }, {
      ...updateRoleDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    const RoleUser = await this.RoleModel.findOne({_id: id});
    if(RoleUser.name === "ADMIN") {
      throw new BadRequestException("ban ko the xoa role admin")
    }
     await this.RoleModel.updateOne({_id: id}, {
      deletedBy: { _id: user._id,email: user.email}
    })
    return await this.RoleModel.softDelete({ _id: id})
  }
}
