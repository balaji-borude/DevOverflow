import React from "react";
import NavLinks from "./navbar/NavLinks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/route";
import Image from "next/image";

const LeftSideBar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] ">
      <div className="flex flex-1 flex-col gap-6 ">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-3">
        <Link href={ROUTES.SIGN_IN}>
          <Button
            asChild
            className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3"
          >
            <span className="flex items-center gap-2">
              <Image
                src="/icons/account.svg"
                width={20}
                height={20}
                alt="icon"
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </span>
          </Button>
        </Link>

          <Link href={ROUTES.SIGN_UP}>
        <Button className="small-medium light-border-2 btn-tertiary w-full rounded-lg  text-dark400_light900 min-h-[41px] border px-4 py-3 mb-2 shadow-none cursor-pointer">
            <Image
              src="/icons/sign-up.svg"
              width={20}
              height={20}
              alt="icons"
              className="invert-colors lg:hidden "
            />
            <span className="max-lg:hidden">Sign Up</span>
        </Button>
          </Link>
      </div>
    </section>
  );
};

export default LeftSideBar;
