import { z } from 'zod';

/** Mirrors the backend's FluentValidation rules, so users see errors before a round trip. */
export const loginSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Enter your name').max(200),
  email: z.string().min(1, 'Enter your email').email('Enter a valid email').max(256),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Add an uppercase letter')
    .regex(/[a-z]/, 'Add a lowercase letter')
    .regex(/[0-9]/, 'Add a number'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;