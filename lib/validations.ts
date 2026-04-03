import { z } from "zod";
import Answer from "../database/answers.model";

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

  name: z.string().min(1, { message: "Name is Required" }).max(50, {
    message: "Username can only contain letters, numbers,and underscores.",
  }),

  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required" })
    .email({ error: "Please provide a valid email address" }),

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

// Create Question Schema Validation
export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(150, { message: "Title cannot exceed 150 characters" }),
  content: z.string().min(1, { message: "Body is requried" }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag cannot be empty" })
        .max(30, { message: "Tag cannot exceed 30 characters" }),
    )
    .min(1, { message: "Please provide at least one tag" })
    .max(3, { message: "Can Not add more than 3 tags" }),
});

// edit question schema
export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "QuestionId is Required" }),
});

// get question schema
export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question Id is required " }),
});

// Frontend validation for the users
export const UserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "UserName must be at least 3 characters long" }),
  username: z
    .string()
    .min(3, { message: "UserName must be at least 3 characters long" }),
  email: z.email({ error: "Please provide a valid email address" }),
  bio: z.string().optional(),
  image: z
    .string()
    .url({ message: "Please provide a valid image url" })
    .optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid portfolio url" })
    .optional(),
  reputation: z.number().optional(),
});

export const accountSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
  name: z.string().min(1, "Name is required").trim(),

  image: z.string().url(" Please provide a valid image url").optional(),

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
    })
    .optional(),
  // we use Otional here because sometime we used connecting with third party provider like google and github and we don't need to provide password

  provider: z.string().min(1, "Provider is required"),

  providerAccountId: z.string().min(1, "Provider Account ID is required"),
});

// signin validation for the OAuth schema
export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
  user: z.object({
    name: z.string().min(1, { message: "Name is Required" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),
    email: z.string().email("Please provide a valid email address"),
    image: z.string().url("Invalid image url").optional(),
  }),
});

// validation for the search params on the home page (search bar and display all the questions)
export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, { message: "TagId is required" }),
});

//validation for the increment question views
export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question Id is required " }),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(50, { message: "Answer has to more than 50 characters" }),
});

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question Id is required " }),
});

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, { message: "Question Id is required " }),
});

// validation for AI Answers
export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Question is Required" })
    .max(130, { message: "Question Cannot exceed 130 Character" }),
  content: z
    .string()
    .min(10, { message: "Answers has to more than 10 characters" }),
});
