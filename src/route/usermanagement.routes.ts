import { Router } from "express";
import { UserManagementController } from "../controller/usermanagement.controller";
import { validate } from "../common/middlewares/validate.middleware";
import { paginationQuerySchemaUser } from "../common/validators/user.validation";
import { authorizeRoles, verifyAccessToken } from "../common/middlewares/auth.middleware";
import { RoleEnum } from "../common/enum/role.enum";


const userManagentRouter = Router()
const userManagementController = new UserManagementController()


userManagentRouter.get('/get-all',validate(paginationQuerySchemaUser),verifyAccessToken,authorizeRoles(RoleEnum.ADMIN),userManagementController.getPaginatedUsers)


export default userManagentRouter