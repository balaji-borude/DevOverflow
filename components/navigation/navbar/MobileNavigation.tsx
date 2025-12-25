import React from "react";
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

const MobileNavigation = () => {
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
              Dev <span className="text-primary-500">Flow</span>
            </p>
          </Link>

          <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6  ">
                <NavLinks isMobileNav={true} />
              </section>
            </SheetClose>

            {/* SignIn Links */}
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href={ROUTES.SIGN_IN}>
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 ">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={ROUTES.SIGN_UP}>
                  <Button className="small-medium light-border-2 btn-tertiary w-full rounded-lg  text-dark400_light900 min-h-[41px] border px-4 py-3 mb-2 shadow-none">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
