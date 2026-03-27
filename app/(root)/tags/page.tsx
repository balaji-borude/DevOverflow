import { getTags } from "@/lib/actions/tag.action";
import React from "react";
import { success } from "zod";

const Tags = async () => {
    // API call --> to get all the tags
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: "JavaScript",
    //filter: "newest",
    sort: "",
  });

  // get tags 
  const {tags} = data || {};

  console.log("Getting Tags -->",tags);

  return
   <div></div>;
};

export default Tags;
