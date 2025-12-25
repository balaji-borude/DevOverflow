import LeftSideBar from "@/components/navigation/LeftSideBar";
import Navbar from "@/components/navigation/navbar/Navbar";
import RightSideBar from "@/components/navigation/RightSideBar";
import React, { ReactNode } from "react";
import { Toaster } from "sonner";
// import { Toaster } from 'sonner'

//every Route Group -->() Route group means route wrapped in ()--> can have its own layout
// every page in (auth) will be wrapped by this layout
const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative ">

      <Navbar />

      <div className="flex ">
        {/* sidebar */}
        <LeftSideBar />

        {/* all children  */}
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          {/* children means --> all the navigation pages are childeren --> are shown in middlere soo */}
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>


        {/* Right side bar */}
        <RightSideBar/>
        
      </div>

      <Toaster />
    </main>
  );
};

export default RootLayout;
