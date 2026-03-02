"use server";

import { ActionResponse, ErrorResponse, Questions } from "@/types/global";
import mongoose from "mongoose";
import action from "../handlers/action";
import { AskQuestionSchema } from "../validations";
import handleError from "../handlers/errors";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

import Question from "@/database/question.model";


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
            name: { $regex: new RegExp(`^${tag}$`, "i") } 
        },
        { 
            $setOnInsert: { name: tag }, $inc: { question: 1 }
        },
        { upsert: true, new: true, session },
      );

      tagId.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,   
      });

    };

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
        question._id,
        {
            $push: { tags: { $each: tagId } },

        },{session}
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
