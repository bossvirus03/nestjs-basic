import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ResponseMessage("create a permission")
  async create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    const newPermission = await this.permissionsService.create(createPermissionDto, user)
    return {
      CreatedAt: newPermission?.createdAt,
      _id: newPermission?._id
    }
  }

  @Get()
  findAll(
    @Query("pageSize") limit: number,
    @Query("current") currentPage: number,
    @Query() qs: string) {
    return this.permissionsService.findAll(limit, currentPage, qs);
  }

  @ResponseMessage("get permission by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
  @Patch(':id')
  @ResponseMessage("update a permission")
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
