"use client";
import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { HasVotedResponse } from "@/types/action";
import { ActionResponse } from "@/types/global";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";

interface Props {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;

  downvotes: number;

  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}
const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetType,
  targetId,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const userId = session.data?.user?.id;

  //here we are Using the Use (Hook) of react
  const { success, data } = use(hasVotedPromise);

  const { hasUpvoted, hasDownvoted } = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      toast.warning("Please login to vote");
      return;
    }
    setIsLoading(true);
    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      console.log("Printing the vote Result ==>", result);

      if (!result.success) {
        toast.error("Failed to vote");
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "Added" : "Removed"} succeddfully`
          : `Downvote ${!hasDownvoted ? "Added" : "Removed"} succeddfully`;

      toast.success(successMessage);
    } catch (error) {
      toast.error("Failed to vote");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex center gap-2.5">
      {/* Upvotes */}
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvoted"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        {/* Show no. of Upvotes  */}
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1 ">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>
      {/* downvotes */}
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          alt="downVote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        {/* Show no. of Upvotes  */}
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1 ">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
