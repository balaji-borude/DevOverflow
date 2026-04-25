import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/route";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getTagQuestions } from "@/lib/actions/tag.action";
import { redirect } from "next/navigation";
import type { RouteParams } from "@/types/action";
import { getTagIconClass, getTechDescription } from "@/lib/utils";

const TagDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params; // tag id from URL
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });

  if (!success || !data) {
    return redirect("/404");
  }

  const { tag, questions, isNext } = data;

  return (
    <>
      {/* Tag Header */}
      <div className="flex-start w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
              <p className="paragraph-semibold text-dark300_light900">
                {tag.name}
              </p>
            </div>
            <i
              className={`${getTagIconClass(tag.name)} text-2xl`}
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
          {getTechDescription(tag.name)}
        </p>

        <div className="mt-3.5 flex flex-wrap gap-4">
          <div className="small-medium text-dark400_light500">
            <span className="body-semibold primary-text-gradient mr-2">
              {tag.questions}+
            </span>
            Questions
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section className="mt-11">
        <LocalSearch
          route={`${ROUTES.TAG(id)}`}
          imgSrc="/icons/search.svg"
          placeholder="Search questions in this tag"
          otherClasses="flex-1"
          iconPostion="Left"
        />
      </section>

      {/* Questions List */}
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTIONS}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      {/* Pagination could be added here if needed */}
      {isNext && (
        <div className="mt-10 flex w-full justify-center">
          <button className="background-light800_dark400 text-light400_light500 rounded-lg px-4 py-2">
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default TagDetails;
