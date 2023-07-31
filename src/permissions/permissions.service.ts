import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private PermissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    return await this.PermissionModel.create(
      {
        ...createPermissionDto,
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
    const totalItems = (await this.PermissionModel.find(filter)).length;//tổng số bản ghi
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.PermissionModel.find(filter)
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

  findOne(id: string) {
    return this.PermissionModel.findOne({ _id: id });
  }
  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    return await this.PermissionModel.updateOne({ _id: id }, {
      ...updatePermissionDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    await this.PermissionModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.PermissionModel.softDelete({ _id: id });
  }
}
