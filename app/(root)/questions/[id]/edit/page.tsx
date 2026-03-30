import { auth } from "@/auth";
import QuestionForms from "@/components/forms/QuestionForms";
import { notFound, redirect } from "next/navigation";
import { getQuestion } from "@/lib/actions/question.action";
import ROUTES from "@/constants/route";
import type { RouteParams } from "@/types/action";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) {
    return redirect("/sign-in");
  }
  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success) return notFound();

  if (question?.author.toString() !== session?.user?.id)
    redirect(ROUTES.QUESTION(id));

  return (
    <main>
 
        <QuestionForms question={question} isEdit />
     
    </main>
  );
};

export default EditQuestion;
