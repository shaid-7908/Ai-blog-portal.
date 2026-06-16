import { RoleEnum } from "../common/enum/role.enum"
import { asyncHandler } from "../common/utils/async.handler"
import { generateAccessToken, generateRefreshToken } from "../common/utils/jwt.tokengenerator"
import { comparePassword, hashPassword } from "../common/utils/password.hasher"
import { sendError, sendSuccess } from "../common/utils/unified.response"
import { LoginUserInput, RegisterUserInput } from "../common/validators/user.validation"
import { RoleModel } from "../model/role.model"
import { UserModel } from "../model/user.model"
import { Request,Response } from "express"



export class AuthController {
     registerUser = asyncHandler(async (req:Request,res:Response)=>{
             const body = req.body as RegisterUserInput
             const checkUserExists = await UserModel.findOne({email:body.email})
             if(checkUserExists){
                 return sendError(res,"User Already Exists",null,400)
             }
             const hashedPassword = await hashPassword(body.password)
             body.password = hashedPassword;
             const role = await RoleModel.findOne({roleDisplayName:RoleEnum.USER})
             if(!role){
                 return sendError(res,"Role Not Found",null,404)
             }
             const payload = {...body,role:role._id}
             const newUser = await UserModel.create(payload)
             return sendSuccess(res,"User Created Successfully",newUser,201)
         })

    loginUser = asyncHandler(async (req:Request,res:Response)=>{
        const body = req.body as LoginUserInput

        const userAggrigation = await UserModel.aggregate([
            {
                $match:{email:body.email}
            },
            {
                $lookup:{
                    from:'roles',
                    localField:'role',
                    foreignField:'_id',
                    as:'role',
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                roleDisplayName:1,
                                roleGroup:1
                            }
                        }
                    ]
                }
            },
            {
                $unwind:'$role'
            },
            {
                $project:{
                    _id:1,
                    email:1,
                    firstName:1,
                    lastName:1,
                    phone:1,
                    dateOfBirth:1,
                    password:1,
                    role:1
                }
            }
        ])
        if(userAggrigation.length <= 0){
            return sendError(res,"User Not Found",null,404)
        }
        const user = userAggrigation[0]
        const isPasswordValid = await comparePassword(body.password,user.password)
        if(!isPasswordValid){
            return sendError(res,"Invalid Password",null,401)
        }

        const accessToken = generateAccessToken({email:user.email,id:user._id.toString(),role:user.role})
        const refreshToken = generateRefreshToken({email:user.email,id:user._id.toString(),role:user.role})
        const payload = {
            accessToken:accessToken,
            refreshToken:refreshToken,
            email:user.email,
            _id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            phone:user.phone,
            dateOfBirth:user.dateOfBirth,
            role:user.role
        }
        res.cookie('refreshToken',refreshToken,{httpOnly:true,secure:true,maxAge:1000*60*60*24*7})
        res.cookie('accessToken',accessToken,{httpOnly:true,secure:true,maxAge:1000*60*60*24})
        return sendSuccess(res,"User Logged In Successfully",payload,200)
    })
}