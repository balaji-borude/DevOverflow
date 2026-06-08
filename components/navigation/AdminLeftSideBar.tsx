import AdminNavLinks from "./navbar/AdminNavLinks";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const AdminLeftSideBar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between  border-r p-6 pt-24 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] ">
      <div className="flex flex-1 flex-col  gap-6 ">
        <AdminNavLinks />
      </div>

      <div className="flex flex-col space-y-4">
        {userId && (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              type="submit"
              className="base-medium w-fit bg-transparent p-3 hover:cursor-pointer text-dark300_light900 border-dark300_light900 hover:bg-dark300_light900 hover:text-light-900 transition-colors duration-200"
            >
              <LogOut className="size-5 text-black dark:text-white " />
              <span className="max-lg:hidden text-dark300_light900 base-medium ">
                Logout
              </span>
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default AdminLeftSideBar;
