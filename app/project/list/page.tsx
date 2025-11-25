import Link from "next/link";
import React from "react";

const Page_List = () => {
  return (
    <div className="w-lg ">
      
      this is Page_List folder
      <ul className="flex  flex-col justify-center ">
        <li>
          <Link href="/project/list"> first</Link>
        </li>
        <li>
          <Link href="/project/list/second"> second Project</Link>
        </li>

        <li>
          <Link href="/project/list/third"> third Project</Link>
        </li>
      </ul>
    </div>
  );
};

export default Page_List;
