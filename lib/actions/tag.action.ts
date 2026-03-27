import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Tag,
} from "@/types/global";
import { PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/errors";
import action from "../handlers/action";
import TagModel from "@/database/tag.model";

export const getTags = async (
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // destructure the params
  const { page = 1, pageSize = 10, query, filter, sort } = params;

  const skip = (Number(page) - 1) * Number(pageSize);

  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};

  if (query) {
    filterQuery.$or = [{ name: { $regex: new RegExp(query, "i") } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;

    case "name":
      sortCriteria = { name: 1 };
      break;
    default: // show newest one on top
      break;
  }

  try {
    const totalTags = await TagModel.countDocuments(filterQuery);

    const tags = await TagModel.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalTags > skip + tags.length;

    return {
        success: true,
        data: {
          tags: JSON.parse(JSON.stringify(tags)),
          isNext,
        },
    }
    


  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
