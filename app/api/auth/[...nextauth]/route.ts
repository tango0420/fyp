
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import User from "../../../models/User";
import connectMongoDB from "../../../lib/mongodb";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
  providers: [
    // route.ts (NextAuth config)
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  allowDangerousEmailAccountLinking: true, // ← add this
}),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoDB();
        const user = await User.findOne({ email: credentials?.email });
        if (user && await bcrypt.compare(credentials?.password || "", user.password)) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email,
            image: user.image || undefined,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      const email = user?.email || token.email;
      if (email) {
        await connectMongoDB();
        const dbUser = await User.findOne({ email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name || token.name;
          token.email = dbUser.email;
          token.image = dbUser.image || token.image;
          token.role = dbUser.role || token.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };