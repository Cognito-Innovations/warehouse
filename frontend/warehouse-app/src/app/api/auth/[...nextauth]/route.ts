import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { hashPassword, generateSequentialSuiteNumber } from "../../../../utils/auth.utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const handler = NextAuth({
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
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
          console.error('Login error:', error);
        }
        
        return null;
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
      try {
        console.log('NextAuth signIn called for user:', user.email);
        const hashedPasswordValue = hashPassword("123456");
        const suiteNumber = generateSequentialSuiteNumber();
        
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            password: hashedPasswordValue,
            name: user.name,
            image: user.image,
            suite_no: suiteNumber
          }),
        });
        const data = await res.json();
        console.log('Backend response:', data);
        (user as any).user_id = data.user.id;
        (user as any).access_token = data.access_token;
        (user as any).verified = data.user.verified ?? false;
        console.log('Stored user_id:', data.user.id);
        console.log('Stored access_token:', data.access_token ? data.access_token.substring(0, 20) + '...' : 'No token');
        console.log('Stored verified status:', data.user.verified);
      } catch (err) {
        console.error("Error calling Nest backend:", err);
      }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - user data:', { user_id: (user as any).user_id, has_token: !!(user as any).access_token, verified: (user as any).verified });
        token.user_id = (user as any).user_id;
        token.access_token = (user as any).access_token;
        token.verified = (user as any).verified;
      }
      console.log('JWT callback - token data:', { user_id: token.user_id, has_token: !!token.access_token, verified: token.verified });
      return token;
    },

    async session({ session, token }) {
      if (token?.user_id) {
        (session.user as any).user_id = token.user_id;
        (session as any).access_token = token.access_token;
        (session.user as any).verified = token.verified;
        console.log('Session callback - session data:', { user_id: token.user_id, has_token: !!token.access_token, verified: token.verified });
      } 
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});

export { handler as GET, handler as POST };