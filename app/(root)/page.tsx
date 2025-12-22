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
      This is a HomePage
      


    </div>
  );
};

export default Home;
