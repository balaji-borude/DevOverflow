import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imgStyles?: string;
  isAuthor?: boolean;
  titleStyles?: string;
}

const Metrics = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  isAuthor,
  titleStyles,
}: Props) => {
  // main contetn want to display
  const metricContent = (
    <div className="flex-center flex gap-1">
      {/* <UserAvatar
                id={author._id}
                name={author?.name}
                className="size-[22px]"
                fallbackClassName="text-[10px]"
              /> */}
      
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`${imgStyles} rounded-full object-contain`}
      />

      <p className={`${textStyles} flex items-center gap-1`}>{value}</p>

      {title ? (
        <span
          className={cn(
            `small-regular  text-dark400_light700 line-clamp-1`,
            titleStyles,
          )}
        >
          {title}
        </span>
      ) : null}
    </div>
  );
  return href ? (
    <Link href={href} className="flex-center flex gap-1">
      {" "}
      {metricContent}
    </Link>
  ) : (
    <div>{metricContent}</div>
  );
};

export default Metrics;
