import ROUTES from "@/constants/route";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

const UserAvatar = ({
  id,
  name,
  image,
  className, 
  fallbackClassName,
}: {
  id: string;
  name?: string;
  image?: string;
  className: string;
  fallbackClassName? : string;
}) => {
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)} className={className}>
      <Avatar className={`${className}`}>
        {image ? (
          <Image
            src={image}
            alt={name || "Avatar"}
            className="object-cover"
            width={36}
            height={36}
            quality={100}
          />
        ) : (
          // if user is not have iamge then used the default avatar of shadcn

          <AvatarFallback className={cn("primary-gradient font-space-grotesk font-bold tracking-wider text-white",fallbackClassName)}>
            {initials || "U"}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
