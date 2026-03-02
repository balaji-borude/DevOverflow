import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ActionResponse } from "./types/global";
import { api } from "./lib/api";
import { IAccountDoc } from "./database/accout.model";
import { SignInSchema } from "./lib/validations";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
   trustHost: true, // ✅ Keep this as true — required for Vercel deployment
  providers: [
    GitHub,
    Google,
    Credentials({
async authorize(credentials) {
  try {
    const validatedField = SignInSchema.safeParse(credentials);
    console.log("PROD 1 →", validatedField.success);

    if (validatedField.success) {
      const { email, password } = validatedField.data;

      const accountRes = await api.accounts.getByProvider(email) as ActionResponse<IAccountDoc>;
      console.log("PROD 2 →", JSON.stringify(accountRes));

      if (!accountRes.data) return null;

      const userRes = await api.users.getById(accountRes.data.userId.toString()) as ActionResponse<any>;
      console.log("PROD 3 →", JSON.stringify(userRes));

      if (!userRes.data) return null;

      const isValid = await bcrypt.compare(password, accountRes.data.password!);
      console.log("PROD 4 →", isValid);

      if (isValid) return {
        id: accountRes.data.userId.toString(),
        name: userRes.data.name,
        email: userRes.data.email,
        image: userRes.data.image,
      };
    }
  } catch(e) {
    console.error("PROD ERROR →", e); // 👈 real error shows here
  }
  return null;
}
    }),
  ],
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
      // console.log("JWT callback ----→", {
      //   accountType: account?.type,
      //   tokenSub: token.sub,
      //   tokenEmail: token.email,
      // });
      
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
