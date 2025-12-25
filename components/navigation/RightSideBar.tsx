import Image from "next/image";
import Link from "next/link";

interface questionProps {
  id: string;
  title: string;
}
const topQuestions: questionProps[] = [
  {
    id: "1",
    title: "How to center a Div ?",
  },
  {
    id: "2",
    title: "How to setup React + tailwindcss Project ?",
  },
  {
    id: "3",
    title: "what is Redux ToolKit  ?",
  },
  {
    id: "4",
    title: "Is React-RouterDom is Updated & how to create routes in react ?",
  },
  {
    id: "5",
    title: "No more question Everything is fine because of BajrangBali ",
  },
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
                href={`question/${question.id}`}
                key={question.id}
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
      <div className="h3-bold text-dark100_light900">popular tags</div>
    </section>
  );
};

export default RightSideBar;
