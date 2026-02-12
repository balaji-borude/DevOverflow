import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import handleError from "@/lib/handlers/errors";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongodb";
import Link from "next/link";

// import { NotFoundError, ValidationError } from "@/lib/http-errors";
// import handleError from "@/lib/handlers/errors";

interface QuestionProps {
  _id: string;
  title: string;
  description: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; image: string };
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
}

// arary of questions
const questions: QuestionProps[] = [
  {
    _id: "1",
    title: "What is React?",
    description: "From where should I learn React?",
    tags: [
      { _id: "t1", name: "react" },
      { _id: "t2", name: "frontend" },
    ],
    author: {
      _id: "u1",
      name: "Balaji",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToP5rz4ky9W48e8f3kQ8gdA_b7fyyjP68Eg&s",
    },
    createdAt: new Date("2024-12-01"),
    upvotes: 12,
    answers: 3,
    views: 150,
  },
  {
    _id: "2",
    title: "What is JavaScript?",
    description: "From where should I learn JavaScript?",
    tags: [
      { _id: "t3", name: "javascript" },
      { _id: "t4", name: "programming" },
      
    ],
    author: {
      _id: "u2",
      name: "Aarav",
      // have to set the DiceBear Api here for profile Picture 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToP5rz4ky9W48e8f3kQ8gdA_b7fyyjP68Eg&s",
    },
    createdAt: new Date("2024-12-05"),
    upvotes: 25,
    answers: 7,
    views: 420,
  },
];

const test =async()=>{
  try {
    // throw new Error("test error");
    // throw new NotFoundError ("test error");
    // throw new ValidationError({name:["name is required"]});
    await dbConnect();
  } catch (error) {
    return handleError(error);
  }
}

interface SearchParams{
  searchParams: Promise<{[key:string]:string}>;
}

const Home = async ({searchParams}:SearchParams) => {
 
   await test();
  //  console.log("result", result); 

  // searchparams madhun query ghene ani 
  const {query=""} = await searchParams;

  // here api call for the Query that we wantot execute 
  // const data = await axios.get(/getquestions/data);
 
  // but above we have questions array -- react and javascript so that we can apply filter by using the two array object of questions

  const filteredQuestions = questions.filter((question)=>question.title.toLowerCase().includes(query?.toLocaleLowerCase()))

      // warchaya questions chya array madhun apan question filter krt ahe 


  const session = await auth();
  console.log("Looged in user session --> ", session);

  // const LogoutHandler= async()=>{
  //     'use server'
  //      signOut()
  // }

  return (
    <>
      <h1 className=" text-red-400 text-[30px] font-bold leading-[42px] tracking-tighter text-center  ">
        Website Under devlopment .....
      </h1>
      <div className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900"> All Questions </h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 text-light-900  "
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </div>

      {/* local search compoonents   */}
      <section className="mt-11">
        {/* Localsearch --> Props pass kele  */}
        <LocalSearch
          placeholder="Search .. "
          otherClasses="flex-1"
          route="/"
          imgSrc="/icons/search.svg"
        />
      </section>

      {/* question card  */}
      <section className="mt-11">
       
        <HomeFilter/> 
        <div className="mt-10 flex w-full flex-col gap-6">
          {/* <p> Question card </p>
           */}

          {filteredQuestions.map((question) => (
            <QuestionCard key={question._id} question={question}/>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
