import {NextFunction, Request,Response} from 'express'
import { JwtPayload } from '../types/auth.types'
import { asyncHandler } from '../utils/async.handler'
import { sendError } from '../utils/unified.response'
import jwt from 'jsonwebtoken'
import envConfig from '../../config/env.config'
import { UserModel } from '../../model/user.model'

declare global {
    namespace Express{
        interface Request{
            user?:JwtPayload
        }
    }
}

export const verifyAccessToken = asyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
    const accessToken = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];

    if(!accessToken){
        return sendError(res,"Access Token Not Found",null,401)
    }
    try {
        const decodeToken = jwt.verify(accessToken,envConfig.JWT_SECRET) as JwtPayload

        const checkUser = await UserModel.findById(decodeToken.id)
        if(!checkUser){
            return sendError(res,"User Not Found",null,404)
        }
        req.user = decodeToken
        next()
    } catch (error) {
        return sendError(res,"Invalid Access Token",null,401)
    }

})

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return sendError(res, "Unauthenticated", null, 401)
        }
        const userRole = req.user.role.roleDisplayName
        if (!allowedRoles.includes(userRole)) {
            return sendError(res, "Forbidden: You do not have permission to access this resource", null, 403)
        }
        next()
    }
}