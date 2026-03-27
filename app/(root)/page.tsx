import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";

import Link from "next/link";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTIONS } from "@/constants/states";

// import { NotFoundError, ValidationError } from "@/lib/http-errors";
// import handleError from "@/lib/handlers/errors";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  // searchparams madhun query ghene ani
  //const {query=""} = await searchParams;

  // GET ALL QUESTIONS =

  const { page, pageSize, query, filter } = await searchParams;

  const { success, data } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "newest",
  });

  // destructure the data
  const { questions = [] } = data || {}; // pass the empty object if data is doestn exist

  // but above we have questions array -- react and javascript so that we can apply filter by using the two array object of questions

  // const filteredQuestions = questions.filter((question)=>question.title.toLowerCase().includes(query?.toLocaleLowerCase()))

  // warchaya questions chya array madhun apan question filter krt ahe

  // const session = await auth();
  // console.log("Looged in user session --> ", session);

  // const LogoutHandler= async()=>{
  //     'use server'
  //      signOut()
  // }

  return (
    <>
      {/* <h1 className=" text-red-400 text-[30px] font-bold leading-[42px] tracking-tighter text-center  ">
        Website Under devlopment .....
      </h1> */}
      <div className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900"> All Questions </h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 text-light-900  "
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </div>

      {/* local search compoonents   */}
      <section className="mt-11">
        {/* Localsearch --> Props pass kele  */}
        <LocalSearch
          placeholder="Search .. "
          otherClasses="flex-1"
          route="/"
          imgSrc="/icons/search.svg"
          iconPostion="Left"
        />
      </section>

      {/* question card  */}
      <section className="mt-11">
        <HomeFilter />

        <DataRenderer
          success={success}
          data={questions}
          empty={EMPTY_QUESTIONS}
          render={(questions) =>
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          }
        />

        {/* {success ? (
          <div className="mt-10 flex w-full flex-col gap-6">
         
            {questions && questions.length > 0 ? (
              questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
              ))
            ) : (
              <div className="mt-10 w-full items-center justify-center">
                <p className="text-dark400_light500">No Questions found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 w-full items-center justify-center">
            <p>{ "failed to fetch questions"}</p>
          </div>
        )} */}
      </section>
    </>
  );
};

export default Home;
