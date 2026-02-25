import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ActionResponse } from "./types/global";
import { api } from "./lib/api";
import { IAccountDoc } from "./database/accout.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Here you can handle the sign-in logic, such as checking if the user exists in your database or creating a new user record.
      // You can also return true to allow the sign-in or false to deny it.

      // if there is no account or user, we return false to deny the sign-in
      if (account?.type == "credentials") return true;

      if (!account || !user) return false;

      // gather all user info
      // ! --> exlamenation mark --> is used to tell typescript that we are sure that this value is not null or undefined, so it can be safely accessed.

      const userinfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,

        username:
          account.provider == "github"
            ? (profile?.login as string)
            : (user.name?.toLocaleLowerCase() as string),
      };

      const allowedProviders = ["github", "google"] as const;
      type AllowedProvider = (typeof allowedProviders)[number];

      if (!allowedProviders.includes(account.provider as AllowedProvider))
        return false;

      const { success } = (await api.auth.oAuthSignIn({
        user: userinfo,
        provider: account.provider as AllowedProvider,
        providerAccountId: account.providerAccountId as string,
      })) as ActionResponse;
      if (!success) return false;

      return true;
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },

    //jwt
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type == "credentials"
              ? token.email!
              : account.providerAccountId!,
          )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;
        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    
  },
});
