import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ICompany } from 'src/companies/companies.interface';
import { InjectModel } from '@nestjs/mongoose'
import { Job, JobDocument } from './schema/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private JobModel: SoftDeleteModel<JobDocument>) {}
  async create(createJobDto: CreateJobDto, company: ICompany) {
    const job = await this.JobModel.create({
      ...createJobDto,
    })
    return job;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);//số bản ghi đã hiển thị ra
    let defaultLimit = +limit ? +limit : 10;//nếu không truyền vào limit thì sẽ để mặc định là 10
    const totalItems = (await this.JobModel.find(filter)).length;//tổng số bản ghi
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.JobModel.find(filter)
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
    return await this.JobModel.findOne({_id:id});
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    return await this.JobModel.updateOne({_id:id}, updateJobDto)
  }

  async remove(id: string) {
    return await this.JobModel.softDelete({_id:id})  }
}