// src/auth.js

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiController } from "./utils/apiController";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials in .env.local");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const user = await apiController({
            method: "POST",
            url: "/auth/login/",
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: `${user.first_name} ${user.last_name}`,
              accessToken: user.access_token,
              refreshToken: user.refresh_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Login Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const data = await apiController({
            method: "POST",
            url: "/auth/google/",
            data: {
              id_token: account.id_token,
              role: "BRAIDER",
            },
          });

          if (data.access) {
            user.accessToken = data.access;
            user.refreshToken = data.refresh;
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
      if (account.provider === "credentials") {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
};
