"use server";

import { CollectionBaseParams } from "@/types/action";
import { CollectionBaseSchema } from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/errors";
import Collection from "@/database/collection.model";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { NotFoundError } from "../http-errors";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/route";

export async function createCollection(
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
