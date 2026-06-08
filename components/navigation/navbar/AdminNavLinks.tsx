"use client";

import { adminSidebarLinks } from "@/constants/adminRoutes";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";

const AdminNavLinks = ({
  isMobileNav = false,
}: {
  isMobileNav?: boolean;
}) => {
  const pathname = usePathname();

  return (
    <>
      {adminSidebarLinks.map((item) => {
        const route = item.route;

        // checking which link is active here
        const isActive =
          (pathname.includes(route) && route.length > 6) || // > 6 because "/admin" is 6 chars. we want to match exact /admin or /admin/something
          pathname === route;

        // actual Link components
        const LinkComponent = (
          <Link
            href={route}
            key={item.label}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900",
              "flex items-center justify-start gap-4 bg-transparent p-3",
            )}
          >
            <Image
              src={item.imageURL}
              alt={item.label}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden",
              )}
            >
              {item.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <span key={route}>{LinkComponent}</span>
        );
      })}
    </>
  );
};

export default AdminNavLinks;
