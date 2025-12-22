"use client";
import { sidebarLinks } from "@/constants/NavLinks";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {

  // for getting path from the URl of Browser 
  const pathname = usePathname();

  // for the Profile section temporary setting the id 
  const id=1;

  return (
    <>
      {sidebarLinks.map((item) => {

        // checking which link is active here
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        
        // profile section 
        if(item.route ==='/profile'){

        }

        //   actual Link compnnets 
        const LinkComponent = (
          <Link href={item.route} key={item.label}
            className={cn(isActive?"primary-gradient rounded-lg text-light-900 ":"text-dark300_light900 ", 
              "flex items-center justify-start gap-4 bg-transparent p-4")}
          >
            <Image
              src={item.imageURL}
              alt={item.label}
              width={20}
              height={20}
              className={cn({"invert-colors":!isActive})}
            />
            <p className={cn(isActive ? "base-bold" :"base-medium",
              !isMobileNav && "max-lg:hidden"
            )}>{item.label}</p>
          </Link>
        );

        // return the LInks
        return LinkComponent;
      })}
    </>
  );
};

export default NavLinks;
