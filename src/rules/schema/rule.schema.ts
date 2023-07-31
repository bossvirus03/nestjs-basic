import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { Permission } from "src/permissions/schema/permission.schema";
export type RuleDocument = HydratedDocument<Rule>;
@Schema({
    timestamps: true
})
export class Rule {
    @Prop() 
    name: string;
    @Prop() 
    description: string;
    @Prop() 
    isActive: boolean;
    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Permission.name})
    permissions: Permission[];
    @Prop() 
    createdAt: Date;
    @Prop() 
    updatedAt:Date;
    @Prop() 
    deletedAt: Date;
    @Prop() 
    isDeleted: boolean;
    @Prop({type: Object}) 
    createdBy: { _id: string, email: string };
    @Prop({type: Object}) 
    updatedBy: { _id: string, email: string };
    @Prop({type: Object}) 
    deletedBy: { _id: string, email: string };
}
export const RuleSchema = SchemaFactory.createForClass(Rule);