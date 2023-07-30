import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
export type ResumeDocument = HydratedDocument<Resume>;
@Schema({
    timestamps: true,
})
export class Resume {
    @Prop()
    email: string;
    @Prop()
    userId: mongoose.Schema.Types.ObjectId;
    @Prop()
    url: string;
    @Prop()
    status: string;
    @Prop()
    companyId: string;
    @Prop()
    jobId: string;
    @Prop({type: Object})
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        }
    };
    @Prop()
    isDeleted: boolean;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    deletedAt: Date;
    @Prop({type: Object})
    cteatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }
    @Prop({type: Object})
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }
    @Prop({type: Object})
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }
}
export const ResumeSchema = SchemaFactory.createForClass(Resume);