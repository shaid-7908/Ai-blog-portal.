import { Router } from "express";
import { authorizeRoles, verifyAccessTokenEJS, redirectIfLoggedIn } from "../common/middlewares/auth.middleware";
import { RoleEnum } from "../common/enum/role.enum";
import { EjsController } from "../controller/ejs.controller";

const ejsRouter = Router()
const ejsController = new EjsController()

ejsRouter.get("/", async (req, res) => {
    res.redirect('/dashboard');
})

ejsRouter.get("/dashboard", verifyAccessTokenEJS, async (req, res) => {
    res.render("index")
})

ejsRouter.get('/login', redirectIfLoggedIn, async (req, res) => {
    res.render('login')
})

ejsRouter.get('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('/login');
});
//User Management Routes 
ejsRouter.get("/user-management", verifyAccessTokenEJS, authorizeRoles(RoleEnum.ADMIN), ejsController.userManageMent)


//Blog category routes
ejsRouter.get("/blog-category-management",verifyAccessTokenEJS,authorizeRoles(RoleEnum.ADMIN),ejsController.blogCategoryList)

export default ejsRouter