'use client'
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useSearchParams } from "next/navigation";

interface Props {
  otherClasses?: string;
  placeholder: string;
  route:string,
  imgSrc:string
}
const LocalSearch = ({ otherClasses, placeholder,route,imgSrc }: Props) => {

    // search params \
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || "";


    const [searchQuery,setSearchQuery ] = useState(query);


  return (
    <div
      className={`background-light800_darkgradient flex min-h-14 grow items-center gap-4 rounded-[10px] px-4 ${otherClasses} `}
    >
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
