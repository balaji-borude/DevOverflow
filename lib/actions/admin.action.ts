"use server";

import action from "../handlers/action"; //this is the server action handler used in all the server actions
// ADMIN CONTROLLER

import { ActionResponse, ErrorResponse, PaginatedSearchParams, Questions, User as UserType, Tags as TagType } from "@/types/global";
import handleError from "../handlers/errors";
import Question, { type IQuestion } from "@/database/question.model";
import User from "@/database/user.model";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import Answer from "@/database/answers.model";
import Vote from "@/database/vote.model";
import Collection from "@/database/collection.model";
import Interaction from "@/database/interaction.model";
import { PaginatedSearchParamsSchema, EditQuestionSchema, GetQuestionSchema } from "../validations";
import { revalidatePath } from "next/cache";
import type { CreateQuestionParams } from "@/types/action";
import mongoose from "mongoose";


// Get all questions for admin panel
export async function getAdminQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: Questions[]; isNext: boolean; totalQuestions: number }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true, // Restricted to authenticated users, further admin check can be done in the handler or action
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort({ createdAt: -1 }) // Newest first by default for admin
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
        totalQuestions,
      },
    };
  } catch (error) {
    console.error("getAdminQuestions error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}

// Get admin statistics
export async function getAdminStats(): Promise<ActionResponse<{ totalUsers: number; totalQuestions: number; totalTags: number }>> {
  try {
    const [totalUsers, totalQuestions, totalTags] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Tag.countDocuments(),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalQuestions,
        totalTags,
      },
    };
  } catch (error) {
    console.error("getAdminStats error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}

// Get all users for admin panel
export async function getAdminUsers(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ users: UserType[]; isNext: boolean; totalUsers: number }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: new RegExp(query, "i") } },
      { username: { $regex: new RegExp(query, "i") } },
    ];
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
        totalUsers,
      },
    };
  } catch (error) {
    console.error("getAdminUsers error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}

// Get all tags for admin panel
export async function getAdminTags(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: TagType[]; isNext: boolean; totalTags: number }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};

  if (query) {
    filterQuery.name = { $regex: new RegExp(query, "i") };
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);

    const tags = await Tag.find(filterQuery)
      .lean()
      .sort({ questions: -1 }) // Sort tags by usage
      .skip(skip)
      .limit(limit);

    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
        totalTags,
      },
    };
  } catch (error) {
    console.error("getAdminTags error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}

// Ban User
export async function banUser(userId: string): Promise<ActionResponse<{ isBanned: boolean }>> {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.isBanned = true;
    await user.save();

    revalidatePath("/admin/users");
    revalidatePath("/community");

    return {
      success: true,
      data: {
        isBanned: true,
      },
    };
  } catch (error) {
    console.error("banUser error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}

// Unban User
export async function unbanUser(userId: string): Promise<ActionResponse<{ isBanned: boolean }>> {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.isBanned = false;
    await user.save();

    revalidatePath("/admin/users");
    revalidatePath("/community");

    return {
      success: true,
      data: {
        isBanned: false,
      },
    };
  } catch (error) {
    console.error("unbanUser error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}

// Delete Question
export async function deleteQuestion(params: {
  questionId: string;
}): Promise<ActionResponse<void>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Decrement tag counts
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session },
      );

      // 2. Delete TagQuestion links
      await TagQuestion.deleteMany({ question: questionId }, { session });

      // 3. Delete Answers related to the question
      const answers = await Answer.find({ question: questionId });
      const answerIds = answers.map((a) => a._id);

      await Answer.deleteMany({ question: questionId }, { session });

      // 4. Delete Votes related to the question and its answers
      await Vote.deleteMany({ id: questionId, type: "question" }, { session });
      await Vote.deleteMany(
        { id: { $in: answerIds }, type: "answer" },
        { session },
      );

      // 5. Delete Interactions related to the question and its answers
      await Interaction.deleteMany(
        { actionId: questionId, actionType: "question" },
        { session },
      );
      await Interaction.deleteMany(
        { actionId: { $in: answerIds }, actionType: "answer" },
        { session },
      );

      // 6. Delete Collection entries
      await Collection.deleteMany({ question: questionId }, { session });

      // 7. Delete the question itself
      await Question.findByIdAndDelete(questionId, { session });

      await session.commitTransaction();

      revalidatePath("/admin/questions");
      revalidatePath("/");
      revalidatePath(`/questions/${questionId}`);

      return {
        success: true,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("deleteQuestion error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}

// Admin Edit question
export async function adminEditQuestion(
  params: CreateQuestionParams & { questionId: string },
): Promise<ActionResponse<IQuestion>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .session(session);

    if (!question) throw new Error("Question Not Found");

    // Admins bypass the author check
    // if (question.author.toString() !== userId) throw new Error("Unauthorized");

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const existingTagNames = question.tags.map((t: ITagDoc) =>
      t.name.toLowerCase(),
    );

    const tagsToAdd = tags.filter(
      (tag) => !existingTagNames.includes(tag.toLowerCase()),
    );

    const tagToRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !tags.map((t) => t.toLowerCase()).includes(tag.name.toLowerCase()),
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          {
            $setOnInsert: { name: tag },
            $inc: { questions: 1 },
          },
          { upsert: true, new: true, session },
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });
          question.tags.push(existingTag);
        }
      }
    }

    if (tagToRemove.length > 0) {
      const tagIdsToRemove = tagToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session },
      );

      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session },
      );

      question.tags = question.tags.filter(
        (tag: ITagDoc) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id),
          ),
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    revalidatePath("/admin/questions");
    revalidatePath(`/questions/${questionId}`); // depending on your route structure

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
