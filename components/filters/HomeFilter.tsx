"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/Url";

const HomeFilter = () => {
  const filters = [
    { name: "Newest", value: "newest" },
    { name: "Popular", value: "popular" },
    { name: "Unanswered", value: "unasnwered" },
    { name: "Recommended", value: "recommended" },
  ];

  const router = useRouter();
  // kontya button we click kelyavr to button Url madhe gela pahije tyasathi useParams use krt ahe
  const searchParams = useSearchParams();

  const filterParams = searchParams.get("filter");

  // create useState to know which button of the filter is selected or which one is not
  const [active, setActive] = useState(filterParams || "");

  // onclick
  const handleClick = (filter: string) => {
    let newUrl = "";

    if (filter === active) {
      setActive("");
      setActive(filter);
      newUrl = removeKeyFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLocaleLowerCase(),
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {/* small evice la hidden kela ahe  */}
      {filters.map((filter, index) => (
        <Button
          key={index}
          className={cn(
            ` body-medium rounded-lg px-6 py-3 capitalize shadow-none cursor-pointer`,
            active === filter.value
              ? // if selected then
                " bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          onClick={() => handleClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
