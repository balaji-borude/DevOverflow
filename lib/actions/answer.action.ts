"use server";

import { ActionResponse, Answers, ErrorResponse } from "@/types/global";
import { AnswerServerSchema, GetAnswersSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/errors";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import { NotFoundError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/route";
import { CreateAnswerParams, GetAnswersParams } from "@/types/action";
import Answer, { IAnswer } from "@/database/answers.model";

// create answer
export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<IAnswer>> {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = validationResult.params!;

  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);

    if (!question) throw new NotFoundError("Question not found");

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session },
    );

    if (!newAnswer) throw new Error("Failed to create answer");

    question.answers = question.answers + 1;
    await question.save();
    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

//get all the answers of a question

export async function getAnswers(params: GetAnswersParams): Promise<
  ActionResponse<{
    Answers: IAnswer[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({ params, schema: GetAnswersSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, page = 1, pageSize = 10, filter } = params;

  const skip = Number(page - 1) * pageSize;

  const limit = Number(pageSize);
  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
    .populate('author','_id name image')
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalAnswers > skip + answers.length;
    // if (!isNext) answers.pop();

    return {
      success: true,
      data: {
        Answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
