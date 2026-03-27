import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";
import Image from "next/image";
import Link from "next/link";

interface Props<T> {
  success: boolean;
  data: T[] | null | undefined;
  error?: {
    message: string;
    details: Record<string, string[]>;
  };

  empty?: {
    title: string;
    message: string;
    button: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt36">
    <>
      {/* Only visile in the dark --> dark:block */}
      <Image
        src={image.dark}
        alt={image.alt}
        width={270}
        height={270}
        className="hidden object-contain dark:block"
      />
      <Image
        src={image.light}
        alt={image.alt}
        width={270}
        height={270}
        className="dark:hidden block object-contain "
      />
    </>
    <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>

    <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
      {message}
    </p>

    {button && (
      <Link href={button.href}>
        <button className="paragraph-medium mt-5 min-h-[46px] px-4 py-3 bg-primary-100 text-black hover:text-light-900  rounded-md cursor-pointer hover:bg-primary-500   ">
          {button.text}
        </button>
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  success,
  data,
  error,
  empty = DEFAULT_EMPTY,
  render,
}: Props<T>) => {
  // if data is not present
  if (!success) {
    return(
          <StateSkeleton
      image={{
        light: "/images/Light-ErrorState illustration.png",
        dark: "/images/Dark-ErrorState Ilustration.png",
        alt: "Empty state illustration",
      }}
      title={error?.message || DEFAULT_ERROR.title}
      message={
        error?.details
          ? JSON.stringify(error.details, null, 2)
          : DEFAULT_ERROR.message
      }
      button={DEFAULT_ERROR.button}
    />
    )

  }

  // this is for if the data is present
  if (!data || data.length === 0)
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );

  return <div className="mt-8 space-y-4">{render(data)}</div>;
};

export default DataRenderer;
