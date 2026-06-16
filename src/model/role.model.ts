import { model, Schema } from "mongoose";
import { RoleDocument } from "../common/types/role.types";

export const RoleSchema =new Schema<RoleDocument>({
    roleDisplayName:{type:String},
    roleGroup:{type:String},
    isDeleted:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true}
},{timestamps:true})

export const RoleModel = model<RoleDocument>('Role', RoleSchema);
