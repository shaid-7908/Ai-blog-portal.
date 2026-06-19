import { generateBlogIdeas, getGroqChatCompletion } from "../ai-functions/groq-sdk";
import { asyncHandler } from "../common/utils/async.handler";
import { Request,Response } from "express";
import { sendSuccess } from "../common/utils/unified.response";
import { Types } from "mongoose";
import { BlogCategoryModel } from "../model/category.model";


export class AifunctionsController{
    // baiscResponseTest = asyncHandler(async (req:Request,res:Response)=>{
    //    //const data = await getGroqChatCompletion()
    //    const data = await generateBlogIdeas()
    //    //console.log(data.usage?.total_tokens)
    //    let payloads ={
    //     usage: data.usage,
    //     result: JSON.parse(data.choices[0]?.message.content || "{}")
    //    }
    //    return sendSuccess(res,'done',payloads,200)
    // })

    generateIdeas = asyncHandler(async (req:Request,res:Response)=>{
        const {topic,keywords,categories,word_count,writing_tone,target_audience} = req.body
        const categoriesFullInfo =await BlogCategoryModel.find({_id:{$in:categories}}).select('name')
        const categoryNameOnlyArray = categoriesFullInfo.map((e:any)=>{
            return e.name
        })
        const ideaPayload = {
            topic,
            keywords,
            word_count,
            writing_tone,
            target_audience,
            categories:categoryNameOnlyArray
        }

        const blogIdea = await generateBlogIdeas(ideaPayload)
        return sendSuccess(res,'Blog Idea fetched successfully',blogIdea,200)
    })


    
}