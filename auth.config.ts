import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/validations";

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const valid = SignInSchema.safeParse(credentials);
        if (valid.success) return valid.data as any;
        return null;
      },
    }),
  ],
};