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
        const res = await fetch(`${process.env.NEST_BACKEND_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image
          }),
        });
        const data = await res.json();
        (user as any).user_id = data[0]?.id ?? data.id;
      } catch (err) {
        console.error("Error calling Nest backend:", err);
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.user_id = (user as any).user_id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.user_id) {
        (session.user as any).user_id = token.user_id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };