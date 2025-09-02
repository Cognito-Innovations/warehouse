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
        console.log("User API response:", await res.json());
      } catch (err) {
        console.error("Error calling Nest backend:", err);
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };