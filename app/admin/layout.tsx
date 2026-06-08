import AdminLeftSideBar from "@/components/navigation/AdminLeftSideBar";
import Navbar from "@/components/navigation/navbar/Navbar";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ROUTES from "@/constants/route";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  // Check if the user is authenticated and is the admin
  if (!session?.user || session.user.email !== "admin@gmail.com") {
    redirect(ROUTES.HOME);
  }

  return (
    <main className="background-light850_dark100 relative ">
      <Navbar />

      <div className="flex ">
        {/* Admin sidebar */}
        <AdminLeftSideBar />

        {/* all children  */}
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
      </div>

      <Toaster />
    </main>
  );
};

export default AdminLayout;
