import { z } from 'zod';

export const registerUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Phone number is required"),
        dateOfBirth: z.string().transform((str) => new Date(str)), // Coerce string to Date
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"), // Assuming role is passed as an ObjectId string
    })
});

// You can extract the TypeScript type from the schema if you need it
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
