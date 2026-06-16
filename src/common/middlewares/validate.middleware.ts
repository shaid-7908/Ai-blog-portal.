import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validate = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as any;
            Object.defineProperty(req, 'body', { value: parsedData.body, writable: true });
            Object.defineProperty(req, 'query', { value: parsedData.query, writable: true });
            Object.defineProperty(req, 'params', { value: parsedData.params, writable: true });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.issues.map(e => ({ path: e.path.join('.'), message: e.message }))
                });
            }
            next(error);
        }
    };
};
