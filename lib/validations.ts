import { z } from "zod";

// signin Schema  of Form
export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is Requried" })
    .email({ message: "Please Provide a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 character" })
    .max(100, { message: "Password cannot exceed 100 character" }),
});

// Sign Up form Schema
export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "username Cannot Exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is Required" })
    .max(50, {
      message: "Username can only contain letters, numbers,and underscores.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is Requried" })
    .email({ message: "Please Provide a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 character" })
    .max(100, { message: "Password cannot exceed 100 character" })
    .regex(/[A-Z]/, {
      message: "Password must contain At least One Uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain At least One Lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain At least One number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain At least One Special character",
    }),
});
