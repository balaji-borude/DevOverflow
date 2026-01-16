import { auth, signOut } from "@/auth";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import Link from "next/link";

interface QuestionProps {
  title: string;
  description: string;
  _id: string;
}

const questions: QuestionProps[] = [
  {
    _id: "1",
    title: "what is react",
    description: "from where should I learn react",
  },
  {
    _id: "2",
    title: "what is javascript",
    description: "from where should I learn js",
  },
];

interface SearchParams{
  searchParams: Promise<{[key:string]:string}>;
}

const Home = async ({searchParams}:SearchParams) => {

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
        HomeFilter tags 
        <div className="mt-10 flex w-full flex-col gap-6">
          {/* <p> Question card </p>
           */}

          {filteredQuestions.map((ques) => (
            <p key={ques._id}>{ques.title}</p>
         
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
