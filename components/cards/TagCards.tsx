import Link from "next/link";
import ROUTES from "@/constants/route";
import { Badge } from "../ui/badge";
import { getTagIconClass, getTechDescription, cn } from "@/lib/utils";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showcount?: boolean;
  compact?: boolean;
}

const TagCards = ({ _id, name, questions, showcount, compact }: Props) => {
  const iconClass = getTagIconClass(name);
  const iconDescription = getTechDescription(name);

  // ✅ CASE 1: Compact View
  if (compact) {
    return (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        <Badge className="background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
          <div className="flex-center space-x-2">
            <i className={`${iconClass} text-sm`} />
            <span>{name}</span>
          </div>
        </Badge>

        {showcount && (
          <p className="small-medium text-dark500_light700">
            {questions}
          </p>
        )}
      </Link>
    );
  }

  // ✅ CASE 2: Full Card View
  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
        
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">
              {name}
            </p>
          </div>

          <i
            className={cn(iconClass, "text-2xl")}
            aria-hidden="true"
          />
        </div>

        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
          {iconDescription}
        </p>

        {/* Questions count */}
        { (
          <p className=" small-medium text-dark400_light500 mt-3.5 ">
            <span className="body-semibold primary-text-gradient mt-2.5 mr-2">
              {questions}+
            </span>
            Questions
            
          </p>
        )}

      </article>
    </Link>
  );
};

export default TagCards;