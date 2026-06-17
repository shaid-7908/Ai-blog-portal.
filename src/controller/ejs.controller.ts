import { email } from "zod";
import { JwtPayload } from "../common/types/auth.types";
import { asyncHandler } from "../common/utils/async.handler";
import { Response,Request } from "express";

export class EjsController {
    //User management 
    userManageMent = asyncHandler(async (req:Request,res:Response)=>{
         const user = req.user as JwtPayload

         res.render('usermanagement',{
            pageTitle:'User Management',
            email:user.email
         })

    })

    //Blog category
    blogCategoryList = asyncHandler(async (req:Request,res:Response)=>{
        const user = req.user as JwtPayload
        res.render('blog-category-list',{
            pageTitle:'Blog Category Management',
            email:user.email
        })
    })

    // ── Blog pages ────────────────────────────────────────────────────────────
    blogList = asyncHandler(async (req:Request,res:Response)=>{
        const user = req.user as JwtPayload
        res.render('blog-list',{ pageTitle:'Blog Management', email:user.email })
    })

    blogCreate = asyncHandler(async (req:Request,res:Response)=>{
        const user = req.user as JwtPayload
        res.render('blog-create',{ pageTitle:'Create Blog', email:user.email })
    })

    blogView = asyncHandler(async (req:Request,res:Response)=>{
        const user = req.user as JwtPayload
        const { id } = req.params
        res.render('blog-view',{ pageTitle:'View Blog', email:user.email, blogId: id })
    })

    blogEdit = asyncHandler(async (req:Request,res:Response)=>{
        const user = req.user as JwtPayload
        const { id } = req.params
        res.render('blog-edit',{ pageTitle:'Edit Blog', email:user.email, blogId: id })
    })

}