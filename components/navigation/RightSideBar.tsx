import Image from "next/image";
import Link from "next/link";
import TagCards from "../cards/TagCards";

interface questionProps {
  _id: string;
  title: string;
}
const topQuestions: questionProps[] = [
  {
    _id: "1",
    title: "How to center a Div ?",
  },
  {
    _id: "2",
    title: "How to setup React + tailwindcss Project ?",
  },
  {
    _id: "3",
    title: "what is Redux ToolKit  ?",
  },
  {
    _id: "4",
    title: "Is React-RouterDom is Updated & how to create routes in react ?",
  },
  {
    _id: "5",
    title: "No more question Everything is fine because of BajrangBali ",
  },
];

const popularTags = [
  { _id: "1", name: "React", questions: 90 },
  { _id: "3", name: "Express.js", questions: 290 },
  { _id: "2", name: "Next.js", questions: 190 },
  { _id: "4", name: "Flask", questions: 10 },
  { _id: "5", name: "Python", questions: 80 },
  { _id: "6", name: "Java", questions: 30 },
];

const RightSideBar = () => {
  return (
    <section className="w-[350px] custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between border-l p-6 pt-32 shadow-light-300 dark:shadow-none overflow-y-auto max-xl:hidden ">
      {/* Hot Network */}
      <div>
        <h3 className="h3-bold text-dark100_light900"> Hot Network </h3>

        {/* all questions are here  */}
        <div className="mt-7 flex w-full flex-col gap-y-3 ">
          {topQuestions.map((question) => {
            return (
              <Link
                href={`question/${question._id}`}
                key={question._id}
                className=" h-full w-full flex gap-x-6 items-center  "
              >
                <Image
                  src="/icons/question.svg"
                  height={20}
                  width={20}
                  alt="??"
                />
                <h4>{question.title}</h4>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Popular tags  */}
      <h3 className="h3-bold text-dark100_light900 mt-6">popular tags</h3>
      <div className="mt-16">
        <div className="h3-bold text-dark200_light900">
          <div className="mt-7 flex flex-col gap-4">
            {popularTags.map(({ _id, name, questions }) => (
              <TagCards key={_id} _id={_id} name={name} questions={questions} 
              showcount compact/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
