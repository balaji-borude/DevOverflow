import React from "react";

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

  return <div></div>;
};

export default QuestionCard;
