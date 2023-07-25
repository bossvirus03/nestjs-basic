import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true
})
export class User {
  @Prop()
  email:string;

  @Prop()
  role:string;
  
  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  age: number;
  @Prop()
  createdAt: string;
  @Prop()
  isDeleted: boolean;

  @Prop()
  updatedAt: string;
  
  @Prop()
  deletedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);