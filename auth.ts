import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import { async } from './.next/dev/types/routes';
import { Action } from "sonner";
import { ActionResponse } from "./types/global";
import { api } from "./lib/api";
 
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub,Google],
  callbacks:{
    async signIn({ user, account, profile }) {
      // Here you can handle the sign-in logic, such as checking if the user exists in your database or creating a new user record.
      // You can also return true to allow the sign-in or false to deny it.
      if(account?.type == "credential") return true;
      if(!account || !user) return false;

      const userinfo = {
        name:user.name!,
        email:user.email!,
        image:user.image!,
        username:account.provider == "github" ? (profile?.login as string) 
        :(user.name?.toLocaleLowerCase() as string), 
      };

      const {success} = (await api.auth.oAuthSignIn({
        user:userinfo,
        provider:account.provider,
        providerAccountId:account.providerAccountId as string,
      })) as ActionResponse; 
     
    }
  }
})