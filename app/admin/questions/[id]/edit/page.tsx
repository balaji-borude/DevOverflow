import { auth } from "@/auth";
import QuestionForms from "@/components/forms/QuestionForms";
import { notFound, redirect } from "next/navigation";
import { getQuestion } from "@/lib/actions/question.action";
import type { RouteParams } from "@/types/action";
import ROUTES from "@/constants/route";

const AdminEditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  // Assuming only admins can access this route due to middleware/layout checks
  const session = await auth();
  if (!session) {
    return redirect(ROUTES.SIGN_IN);
  }

  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success || !question) return notFound();

  return (
    <main>
      <div className="mb-10">
        <h1 className="h1-bold text-dark100_light900">Admin Edit Question</h1>
        <p className="mt-2 text-dark400_light700">You are editing this question as an administrator.</p>
      </div>
      <QuestionForms question={question} isEdit isAdmin />
    </main>
  );
};

export default AdminEditQuestion;
