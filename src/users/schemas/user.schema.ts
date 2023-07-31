import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Rule } from 'src/rules/schema/rule.schema';
export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true
})
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  role: string;

  @Prop()
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Rule.name })
  rule: mongoose.Schema.Types.ObjectId;;

  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: string;

  @Prop()
  isDeleted: boolean;

  @Prop()
  updatedAt: string;

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}
export const UserSchema = SchemaFactory.createForClass(User);