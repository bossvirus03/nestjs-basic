import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Company, Public } from 'src/decorator/customize';
import { ICompany } from 'src/companies/companies.interface';
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  create(@Body() createJobDto: CreateJobDto, @Company() company: ICompany) {
    return this.jobsService.create(createJobDto, company);
  }

  @Get()
  @Public()
  findAll(@Query("current") currentPage: number,
          @Query("pageSize") limit: number,
          @Query() qs : string) {
    return this.jobsService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
