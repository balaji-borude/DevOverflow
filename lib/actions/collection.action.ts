"use server";

import { CollectionBaseParams } from "@/types/action";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/errors";
import Collection from "@/database/collection.model";
import {
  ActionResponse,
  Collection as collection,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/global";
import { NotFoundError } from "../http-errors";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/route";
import mongoose, { PipelineStage } from "mongoose";

export async function toggleSaveQuestion(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  const userId = validationResult?.session?.user?.id;

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new NotFoundError("Question not found");

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(ROUTES.QUESTION(questionId));
      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

// in collection.action.ts
export async function hasSavedQuestion(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    // !! --> converts the value to a boolean, so if collection is null or undefined, it will return false, otherwise true
    return {
      success: true,
      data: { saved: !!collection },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

// get all the saved questions
export async function getSavedQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ collection: collection[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult?.session?.user?.id;

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);

  const limit = Number(pageSize);

  const SortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostviewed: { "question.views": -1 },
    leastviewed: { "question.views": 1 },
    mostanswered: { "question.answers": -1 },
    leastanswered: { "question.answers": 1 },
    mostvoted: { "question.upvotes": -1 },
  };

  const sortCriteria = SortOptions[filter as keyof typeof SortOptions] || {
    "question.createdAt": -1,
  };

  try {
    // advance search using aggregation pipeline
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      {
        $unwind: {
          path: "$question.author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      }
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const totalCountResult = await Collection.aggregate([
      ...pipeline,
      {
        $count: "count",
      },
    ]);
    const totalCount = totalCountResult[0]?.count ?? 0;

    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({ $project: { question: 1, author: 1 } });

    const questions = await Collection.aggregate(pipeline);
    const isNext = totalCount > skip + questions.length;

    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
