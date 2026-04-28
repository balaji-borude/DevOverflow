import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import { getUserProfile } from "@/lib/actions/user.action";
import { notFound, redirect } from "next/navigation";

const EditProfile = async () => {
  const loggedInUser = await auth();

  if (!loggedInUser?.user?.id) {
    return redirect("/sign-in");
  }

  const { success, data, error } = await getUserProfile({ userId: loggedInUser.user.id });

  if (!success || !data) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col px-4 pb-10 pt-28 sm:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="h1-bold text-dark100_light900 text-3xl">Edit Profile</h1>
        
        <div className="mt-9">
          <ProfileForm user={data.user} />
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
