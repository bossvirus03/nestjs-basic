import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schema/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  async create(createResumeDto: CreateResumeDto, user: IUser): Promise<Resume> {
    const resume = await this.resumeModel.create({
      ...createResumeDto,
      status: "Pending",
      email: user.email,
      history: {
        status: createResumeDto.status,
        updatedAt: new Date,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    })
    return resume;
  }

  async findAll(limit: number, currentPage: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    console.log(filter)
    const skip = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;//nếu không truyền vào limit thì sẽ để mặc định là 10
    const totalItems = (await this.resumeModel.find(filter)).length;//tổng số bản ghi
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.resumeModel.find(filter)
      .skip(skip)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select("-password")
      .populate(population)
      .exec();
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
    return this.resumeModel.findOne({_id: id});
  }

  update(id: string, updateResumeDto: UpdateResumeDto) {
    return this.resumeModel.updateOne({_id: id},{...updateResumeDto});
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne({_id: id},{deletedBy: {_id: user._id,email: user.email}});
    return await this.resumeModel.softDelete({_id: id});
  }
}
