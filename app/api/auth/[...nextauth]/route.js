import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbConnect from "@/lib/db";
import User from "@/lib/userModel";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/S3Drive';
const clientPromise = new MongoClient(MONGODB_URI).connect();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // This is important to prevent OAuthAccountNotLinked error:
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Always allow sign in for Google users (prevents OAuthAccountNotLinked error)
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
        // Upsert user in our own collection for local user details
        await User.findOneAndUpdate(
          { email: user.email },
          {
            $setOnInsert: {
              name: user.name,
              fullName: profile?.name || user.name,
              firstName: profile?.given_name || '',
              lastName: profile?.family_name || '',
              email: user.email,
              image: user.image,
              emailVerified: user.emailVerified || null,
            },
          },
          { upsert: true, new: true }
        );
        // Always allow sign in for Google users
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async session({ session, token, user }) {
      // Debug: log session, token, user
      console.log('SESSION CALLBACK', { session, token, user });
      return session;
    },
  },
  // Remove custom signIn page to use NextAuth's default modal/flow (prevents 404)
  // If you want to keep a custom page, make sure it exists at /custom-signin
  // pages: {
  //   signIn: "/custom-signin",
  // },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 