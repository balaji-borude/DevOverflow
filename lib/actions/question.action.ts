"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Questions,
} from "@/types/global";
// import mongoose from "mongoose";
import mongoose from "mongoose";
import action from "../handlers/action"; //this is the server action handler used in all the server actions
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import handleError from "../handlers/errors";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

import Question, { type IQuestion } from "@/database/question.model";
import User from "@/database/user.model";

console.log("User model registered: -------->", User.modelName);
// create question
export async function createQuestion(
  params: CreateQuestionParams,
): Promise<ActionResponse<Questions>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  // use mongoose trancsation to create question
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }, // ya session cha use asa hoto kii --> ya transaction madhe jehi operation hote te session cha part asel ani jar kahi operation fail jala tar sagle operations roll back honar
      // tyamule je aplyala rollback karayche tyala argument session dene garjeche ahe
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagId: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        {
          $setOnInsert: { name: tag },
          $inc: { questions: 1 },
        },
        { upsert: true, new: true, session },
      );

      tagId.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagId } },
      },
      { session },
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)), // ✅ Fix circular reference
    };

    // TODO --> check we have to do these or not data: JSON.stringify(JSON.stringify(question))
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

// edit question
export async function editQuestion(
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
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //const question = await Question.findById(questionId).populate("tags");
    const question = await Question.findById(questionId)
      .populate("tags")
      .session(session);

    if (!question) throw new Error("Question Not Found");
    if (question.author.toString() !== userId) throw new Error("Unauthorized");

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // ✅ Bug 4 Fixed — compare tag names properly
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

    // ✅ Bug 3 Fixed — iterate tagsToAdd, not tags
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          {
            $setOnInsert: { name: tag },
            $inc: { questions: 1 }, // ✅ Bug 1 Fixed — correct field name
          },
          { upsert: true, new: true, session },
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });
          // question.tags.push(existingTag._id);
          //  // Fix — push the full document instead
          question.tags.push(existingTag);
        }
      }
    }

    // ✅ Bug 2 Fixed — check tagToRemove.length, not tagsToAdd.length
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

      // question.tags = question.tags.filter(
      //   (tagId: mongoose.Types.ObjectId) =>
      //     !tagIdsToRemove.some((id) => id.equals(tagId))
      // );
      // question.tags = question.tags.filter(
      //   (tag: ITagDoc) => !tagIdsToRemove.some((id) => id.equals(tag._id)),
      // );
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

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
// Get question -- all server action become a -->  Post request --> here we fetching the question but
export async function getQuestion(
  params: GetQuestionParams & { questionId: string },
): Promise<ActionResponse<Questions>> {
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
    const question = await Question.findById(questionId).populate("tags").populate("author", " _id name image").lean();

    if (!question) {
      throw new Error("Question Not Found ");
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// get ALL questions for the home page --> search bar and display all the questions -->
export async function getQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: Questions[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  // continue logic...

  const { page = 1, pageSize = 10, query, filter, sort } = params;

  const skip = (Number(page) - 1) * Number(pageSize);

  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};
  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }

  // if (query) {
  //   filterQuery.$or = [
  //     (filterQuery.title = { $regex: new RegExp(query, "i") }),
  //     (filterQuery.content = { $regex: new RegExp(query, "i") }),
  //   ];
  // }
  if (query) {
  filterQuery.$or = [
    { title: { $regex: new RegExp(query, "i") } },
    { content: { $regex: new RegExp(query, "i") } },
  ];
}
  // ✅ Fix
  // if (query) {
  //   filterQuery.$or = [
  //     { title: { $regex: new RegExp(query, "i") } },
  //     { content: { $regex: new RegExp(query, "i") } },
  //   ];
  // }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default: // show newest one on top
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    //throw new Error("error");

    // get total number of questions --> to tell which one is the next question
    const totalQuestions = await Question.countDocuments(filterQuery);

    // get all the questions
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean() //convert mongoose document to json
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };

  } catch (error) {
      console.error("getQuestions error:=======>", error);
    return handleError(error) as ErrorResponse;
  }
}
