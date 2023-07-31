import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @ResponseMessage("create a User")
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      createdBy: newUser?.createdBy
    }
  }

  @ResponseMessage("fetch all Users")
  @Get()
  findAll(
    @Query("pageSize") limit: number,
    @Query("current") currentPage: number,
    @Query() qs: string
  ) {
    return this.usersService.findAll(limit, currentPage, qs);
  }
  @ResponseMessage("fetch a User by id")
  @Get(':id')//các router dùng tới params thì nên đặt ở đằng sau
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
      .then(() => this.usersService.findOne(id))
      .catch(() => "user not found")
  }

  @ResponseMessage("Update a User")
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @ResponseMessage("delete a User")
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.usersService.remove(id, user)
  }
}