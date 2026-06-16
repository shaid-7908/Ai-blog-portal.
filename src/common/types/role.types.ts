
import { Document, Types } from 'mongoose'

export interface RoleDocument extends Document {
    roleDisplayName:string;
    roleGroup:string;
    isDeleted:boolean;
    isActive:boolean;
}