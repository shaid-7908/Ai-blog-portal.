import { Document, Types } from 'mongoose';
import { AIBodySection, AIOutline } from './ai-generation-session.types';

// Re-export for convenience
export type { AIBodySection, AIOutline };

// ── AI Config snapshot (what was sent to the API) ────────────────────────────

export interface AIOutlineConfig {
    topic: string;
    categories: Types.ObjectId[];    // refs to BlogCategory
    keywords: string[];
    writing_tone: string;
    target_audience: string;
    word_count: number;
}

// ── Mongoose Document ────────────────────────────────────────────────────────

export interface AIOutlineDocument extends Document {
    userId: Types.ObjectId;          // ref: 'User'
    sessionId: Types.ObjectId | null; // ref: 'AIGenerationSession' (optional)
    config: AIOutlineConfig;         // the form inputs used to generate
    title: string;                   // the selected blog title
    outline: AIOutline;              // the full selected outline
    linkedBlogId: Types.ObjectId | null; // ref: 'Blog' — set when user publishes
    createdAt: Date;
    updatedAt: Date;
}
