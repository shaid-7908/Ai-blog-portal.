import { Router, Request, Response } from 'express'
import { AifunctionsController } from '../controller/aifunctions.controller'
import { validate } from '../common/middlewares/validate.middleware'
import { aiConfigFormSchema } from '../common/validators/aifunctions.validation'
import { authorizeRoles, verifyAccessToken } from '../common/middlewares/auth.middleware'
import { RoleEnum } from '../common/enum/role.enum'


const aiFunctionsRouter = Router()

const aiFunctionsController = new AifunctionsController()

//aiFunctionsRouter.get('/baisc-response-test',aiFunctionsController.baiscResponseTest)

aiFunctionsRouter.post('/generate-blog-idea', validate(aiConfigFormSchema),verifyAccessToken,
authorizeRoles(RoleEnum.ADMIN),aiFunctionsController.generateIdeas)

aiFunctionsRouter.post('/save-outline', verifyAccessToken,
    authorizeRoles(RoleEnum.ADMIN), aiFunctionsController.saveOutline)

export default aiFunctionsRouter