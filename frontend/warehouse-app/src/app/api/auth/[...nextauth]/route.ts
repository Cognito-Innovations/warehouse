import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        console.log('NextAuth signIn called for user:', user.email);
        const res = await fetch(`${process.env.NEST_BACKEND_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          //TODO: Remove this password here
          body: JSON.stringify({
            email: user.email,
            password: "123456",
            name: user.name,
            image: user.image
          }),
        });
        const data = await res.json();
        console.log('Backend response:', data);
        (user as any).user_id = data.user.id;
        (user as any).access_token = data.access_token;
        console.log('Stored user_id:', data.user.id);
        console.log('Stored access_token:', data.access_token ? data.access_token.substring(0, 20) + '...' : 'No token');
      } catch (err) {
        console.error("Error calling Nest backend:", err);
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - user data:', { user_id: (user as any).user_id, has_token: !!(user as any).access_token });
        token.user_id = (user as any).user_id;
        token.access_token = (user as any).access_token;
      }
      console.log('JWT callback - token data:', { user_id: token.user_id, has_token: !!token.access_token });
      return token;
    },

    async session({ session, token }) {
      if (token?.user_id) {
        (session.user as any).user_id = token.user_id;
        (session as any).access_token = token.access_token;
        console.log('Session callback - session data:', { user_id: token.user_id, has_token: !!token.access_token });
      } 
      return session;
    },
  },
});

export { handler as GET, handler as POST };