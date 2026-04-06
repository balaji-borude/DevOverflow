import QuestionCard from "@/components/cards/QuestionCard";

import LocalSearch from "@/components/search/LocalSearch";

import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import { Questions } from "@/types/global";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Collection = async ({ searchParams }: SearchParams) => {
  // GET ALL QUESTIONS =

  const { page, pageSize, query, filter } = await searchParams;

  const { success, data } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "mostrecent",
  });

  // destructure the data
  const { collection } = data || {};

  return (
    <>
      <div className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900"> Saved Questions </h1>
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
        <DataRenderer
          success={success}
          data={collection} 
          empty={EMPTY_QUESTIONS}
          render={(collection) =>
            collection.map((item) => (
              <QuestionCard
                key={item._id}
                question={item.question as Questions}
              />
            ))
          }
        />
      </section>
    </>
  );
};

export default Collection;
