import { model, Schema } from 'mongoose';
import { AIGenerationSessionDocument } from '../common/types/ai-generation-session.types';
import { AIGenerationSessionStatusEnum } from '../common/enum/ai-generation-session.enum';

// ── Nested Schemas ───────────────────────────────────────────────────────────

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

const AIBlogIdeaSchema = new Schema(
    {
        title: { type: String, required: true },
        outline: { type: AIOutlineSchema, required: true },
    },
    { _id: false }
);

const AIGenerationOutputSchema = new Schema(
    {
        usage_tokens: { type: Number },
        blog_ideas: [AIBlogIdeaSchema],
    },
    { _id: false }
);

const AIGenerationInputSchema = new Schema(
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

// ── Main Schema ──────────────────────────────────────────────────────────────

export const AIGenerationSessionSchema = new Schema<AIGenerationSessionDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        input: { type: AIGenerationInputSchema, required: true },
        output: { type: AIGenerationOutputSchema, default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ── Indexes ─────────────────────────────────────────────────────────────────

AIGenerationSessionSchema.index({ userId: 1, createdAt: -1 }); // List sessions by user, latest first
// Look up session from a blog

export const AIGenerationSessionModel = model<AIGenerationSessionDocument>(
    'AIGenerationSession',
    AIGenerationSessionSchema
);
