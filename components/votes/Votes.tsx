"use client";
import { formatNumber } from "@/lib/utils";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";
interface Props {
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
}
const Votes = ({ upvotes, hasUpvoted, downvotes, hasDownvoted }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();
  const userId=session.data?.user?.id;

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if(!userId){

        toast.warning("Please login to vote");
        return;
    };
setIsLoading(true);
    try {
        const successMessage = voteType === "upvote" ? `Upvote ${!hasUpvoted ? 'Added' : 'Removed'} succeddfully` : `Downvote ${!hasDownvoted ? 'Added' : 'Removed'} succeddfully`;

        toast.success(successMessage);
        
    } catch (error) {
        toast.error("Failed to vote");
    }finally{
        setIsLoading(false);
    }

  };


  return (
    <div className="flex center gap-2.5">
      {/* Upvotes */}
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
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
          src={hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
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
