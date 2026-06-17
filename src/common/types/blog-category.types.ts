import { Document } from "mongoose";

export interface BlogCategoryDocument extends Document{
    name:string;
    slug:string;
    description:string;
    isDeleted:boolean;
    isActive:boolean;
}