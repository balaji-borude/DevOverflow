"use client";
import { sidebarLinks } from "@/constants/NavLinks";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { SheetClose } from "./ui/sheet";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {

  // for getting path from the URl of Browser 
  const pathname = usePathname();

  // for the Profile section temporary setting the id 
  const userId=1;

  return (
    <>
      {sidebarLinks.map((item) => {

        // checking which link is active here
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        
        // profile section --> if userId is present then reset the item.route /${user_id} 
        if(item.route ==='/profile'){
          if(userId) item.route = `${item.route}/${userId}`
          // if we dont have userId then exit the function 
          else return null;
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

        // return the LInks --> but it has to manually close the section 
        // return LinkComponent;

        return isMobileNav ?  (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ):(
          // if it is not mobile nav then 
          <React.Fragment key={item.route}> {LinkComponent}</React.Fragment>
        )
      })}
    </>
  );
};

export default NavLinks;
