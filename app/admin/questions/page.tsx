import React from "react";
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearch from "@/components/search/LocalSearch";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getAdminQuestions } from "@/lib/actions/admin.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const AdminQuestionsPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query } = await searchParams;

  const { success, data } = await getAdminQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
  });

  const { questions = [] } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Questions</h1>
      <div className="mt-10 flex flex-col gap-6">
        <p className="paragraph-regular text-dark400_light700">
          List of all questions posted on the platform. You can review, moderate, and delete them.
        </p>

        <LocalSearch
          route="/admin/questions"
          iconPostion="Left"
          imgSrc="/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <div className="mt-8 flex flex-col gap-6">
          <DataRenderer
            success={success}
            data={questions}
            empty={EMPTY_QUESTIONS}
            render={(questions) =>
              questions.map((question) => (
                <QuestionCard key={question._id} question={question} isAdmin={true} />
              ))
            }
          />
        </div>
      </div>
    </>
  );
};

export default AdminQuestionsPage;
