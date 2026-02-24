import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ActionResponse } from "./types/global";
import { api } from "./lib/api";

/**
 * Define allowed OAuth providers for our backend.
 * This keeps our domain model strict and aligned with API expectations.
 */
type OAuthProvider = "github" | "google";

/**
 * Export NextAuth handlers and utilities
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],

  callbacks: {
    /**
     * signIn callback is triggered whenever a user attempts authentication.
     * We use this to sync OAuth users with our backend.
     */
    async signIn({ user, account, profile }) {
      
      // Allow credential-based login directly (handled elsewhere)
      if (account?.type === "credentials") return true;

      // If essential data is missing, deny login
      if (!account || !user) return false;

      /**
       * Ensure provider is one of our supported OAuth providers.
       * This narrows the type from `string` to our strict union type.
       */
      if (account.provider !== "github" && account.provider !== "google") {
        return false;
      }

      const provider: OAuthProvider = account.provider;

      /**
       * Validate required user fields.
       * We avoid non-null assertions (!) for safety.
       */
      if (!user.name || !user.email || !user.image) {
        return false;
      }

      /**
       * Derive username based on provider.
       * GitHub provides a login field.
       * Google does not — we derive from name.
       */
      let username: string;

      if (provider === "github") {
        if (!profile || typeof (profile).login !== "string") {
          return false;
        }
        username = (profile ).login;
      } else {
        username = user.name.toLowerCase().replace(/\s+/g, "");
      }

      /**
       * Construct user payload for backend sync.
       */
      const userinfo = {
        name: user.name,
        email: user.email,
        image: user.image,
        username,
      };

      /**
       * Call backend OAuth sync API
       */
      const response = (await api.auth.oAuthSignIn({
        user: userinfo,
        provider,
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      /**
       * If backend sync fails, deny authentication.
       */
      if (!response.success) {
        return false;
      }

      return true;
    },
  },
});