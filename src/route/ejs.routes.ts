import { Router } from "express";
import { authorizeRoles, verifyAccessToken } from "../common/middlewares/auth.middleware";
import { RoleEnum } from "../common/enum/role.enum";
import { EjsController } from "../controller/ejs.controller";

const ejsRouter = Router()
const ejsController = new EjsController()

ejsRouter.get("/",async (req,res)=>{
    res.send('hello')
})

ejsRouter.get("/dashboard",async(req,res)=>{
    res.render("index")
})

ejsRouter.get('/login',async(req,res)=>{
    res.render('login')
})

ejsRouter.get("/user-management",verifyAccessToken,authorizeRoles(RoleEnum.ADMIN,RoleEnum.USER),ejsController.userManageMent)

export default ejsRouter