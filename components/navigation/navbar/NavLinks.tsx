// "use client";

// // import the links from constant
// import { sidebarLinks } from "@/constants/NavLinks"; // Sidebar Links
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { SheetClose } from "@/components/ui/sheet";

// const NavLinks = ({
//   isMobileNav = false,
//   userId,
// }: {
//   isMobileNav?: boolean;
//   userId?: string;
// }) => {
//   // for getting path from the URl of Browser
//   const pathname = usePathname();

//   // for the Profile section temporary setting the id

//   return (
//     <>
//       {sidebarLinks.map((item) => {
//         // ✅ Use a local variable, never mutate the original
//         const route =
//           item.route === "/profile"
//             ? userId
//               ? `/profile/${userId}`
//               : null
//             : item.route;
//          // if no userId and profile route, skip
//         if (!route) return null;

//         // checking which link is active here
//         const isActive =
//           (pathname.includes(item.route) && item.route.length > 1) ||
//           pathname === item.route;

//         // profile section --> if userId is present then reset the item.route /${user_id}
//         if (item.route === "/profile") {
//           if (userId) item.route = `${item.route}/${userId}`;
//           // if we dont have userId then exit the function
//           else return null;
//         }

//         //   actual Link compnnets
//         const LinkComponent = (
//           <Link
//             href={item.route}
//             key={item.label}
//             className={cn(
//               isActive
//                 ? "primary-gradient rounded-lg text-light-900 "
//                 : "text-dark300_light900 ",
//               "flex items-center justify-start gap-4 bg-transparent p-3 ",
//             )}
//           >
//             <Image
//               src={item.imageURL}
//               alt={item.label}
//               width={20}
//               height={20}
//               className={cn({ "invert-colors": !isActive })}
//             />
//             <p
//               className={cn(
//                 isActive ? "base-bold" : "base-medium",
//                 !isMobileNav && "max-lg:hidden",
//               )}
//             >
//               {item.label}
//             </p>
//           </Link>
//         );

//         // return the LInks --> but it has to manually close the section
//         // return LinkComponent;

//         return isMobileNav ? (
//           <SheetClose asChild key={item.route}>
//             {LinkComponent}
//           </SheetClose>
//         ) : (
//           LinkComponent
//         );
//       })}
//     </>
//   );
// };

// export default NavLinks;

"use client";

// import the links from constant
import { sidebarLinks } from "@/constants/NavLinks"; // Sidebar Links
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";

const NavLinks = ({
  isMobileNav = false,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks.map((item) => {
        // ✅ Use a local variable, never mutate the original
        const route =
          item.route === "/profile"
            ? userId
              ? `/profile/${userId}`
              : null
            : item.route;

        // if no userId and profile route, skip
        if (!route) return null;

        // checking which link is active here
        const isActive =
          (pathname.includes(route) && route.length > 1) ||
          pathname === route;

        // actual Link components
        const LinkComponent = (
          <Link
            href={route}  // ✅ use route, not item.route
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

export default NavLinks;
