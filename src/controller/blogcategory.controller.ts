import { Request, Response } from "express";
import { asyncHandler } from "../common/utils/async.handler";
import { sendError, sendSuccess } from "../common/utils/unified.response";
import { BlogCategoryModel } from "../model/category.model";
import { PipelineStage } from "mongoose";
import { PaginationQueryInputBlogCategory } from "../common/validators/blogcategory.validation";

// Helper function to generate slug
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export class BlogCategoryController {
    createCategory = asyncHandler(async (req: Request, res: Response) => {
        const { name, description } = req.body;
        
        const existingCategory = await BlogCategoryModel.findOne({ name, isDeleted: false });
        if (existingCategory) {
            return sendError(res, "Category with this name already exists", null, 400);
        }

        let slug = generateSlug(name);
        
        // Ensure slug is unique
        let slugExists = await BlogCategoryModel.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = `${generateSlug(name)}-${counter}`;
            slugExists = await BlogCategoryModel.findOne({ slug });
            counter++;
        }

        const category = await BlogCategoryModel.create({
            name,
            slug,
            description
        });

        return sendSuccess(res, "Category created successfully", category, 201);
    });

    getPaginatedCategories = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as PaginationQueryInputBlogCategory;
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        const and_clause: any[] = [{ isDeleted: false }];

        if (query.search) {
            const regex = new RegExp(query.search, 'i');
            and_clause.push({
                $or: [{ name: regex }, { description: regex }]
            });
        }
        
        if (query.isActive !== undefined && query.isActive !== null) {
            and_clause.push({ isActive: query.isActive });
        }

        const condition = { $and: and_clause };
        console.log(condition)

        const countPipeline: PipelineStage[] = [
            { $match: condition },
            { $count: 'total' }
        ];

        const filterPipeline: PipelineStage[] = [
            { $match: condition },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    description: 1,
                    isActive: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ];

        const [countResult, docs] = await Promise.all([
            BlogCategoryModel.aggregate(countPipeline),
            BlogCategoryModel.aggregate([...filterPipeline, { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }])
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

        return sendSuccess(res, "Categories fetched successfully", result, 200);
    });

    getCategoryById = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const category = await BlogCategoryModel.findOne({ _id: id, isDeleted: false });
        
        if (!category) {
            return sendError(res, "Category not found", null, 404);
        }
        
        return sendSuccess(res, "Category fetched successfully", category, 200);
    });

    updateCategory = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name, description, isActive } = req.body;
        
        const category = await BlogCategoryModel.findOne({ _id: id, isDeleted: false });
        
        if (!category) {
            return sendError(res, "Category not found", null, 404);
        }

        if (name && name !== category.name) {
            const existingCategory = await BlogCategoryModel.findOne({ name, isDeleted: false, _id: { $ne: id } });
            if (existingCategory) {
                return sendError(res, "Category with this name already exists", null, 400);
            }

            let newSlug = generateSlug(name);
            let slugExists = await BlogCategoryModel.findOne({ slug: newSlug, _id: { $ne: id } });
            let counter = 1;
            while (slugExists) {
                newSlug = `${generateSlug(name)}-${counter}`;
                slugExists = await BlogCategoryModel.findOne({ slug: newSlug, _id: { $ne: id } });
                counter++;
            }
            category.name = name;
            category.slug = newSlug;
        }

        if (description !== undefined) category.description = description;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        return sendSuccess(res, "Category updated successfully", category, 200);
    });

    deleteCategory = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const category = await BlogCategoryModel.findOne({ _id: id, isDeleted: false });
        
        if (!category) {
            return sendError(res, "Category not found", null, 404);
        }

        category.isDeleted = true;
        category.isActive = false;
        await category.save();

        return sendSuccess(res, "Category deleted successfully", null, 200);
    });
}
