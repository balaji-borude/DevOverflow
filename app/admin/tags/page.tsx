import React from "react";
import TagCards from "@/components/cards/TagCards";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { EMPTY_TAGS } from "@/constants/states";
import { getAdminTags } from "@/lib/actions/admin.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const AdminTagsPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query } = await searchParams;

  const { success, data } = await getAdminTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
  });

  const { tags = [] } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-10 flex flex-col gap-6">
        <p className="paragraph-regular text-dark400_light700">
          List of all tags used across the platform. You can moderate, merge, or delete tags.
        </p>

        <LocalSearch
          route="/admin/tags"
          iconPostion="Left"
          imgSrc="/icons/search.svg"
          placeholder="Search tag"
          otherClasses="flex-1"
        />

        <DataRenderer
          empty={EMPTY_TAGS}
          data={tags}
          success={success}
          render={(tags) => (
            <div className="mt-8 grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tags.map((tag) => (
                <TagCards
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  questions={tag.questions}
                />
              ))}
            </div>
          )}
        />
      </div>
    </>
  );
};

export default AdminTagsPage;
