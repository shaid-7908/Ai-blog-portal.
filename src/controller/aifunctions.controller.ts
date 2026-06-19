import { generateBlogIdeas } from "../ai-functions/groq-sdk";
import { asyncHandler } from "../common/utils/async.handler";
import { Request, Response } from "express";
import { sendSuccess, sendError } from "../common/utils/unified.response";
import { BlogCategoryModel } from "../model/category.model";
import { AIGenerationSessionModel } from "../model/ai-generation-session.model";
import { AIOutlineModel } from "../model/ai-outline.model";
import { UserModel } from "../model/user.model";


export class AifunctionsController {

    generateIdeas = asyncHandler(async (req: Request, res: Response) => {
        const { topic, keywords, categories, word_count, writing_tone, target_audience } = req.body;

        const categoriesFullInfo = await BlogCategoryModel.find({ _id: { $in: categories } }).select('name');
        const categoryNameOnlyArray = categoriesFullInfo.map((e: any) => e.name);

        const ideaPayload = {
            topic,
            keywords,
            word_count,
            writing_tone,
            target_audience,
            categories: categoryNameOnlyArray
        };

        try {
            const blogIdea = await generateBlogIdeas(ideaPayload);
            const payload = {
                userId: req.user?.id,
                input: req.body,
                output: {
                    usage_tokens: blogIdea.usage,
                    blog_ideas: blogIdea.ai_response?.blog_ideas
                }
            }
            const session = await AIGenerationSessionModel.create(payload);
            await UserModel.updateOne({ _id: req.user?.id },
                {
                    $inc: {
                        totalAiRequest: 1,
                        totalAiToken: blogIdea.usage
                    }
                })
            
            const responsePayload = {
                ...blogIdea,
                sessionId: session._id
            };
            return sendSuccess(res, 'Blog Idea fetched successfully', responsePayload, 200);
        } catch (err: any) {
            const isSchemaError = err?.error?.error?.code === 'json_validate_failed';
            const message = isSchemaError
                ? 'The AI failed to generate a valid structured response after multiple attempts. Please try again.'
                : 'An unexpected error occurred while generating ideas. Please try again.';

            console.error('[generateIdeas] Error after retries:', err?.error?.error?.message || err?.message);
            return sendError(res, message, 503);
        }
    });
    saveOutline = asyncHandler(async (req: Request, res: Response) => {
        const { title, outline, config, sessionId } = req.body;

        if (!title || !outline || !config) {
            return sendError(res, 'title, outline, and config are required.', 400);
        }

        const saved = await AIOutlineModel.create({
            userId: req.user?.id,
            sessionId: sessionId || null,
            config,
            title,
            outline,
            linkedBlogId: null,
        });

        return sendSuccess(res, 'Outline saved successfully', { id: saved._id }, 201);
    });
}
