// lib/auth.js
import User from "@/models/User";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connect from "./mongoose";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );
        if (!user) throw new Error("No user found");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid username or password");
        // return minimal user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // called whenever a JWT is created/updated
    async jwt({ token, user, account, profile }) {
      // When credentials provider returns user object
      if (user) {
        token.uid = user.id || user.uid;
        token.role = user.role || "customer";
      }
      return token;
    },
    // expose values in session on client
    async session({ session, token }) {
      session.user.id = token.uid;
      session.user.role = token.role || "customer";
      return session;
    },
    // on sign in with OAuth we ensure a User record exists in our DB
    async signIn({ user, account, profile }) {
      // Only for OAuth providers (Google) — create user if missing
      try {
        await connect();
        const email = user.email;
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
          await User.create({
            name: user.name || profile?.name || "Unnamed",
            email,
            image: user.image || profile?.picture,
            role: "customer",
          });
        }
        return true;
      } catch (err) {
        console.error("signIn error:", err);
        return false;
      }
    },
  },
};
