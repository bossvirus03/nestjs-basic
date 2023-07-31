import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose";
export type PermissionDocument = HydratedDocument  <Permission>;
@Schema({
    timestamps: true
})
export class Permission {

    @Prop()
    name: string;
    @Prop()
    apiPath: string;
    @Prop()
    method: string;
    @Prop()
    module: string;//thuộc modules nào ?
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    deletedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop({ type: Object })
    createdBy: { _id, email };
    @Prop({ type: Object })
    updatedBy: { _id, email };
    @Prop({ type: Object })
    deletedBy: { _id, email };
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);