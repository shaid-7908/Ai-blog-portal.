import { z } from 'zod';

export const createBlogCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        description: z.string().optional(),
    })
});

export const updateBlogCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    })
});

export const idParamSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    })
});

export const paginationQuerySchemaBlogCategory = z.object({
    query: z.object({
        page: z.coerce.number().min(1, "Page must be at least 1").default(1),
        limit: z.coerce.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100").default(10),
        search: z.string().optional().nullable(),
        isActive: z.string().optional().nullable().transform(value => {
            if (value === undefined || value === null) return value;
            return value.toLowerCase() === 'true';
        }),
    })
});

export type PaginationQueryInputBlogCategory = z.infer<typeof paginationQuerySchemaBlogCategory>['query'];
