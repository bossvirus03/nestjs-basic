import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schema/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose } from 'mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) 
    private resumeModel: SoftDeleteModel<ResumeDocument>,
    @InjectModel(User.name) 
    private userModel: SoftDeleteModel<UserDocument>,
    ) { }

  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const {status} = createResumeDto;
    const resume = await this.resumeModel.create({
      ...createResumeDto,
      status: "PENDING",
      email: user.email,
      history: {
        status,
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

  async findAll(limit: number, currentPage: number, qs: string, user: IUser) {
    const IduserCompany = (await this.userModel.findOne({_id: user._id}))?.company?._id;
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    console.log(filter)
    const skip = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;//nếu không truyền vào limit thì sẽ để mặc định là 10
    const totalItems = (await this.resumeModel.find(filter)).length;//tổng số bản ghi
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if(IduserCompany){
      const result = await this.resumeModel.find({companyId: IduserCompany})
      .skip(skip)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select(projection as any)
      .populate(population)
       //dùng để ref data truyền populate lên để lấy toàn bộ dữ liệu của model truyên vào ở @Prop
       //dùng fields chọn ra các dữ liệu trong model caanf lấy
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
    const result = await this.resumeModel.find(filter)
      .skip(skip)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select(projection as any)
      .populate(population)
       //dùng để ref data truyền populate lên để lấy toàn bộ dữ liệu của model truyên vào ở @Prop
       //dùng fields chọn ra các dữ liệu trong model caanf lấy
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
    return this.resumeModel.findOne({ _id: id });
  }
  async findByUser(id: string) {
    return await this.resumeModel.findOne({ userId: id }).sort("-createdAt")
    .populate([
    {
    path: "companyId",
    select: { name: 1 }
    },
    {
    path: "jobId",
    select: { name: 1 }
    }
    ])
    
  }

  async update(_id:string, status: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new BadRequestException("id user not found");
    }
    const updated = await this.resumeModel.updateOne({_id}, {
      status,
      updatedBy: {
        _id: user._id,
        email: user.email
      },
      $push: {
        history: {
          status: status,
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      }
    });
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    return await this.resumeModel.softDelete({ _id: id });
  }
}
