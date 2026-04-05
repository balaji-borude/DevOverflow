import { Answers } from "@/types/global";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constants/route";
import { getTimeStamp } from "@/lib/utils";
import Preview from "../editor/Preview";
import { Suspense } from "react";
import Votes from "../votes/Votes";
import { hasVoted } from '@/lib/actions/vote.action';

const AnswersCard = ({ _id, author, content, createdAt, upvotes, downvotes }: Answers) => {


  const hasVotedPromise = hasVoted({ targetId: _id, targetType: "answer" });

  return (
    <article className="light-border border-b py-10">
      <span id={JSON.stringify(_id)} className="hash-span" />

      {/* Top row: author info + votes */}
      <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        {/* ✅ Avatar + name + timestamp all together in one row */}
        <div className="flex items-center gap-2">
          <UserAvatar
            id={author._id}
            name={author.name}
            image={author.image}
            className="size-8 rounded-full object-cover"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="body-semibold text-dark300_light700 hover:underline">
                {author.name ?? "Anonymous"}
              </p>
            </Link>

            <p className="small-regular text-light400_light500">
              <span className="max-sm:hidden">· </span>
              answered {getTimeStamp(new Date(createdAt))}
            </p>
          </div>
        </div>

        {/* ✅ Votes section on the right */}
        <div className=" w-full  flex justify-end">
          <Suspense fallback={<div> Loading...</div>}>
            <Votes
              upvotes={upvotes}
              downvotes={downvotes}
              hasVotedPromise={hasVotedPromise}
              targetId={_id}
              targetType="answer"
            />
          </Suspense>
        </div>
      </div>

      {/* Answer content */}
      <Preview content={content} />
    </article>
  );
};

export default AnswersCard;
