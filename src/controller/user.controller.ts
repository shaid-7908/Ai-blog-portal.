import { asyncHandler } from "../common/utils/async.handler";
import {Request,Response} from 'express'
import { RegisterUserInput } from "../common/validators/user.validation";
import { hashPassword } from "../common/utils/password.hasher";
import { UserModel } from "../model/user.model";
import { sendError, sendSuccess } from "../common/utils/unified.response";
import { RoleModel } from "../model/role.model";
import { RoleEnum } from "../common/enum/role.enum";
import { Types } from "mongoose";

export class UserController {
    profileDetails = asyncHandler(async (req:Request,res:Response)=>{
        if(!req.user){
            return sendError(res,'Unauthenticated user',null,400)
        }
        const userDetails = await UserModel.aggregate([
            {
                $match:{
                    _id:new Types.ObjectId(req.user.id)
                }
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
                    role:1
                }
            }
        ])
        return sendSuccess(res,"User Details",userDetails[0],200)
    })
}