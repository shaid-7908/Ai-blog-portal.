import { model, Schema } from "mongoose";
import { BlogCategoryDocument } from "../common/types/blog-category.types";

export const BlogCategorySchema = new Schema<BlogCategoryDocument>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String },
        isDeleted: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey:false
    }
)

BlogCategorySchema.index({name:1},{unique:true,partialFilterExpression:{isDeleted:false}})
BlogCategorySchema.index({slug:1})

export const BlogCategoryModel = model<BlogCategoryDocument>('BlogCategory', BlogCategorySchema)