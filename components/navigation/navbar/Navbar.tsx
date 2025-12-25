import Link from "next/link";
import Image from "next/image";
import { ThemeToggler } from "./ThemeToggler";
import MobileNavigation from "./MobileNavigation";

const Navbar = () => {
  return (
    <nav className="  w-full flex-between background-light900_dark200 fixed z-50 gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          alt="logo_img"
          width={23}
          height={23}
        />

        {/*logo text   */}
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          {/* device lowert than 640 px we hide the logo  */}
          Dev <span className="text-primary-500">Flow</span>
        </p>
      </Link>

      {/* searchbar  */}
      <div className="w-[100px] sm:w-[300px]   flex justify-center ">
   
        <input
          type="text"
          placeholder="Search..."
          className="w-full  outline-1 p-1 pl-3 rounded-2"
        />
      </div>

      {/* .flex-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
          } */}

      {/* dark theme togglere  */}

      <div className="flex gap-x-2">
        <ThemeToggler />
        {/*mobile Navbar   */}
        <MobileNavigation />
      </div>

      {/* autheticated user icons */}
    </nav>
  );
};

export default Navbar;
