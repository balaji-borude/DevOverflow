"use server";

import Answer, { IAnswer } from "@/database/answers.model";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { AnswerServerSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/errors";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import { NotFoundError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/route";
import {CreateAnswerParams} from "@/types/action";

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
