import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required field");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, underscores and dashes are allowed",
  ),
  password: requiredString.min(
    8,
    "Password must be at least 8 characters long",
  ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type SignInValues = z.infer<typeof signInSchema>;
