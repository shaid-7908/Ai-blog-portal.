import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { validate } from "../common/middlewares/validate.middleware";
import { loginUserSchema, registerUserSchema } from "../common/validators/user.validation";


const authRouter = Router()
const authController = new AuthController()

authRouter.post('/register',validate(registerUserSchema),authController.registerUser)
authRouter.post('/login',validate(loginUserSchema),authController.loginUser)
export default authRouter