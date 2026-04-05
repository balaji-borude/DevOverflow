import TagCards from "@/components/cards/TagCards";
import Metrics from "@/components/Metrics";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/route";
import type { RouteParams } from "@/types/action";
import type { Tags } from "@/types/global";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";

import Preview from "@/components/editor/Preview";
import { getQuestion } from "@/lib/actions/question.action";
import { redirect } from "next/navigation";
import View from "../View";
import AnswerForm from "@/components/forms/AnswerForm";
import { getAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/AllAnswers";
import Votes from "@/components/votes/Votes";
import { hasVoted } from "@/lib/actions/vote.action";
import { Suspense } from "react";

const QuestionDetails = async ({ params }: RouteParams) => {
  //   He Params ahe
  const { id } = await params; // question id ghenasathi use hote
  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) {
    return redirect("/404");
  }
  // Getting the questions Answers
  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  // here we are using --> Use (Hook) of react
  const hasVotedPromise = hasVoted({ targetId: id, targetType: "question" });
  // console.log("All the anwers --->", answersResult);

  console.log("Printing the questions data----->", question);

  const {
    author,
    createdAt,
    answers,
    views,
    tags,
    title,
    content,
    upvotes,
    downvotes,
  } = question;

  return (
    <>
      <View questionId={id} />

      {/* <div>  QuestionDetails page {id}</div> */}

      {/* <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="w-full flex items-center gap-1">
            
            <div className="flex items-center gap-2 shrink-0 rounded-full border-2 border-light400_dark300 px-3 py-1.5">
              <UserAvatar
                id={author._id}
                name={author?.name}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              />
              <Link href={ROUTES.PROFILE(author._id)}>
                <p className="paragraph-semibold text-dark300_light700 whitespace-nowrap">
                  {author.name}
                </p>
              </Link>
            </div>

            <div className="w-full flex justify-end">
              <Suspense fallback={<div>Loading...</div>}>
                <Votes
                  upvotes={question.upvotes}
                  downvotes={question.downvotes}
                  hasVotedPromise={hasVotedPromise}
                  targetId={question._id}
                  targetType="question"
                />
              </Suspense>
            </div>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div> */}

      {/* H.W --> PENDING ==>  Hey change here insted of Metrics you can use the UserAvatar component and its fallback class   */}

      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="w-full flex items-center gap-1">
            {/* Author pill with conditional rendering */}
            <div className="flex items-center gap-2 shrink-0 rounded-full border-2 border-light400_dark300 px-3 py-1.5">
              {author?.image ? (
                <Metrics
                  imgUrl={author.image}
                  alt={author.name}
                  value={author.name}
                  title={`. asked ${getTimeStamp(new Date(createdAt))}`}
                  href={ROUTES.PROFILE(author._id)}
                  textStyles="body-medium text-dark400_light700 whitespace-nowrap"
                  isAuthor
                />
              ) : (
                <>
                  <UserAvatar
                    id={author._id}
                    name={author?.name}
                    className="size-[22px]"
                    fallbackClassName="text-[10px]"
                  />
                  <Link href={ROUTES.PROFILE(author._id)}>
                    <p className="paragraph-semibold text-dark300_light700 whitespace-nowrap">
                      {author.name}
                    </p>
                  </Link>
                </>
              )}
            </div>

            {/* Votes on the right */}
            <div className="w-full flex justify-end">
              <Suspense fallback={<div>Loading...</div>}>
                <Votes
                  upvotes={question.upvotes}
                  downvotes={question.downvotes}
                  hasVotedPromise={hasVotedPromise}
                  targetId={question._id}
                  targetType="question"
                />
              </Suspense>
            </div>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metrics
          imgUrl="/icons/clock.svg"
          alt="clock"
          value={`asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
        <Metrics
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
        <Metrics
          imgUrl="/icons/eye.svg"
          alt="eye icon "
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
      </div>

      <p>Prevew Content</p>
      <Preview content={content} />

      <div className="mt-8 flex flex-wrap  gap-2">
        {tags.map((tag: Tags) => (
          <TagCards
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            // questions={tag.questions}
            compact
          />
        ))}
      </div>

      {/* section for answer form */}
      <section className="my-5">
        {/* Write your answer here */}
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>

      {/* Display all the answers  */}
      <section className="my-5">
        <AllAnswers
          data={answersResult?.Answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
