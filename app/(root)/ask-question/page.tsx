import { auth } from "@/auth";
import QuestionForms from "@/components/forms/QuestionForms";
import { redirect } from "next/navigation";

const Ask_Question = async () => {
  const session = await auth();
  if(!session){
    return redirect("/sign-in");
  };  
  
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <QuestionForms />
      </div>
    </div>
  );
};

export default Ask_Question;
