// import { Answers } from "@/types/global";
// import UserAvatar from "../UserAvatar";
// import Link from "next/link";
// import ROUTES from "@/constants/route";
// import { getTimeStamp } from "@/lib/utils";
// import Preview from "../editor/Preview";
// import { Suspense } from "react";
// import Votes from "../votes/Votes";
// import { hasVoted } from '@/lib/actions/vote.action';

// const AnswersCard = ({ _id, author, content, createdAt, upvotes, downvotes }: Answers) => {
//   const hasVotedPromise = hasVoted({ targetId: _id, targetType: "answer" });

//   return (
//     <article className="light-border border-b py-10">
//       <span id={JSON.stringify(_id)} className="hash-span" />

//       {/* ✅ Always flex-row so author + votes never stack vertically */}
//       <div className="mb-8 flex flex-row items-center justify-between gap-2">

//         {/* Author pill */}
//         <div className="flex items-center gap-2 shrink-0 rounded-full border-2 border-light400_dark300 px-3 py-1.5">
//           <UserAvatar
//             id={author._id}
//             name={author.name}
//             image={author.image}
//             className="size-[22px]"
//             fallbackClassName="text-[10px]"
//           />

//           <div className="flex items-center gap-1">
//             <Link href={ROUTES.PROFILE(author._id)}>
//               <p className="paragraph-semibold text-dark300_light700 whitespace-nowrap hover:underline">
//                 {author.name ?? "Anonymous"}
//               </p>
//             </Link>

//             {/* ✅ Hide timestamp on mobile to prevent overflow */}
//             <p className="small-regular text-light400_light500 whitespace-nowrap max-sm:hidden">
//               · answered {getTimeStamp(new Date(createdAt))}
//             </p>
//           </div>
//         </div>

//         {/* Votes always on the right */}
//         <div className="flex shrink-0 justify-end">
//           <Suspense fallback={<div>Loading...</div>}>
//             <Votes
//               upvotes={upvotes}
//               downvotes={downvotes}
//               hasVotedPromise={hasVotedPromise}
//               targetId={_id}
//               targetType="answer"
//             />
//           </Suspense>
//         </div>

//       </div>

//       <Preview content={content} />
//     </article>
//   );
// };
// export default AnswersCard;


import { Answers } from "@/types/global";
import UserAvatar from "../UserAvatar";
import Metrics from "../Metrics";
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

      <div className="mb-8 flex flex-row items-center justify-between gap-2">

        {/* Author pill with conditional rendering */}
        <div className="flex items-center gap-2 shrink-0 rounded-full border-2 border-light400_dark300 px-3 py-1.5">
          {author?.image ? (
            <Metrics
              imgUrl={author.image}
              alt={author.name}
              value={author.name ?? "Anonymous"}
              title={`. answered ${getTimeStamp(new Date(createdAt))}`}
              href={ROUTES.PROFILE(author._id)}
              textStyles="body-medium text-dark400_light700 whitespace-nowrap"
              isAuthor
            />
          ) : (
            <>
              <UserAvatar
                id={author._id}
                name={author.name}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              />
              <div className="flex items-center gap-1">
                <Link href={ROUTES.PROFILE(author._id)}>
                  <p className="paragraph-semibold text-dark300_light700 whitespace-nowrap hover:underline">
                    {author.name ?? "Anonymous"}
                  </p>
                </Link>
                <p className="small-regular text-light400_light500 whitespace-nowrap max-sm:hidden">
                  · answered {getTimeStamp(new Date(createdAt))}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Votes always on the right */}
        <div className="flex shrink-0 justify-end">
          <Suspense fallback={<div>Loading...</div>}>
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

      <Preview content={content} />
    </article>
  );
};

export default AnswersCard;
