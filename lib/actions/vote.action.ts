"use server";

import mongoose, { ClientSession } from "mongoose";
import { ActionResponse, ErrorResponse } from "@/types/global";

import action from "../handlers/action";
import handleError from "../handlers/errors";
import { CreateVoteParams, UpdateVoteCountParams } from "@/types/action";
import { updateVoteCountSchema } from "../validations";
import Vote from "@/database/vote.model";
import Question from "@/database/question.model";
import Answer from "@/database/answers.model";

// update vote
export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: updateVoteCountSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;

  const model = targetType === "question" ? Question : Answer;

  const VoteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await model.updateByIdAndUpdate(
      targetId,
      { $inc: { [VoteField]: change } },
      { new: true, session },
    );

    if (!result) {
      return handleError("failed to update vote count") as ErrorResponse;
    }

    return { success: true, data: result };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// create vote
export async function createVote(
  params: CreateVoteParams,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: updateVoteCountSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params!;

  const userId = validationResult?.session?.user?.id;

  if (!userId) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session;

    if (!existingVote) {

        if (existingVote.voteType === voteType) {
          //if the user has already voted on the the same vote type --> remove the vote
          await Vote.deleteOne({
            _id: existingVote._id,
          }).session(session);
    
          // if we delete the vote --> we need to update the vote count
          await updateVoteCount(
            { targetId, targetType, voteType, change: -1 },
            session,
          );
        } else {
          // if the user has not voted on the same vote type --> add the vote\
          await Vote.findByIdAndUpdate(
            existingVote._id,
            { voteType },
            { new: true, session },
          );
          // if we add the vote --> we need to update the vote count
          await updateVoteCount(
            { targetId, targetType, voteType, change: 1 },
            session,
          );
        }
    }else{
        await Vote.create([{targetId,targetType,voteType,change:1}],{session});
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session,
        );
    }

    await session.commitTransaction();
    session.endSession();
    return { success: true, data: existingVote };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}
