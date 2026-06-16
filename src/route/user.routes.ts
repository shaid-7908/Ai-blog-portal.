import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { validate } from "../common/middlewares/validate.middleware";
import { registerUserSchema } from "../common/validators/user.validation";
import { verifyAccessToken } from "../common/middlewares/auth.middleware";

const userRouter = Router()
const userController = new UserController()

//userRouter.post('/register',validate(registerUserSchema),userController.register)
userRouter.get('/profile-details',verifyAccessToken,userController.profileDetails)
export default userRouter