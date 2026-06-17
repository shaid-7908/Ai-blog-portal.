import { Request, Response } from "express";
import { asyncHandler } from "../common/utils/async.handler";
import { sendError, sendSuccess } from "../common/utils/unified.response";
import { BlogModel } from "../model/blog.model";
import { BlogCategoryModel } from "../model/category.model";
import { PipelineStage } from "mongoose";
import { PaginationQueryInputBlog } from "../common/validators/blog.validation";
import { EmbeddedBlogCategory } from "../common/types/blog.types";

const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export class BlogController {
    createBlog = asyncHandler(async (req: Request, res: Response) => {
        const { title, content, status, categories, excerpt, seoTitle, seoDescription } = req.body;
        
        let featureImage = "";
        if (req.file) {
            // multer-s3 adds location property to the file object
            featureImage = (req.file as any).location || req.file.path;
        }

        // Auto-generate slug
        let slug = generateSlug(title);
        let slugExists = await BlogModel.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = `${generateSlug(title)}-${counter}`;
            slugExists = await BlogModel.findOne({ slug });
            counter++;
        }

        // Process categories
        let embeddedCategories: EmbeddedBlogCategory[] = [];
        if (categories && Array.isArray(categories)) {
            // Handle cases where category items are comma-separated within the array
            const categoryIds = categories.flatMap(c => c.split(',').map((id: string) => id.trim()));
            
            const fetchedCategories = await BlogCategoryModel.find({ 
                _id: { $in: categoryIds },
                isDeleted: false
            });

            embeddedCategories = fetchedCategories.map(cat => ({
                categoryId: cat._id,
                name: cat.name,
                slug: cat.slug
            }));
        }

        const newBlog = await BlogModel.create({
            title,
            slug,
            content,
            status,
            featureImage,
            postedBy: req.user?.id,
            categories: embeddedCategories,
            excerpt,
            seoTitle,
            seoDescription
        });

        return sendSuccess(res, "Blog created successfully", newBlog, 201);
    });

    getPaginatedBlogs = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as PaginationQueryInputBlog;
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        const and_clause: any[] = [{ isDeleted: false }];

        if (query.search) {
            const regex = new RegExp(query.search, 'i');
            and_clause.push({
                $or: [{ title: regex }, { content: regex }, { excerpt: regex }]
            });
        }
        
        if (query.status) {
            and_clause.push({ status: query.status });
        }

        if (query.category) {
            // Can be slug or ID
            const categoryRegex = new RegExp(query.category, 'i');
            and_clause.push({
                $or: [
                    { 'categories.slug': categoryRegex },
                    { 'categories.categoryId': query.category } // Exact match if ID is passed
                ]
            });
        }

        const condition = { $and: and_clause };

        const countPipeline: PipelineStage[] = [
            { $match: condition },
            { $count: 'total' }
        ];

        const filterPipeline: PipelineStage[] = [
            { $match: condition },
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [
                        { $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } }
                    ]
                }
            },
            { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    content: 0 // Exclude full content for list view to improve performance
                }
            }
        ];

        const [countResult, docs] = await Promise.all([
            BlogModel.aggregate(countPipeline),
            BlogModel.aggregate([...filterPipeline, { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }])
        ]);

        const totalDocs = countResult.length ? countResult[0].total : 0;
        const remainingDocs = totalDocs - (skip + docs.length);
        const hasNextPage = remainingDocs > 0;
        const hasPrevPage = page > 1;

        const result = {
            meta: {
                totalDocs,
                skip,
                page,
                limit,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
            },
            docs,
        };

        return sendSuccess(res, "Blogs fetched successfully", result, 200);
    });

    getBlogByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
        const slug = req.params.slug;
        
        const query = { slug: slug, isDeleted: false };
        
        const blog = await BlogModel.findOne(query).populate('postedBy', 'firstName lastName email');
        
        if (!blog) {
            return sendError(res, "Blog not found", null, 404);
        }
        
        return sendSuccess(res, "Blog fetched successfully", blog, 200);
    });

    updateBlog = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const { title, content, status, categories, excerpt, seoTitle, seoDescription } = req.body;
        
        const blog = await BlogModel.findOne({ _id: id, isDeleted: false });
        
        if (!blog) {
            return sendError(res, "Blog not found", null, 404);
        }

        if (req.file) {
            blog.featureImage = (req.file as any).location || req.file.path;
        }

        if (title && title !== blog.title) {
            let newSlug = generateSlug(title);
            let slugExists = await BlogModel.findOne({ slug: newSlug, _id: { $ne: id } });
            let counter = 1;
            while (slugExists) {
                newSlug = `${generateSlug(title)}-${counter}`;
                slugExists = await BlogModel.findOne({ slug: newSlug, _id: { $ne: id } });
                counter++;
            }
            blog.title = title;
            blog.slug = newSlug;
        }

        if (content !== undefined) blog.content = content;
        if (status !== undefined) blog.status = status;
        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (seoTitle !== undefined) blog.seoTitle = seoTitle;
        if (seoDescription !== undefined) blog.seoDescription = seoDescription;

        if (categories && Array.isArray(categories)) {
            const categoryIds = categories.flatMap(c => c.split(',').map((id: string) => id.trim()));
            const fetchedCategories = await BlogCategoryModel.find({ 
                _id: { $in: categoryIds },
                isDeleted: false
            });

            blog.categories = fetchedCategories.map(cat => ({
                categoryId: cat._id,
                name: cat.name,
                slug: cat.slug
            }));
        }

        await blog.save();

        return sendSuccess(res, "Blog updated successfully", blog, 200);
    });

    deleteBlog = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const blog = await BlogModel.findOne({ _id: id, isDeleted: false });
        
        if (!blog) {
            return sendError(res, "Blog not found", null, 404);
        }

        blog.isDeleted = true;
        await blog.save();

        return sendSuccess(res, "Blog deleted successfully", null, 200);
    });
}
