import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/route";
import { Button } from "../../ui/button";
import NavLinks from "./NavLinks";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild className="block sm:hidden">
          <Image src="/icons/hamburger.svg" width={36} height={36} alt="menu" />
        </SheetTrigger>

        {/*Main sidebar section is here   */}
        <SheetContent
          side="left"
          className="background-light900_dark200 border-none p-3 "
        >
          <SheetHeader>
            <SheetTitle className="hidden">Navigation</SheetTitle>
          </SheetHeader>

          {/* links to navigation  */}
          <Link href="/" className="flex items-center gap-2 -mt-3 mb-2">
            <Image
              src="/images/site-logo.svg"
              width={23}
              height={23}
              alt="Logo"
            />

            {/*logo text   */}
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 ">
              {/* device lowert than 640 px we hide the logo  */}
              Dev <span className="text-primary-500">OverFlow</span>
            </p>
          </Link>

          <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
            {/* ✅ Fix 1: Remove asChild from SheetClose wrapping section */}
            <SheetClose>
              <section className="flex h-full flex-col gap-6">
                <NavLinks isMobileNav={true} />
              </section>
            </SheetClose>

            {/* ✅ Fix 2: SheetClose asChild → Link directly (no Button in between) */}
            <div className="flex flex-col gap-3">
              {userId ? (
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
                    <LogOut className="size-5 text-black dark:text-white" />
                    <span className="max-lg:hidden text-dark300_light900 base-medium">
                      Logout
                    </span>
                  </Button>
                </form>
              ) : (
                <>
                  {/* ✅ SheetClose asChild → Link only (single Slot, no nested Slot) */}
                  <SheetClose asChild>
                    <Link
                      href={ROUTES.SIGN_IN}
                      className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 flex items-center justify-center"
                    >
                      <span className="primary-text-gradient">Log In</span>
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href={ROUTES.SIGN_UP}
                      className="small-medium light-border-2 btn-tertiary w-full rounded-lg text-dark400_light900 min-h-[41px] border px-4 py-3 mb-2 shadow-none flex items-center justify-center"
                    >
                      Sign Up
                    </Link>
                  </SheetClose>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
