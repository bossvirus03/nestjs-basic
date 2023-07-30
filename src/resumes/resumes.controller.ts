import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }
  @Post()
  async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    const newResume = await this.resumesService.create(createResumeDto, user);
    return {
      createdAt: newResume?.createdAt,
    }
  }

  @Get()
  findAll(
    @Query("pageSize") limit: number,
    @Query("current") currentPage: number,
    @Query() qs: string) {
    return this.resumesService.findAll(limit, currentPage,qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumesService.update(id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
