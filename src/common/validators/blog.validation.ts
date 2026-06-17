import { z } from 'zod';
import { BlogStatusEnum } from '../enum/blog.enum';

export const createBlogSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        content: z.string().min(10, "Content must be at least 10 characters"),
        status: z.nativeEnum(BlogStatusEnum).optional(),
        categories: z.union([
            z.string().transform((val) => {
                try {
                    const parsed = JSON.parse(val);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                    return [val]; // If it's just a single comma-separated string or ID
                }
            }),
            z.array(z.string())
        ]).optional(),
        excerpt: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
    })
});

export const updateBlogSchema = z.object({
    body: z.object({
        title: z.string().min(3).optional(),
        content: z.string().min(10).optional(),
        status: z.nativeEnum(BlogStatusEnum).optional(),
        categories: z.union([
            z.string().transform((val) => {
                try {
                    const parsed = JSON.parse(val);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                    return [val];
                }
            }),
            z.array(z.string())
        ]).optional(),
        excerpt: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    })
});

export const paginationQuerySchemaBlog = z.object({
    query: z.object({
        page: z.coerce.number().min(1, "Page must be at least 1").default(1),
        limit: z.coerce.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").default(10),
        search: z.string().optional().nullable(),
        status: z.nativeEnum(BlogStatusEnum).optional().nullable(),
        category: z.string().optional().nullable(), // Can filter by category slug or ID
    })
});

export type PaginationQueryInputBlog = z.infer<typeof paginationQuerySchemaBlog>['query'];
