import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { authorizeRoles, verifyAccessToken } from "../common/middlewares/auth.middleware";
import { RoleEnum } from "../common/enum/role.enum";

const userRouter = Router()
const userController = new UserController()

userRouter.get('/profile-details',verifyAccessToken,authorizeRoles(RoleEnum.ADMIN,RoleEnum.USER),userController.profileDetails)


export default userRouter