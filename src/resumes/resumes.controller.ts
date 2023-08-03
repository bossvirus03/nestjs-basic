import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }
  @Post()
  async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    const newResume = await this.resumesService.create(createResumeDto, user);
    return {
      _id: newResume?._id,
      createdAt: newResume?.createdAt,
    }
  }

  @Get()
  findAll(
    @User() user: IUser,
    @Query("pageSize") limit: number,
    @Query("current") currentPage: number,
    @Query() qs: string) {
    return this.resumesService.findAll(limit, currentPage, qs, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }
  @Get('/by-user/:userId')
  findByUser(@Param('userId') id: string) {
    return this.resumesService.findByUser(id)
  }
  @ResponseMessage("update status resume")
  @Patch(':id')
  update(@Param('id') id: string, @Body("status") status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
