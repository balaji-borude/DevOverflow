import TagCards from "@/components/cards/TagCards";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/route";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.action";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl ">Tags</h1>

      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tag "
          otherClasses="flex-1"
          iconPostion="Left"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={data?.tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
};

export default Tags;
