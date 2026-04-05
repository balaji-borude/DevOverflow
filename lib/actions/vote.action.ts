"use server";

import mongoose, { ClientSession } from "mongoose";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { revalidatePath } from "next/cache";

import action from "../handlers/action";
import handleError from "../handlers/errors";
import {
  CreateVoteParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteCountParams,
} from "@/types/action";
import {
  CreateVoteSchema,
  HasVotedSchema,
  updateVoteCountSchema,
} from "../validations";
import Vote from "@/database/vote.model";
import Question from "@/database/question.model";
import Answer from "@/database/answers.model";
import ROUTES from "@/constants/route";

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
    const result = await model.findByIdAndUpdate(
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
    schema: CreateVoteSchema, // ✅ Fix 1: was updateVoteCountSchema
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
      id: targetId,
      type: targetType,
    }).session(session);

    if (existingVote) {
      // ✅ Fix 2: was !existingVote
      if (existingVote.voteType === voteType) {
        // Same vote type → user is toggling off, remove the vote
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      } else {
        // Different vote type → switch upvote ↔ downvote
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session },
        );

          // ✅ Decrement the OLD vote type
  await updateVoteCount(
    { targetId, targetType, voteType: existingVote.voteType, change: -1 },
    session,
  );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session,
        );
      }
    } else {
      // No existing vote → create a fresh one
      await Vote.create(
        [{ author: userId, id: targetId, type: targetType, voteType }],
        { session },
      );
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session,
      );
    }

    await session.commitTransaction();
    session.endSession();

    revalidatePath(ROUTES.QUESTION(targetId));
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}

// check if the user has voted on the question or answer
export async function hasVoted(
  params: HasVotedParams,
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  if (!userId) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  try {
    const vote = await Vote.findOne({
      author: userId,
      id: targetId,
      type: targetType,
    });

    if (!vote) {
      return {
        success: false,
        data: { hasUpvoted: false, hasDownvoted: false },
      };
    }
    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
