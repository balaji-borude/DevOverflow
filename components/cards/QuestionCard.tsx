import ROUTES from "@/constants/route";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCards from "./TagCards";
import Metrics from "../Metrics";
import AuthLayout from "../../app/(auth)/layout";
import { auth } from "@/auth";
import { create } from "domain";

interface QuestionProps {
  _id: string;
  title: string;
  description: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; image: string };
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
}

interface Props {
  question: QuestionProps;
}
const QuestionCard = ({ question }: Props) => {
  // desstruct the question part here
  const {
    _id,
    title,
    description,
    tags,
    author,
    createdAt,
    upvotes,
    answers,
    views,
  } = question;

  return (
    <div className="card-wrapper rounded-[10px]  p-9 sm:px-11  ">
      <div className="flex flex-col-reverse items-start justify-between gap-5  sm:flex-row">
        <div>
          {/* Time of creation */}
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden ">
            {getTimeStamp(createdAt)}
          </span>

          {/*Title  */}
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      {/* Tags */}
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag) => (
          // tagCard components
          <TagCards key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>

      {/* like share logo and other metricks */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metrics
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`. asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <div></div>
          <Metrics
            imgUrl="/icons/like.svg"
            alt="Like"
            value={upvotes}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metrics
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
          <Metrics
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title="answers"
            textStyles=" small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
