import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import { getUserProfile } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/action";
import { notFound, redirect } from "next/navigation";

const EditProfile = async ({ params }: RouteParams) => {
  const { id } = await params;
  
  if (!id) notFound();

  const loggedInUser = await auth();

  const { success, data, error } = await getUserProfile({ userId: id });

  if (!success || !data) {
    return notFound();
  }

  // Check if the logged-in user is the owner of this profile
  if (loggedInUser?.user?.id !== data.user._id) {
    return redirect("/profile/" + id);
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
