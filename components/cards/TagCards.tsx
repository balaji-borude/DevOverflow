import React from "react";
import Link from "next/link";
import ROUTES from "@/constants/route";
import { Badge } from "../ui/badge";
//import { getDeviconClassName } from '@/lib/utils';

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showcount?: boolean;
  compact?: boolean;
}

// getting icons from the devicons site
const TAG_ICON_MAP: Record<string, string> = {
  react: "devicon-react-original",
  express: "devicon-express-original",
  next: "devicon-nextjs-original-wordmark",
  javascript: "devicon-javascript-plain colored",
  python: "devicon-python-plain",
  java: "devicon-java-plain",
};

// getting dev icoons
const getTagIconClass = (tagName: string) => {
  const icon = TAG_ICON_MAP[tagName.toLowerCase()];

  if (!icon) {
    return "devicon-devicon-plain colored";
  }

  return `${icon} colored`;
};

const TagCards = ({ _id, name, questions, showcount, compact }: Props) => {
  // function call kert ahe 
  const iconClass = getTagIconClass(name);

  return (
    <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2 ">
      <Badge className="background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span> {name}</span>
        </div>
      </Badge>

      {/* count */}
      {showcount && (
        <p className="small-medium text-dark500_light700"> {questions}</p>
      )}
    </Link>
  );
};

export default TagCards;
