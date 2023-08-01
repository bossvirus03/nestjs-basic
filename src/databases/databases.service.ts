import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schema/permission.schema';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  constructor(
    @InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name) private PermissionModel: SoftDeleteModel<PermissionDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private configService: ConfigService,
    private usersService: UsersService
  ) { }
  async onModuleInit() {
    const autoCreateFakeData = this.configService.get<string>("AUTO_CREATE_DATA")
    if (autoCreateFakeData == "true") {
      const countPermissions = await this.PermissionModel.count({});
      const countRoles = await this.RoleModel.count({});
      const countUsers = await this.userModel.count({});

      if (countPermissions == 0) {
        await this.PermissionModel.insertMany(INIT_PERMISSIONS)
      }
      if (countRoles == 0) {
        const permissions = await this.PermissionModel.find().select("_id");
        await this.RoleModel.insertMany(
          [
            {
              name: ADMIN_ROLE,
              description: "Admin thì full quyền :v",
              isActive: true,
              permissions: permissions
            },
            {
              name: USER_ROLE,
              description: "Người dùng/Ứng viên sử dụng hệ thống",
              isActive: true,
              permissions: [] //không set quyền, chỉ cần add ROLE
            }
          ]
        )
      }
      if (countUsers === 0) {
        const adminRole = await this.RoleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.RoleModel.findOne({ name: USER_ROLE })
        await this.userModel.insertMany([
          {
            name: "I'm admin",
            email: "admin@gmail.com",
            password: this.usersService.getHardPassword(this.configService.get<string>("INIT_PASSWORD")),
            age: 69,
            gender: "MALE",
            address: "VietNam",
            role: adminRole?._id
          },
          {
            name: "I'm Hỏi Dân IT",
            email: "hoidanit@gmail.com",
            password: this.usersService.getHardPassword(this.configService.get<string>("INIT_PASSWORD")),
            age: 96,
            gender: "MALE",
            address: "VietNam",
            role: adminRole?._id
          },
          {
            name: "I'm normal user",
            email: "user@gmail.com",
            password: this.usersService.getHardPassword(this.configService.get<string>("INIT_PASSWORD")),
            age: 69,
            gender: "MALE",
            address: "VietNam",
            role: userRole?._id
          },
        ])
      }
    }
  }
}
