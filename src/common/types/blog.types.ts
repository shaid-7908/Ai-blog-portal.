import { Document, Types } from "mongoose";
import { BlogStatusEnum } from "../enum/blog.enum";



export interface EmbeddedBlogCategory {
    categoryId: Types.ObjectId; 
    name: string;
    slug: string;
}

export interface BlogDocument extends Document {
    title:string;
    slug:string;
    content:string;
    status:BlogStatusEnum;
    isDeleted:boolean;
    featureImage:string;
    postedBy:Types.ObjectId | string;
    categories:EmbeddedBlogCategory[];
    excerpt:string;
    seoTitle:string;
    seoDescription:string;
}