import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ActionResponse } from "./types/global";
import { api } from "./lib/api";
import Account from "./database/accout.model";
import { SignInSchema } from "./lib/validations";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/mongodb";

import { authConfig } from "./auth.config";
import User from "./database/user.model";



export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // ← spread it here
  // then override providers with full DB version
  providers: [
    GitHub,
    Google,
    // Credentials({
    //   async authorize(credentials) {
    //     // ✅ full DB + bcrypt logic stays here
    //     const validatedField = SignInSchema.safeParse(credentials);
    //     if (!validatedField.success) return null;

    //     const { email, password } = validatedField.data;
    //     try {
    //       await dbConnect();
    //       const existingAccount = await Account.findOne({
    //         provider: "credentials",
    //         providerAccountId: email,
    //       });
    //       if (!existingAccount) return null;

    //       const existingUser = await User.findById(existingAccount.userId);
    //       if (!existingUser) return null;

    //       const isValidPassword = await bcrypt.compare(
    //         password,
    //         existingAccount.password!
    //       );
    //       if (!isValidPassword) return null;

    //       return {
    //         id: existingAccount.userId.toString(),
    //         name: existingUser.name,
    //         email: existingUser.email,
    //         image: existingUser.image,
    //       };
    //     } catch (error) {
    //       console.error("Authorize error:", error);
    //       return null;
    //     }
    //   },
    // }),
    Credentials({
  async authorize(credentials) {
    const validatedField = SignInSchema.safeParse(credentials);
    console.log("1️⃣ Validation:", validatedField.success);
    if (!validatedField.success) return null;

    const { email, password } = validatedField.data;
    console.log("2️⃣ Email:", email);

    await dbConnect();

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    console.log("3️⃣ Account found:", existingAccount);  // null = not found
    if (!existingAccount) return null;

    const existingUser = await User.findById(existingAccount.userId);
    console.log("4️⃣ User found:", existingUser);  // null = not found
    if (!existingUser) return null;

    const isValidPassword = await bcrypt.compare(password, existingAccount.password!);
    console.log("5️⃣ Password valid:", isValidPassword);  // false = wrong password
    if (!isValidPassword) return null;

    return {
      id: existingAccount.userId.toString(),
      name: existingUser.name,
      email: existingUser.email,
      image: existingUser.image,
    };
  },
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
    // async jwt({ token, account }) {
    //   // console.log("JWT callback ----→", {
    //   //   accountType: account?.type,
    //   //   tokenSub: token.sub,
    //   //   tokenEmail: token.email,
    //   // });
      
    //   if (account) {
    //     const { data: existingAccount, success } =
    //       (await api.accounts.getByProvider(
    //         account.type == "credentials"
    //           ? token.email!
    //           : account.providerAccountId!,
    //       )) as ActionResponse<IAccountDoc>;

    //     if (!success || !existingAccount) return token;

    //     const userId = existingAccount.userId;
    //     if (userId) token.sub = userId.toString();
    //   }
    //   return token;
    // },
    // jwt
async jwt({ token, account }) {
  if (account) {
    await dbConnect(); // ✅ direct DB — no HTTP call

    const existingAccount = await Account.findOne({
      providerAccountId:
        account.type === "credentials"
          ? token.email!
          : account.providerAccountId!,
    });

    if (!existingAccount) return token;

    const userId = existingAccount.userId;
    if (userId) token.sub = userId.toString(); // ✅ always consistent
  }
  return token;
},
  },
});
