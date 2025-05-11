import { z } from "zod";

// Base schema for sign-in (shared across all types)
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Extended schema for sign-up (includes all relevant fields)
export const signUpSchema = signInSchema
  .extend({
    firstName: z.string().min(2, "Full name must be at least 2 characters"),
    lastName: z.string().min(2, "Full name must be at least 2 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
