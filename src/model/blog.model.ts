import { model, Schema } from "mongoose";
import { BlogDocument, EmbeddedBlogCategory } from "../common/types/blog.types";
import { BlogStatusEnum } from "../common/enum/blog.enum";

const EmbeddedBlogCategorySchema = new Schema<EmbeddedBlogCategory>(
    {
        categoryId: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true }
    },
    { _id: false }
);

export const BlogSchema = new Schema<BlogDocument>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        content: { type: String, required: true },
        status: { 
            type: String, 
            enum: Object.values(BlogStatusEnum), 
            default: BlogStatusEnum.DRAFT 
        },
        isDeleted: { type: Boolean, default: false },
        featureImage: { type: String },
        postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        categories: [EmbeddedBlogCategorySchema],
        excerpt: { type: String },
        seoTitle: { type: String },
        seoDescription: { type: String }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Proper Indexing for performance
BlogSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
BlogSchema.index({ status: 1, isDeleted: 1 }); // Common filter combination
BlogSchema.index({ 'categories.slug': 1 }); // For querying blogs by category
BlogSchema.index({ postedBy: 1 }); // For finding blogs by author
BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' }); // Text search index

export const BlogModel = model<BlogDocument>('Blog', BlogSchema);
