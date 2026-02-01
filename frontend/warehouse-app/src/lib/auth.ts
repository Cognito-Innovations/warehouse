import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { generateSequentialSuiteNumber } from "../utils/auth.utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_NEST_BACKEND_URL || "http://localhost:3001";

export const authOptions: NextAuthOptions = {
  debug: false,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const suiteNumber = generateSequentialSuiteNumber();

          const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              role: "user",
              suite_no: suiteNumber,
              identifier: "google",
            }),
          });

          if (!res.ok) {
            console.error("Backend registration failed:", res.status, res.statusText);
            return false;
          }

          const data = await res.json();
          (user as any).user_id = data.id;
          (user as any).access_token = data.access_token;
          (user as any).verified = data.verified ?? false;
          (user as any).role = data.role;
          (user as any).suite_no = data.suite_no;
          (user as any).identifier = data.identifier;
        } catch (err) {
          console.error("Error calling Nest backend:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.user_id = (user as any).user_id;
        token.access_token = (user as any).access_token;
        token.verified = (user as any).verified;
        token.role = (user as any).role;
        token.suite_no = (user as any).suite_no;
        token.identifier = (user as any).identifier;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user_id) {
        (session.user as any) = {
          ...session.user,
          id: token.user_id as string,
          user_id: token.user_id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.picture as string,
          verified: token.verified as boolean,
          role: token.role as string,
          suite_no: token.suite_no as string,
          identifier: token.identifier as string,
        };
        (session as any).access_token = token.access_token;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // If url is relative, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // If url is on the same origin, allow it
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          return url;
        }
      } catch (e) {
        console.error("Invalid URL in redirect:", e);
      }

      // Default to home
      return `${baseUrl}/`;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};
