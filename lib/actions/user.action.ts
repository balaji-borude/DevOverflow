"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  User as UserType,
} from "@/types/global";
import action from "../handlers/action";
import { getUserSchema, PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/errors";
import { GetUserParams } from "@/types/action";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Answer from "@/database/answers.model";


export async function getUser(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ users: UserType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = Number(page - 1) * pageSize;

  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation : -1 };
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUser = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);

    const isNext = totalUser > skip + users.length;

    return {
      success: true,
      data: {
        users:JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}


// Profile page
export async function getUserProfile(params:GetUserParams):Promise<ActionResponse<{ user:typeof User,
  totalQuestions:number,
  totalAnswers:number,
 }>>{


  const validationResult = await action({
    params,
    schema: getUserSchema,

  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId } = validationResult.params!;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    };

    const totalQuestions = await Question.countDocuments({ author: userId });

    const totalAnswers = await Answer.countDocuments({ author: userId });

    return{
      success:true,
      data:{
        user:JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      }
    }



  } catch (error) {
    return handleError(error) as ErrorResponse;
  }



}   