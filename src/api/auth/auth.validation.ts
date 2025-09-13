import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Not a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});
