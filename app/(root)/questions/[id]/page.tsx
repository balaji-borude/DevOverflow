import TagCards from "@/components/cards/TagCards";
import Metrics from "@/components/Metrics";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/route";
import type { Tags } from "@/types/global";
import { formatNumber, getTimeStamp } from "@/lib/utils";

// sample question

import Link from "next/link";

const sampleQuestions = {
  id: "1",
  title: "How to implement JWT authentication in Express?",
  content: "I am confused about access token and refresh token implementation.",
  tags: [
    { _id: "tag1", name: "react", questions: 10 },
    { _id: "tag2", name: "next", questions: 20 },
    { _id: "tag3", name: "javascript", questions: 30 },
    { _id: "tag4", name: "express", questions: 40 },
  ],

  views: 150,
  upvotes: 20,
  downvotes: 2,
  answers: 5,
  createdAt: new Date(),
  author: {
    _id: "sdfh23242",
    name: "RAM ",
    image: "https://avatars.githubusercontent.com/u/10048474?v=4",
  },
};

const QuestionDetails = async ({ params }: RouteParams) => {
  //   He Params ahe
  const { id } = await params; // question id ghenasathi use hote
  return (
    <>
      {/* <div>  QuestionDetails page {id}</div> */}
      <div className=" flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <div className="w-fit rounded-full border-2 border-light400_dark300 px-3 py-1.5 text-sm">
              <UserAvatar
                id={sampleQuestions.author._id}
                name={sampleQuestions.author.name}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              />

              <Link href={ROUTES.PROFILE(sampleQuestions.author._id)}>
                <p className="paragraph-semibold text-dark300_light700 ">
                  {sampleQuestions.author.name}
                </p>
              </Link>
            </div>

            <div className="flex justify-end">
              <p>Votes</p>
            </div>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {sampleQuestions.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        {/* metrics timestamp --> when did question created */}
        <Metrics
          imgUrl="/icons/clock.svg"
          alt="clock"
          value={`asked ${getTimeStamp(new Date(sampleQuestions.createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
        <Metrics
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={sampleQuestions.answers}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
        <Metrics
          imgUrl="/icons/eye.svg"
          alt="eye icon "
          value={formatNumber(sampleQuestions.views)}
          title=""
          textStyles="small-regular text-dark400_light700"
          titleStyles="max-sm:hidden"
        />
      </div>

      <p>Prevew Content</p>

      <div className="mt-8 flex flex-wrap  gap-2">
      {
        sampleQuestions.tags.map((tag:Tags)=>(
          <TagCards
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            // questions={tag.questions}
            compact
          />
        ))
      }
      </div>
    </>
  );
};

export default QuestionDetails;
