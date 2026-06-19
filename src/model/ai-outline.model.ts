import { model, Schema } from 'mongoose';
import { AIOutlineDocument } from '../common/types/ai-outline.types';


const AIBodySectionSchema = new Schema(
    {
        section_heading: { type: String, required: true },
        key_points: [{ type: String }],
    },
    { _id: false }
);

const AIOutlineSchema = new Schema(
    {
        introduction: { type: String, required: true },
        body_sections: [AIBodySectionSchema],
        conclusion: { type: String, required: true },
    },
    { _id: false }
);

const AIOutlineConfigSchema = new Schema(
    {
        topic: { type: String, required: true },
        categories: [{ type: Schema.Types.ObjectId, ref: 'BlogCategory' }],
        keywords: [{ type: String }],
        writing_tone: { type: String, required: true },
        target_audience: { type: String, required: true },
        word_count: { type: Number, required: true },
    },
    { _id: false }
);


const AIOutlineMainSchema = new Schema<AIOutlineDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sessionId: { type: Schema.Types.ObjectId, ref: 'AIGenerationSession', default: null },
        config: { type: AIOutlineConfigSchema, required: true },
        title: { type: String, required: true },
        outline: { type: AIOutlineSchema, required: true },
        linkedBlogId: { type: Schema.Types.ObjectId, ref: 'Blog', default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);



AIOutlineMainSchema.index({ userId: 1, createdAt: -1 }); // User's saved outlines, latest first
AIOutlineMainSchema.index({ linkedBlogId: 1 });           // Trace outline from a published blog

export const AIOutlineModel = model<AIOutlineDocument>('AIOutline', AIOutlineMainSchema);
