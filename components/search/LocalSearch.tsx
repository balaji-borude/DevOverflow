"use client";

// here we used the query-string paramenter  --> placed in lib/Url.ts file
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/Url"; // imported the Form url fron lib/Url/ts constant file

interface Props {
  otherClasses?: string;
  placeholder: string;
  route: string;
  imgSrc: string;
}

const LocalSearch = ({ otherClasses, placeholder, route, imgSrc }: Props) => {
  // search params from next navigation
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // if the chage occure then only change the URl

  const [searchQuery, setSearchQuery] = useState(query);

  //
  const router = useRouter();
  const pathname = usePathname();

  // const currentQuery = searchParams.get("query") || ""; //

  useEffect(() => {
    if (searchQuery === query) return; // no change, no push --> only push when there is chage in the searchbar

    // debounceing
    const delayDebounceFn = setTimeout(() => {
      //alert("debounced the query ");
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, searchParams]);

  // here is every charecter got an request so that this is not Optimal solution for the searching text
  // what is optimal --> Debounceing  ? use it

  return (
    <div
      className={`background-light800_darkgradient flex min-h-14 grow items-center gap-4 rounded-[10px] px-4 ${otherClasses} `}
    >
      {/* <p>{searchParams.toString()}</p> */}
      {/*Reusable Searchbar */}

      {/* search icons */}
      <Image
        src={imgSrc}
        width={24}
        height={24}
        alt="search"
        className="cursor-pointer"
      />

      {/* Input type  */}

      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none "
      />
    </div>
  );
};

export default LocalSearch;
