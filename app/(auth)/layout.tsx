import React, { ReactNode } from "react";
import Image from "next/image";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

//every Route Group -->() Route group means route wrapped in ()--> can have its own layout
// every page in (auth) will be wrapped by this layout

// rooute group does not call in Url --> like localhost:3000/(auth)/sign-in --> it directly calls localhost:3000/sign-in

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen justify-center items-center bg-auth-light dark:bg-auth-dark bg-cover bg-center bg-no-repeat px-4 py-10 ">
      {/* common layout for the auth form --> is here (without duplicating the code ) */}

      <section className="light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8 ">
        <div className="flex items-center justify-between">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100_light900">Join Devflow</h1>
            <p className="paragraph-regular text-dark500_light400 ">
              To get your questions Answered{" "}
            </p>
          </div>

          <Image
            src="/images/site-logo.svg"
            alt="Devflow Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {children}

        {/*Below there is social link for authetication   */}
        {/* <p> Social Auth </p> */}
        <SocialAuthForm/>
      </section>
    </main>
  );
};

export default AuthLayout;
