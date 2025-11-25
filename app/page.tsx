import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return <div >
      Home Page


    {/* <h1 className="font-space-grotesk text-2xl"> Test Tailwind </h1>
    <h1 className="font-inter text-2xl">Test Tailwind</h1>
   */}

   {/* Nested Route Learning */}

   <p>
      Welcome to Dev Overflow

   </p>

      <Link href="/project/list"> ProjectList (nested ROutes )</Link>


    </div>
}
