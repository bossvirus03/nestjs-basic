import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({
  timestamps: true
})
export class Company {
  @Prop()
  email:string;

  @Prop()
  role:string;

  @Prop()
  desciption:string;

  @Prop()
  name: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;
  
  @Prop()
  deletedAt: string;
@Prop()
isDeleted: boolean;
  @Prop({type : Object })
  deletedBy: {
    _id: string;
    email: string;
  };
  @Prop({type : Object })
  updatedBy: {
    _id: string;
    email: string;
  };
  @Prop({type : Object })
  createdBy: {
    _id: string;
    email: string;
  };

}

export const CompanySchema = SchemaFactory.createForClass(Company);