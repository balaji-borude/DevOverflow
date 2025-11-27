import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/route";
import React from "react";

const Home = async () => {
  const session = await auth();
  console.log("Looged in user session --> ", session);

  // const LogoutHandler= async()=>{
  //     'use server'
  //      signOut()
  // }

  return (
    <div>
      Thisis a HomePage
      <br />
      {/* Logout handler  */}
      <form
        className="mt-48"
        action={async () => {
          "use server";
          await signOut({redirectTo:ROUTES.SIGN_IN});
        }}
      >
        <button type="submit">Logout</button>
      </form>


    </div>
  );
};

export default Home;
