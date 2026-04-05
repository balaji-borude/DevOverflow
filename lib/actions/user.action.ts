"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/global";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/errors";
import User, { IUser } from "@/database/user.model";


export async function getUser(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ users: IUser[]; isNext: boolean }>> {
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
