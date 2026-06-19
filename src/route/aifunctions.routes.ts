import { Router, Request, Response } from 'express'
import { AifunctionsController } from '../controller/aifunctions.controller'
import { validate } from '../common/middlewares/validate.middleware'
import { aiConfigFormSchema } from '../common/validators/aifunctions.validation'


const aiFunctionsRouter = Router()

const aiFunctionsController = new AifunctionsController()

//aiFunctionsRouter.get('/baisc-response-test',aiFunctionsController.baiscResponseTest)

aiFunctionsRouter.post('/generate-blog-idea', validate(aiConfigFormSchema),aiFunctionsController.generateIdeas)

export default aiFunctionsRouter