import { asyncHandler } from "../common/utils/async.handler";
import {Request,Response} from 'express'
import { RegisterUserInput } from "../common/validators/user.validation";
import { hashPassword } from "../common/utils/password.hasher";
import { UserModel } from "../model/user.model";
import { sendError, sendSuccess } from "../common/utils/unified.response";

export class UserController {
    register = asyncHandler(async (req:Request,res:Response)=>{
        const body = req.body as RegisterUserInput
        const checkUserExists = await UserModel.findOne({email:body.email})
        if(checkUserExists){
            return sendError(res,"User Already Exists",null,400)
        }
        const hashedPassword = await hashPassword(body.password)
        body.password = hashedPassword;

        const newUser = await UserModel.create(body)
        return sendSuccess(res,"User Created Successfully",newUser,201)
    })
}