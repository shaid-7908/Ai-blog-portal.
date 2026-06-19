import { Document, Types } from 'mongoose';
import { AIGenerationSessionStatusEnum } from '../enum/ai-generation-session.enum';

// ── AI Output Shapes ─────────────────────────────────────────────────────────

export interface AIBodySection {
    section_heading: string;
    key_points: string[];
}

export interface AIOutline {
    introduction: string;
    body_sections: AIBodySection[];
    conclusion: string;
}

export interface AIBlogIdea {
    title: string;
    outline: AIOutline;
}

export interface AIGenerationOutput {
    usage_tokens: number;
    blog_ideas: AIBlogIdea[];
}

// ── Input Config Shape ───────────────────────────────────────────────────────

export interface AIGenerationInput {
    topic: string;
    categories: Types.ObjectId[];   // refs to BlogCategory
    keywords: string[];
    writing_tone: string;
    target_audience: string;
    word_count: number;
}

// ── Mongoose Document ────────────────────────────────────────────────────────

export interface AIGenerationSessionDocument extends Document {
    userId: Types.ObjectId;                           // ref: 'User'
    input: AIGenerationInput;
    output: AIGenerationOutput | null;
    status: AIGenerationSessionStatusEnum;
    selectedIdeaIndex: number | null;                 // which idea the user chose
    linkedBlogId: Types.ObjectId | null;              // ref: 'Blog'
    createdAt: Date;
    updatedAt: Date;
}
