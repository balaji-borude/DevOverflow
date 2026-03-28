import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Questions,
  Tags,
} from "@/types/global";
import { GetTagQuestionSchema, PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/errors";
import action from "../handlers/action";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";

// get the tags for the tag page
export const getTags = async (
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: Tags[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const filterQuery: {
      name?: { $regex: RegExp };
    } = {};

    if (query) {
      filterQuery.name = { $regex: new RegExp(query, "i") };
    }

    const totalTags = await Tag.countDocuments(filterQuery);

    const tags = await Tag.find(filterQuery)
      .sort({ questions: -1, name: 1 })
      .skip(skip)
      .limit(limit)
      .select("_id name questions");

    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// Get All tags --> Which show in the tag page of HomeScreen/Navbar tagPage
export const getTagQuestions = async (
  params: GetTagQuestionParams,
): Promise<
  ActionResponse<{ tag: Tags; questions: Questions[]; isNext: boolean }>
> => {
  const validationResult = await action({
    params,
    schema: GetTagQuestionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // destructure the params
  const { page = 1, pageSize = 10, query, tagId } = params;

  const skip = (Number(page) - 1) * Number(pageSize);

  const limit = Number(pageSize);

  try {
    // tag warun purn question find karysathi use krt ahe he f
    const tag = await Tag.findById(tagId);

    if (!tag) throw new Error("Tag not found");

    const filterQuery: {
      tags: { $in: string[] };
      title?: { $regex: RegExp };
    } = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = { $regex: new RegExp(query, "i") };
    }

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .skip(skip)
      .select("_id title author upvotes downvotes answers views createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions:JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

//Here we have to do --> get all the questions which have the tagId / tagname in tag Page/Navbar

//1. make a call to the Question model and find the questions that contain this tag
//2.  OR make a call to the TagQuestionModel and find the all related question together by finding different document that have the tag mentioned in them
