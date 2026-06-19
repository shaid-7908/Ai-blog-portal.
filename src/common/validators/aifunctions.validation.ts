import { z } from 'zod';

export const aiConfigFormSchema = z.object({
    body: z.object({
        topic: z.string().min(1, 'Topic is required')
            .transform(val => val.trim()),
            
        categories: z.string().min(1, 'Categories are required')
            .transform(val => val.split(',').map(c => c.trim()).filter(Boolean)),
            
        keywords: z.string().min(1, 'Keywords are required')
            .transform(val => val.split(',').map(k => k.trim()).filter(Boolean)),
            
        writing_tone: z.string().min(1, 'Writing tone is required')
            .transform(val => val.trim()),
            
        target_audience: z.string().min(1, 'Target audience is required')
            .transform(val => val.trim()),
            
        word_count: z.string().min(1, 'Word count is required')
            .transform((val, ctx) => {
                const parsed = parseInt(val, 10);
                if (isNaN(parsed)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Word count must be a valid number',
                    });
                    return z.NEVER;
                }
                return parsed;
            }),
    })
});

export type AiConfigFormInput = z.infer<typeof aiConfigFormSchema>['body'];
