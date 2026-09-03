import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Enter your email.").email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name."),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    rePassword: z.string().min(1, "Please confirm your password."),
    dateOfBirth: z.string().min(1, "Enter your date of birth."),
    gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Select a gender." }) }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match.",
    path: ["rePassword"],
  });
