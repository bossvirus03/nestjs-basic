import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) { }
  @ResponseMessage("create a role")
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser){
    const newRole = await this.rolesService.create(createRoleDto, user);
    return {
      createdAt: new Date,
      _id: newRole._id
    }
  }

  @Get()
  findAll(
    @Query("pageSize") limit: number,
    @Query("current") currentPage: number,
    @Query() qs: string) {
    return this.rolesService.findAll(limit, currentPage, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @ResponseMessage("delete a role")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
