"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/lib/Url";

interface Filter {
  name: string;
  value: string;
}

interface Props {
  filters: Filter[];
  otherClasses?: string;
  containerClasses?: string;
}

const CommonFilter = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  // this is how we can get the filter value from the search params
  const paramsFilter = searchParams.get("filter");

  // function to handle the filter change
  const handleUpdateFilter = (value: string) => {

    const newUrl = formUrlQuery({
        params:searchParams.toString(),
        key: "filter",
        value: value,
      });
      router.push(newUrl,{scroll:false});
  };

  console.log("Filters", filters);
return (
  <div className={cn("relative w-full", containerClasses)}>
    <Select
      onValueChange={(value) => handleUpdateFilter(value)}
      defaultValue={paramsFilter || undefined}
    >
      <SelectTrigger
        className={cn(
          "w-full body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
          otherClasses
        )}
        aria-label="Filter options"
      >
        <SelectValue placeholder="Select a filter" />
      </SelectTrigger>

      <SelectContent className="w-full">
        <SelectGroup>
          {filters.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
};

export default CommonFilter;
