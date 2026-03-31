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


const QuestionDetails = async ({ params }: RouteParams) => {
  //   He Params ahe
  const { id } = await params; // question id ghenasathi use hote

  // actual fetch question details from database using question id

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) {
    return redirect("/404");
  };

 // console.log("Printing the questions data----->",question);

  const { author, createdAt, answers, views, tags, title, content } = question;

  return (
    <>

      <View questionId={id}/>

      
      {/* <div>  QuestionDetails page {id}</div> */}
      <div className=" flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <div className=" flex space-x-2 w-fit rounded-full border-2 border-light400_dark300 px-3 py-1.5 text-sm">
              <UserAvatar
                id={author._id}
                name={author?.name}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              />

              <Link href={ROUTES.PROFILE(author._id)}>
                <p className="paragraph-semibold text-dark300_light700 ">
                  {author.name}
                </p>
              </Link>
            </div>

            <div className="flex justify-end">
              <p>Votes</p>
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

      <AnswerForm />
      </section>
    </>
  );
};

export default QuestionDetails;
