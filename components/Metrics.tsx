import React from "react";
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
}: Props) => {
  // main contetn want to display
  const metricContent = (
    <div className="flex-center flex gap-1">
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`${imgStyles} rounded-full object-contain`}
      />

      <p className={`${textStyles} flex items-center gap-1`}>{value}</p>

      <span
        className={`small-regular  text-dark400_light700 ${isAuthor ? "max-sm:hidden" : ""}`}
      >
        {title}
      </span>
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
