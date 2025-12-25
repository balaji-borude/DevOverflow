import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/route";
import React from "react";
import { toast } from "sonner";

const Home = async () => {
  const session = await auth();
  console.log("Looged in user session --> ", session);

  // const LogoutHandler= async()=>{
  //     'use server'
  //      signOut()
  // }

  return (
    <div>
      <h1 className=" text-red-400 text-[30px] font-bold leading-[42px] tracking-tighter text-center  "> Website Under devlopment .............. </h1>
      


    </div>
  );
};

export default Home;
