import React from "react";
import Image from "next/image";

const SocialAuthForm = () => {

    
  const buttonStyles =
    " flex justify-center hover:cursor-pointer background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1  px-4 py-3.5  ";
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      <button className={buttonStyles}>
        <Image
          src="/icons/github.svg"
          alt="Google Icon"
          width={20}
          height={20}
          className="invert-colors mr-3 object-contain"
        />
        <span> Login with Github</span>
      </button>
      <button className={buttonStyles}>
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
