"use server";

import { ActionResponse, ErrorResponse, Questions } from "@/types/global";
import mongoose from "mongoose";
import action from "../handlers/action";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";
import handleError from "../handlers/errors";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

import Question from "@/database/question.model";

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
          $inc: { question: 1 },
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
};

// edit question
export async function editQuestion(
  params: CreateQuestionParams & { questionId: string },
): Promise<ActionResponse<Questions>> {
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

  // use mongoose trancsation to create question
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question Not Found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    // this is update when the title and content are Updated
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }
    //tags --? means this tag is not present in the original tag array
    const tagsToAdd = tags.filter(
      (tag) => !question.tags.includes(tag.toLocaleLowerCase()),
    );

    const tagToRemove = question.tags.filter(
      (tag: ITagDoc) => !tags.includes(tag.name.toLowerCase()),
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tags) {
        const existingTag = await Tag.findOneAndUpdate(
          {
            name: { $regex: new RegExp(`^${tag}$`, "i") },
          },
          {
            $setOnInsert: { name: tag },
            $inc: { question: 1 },
          },
          { upsert: true, new: true, session },
        );

        if (existingTag) {
          // add new Tag
          newTagDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });

          question.tags.push(existingTag._id);
        }
      }
    }

    // remove tags --- previsiously added (which one should we remove ?)
    if (tagsToAdd.length > 0) {
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
        (tagId: mongoose.Types.ObjectId) => !tagToRemove.includes(tagId),
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

// Get question -- all server action become a Post request --> here we fetching the question but
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
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question Not Found ");
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
