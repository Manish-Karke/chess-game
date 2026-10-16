import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(254),

    username: z
      .string()
      .trim()
      .min(3, "Username must contain at least 3 characters")
      .max(30, "Username must contain at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Use only letters, numbers, and underscores",
      ),

    password: z
      .string()
      .min(12, "Password must contain at least 12 characters")
      .max(128, "Password must contain at most 128 characters"),

    confirmPassword: z.string(),
  })
  .refine(
    (values) => values.password === values.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type RegisterFormValues = z.infer<
  typeof registerSchema
>;
