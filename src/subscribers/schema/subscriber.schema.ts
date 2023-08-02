import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type SubscriberDocument = HydratedDocument<Subscriber>;
@Schema({
    timestamps: true
})
export class Subscriber {
    @Prop()
    email: string;
    @Prop()
    name: string;
    @Prop({type: mongoose.Schema.Types.Array})
    skills: string[];
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    deletedAt: Date;
    @Prop()
    isDeleted: boolean;
}
export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);