import { Router } from "express";
import { BlogController } from "../controller/blog.controller";
import { validate } from "../common/middlewares/validate.middleware";
import { verifyAccessToken, authorizeRoles } from "../common/middlewares/auth.middleware";
import { RoleEnum } from "../common/enum/role.enum";
import { uploadSingleImage } from "../common/middlewares/upload.middleware";
import {
    createBlogSchema,
    updateBlogSchema,
    paginationQuerySchemaBlog
} from "../common/validators/blog.validation";
import { idParamSchema } from "../common/validators/blogcategory.validation";

export const blogRouter = Router();
const blogController = new BlogController();

// Create a new blog (Admin only) - uses upload middleware for featureImage
blogRouter.post(
    '/create',
    verifyAccessToken,
    authorizeRoles(RoleEnum.ADMIN,RoleEnum.USER),
    uploadSingleImage, // Important: Multipart handling comes before Zod validation
    validate(createBlogSchema),
    blogController.createBlog
);

// Get paginated blogs (Public)
blogRouter.get(
    '/get-all',
    validate(paginationQuerySchemaBlog),
    blogController.getPaginatedBlogs
);

// Get a single blog by ID or Slug (Public)
blogRouter.get(
    '/get/:Slug',
    blogController.getBlogByIdOrSlug
);

// Update a blog (Admin only)
blogRouter.put(
    '/update/:id',
    verifyAccessToken,
    authorizeRoles(RoleEnum.ADMIN),
    uploadSingleImage,
    validate(updateBlogSchema),
    blogController.updateBlog
);

// Delete a blog (Admin only)
blogRouter.delete(
    '/delete/:id',
    verifyAccessToken,
    authorizeRoles(RoleEnum.ADMIN),
    validate(idParamSchema),
    blogController.deleteBlog
);

export default blogRouter;
