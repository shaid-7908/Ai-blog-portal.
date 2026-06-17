import { email } from "zod";
import { JwtPayload } from "../common/types/auth.types";
import { asyncHandler } from "../common/utils/async.handler";
import { Response,Request } from "express";

export class EjsController {
    userManageMent = asyncHandler(async (req:Request,res:Response)=>{
         const user = req.user as JwtPayload

         res.render('usermanagement',{
            pageTitle:'User Management',
            email:user.email
         })

    })
}