"use client";

import Image from "next/image";
import { toast } from "sonner";
import ROUTES from "@/constants/route";
import { signIn } from "next-auth/react";

const SocialAuthForm = () => {
  const buttonStyles =
    " flex justify-center hover:cursor-pointer background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1  px-4 py-3.5  ";

  // signin Functin for oAuth
  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        //redirect:false,
      });
      // throw new Error("Not implemented baby")

     toast.success("Login Succesfully");
    } catch (error) {
      console.log(error);

      toast.error("Sign-In Failed");
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2">

      {/* Github signIN button  */}
      <button className={buttonStyles} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="Github Icon"
          width={20}
          height={20}
          className="invert-colors mr-3 object-contain"
        />
        <span> Login with Github</span>
      </button>

      {/* Google signIn Button  */}
      <button className={buttonStyles} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google Icon"
          width={20}
          height={20}
          className="invert-colors mr-3 object-contain"
        />
        <span> Login with Google</span>
      </button>
    </div>
  );
};

export default SocialAuthForm;
