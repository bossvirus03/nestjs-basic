import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;
@Schema({
    timestamps: true
})
export class Job {
    @Prop()
    name: string;
    @Prop()
    skills: string[];
    @Prop({ type: Object })
    company: {
        _id: string;
        name: string;
    };
    @Prop()
    location: string;
    @Prop()
    salary: number;
    @Prop()
    quantity: number;
    @Prop()
    level: string;
    @Prop()
    description: string;
    @Prop()
    startDate: string;
    @Prop()
    endDate: string;
    @Prop()
    isActive: boolean;
    @Prop()
    isDeleted: boolean;
    @Prop()
    createdAt: string;
    @Prop()
    updatedAt: string;
    @Prop()
    deletedAt: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);