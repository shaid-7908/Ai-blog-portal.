import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { validate } from "../common/middlewares/validate.middleware";
import { registerUserSchema } from "../common/validators/user.validation";
import { authorizeRoles, verifyAccessToken } from "../common/middlewares/auth.middleware";
import { RoleEnum } from "../common/enum/role.enum";

const userRouter = Router()
const userController = new UserController()

//userRouter.post('/register',validate(registerUserSchema),userController.register)
userRouter.get('/profile-details',verifyAccessToken,authorizeRoles(RoleEnum.ADMIN,RoleEnum.USER),userController.profileDetails)
export default userRouter