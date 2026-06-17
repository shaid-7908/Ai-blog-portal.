import { Router } from "express";
import { BlogCategoryController } from "../controller/blogcategory.controller";
import { validate } from "../common/middlewares/validate.middleware";
import { verifyAccessToken, authorizeRoles } from "../common/middlewares/auth.middleware";
import { RoleEnum } from "../common/enum/role.enum";
import {
    createBlogCategorySchema,
    updateBlogCategorySchema,
    idParamSchema,
    paginationQuerySchemaBlogCategory
} from "../common/validators/blogcategory.validation";

export const blogCategoryRouter = Router();
const blogCategoryController = new BlogCategoryController();


blogCategoryRouter.post(
    '/create',
    verifyAccessToken,
    authorizeRoles(RoleEnum.ADMIN),
    validate(createBlogCategorySchema),
    blogCategoryController.createCategory
);


blogCategoryRouter.get(
    '/get-all',
    validate(paginationQuerySchemaBlogCategory),
    blogCategoryController.getPaginatedCategories
);


blogCategoryRouter.get(
    '/get/:id',
    validate(idParamSchema),
    blogCategoryController.getCategoryById
);


blogCategoryRouter.put(
    '/update/:id',
    verifyAccessToken,
    authorizeRoles(RoleEnum.ADMIN),
    validate(updateBlogCategorySchema),
    blogCategoryController.updateCategory
);

blogCategoryRouter.delete(
    '/delete/:id',
    verifyAccessToken,
    authorizeRoles(RoleEnum.ADMIN),
    validate(idParamSchema),
    blogCategoryController.deleteCategory
);

export default blogCategoryRouter;
