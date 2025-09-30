import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { generateSequentialSuiteNumber } from "../../../../utils/auth.utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_NEST_BACKEND_URL || "http://localhost:3001";

const handler = NextAuth({
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
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { access_token, user } = response.data;
          
          if (access_token && user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              access_token,
              user_id: user.id,
              verified: user.verified,
            };
          }
        } catch (error) {
          console.error("Login error:", error);
        }
        
        return null;
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
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };